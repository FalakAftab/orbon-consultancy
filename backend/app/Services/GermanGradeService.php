<?php

namespace App\Services;

use InvalidArgumentException;

class GermanGradeService
{
    public function calculate(?float $obtainedGpa, ?float $maximumGpa, ?float $passingGpa = null): ?float
    {
        if ($obtainedGpa === null || $maximumGpa === null || $maximumGpa <= 0) {
            return null;
        }

        // Legacy behavior (no passing GPA): normalize using [0, maximumGpa]
        if ($passingGpa === null || $passingGpa <= 0 || $passingGpa >= $maximumGpa) {
            $grade = 1 + 3 * (($maximumGpa - $obtainedGpa) / $maximumGpa);
            return round(max(1, min(4, $grade)), 2);
        }

        // Normalize using [passingGpa, maximumGpa]
        $denom = $maximumGpa - $passingGpa;
        if ($denom <= 0) {
            return null;
        }

        $normalized = ($maximumGpa - $obtainedGpa) / $denom; // 0 => at max, 1 => at passing
        $grade = 1 + 3 * $normalized;

        return round(max(1, min(4, $grade)), 2);
    }
}

