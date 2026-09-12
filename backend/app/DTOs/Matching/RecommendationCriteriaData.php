<?php

namespace App\DTOs\Matching;

class RecommendationCriteriaData
{
    public function __construct(
        public readonly ?string $lastDegree,
        public readonly ?float $obtainedGpa,
        public readonly ?float $maximumGpa,
        public readonly string|array|null $englishTestType,
        public readonly ?float $englishTestScore,
        public readonly ?string $preferredIntake,
        public readonly ?string $admissionPreference,
        public readonly ?string $tuitionPreference,
        public readonly ?string $preferredDegree,
        public readonly ?string $preferredLanguage,
        public readonly ?string $preferredCity,
        public readonly ?string $preferredState,
        public readonly ?float $tuitionFeeMin,
        public readonly ?float $tuitionFeeMax,
        public readonly ?array $preferredSubjects,
        public readonly ?float $germanGrade,
        public readonly ?string $germanLevel,
    ) {
    }
}