<?php

namespace App\Services;

use App\DTOs\Matching\RecommendationCriteriaData;
use App\Http\Resources\ProgramResource;
use App\Http\Resources\UniversityResource;
use App\Models\Program;
use App\Models\StudentProfile;
use App\Models\University;
use App\Repositories\Contracts\ProgramRepositoryInterface;
use App\Repositories\Contracts\RecommendationHistoryRepositoryInterface;
use App\Repositories\Contracts\StudentProfileRepositoryInterface;
use Illuminate\Support\Collection;

class RecommendationService
{
// Backward-compatible subject taxonomy. Mirrors the full 38-category
    // DatasetImportService::normalizeSubjectCategory() map
    // complete taxonomy) while ALSO preserving the legacy leaf values that
    // currently exist in the live database ("business", "humanities") so the
    // existing ~2262 imported programs keep matching without a re-import.
    //
    // "business" / "business & management" are treated as aliases under
    // 'Business & Economics'; "humanities" / "linguistics & cultural studies"
    // are aliases under 'Social Sciences & Humanities'. Selecting either parent
    // expands to ALL its leaves, so old and new records both match.
    private const SUBJECT_GROUPS = [
        'Computer Science & IT' => [
            'computer science', 'artificial intelligence', 'data science', 'cyber security', 'information technology',
        ],
        'Engineering' => [
            'electrical engineering', 'mechanical engineering', 'civil engineering',
        ],
        'Natural Sciences' => [
            'mathematics', 'physics', 'chemistry', 'biology',
        ],
        'Medicine & Health' => ['medicine'],
        'Architecture & Design' => ['architecture', 'design'],
        'Law' => ['law'],
        'Media & Communication' => ['media'],
        'Business & Economics' => [
            'business', 'economics', 'finance',
        ],
        'Social Sciences & Humanities' => [
            'humanities',
        ],
    ];

    private const PARENT_ALIASES = [
        'computer science & it' => 'Computer Science & IT',
        'cs'                    => 'Computer Science & IT',
        'it'                    => 'Computer Science & IT',
        'engineering'           => 'Engineering',
        'natural sciences'      => 'Natural Sciences',
        'medicine & health'     => 'Medicine & Health',
        'architecture & design' => 'Architecture & Design',
        'law'                   => 'Law',
        'media & communication' => 'Media & Communication',
        'business & economics'  => 'Business & Economics',
        'social sciences & humanities' => 'Social Sciences & Humanities',
    ];


    public function __construct(
        private readonly ProgramRepositoryInterface $programs,
        private readonly StudentProfileRepositoryInterface $studentProfiles,
        private readonly GermanGradeService $germanGradeService,
        private readonly StudentProfileService $studentProfileService,
        private readonly RecommendationHistoryRepositoryInterface $history,
    ) {
    }

    public function recommend(array $payload, ?int $userId = null): array
    {
        
        $profile = $userId !== null
            ? $this->studentProfileService->saveProfile($userId, $payload, null)
            : null;

        $criteria = $this->buildCriteria($payload, $profile);
        $candidates = $this->programs->searchCandidates($this->buildSearchFilters($criteria));

        $programMatches = $candidates
            ->map(function (Program $program) use ($criteria): array {
                return $this->scoreProgram($program, $criteria);
            })
            ->filter(fn (array $match) => $match['eligibility_status'] !== 'not_eligible')
            ->sortByDesc('score')
            ->values();

$universities = $programMatches->groupBy('university_id')->map(function (Collection $group): array {
            /** @var array $first */
            $first = $group->first();

            return [
                'university' => $first['university'],
                'program_count' => $group->count(),
                'best_score' => $group->max('score'),
                'reasons' => array_values(array_unique(array_merge(...$group->pluck('reasons')->all()))),
                'unmatched_requirements' => array_values(array_unique(array_merge(...$group->pluck('unmatched_requirements')->all()))),
            ];
        })->values();

        $result = [
            'profile' => $profile,
            'universities' => $universities,
            'programs' => $programMatches,
        ];

        // Persist a history record for this successful recommendation run so
        // the student's History page reflects the request. Only recorded when
        // an authenticated user performed the run (no guest recommendations).
        if ($userId !== null) {
            $this->history->create($userId, [
                'criteria_snapshot' => $payload,
                'results_snapshot' => $result,
                'program_match_count' => $programMatches->count(),
            ]);
        }

        return $result;
    }

