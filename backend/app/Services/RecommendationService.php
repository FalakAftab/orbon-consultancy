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
            'cyber security', 'information technology', 'game & visual computing',
            'software engineering', 'computer engineering', 'digital engineering',
        ],
        'Engineering' => [
            'engineering', 'mechanical engineering', 'electrical engineering', 'civil engineering',
            'water engineering', 'nanotechnology', 'robotics', 'polymer',
            'aerospace', 'renewable energy', 'biomedical', 'materials',
            'chemical engineering', 'environmental engineering', 'industrial engineering',
            'computational engineering', 'textile engineering', 'automotive', 'maritime engineering',
        ],
        'Natural Sciences' => [
            'mathematics', 'physics', 'chemistry', 'biology',
            'nanoscience', 'environmental science', 'polymer', 'materials',
            'agricultural science', 'geosciences', 'agriculture', 'food science', 'forestry',
        ],
        'Medicine & Health' => [
            'medicine', 'biomedical sciences', 'public health', 'pharmacy',
            'sports science', 'nursing', 'neuroscience',
        ],
        'Architecture & Design' => [
            'architecture', 'design', 'graphic design', 'animation & game',
            'urban planning', 'landscape architecture',
        ],
        'Law' => ['law', 'legal studies'],
        'Media & Communication' => ['media'],
        'Business & Economics' => [
            'business', 'economics', 'finance', 'management',
            'international trade', 'supply chain & logistics', 'marketing',
            'real estate', 'accounting', 'entrepreneurship',
        ],
        'Social Sciences & Humanities' => [
            'humanities', 'psychology', 'social sciences', 'sociology',
            'political science', 'international relations', 'history',
            'philosophy', 'literature', 'languages & translation',
            'area studies', 'education', 'social work',
        ],
        'German Language' => ['german'],
        'Preparatory & Foundation Studies' => [
            'foundation & preparatory', 'interdisciplinary & research',
        ],
    ];

    private const SUBJECT_KEYWORDS = [
        // Engineering Sub-disciplines
        'engineering' => ['engineering', 'engineer', 'ingenieur', 'technology', 'technologies', 'mechanics', 'computational mechanics', 'autonomous driving', 'testing', 'non-destructive', 'nautical', 'maritime', 'scientific instrumentation'],
        'mechanical engineering' => ['mechanical engineering', 'mechanical', 'maschinenbau', 'automotive', 'thermodynamics', 'manufacturing', 'production engineering', 'propulsion', 'combustion', 'fluid mechanics', 'mechatronics'],
        'electrical engineering' => ['electrical', 'electronic', 'electronics', 'elektrotechnik', 'telecommunication', 'power engineering', 'optics', 'photonics', 'microelectronics', 'signal processing', 'sensor', 'embedded', 'communications'],
        'civil engineering' => ['civil engineering', 'civil', 'construction', 'structural', 'infrastructure', 'geotechnical', 'traffic', 'transportation', 'geodesy', 'cartography', 'surveying', 'built environment'],
        'water engineering' => ['water', 'hydrolog', 'hydraul', 'hydro science', 'hydro engineering', 'aquatic', 'waste water', 'wastewater', 'water resources'],
        'nanotechnology' => ['nano', 'nanotech', 'nanoscience', 'nanomaterial', 'nanotechnology', 'advanced materials', 'metallurgy', 'ceramics'],
        'polymer' => ['polymer', 'macromolecular', 'plastics', 'rubber', 'chemical engineering', 'process engineering', 'process technology', 'verfahrenstechnik', 'bioprocess', 'membrane'],
        'robotics' => ['robot', 'robotics', 'mechatronic', 'mechatronics', 'automation', 'autonomous systems', 'cyber-physical', 'autonomous driving', 'control engineering', 'control systems', 'cybernetics'],
        'materials' => ['material', 'materials science', 'metallurg', 'computational materials', 'biofabrication'],
        'biomedical' => ['biomedical', 'bioengineering', 'medical engineering', 'biomechanic', 'medical technology', 'biomedizin', 'biomaterials', 'medical physics', 'neural engineering'],
        'aerospace' => ['aerospace', 'aeronautic', 'aviation', 'space engineering', 'space tech', 'aircraft'],
        'automotive' => ['automotive', 'vehicle', 'mobility systems', 'automotive engineering', 'autonomous driving'],
        'renewable energy' => ['renewable energy', 'clean energy', 'solar', 'wind energy', 'energy engineering', 'energy system', 'power engineering', 'energy efficiency', 'sustainable energy'],
        'environmental engineering' => ['environmental engineering', 'waste management', 'sustainability engineering', 'ecological engineering', 'water and environment', 'environmental planning', 'nature conservation', 'ecosystem', 'circular economy', 'sustainable resources'],
        'chemical engineering' => ['chemical engineering', 'process engineering', 'bioprocess', 'chemoinformatics'],
        'industrial engineering' => ['industrial engineering', 'wirtschaftsingenieurwesen', 'operations research', 'engineering management', 'systems engineering', 'production management'],
        'computational engineering' => ['computational engineering', 'computational methods', 'scientific computing', 'simulation science', 'computational mechanics', 'computer simulation'],
        'textile engineering' => ['textile', 'leather and textile'],
        'maritime engineering' => ['maritime', 'nautical', 'shipping', 'offshore'],

        // Computer Science & IT
        'computer science' => ['computer science', 'software', 'computing', 'informatics', 'programming', 'informatik', 'web', 'computational science', 'computational modelling', 'computational modeling', 'simulation', 'digital studies'],
        'software engineering' => ['software engineering', 'software development', 'software systems'],
        'computer engineering' => ['computer engineering', 'hardware', 'digital engineering', 'embedded systems', 'internet of things', 'iot', 'smart systems'],
        'artificial intelligence' => ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'computational intelligence', 'computer vision', 'natural language processing', 'ai'],
        'data science' => ['data science', 'big data', 'data analytics', 'data engineering'],
        'cyber security' => ['cyber security', 'cybersecurity', 'information security', 'network security', 'cryptography'],
        'information technology' => ['information technology', 'information systems', 'business informatics', 'wirtschaftsinformatik', 'digital transformation', 'e-government', 'hci', 'human-computer interaction', 'human computer interaction'],
        'game & visual computing' => ['game', 'visual computing', 'animation', 'computer graphics', 'virtual reality', 'augmented reality', 'visualisation'],

        // Natural Sciences & Agriculture
        'mathematics' => ['mathematic', 'mathematics', 'applied mathematics', 'statistics', 'actuarial'],
        'physics' => ['physic', 'physics', 'quantum', 'optics', 'astrophysics', 'geophysics', 'particle accelerator', 'acoustics', 'theoretical'],
        'chemistry' => ['chemist', 'chemistry', 'biochemistry', 'organic chemistry', 'chemical science', 'drug sciences'],
        'biology' => ['biolog', 'biology', 'molecular biology', 'microbiology', 'genetics', 'biotechnology', 'bioinformatics', 'biomedicine', 'neuroscience', 'life science', 'biosciences', 'biosystems', 'biodiversity', 'science'],
        'agricultural science' => ['agriculture', 'agricultural', 'agronomy', 'horticulture', 'crop', 'soil', 'bioeconomy', 'digital farming', 'plant science', 'plant breeding', 'viticulture', 'enology', 'animal science', 'food science', 'food technology', 'nutrition', 'global food', 'food quality', 'forest', 'forestry', 'wood science'],
        'geosciences' => ['geoscience', 'geology', 'geography', 'earth sciences', 'paleontology', 'mineralogy', 'geomatics', 'geospatial', 'remote sensing'],
        'nanoscience' => ['nanoscience', 'nanomaterial', 'nanotechnology'],
        'environmental science' => ['environmental science', 'ecology', 'geoscience', 'earth science', 'climate science', 'meteorology', 'geology', 'geography', 'atmospheric', 'ecosystem', 'nature conservation'],

        // Medicine & Health
        'medicine' => ['medicine', 'medical', 'public health', 'healthcare', 'pharmacy', 'pharmaceutical', 'nursing', 'clinical', 'dentistry', 'auditory', 'cardiovascular', 'oral sciences', 'drug', 'gerontology'],
        'biomedical sciences' => ['biomedical', 'molecular medicine', 'neurobiology', 'immunology', 'toxicology', 'epidemiology', 'pharmacology', 'biosciences'],
        'public health' => ['public health', 'global health', 'health policy', 'epidemiology'],
        'sports science' => ['sport', 'sports', 'sports science', 'kinesiology', 'coaching', 'exercise science', 'physical activity'],

        // Architecture & Design
        'architecture' => ['architecture', 'architectural', 'spatial planning', 'interior architecture', 'built environment'],
        'urban planning' => ['urban planning', 'urban design', 'landscape architecture', 'regional planning', 'city planning', 'spatial development', 'urban studies'],
        'design' => ['design', 'industrial design', 'product design', 'interaction design', 'ui/ux', 'spatial design', 'art', 'music', 'sound'],
        'graphic design' => ['graphic design', 'visual communication', 'visual design', 'typography', 'branding'],
        'animation & game' => ['animation', 'game design', '3d animation', 'game technologies', 'digital media'],

        // Law
        'law' => ['law', 'legal', 'llm', 'jurisprudence', 'human rights', 'international law', 'commercial law'],
        'legal studies' => ['legal studies', 'comparative law', 'european law', 'intellectual property'],

        // Media & Communication
        'media' => ['media', 'journalism', 'communication', 'digital media', 'broadcasting', 'film', 'media studies', 'public relations'],

        // Business, Economics & Trade
        'business' => ['business', 'management', 'mba', 'administration', 'international management', 'commerce', 'business administration', 'entrepreneurship', 'consumer science', 'tourism', 'hospitality'],
        'international trade' => ['trade', 'international trade', 'foreign trade', 'global business', 'world trade', 'customs', 'international business', 'shipping', 'chartering'],
        'economics' => ['economic', 'economics', 'econometrics', 'macroeconomic', 'microeconomic', 'development economics', 'development research', 'labour'],
        'finance' => ['finance', 'financial', 'accounting', 'banking', 'fintech', 'investment', 'auditing'],
        'supply chain & logistics' => ['supply chain', 'logistics', 'procurement', 'transportation management', 'operations management', 'shipping'],
        'marketing' => ['marketing', 'digital marketing', 'consumer behavior', 'brand management'],
        'real estate' => ['real estate', 'property management', 'housing'],

        // Social Sciences & Humanities
        'humanities' => ['humanities', 'history', 'philosophy', 'literature', 'cultural studies', 'cultural heritage', 'heritage studies', 'manuscript', 'archaeology', 'anthropology', 'slavery'],
        'psychology' => ['psychology', 'cognitive science', 'neuropsychology', 'social psychology', 'clinical psychology', 'counseling', 'behavioural sciences'],
        'social sciences' => ['social science', 'sociology', 'political science', 'international relations', 'public policy', 'development studies', 'governance', 'peace and conflict', 'war studies', 'humanitarian', 'gender', 'diversity', 'transformation studies', 'postcolonial', 'world studies', 'cultural and social'],
        'languages & translation' => ['language', 'linguistics', 'translation', 'interpreting', 'english studies', 'german studies', 'french', 'spanish', 'philology', 'romance', 'turcolog', 'turkic', 'semitic'],
        'area studies' => ['european studies', 'asian studies', 'chinese studies', 'american studies', 'african studies', 'middle eastern', 'turkic', 'latin american', 'global studies', 'area studies', 'slavic', 'sinology', 'indian studies', 'iranian', 'british studies'],
        'theology & religious studies' => ['theology', 'religion', 'religious', 'islamic', 'jewish', 'intercultural theology'],
        'social work' => ['social work', 'social pedagogy', 'community development', 'welfare'],
        'education' => ['education', 'pedagogy', 'educational', 'teaching', 'lifelong education', 'higher education', 'evaluation'],

        // German Language
        'german' => ['german', 'deutsch', 'germanistik', 'german studies', 'daad', 'daf'],

        // Preparatory & Foundation Studies (Studienkolleg)
        'foundation & preparatory' => ['foundation', 'studienkolleg', 'pathway', 'freshman', 'university preparation', 'study preparation', 'preparatory'],
        'interdisciplinary & research' => ['interdisciplinary', 'multidisciplinary', 'graduate academy', 'early career', 'research academy', 'summer school', 'winter university', 'studium individuale', 'research master', 'research'],
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
                $snapshotArray = json_decode(json_encode($result), true);

                $this->history->create($userId, [
                    'criteria_snapshot' => $payload,
                    'results_snapshot' => $snapshotArray,
                    'program_match_count' => $programMatches->count(),
                ]);
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning(
                    'Failed to record recommendation history: ' . $e->getMessage()
                );
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
            $subjectOk = $this->subjectMatches($criteria->preferredSubjects, $program);
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
        $acceptsMoi = ! empty($englishReq['accepts_moi']);

        $selectedTestTypes = [];
        if ($criteria->englishTestType !== null) {
            $selectedTestTypes = is_array($criteria->englishTestType) ? $criteria->englishTestType : [$criteria->englishTestType];
        }

        $englishOk = false;
        if (empty($selectedTestTypes)) {
            $englishOk = true;
        } else {
            foreach ($selectedTestTypes as $type) {
                if ($type === 'moi') {
                    if ($acceptsMoi || ($minIelts === null && $minToefl === null)) {
                        $englishOk = true;
                        $reasons[] = 'MOI accepted for this profile.';
                    }
                } elseif ($type === 'ielts') {
                    if ($minIelts === null || ($criteria->englishTestScore !== null && $criteria->englishTestScore >= $minIelts)) {
                        $englishOk = true;
                        if ($minIelts !== null) {
                            $reasons[] = 'IELTS requirement matched.';
                        }
                    }
                } elseif ($type === 'toefl') {
                    if ($minToefl === null || ($criteria->englishTestScore !== null && $criteria->englishTestScore >= $minToefl)) {
                        $englishOk = true;
                        if ($minToefl !== null) {
                            $reasons[] = 'TOEFL requirement matched.';
                        }
                    }
                }
            }
        }

        if (! $englishOk) {
            $mandatoryFailures[] = 'English language score does not meet the requirement.';
            $unmatched[] = 'English language score does not meet the requirement.';
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

    private function matchesKeyword(string $searchContext, string $keyword): bool
    {
        $keyword = trim($keyword);
        if ($keyword === '') {
            return false;
        }
        
        // For short keywords (acronyms) or specific ones, enforce word boundaries
        // to avoid false positives (e.g. 'ai' in 'sustainability', 'iot' in 'physiotherapy')
        if (strlen($keyword) <= 3 || $keyword === 'ui/ux' || $keyword === 'game') {
            return preg_match('/\b' . preg_quote($keyword, '/') . '\b/i', $searchContext) === 1;
        }

        return str_contains($searchContext, $keyword);
    }

    private function subjectMatches(array $preferredSubjects, Program $program): bool
    {
        $preferredSubjects = array_values(array_filter($preferredSubjects, static fn ($v) => $v !== null && $v !== ''));
        if (empty($preferredSubjects)) {
            return true;
        }

        $cat = mb_strtolower(trim((string) $program->subject_category));
        $field = mb_strtolower(trim((string) $program->field));
        $name = mb_strtolower(trim((string) $program->name));
        $searchContext = " {$cat} {$field} {$name} ";

        foreach ($preferredSubjects as $subject) {
            $prefRaw = trim((string) $subject);
            $prefLower = mb_strtolower($prefRaw);

            // 1. Direct match on subject_category (100% backward compatible with existing DB values)
            if ($cat !== '' && ($cat === $prefLower || str_contains($cat, $prefLower) || str_contains($prefLower, $cat))) {
                return true;
            }

            // 2. Parent category matching (e.g. "Engineering", "Computer Science & IT")
            $parentKeys = [];
            if (isset(self::SUBJECT_GROUPS[$prefRaw])) {
                $parentKeys = self::SUBJECT_GROUPS[$prefRaw];
            } else {
                foreach (self::SUBJECT_GROUPS as $groupName => $subKeys) {
                    if (strcasecmp($groupName, $prefRaw) === 0) {
                        $parentKeys = $subKeys;
                        break;
                    }
                }
            }

            if (! empty($parentKeys)) {
                // If program has an explicit subject_category in this group
                if ($cat !== '' && in_array($cat, $parentKeys, true)) {
                    return true;
                }

                // Check keywords for all sub-disciplines under this parent
                foreach ($parentKeys as $subKey) {
                    if (isset(self::SUBJECT_KEYWORDS[$subKey])) {
                        foreach (self::SUBJECT_KEYWORDS[$subKey] as $keyword) {
                            if ($this->matchesKeyword($searchContext, $keyword)) {
                                return true;
                            }
                        }
                    } elseif ($this->matchesKeyword($searchContext, $subKey)) {
                        return true;
                    }
                }
            } else {
                // 3. Specific subcategory / specialized discipline
                if (isset(self::SUBJECT_KEYWORDS[$prefLower])) {
                    foreach (self::SUBJECT_KEYWORDS[$prefLower] as $keyword) {
                        if ($this->matchesKeyword($searchContext, $keyword)) {
                            return true;
                        }
                    }
                }

                // Fallback: general substring match against category, field, or title
                if ($this->matchesKeyword($searchContext, $prefLower)) {
                    return true;
                }
            }
        }

        return false;
    }
}