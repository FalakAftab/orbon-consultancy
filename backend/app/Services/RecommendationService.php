<?php

namespace App\Services;

use App\DTOs\Matching\RecommendationCriteriaData;
use App\Http\Resources\ProgramResource;
use App\Http\Resources\UniversityResource;
use App\Models\Program;
use App\Models\StudentProfile;
use App\Repositories\Contracts\ProgramRepositoryInterface;
use App\Repositories\Contracts\RecommendationHistoryRepositoryInterface;
use App\Repositories\Contracts\StudentProfileRepositoryInterface;
use Illuminate\Support\Collection;

class RecommendationService
{
    private const SUBJECT_GROUPS = [
        'Computer Science & IT' => [
            'computer science', 'artificial intelligence', 'data science',
            'cyber security', 'information technology',
        ],
        'Engineering' => [
            'mechanical engineering', 'electrical engineering', 'civil engineering',
        ],
        'Natural Sciences' => [
            'mathematics', 'physics', 'chemistry', 'biology',
        ],
        'Medicine & Health' => ['medicine'],
        'Architecture & Design' => ['architecture', 'design'],
        'Law' => ['law'],
        'Media & Communication' => ['media'],
        'Business & Economics' => ['business', 'economics', 'finance'],
        'Social Sciences & Humanities' => ['humanities'],
        'German Language' => [],
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

        if ($userId !== null) {
            try {
                $this->history->create($userId, [
                    'criteria_snapshot' => $payload,
                    'results_snapshot' => json_decode(json_encode($result), true),
                    'program_match_count' => $programMatches->count(),
                ]);
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Failed to record recommendation history: ' . $e->getMessage());
            }
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

    private function buildSearchFilters(RecommendationCriteriaData $criteria): array
    {
        return array_filter([
            'degree_level' => $this->normalizeDegreeLevel($criteria->preferredDegree),
            'intake' => $criteria->preferredIntake === 'both' ? null : $criteria->preferredIntake,
            'city' => $criteria->preferredCity,
            'state' => $criteria->preferredState,
            'minimum_tuition_fee' => $criteria->tuitionFeeMin,
            'maximum_tuition_fee' => $criteria->tuitionFeeMax,
            'tuition_type' => match ($criteria->tuitionPreference) {
                'free_only' => ['free', 'both'],
                'paid_only' => ['paid', 'both'],
                default => null,
            },
        ], static fn ($value) => $value !== null && $value !== '');
    }

    private function normalizeDegreeLevel(?string $degree): ?string
    {
        if ($degree === null || $degree === '') {
            return null;
        }
        $d = strtolower(trim($degree));
        if (str_contains($d, 'bachelor') || str_contains($d, 'b.sc') || str_contains($d, 'b.a') || str_contains($d, 'b.eng') || str_contains($d, 'bba') || str_contains($d, 'bscs')) {
            return 'bachelor';
        }
        if (str_contains($d, 'master') || str_contains($d, 'm.sc') || str_contains($d, 'm.a') || str_contains($d, 'm.eng') || str_contains($d, 'mba')) {
            return 'master';
        }
        if (str_contains($d, 'phd') || str_contains($d, 'doctorate') || str_contains($d, 'dr.')) {
            return 'phd';
        }

        return $d;
    }

    private function degreeMatches(?string $preferredDegree, Program $program): bool
    {
        if ($preferredDegree === null || $preferredDegree === '') {
            return true;
        }

        $expectedNorm = $this->normalizeDegreeLevel($preferredDegree);
        $actualNorm = $this->normalizeDegreeLevel($program->degree_level);

        return $expectedNorm === $actualNorm;
    }

    private function scoreProgram(Program $program, RecommendationCriteriaData $criteria): array
    {
        $reasons = [];
        $unmatched = [];
        $mandatoryFailures = [];

        if (! empty($criteria->preferredSubjects)) {
            $subjectOk = $this->subjectMatches($criteria->preferredSubjects, $program->subject_category);
            if (! $subjectOk) {
                $mandatoryFailures[] = 'Subject mismatch.';
                $unmatched[] = 'Subject mismatch.';
            } else {
                $reasons[] = 'Subject match found.';
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

        if ($criteria->preferredDegree === null || $program->degree_level === $criteria->preferredDegree) {
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

        if ($criteria->tuitionPreference === null || $this->tuitionMatches($program->tuition_type, $criteria->tuitionPreference)) {
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

    private function tuitionMatches(string $programTuition, string $preference): bool
    {
        return match ($preference) {
            'free_only' => in_array($programTuition, ['free', 'both'], true),
            'paid_only' => in_array($programTuition, ['paid', 'both'], true),
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

    private function subjectMatches(array $preferredSubjects, ?string $programSubjectCategory): bool
    {
        if ($programSubjectCategory === null || $programSubjectCategory === '') {
            return false;
        }

        $preferredSubjects = array_values(array_filter($preferredSubjects, static fn ($v) => $v !== null && $v !== ''));

        $expanded = [];
        foreach ($preferredSubjects as $subject) {
            $key = (string) $subject;
            if (isset(self::SUBJECT_GROUPS[$key])) {
                array_push($expanded, ...self::SUBJECT_GROUPS[$key]);
            } else {
                $expanded[] = $key;
            }
        }

        $normalizedProgramSubject = mb_strtolower(trim($programSubjectCategory));
        $normalizedPreferred = array_map(static fn ($v) => mb_strtolower(trim((string) $v)), $expanded);

        return in_array($normalizedProgramSubject, $normalizedPreferred, true);
    }
}