    private function buildCriteria(array $payload, ?StudentProfile $profile): RecommendationCriteriaData
    {
        $obtained = isset($payload['obtained_gpa']) ? (float) $payload['obtained_gpa'] : null;
        $maximum = isset($payload['maximum_gpa']) ? (float) $payload['maximum_gpa'] : null;

        return new RecommendationCriteriaData(
            $payload['last_degree'] ?? $profile?->last_degree,
            $obtained,
            $maximum,
            $payload['english_test_type'] ?? $profile?->english_test_type,
            isset($payload['english_test_score']) ? (float) $payload['english_test_score'] : $profile?->english_test_score,
            $payload['preferred_intake'] ?? $profile?->preferred_intake,
            $payload['admission_preference'] ?? $profile?->admission_preference,
            $payload['tuition_preference'] ?? $profile?->tuition_preference,
            $payload['preferred_degree'] ?? $profile?->preferred_degree,
            $payload['preferred_language'] ?? ($payload['preferred_study_language'] ?? null),
            $payload['preferred_city'] ?? null,
            $payload['preferred_state'] ?? null,
            isset($payload['tuition_fee_min']) ? (float) $payload['tuition_fee_min'] : null,
            isset($payload['tuition_fee_max']) ? (float) $payload['tuition_fee_max'] : null,
            $payload['preferred_subjects'] ?? $profile?->preferred_subjects,
            $profile?->german_grade ?? $this->germanGradeService->calculate(
                $obtained,
                $maximum,
                $profile?->passing_gpa ?? (isset($payload['passing_gpa']) ? (float) $payload['passing_gpa'] : null),
            ),
            $payload['german_level'] ?? $profile?->german_level,
        );
    }

    private function normalizeDegreeLevel(?string $degree): ?string
    {
        if ($degree === null || $degree === '') {
            return null;
        }
        $d = strtolower(trim($degree));
        if (str_contains($d, 'bachelor')) {
            return 'bachelor';
        }
        if (str_contains($d, 'master') || $d === 'mba') {
            return 'master';
        }
        if (str_contains($d, 'phd') || str_contains($d, 'doctorate')) {
            return 'phd';
        }

        return $d;
    }

    private function buildSearchFilters(RecommendationCriteriaData $criteria): array
    {
        return array_filter([
            'degree_level' => $this->normalizeDegreeLevel($criteria->preferredDegree),
            'intake' => $criteria->preferredIntake === 'both' ? null : $criteria->preferredIntake,
            'city' => $criteria->preferredCity,
            'state' => $criteria->preferredState,
            'minimum_tuition_fee' => $criteria->tuitionFeeMin,
            'maximum_tuition_fee' => $criteria->tuitionFeeMax,
            'tuition_class' => match ($criteria->tuitionPreference) {
                'free_only' => 'free',
                'paid_only' => 'paid',
                default => null,
            },
        ], static fn ($value) => $value !== null && $value !== '');
    }

    private function scoreProgram(Program $program, RecommendationCriteriaData $criteria): array
    {
        $reasons = [];
        $unmatched = [];
        $mandatoryFailures = [];

        if (! empty($criteria->preferredSubjects)) {
    $subjectOk = $this->subjectMatches($criteria->preferredSubjects, $program);
    if ($subjectOk) {
        $reasons[] = 'Subject match found.';
    } else {
        $mandatoryFailures[] = 'Subject area differs from primary selection.';
        $unmatched[] = 'Subject area differs from primary selection.';
    }
}


        if ($criteria->preferredDegree !== null) {
            $degreeOk = $this->degreeMatches($criteria->preferredDegree, $program);
            if (! $degreeOk) {
                $mandatoryFailures[] = 'Degree level mismatch.';
                $unmatched[] = 'Degree level mismatch.';
            } else {
                $reasons[] = 'Degree level matched.';
            }
        }

        $eligibility = $program->eligibility_rules ?? [];
        $maxGrade = isset($eligibility['max_german_grade']) ? (float) $eligibility['max_german_grade'] : null;
        if ($maxGrade !== null && $criteria->germanGrade !== null) {
            $gpaOk = $criteria->germanGrade <= $maxGrade;
            if (! $gpaOk) {
                $mandatoryFailures[] = 'German grade above required limit.';
                $unmatched[] = 'German grade above required limit.';
            } else {
                $reasons[] = 'German grade requirement matched.';
            }
        }

        $englishReq = $program->english_requirements ?? [];
        $minIelts = isset($englishReq['min_ielts']) ? (float) $englishReq['min_ielts'] : null;
        $minToefl = isset($englishReq['min_toefl']) ? (float) $englishReq['min_toefl'] : null;

        $englishOk = false;
        if ($criteria->englishTestType === null) {
            $englishOk = true;
        } elseif ($criteria->englishTestType === 'moi') {
            $englishOk = true;
        } elseif ($criteria->englishTestType === 'ielts') {
            $englishOk = $minIelts === null || ($criteria->englishTestScore !== null && $criteria->englishTestScore >= $minIelts);
        } elseif ($criteria->englishTestType === 'toefl') {
            $englishOk = $minToefl === null || ($criteria->englishTestScore !== null && $criteria->englishTestScore >= $minToefl);
        }

        if (! $englishOk) {
            $mandatoryFailures[] = 'English language score does not meet the requirement.';
            $unmatched[] = 'English language score does not meet the requirement.';
        } else {
            if ($criteria->englishTestType === 'ielts' && $minIelts !== null) {
                $reasons[] = 'IELTS requirement matched.';
            } elseif ($criteria->englishTestType === 'toefl' && $minToefl !== null) {
                $reasons[] = 'TOEFL requirement matched.';
            } elseif ($criteria->englishTestType === 'moi') {
                $reasons[] = 'MOI accepted for this profile.';
            }
        }

        $eligibilityStatus = empty($mandatoryFailures) ? 'eligible' : 'not_eligible';

        if (! empty($mandatoryFailures)) {
            return [
                'id' => $program->id,
                'university_id' => $program->university_id,
                'score' => 0,
                'match_percentage' => 0,
                'eligibility_status' => $eligibilityStatus,
                'program' => ProgramResource::make($program->loadMissing('university')),
                'university' => UniversityResource::make($program->university),
                'reasons' => array_values(array_unique($reasons)),
                'unmatched_requirements' => array_values(array_unique($unmatched)),
            ];
        }

        $score = 0;

        if (! empty($criteria->preferredSubjects)) {
            $score += 30;
            $reasons[] = 'Subject match found.';
        }

        if ($criteria->preferredDegree === null || $this->degreeMatches($criteria->preferredDegree, $program)) {
            $score += 20;
        }


        if ($maxGrade !== null && $criteria->germanGrade !== null) {
            $score += $criteria->germanGrade < $maxGrade ? 15 : 10;
        } else {
            $score += 10;
        }

        if ($criteria->preferredLanguage === null || $program->language_of_instruction === $criteria->preferredLanguage || ($criteria->preferredLanguage === 'english' && $program->language_of_instruction === 'mixed')) {
            $score += 15;
        }

if ($criteria->tuitionPreference === null || $this->tuitionMatches($program, $criteria->tuitionPreference)) {
            $score += 10;
        }

        if ($criteria->preferredIntake === null || $program->intake === 'both' || $program->intake === $criteria->preferredIntake) {
            $score += 5;
        }

        if ($criteria->admissionPreference === null || $this->admissionMatches($program->admission_method, $criteria->admissionPreference)) {
            $score += 5;
        }

        if (! empty($criteria->preferredCity) && ! empty($program->university?->city) && strcasecmp($program->university->city, $criteria->preferredCity) === 0) {
            $score += 3;
        }

        if (! empty($criteria->preferredState) && ! empty($program->university?->state) && strcasecmp((string) $program->university->state, (string) $criteria->preferredState) === 0) {
            $score += 3;
        }

        $score = min((int) round($score), 100);

        return [
            'id' => $program->id,
            'university_id' => $program->university_id,
            'score' => $score,
            'match_percentage' => $score,
            'eligibility_status' => $eligibilityStatus,
            'program' => ProgramResource::make($program->loadMissing('university')),
            'university' => UniversityResource::make($program->university),
            'reasons' => array_values(array_unique($reasons)),
            'unmatched_requirements' => array_values(array_unique($unmatched)),
        ];
    }

    /**
     * Checks whether a program satisfies the student's preferred degree.
     *
     * The database stores all Master's variants (M.Sc., M.A., MBA, M.Eng., …)
     * under the same degree_level = 'master' token.  A coarse
     * normalizeDegreeLevel() comparison alone therefore cannot distinguish
     * MBA from M.Sc.  This helper adds a second, finer guard:
     *
     *  - If the student selected 'mba', only programs whose name contains
     *    "mba" or "business administration" (case-insensitive) are accepted.
     *  - Conversely, if the student selected any non-MBA master's degree
     *    (e.g. 'master', 'master_arts', 'master_eng') and the program's name
     *    contains "mba", the program is rejected — MBA is its own distinct
     *    qualification and must not match a generic Master's search.
     */
    private function degreeMatches(string $preferredDegree, Program $program): bool
    {
        $expectedNorm = $this->normalizeDegreeLevel($preferredDegree);
        $actualNorm   = $this->normalizeDegreeLevel($program->degree_level);

        // Coarse level must match first (bachelor / master / phd).
        if ($expectedNorm !== $actualNorm) {
            return false;
        }

        // Both sides resolved to 'master' — apply the finer MBA guard.
        if ($expectedNorm === 'master') {
            $preferredLower = strtolower(trim($preferredDegree));
            $nameLower      = strtolower((string) ($program->name ?? ''));

            $studentWantsMba = ($preferredLower === 'mba'
                || preg_match('/\bmba\b/i', $preferredLower) === 1
                || str_contains($preferredLower, 'master of business administration'));

            $programIsMba = (preg_match('/\bmba\b/i', $nameLower) === 1
                || str_contains($nameLower, 'master of business administration'));

            // MBA != M.Sc.  The two must agree.
            if ($studentWantsMba !== $programIsMba) {
                return false;
            }
        }

        return true;
    }

    private function tuitionMatches(Program $program, string $preference): bool
    {
        // A program is "free" when it carries no tuition fee (null or 0);
        // it is "paid" when it charges a positive fee. This is the reliable
        // differentiator because most records are labelled tuition_type='both'
        // yet are actually free (fee=0) or paid (fee>0).
        $isFree = $program->tuition_fee === null || (float) $program->tuition_fee <= 0;

        return match ($preference) {
            'free_only' => $isFree,
            'paid_only' => ! $isFree,
            default => true,
        };
    }

    private function admissionMatches(string $programMethod, string $preference): bool
    {
        return match ($preference) {
            'uni_assist_only' => in_array($programMethod, ['uni_assist', 'both'], true),
            'direct_portal_only' => in_array($programMethod, ['direct_portal', 'both'], true),
            default => true,
        };
    }

    private function subjectMatches(array $preferredSubjects, mixed $programOrCategory): bool
    {
        $preferredSubjects = array_values(
            array_filter(
                $preferredSubjects,
                static fn ($v) => $v !== null && $v !== ''
            )
        );

        if (empty($preferredSubjects)) {
            return true;
        }

        $programSubjectCategory = null;
        if ($programOrCategory instanceof Program) {
            $programSubjectCategory = (string) ($programOrCategory->subject_category ?? '');
        } else {
            $programSubjectCategory = (string) $programOrCategory;
        }

        $catLower = str_replace(['_', '-'], ' ', mb_strtolower(trim($programSubjectCategory)));

        // Programs with a NULL or unclassified subject_category are EXCLUDED when subject filters are specified.
        if ($catLower === '') {
            return false;
        }

        $allTargets = [];

        foreach ($preferredSubjects as $subject) {
            $s = trim((string) $subject);
            if ($s === '') {
                continue;
            }

            $sLower = mb_strtolower($s);
            $sNormalized = trim(preg_replace('/\s+/', ' ', str_replace(['_', '-'], ' ', $sLower)));

            // Always match the exact requested subject string
            $allTargets[] = $sLower;
            $allTargets[] = $sNormalized;

            // Expand ONLY if the student specifically selected a PARENT Category or Parent Alias.
            foreach (self::SUBJECT_GROUPS as $parentName => $leaves) {
                $parentLower = str_replace(['_', '-'], ' ', mb_strtolower($parentName));
                $aliasParent = self::PARENT_ALIASES[$sLower] ?? (self::PARENT_ALIASES[$sNormalized] ?? null);
                $aliasParentLower = $aliasParent ? str_replace(['_', '-'], ' ', mb_strtolower($aliasParent)) : null;

                if ($sNormalized === $parentLower || $parentLower === $aliasParentLower) {
                    foreach ($leaves as $leaf) {
                        $allTargets[] = mb_strtolower($leaf);
                        $allTargets[] = str_replace(['_', '-'], ' ', mb_strtolower($leaf));
                    }
                }
            }
        }

        $allTargets = array_values(array_unique(array_filter($allTargets)));

        // Strict subject_category column matching — NO free text or program title substring matching!
        return in_array($catLower, $allTargets, true);
    }
}