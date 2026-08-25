<?php

namespace App\Services\Excel;

use App\Models\Program;
use App\Models\University;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class DatasetImportService
{
    public function importWorkbook(string $path): array
    {
        $rows = Excel::toCollection(new HeadingsImport(), $path)->first() ?? collect();

        return $this->importRows($rows);
    }

    public function importRows(Collection $rows): array
    {
        $processed = 0;
        $failed = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;

            try {
                $data = $this->normalizeRow($row);
                $university = University::query()->updateOrCreate(
                    ['slug' => $data['university_slug']],
                    [
                        'name' => $data['university_name'],
                        'slug' => $data['university_slug'],
                        'city' => $data['city'],
                        'state' => $data['state'],
                        'country' => 'Germany',
                        'ranking' => $data['ranking'],
                        'tuition_type' => $data['tuition_type'],
                        'tuition_fee' => $data['tuition_fee'],
                        'admission_method' => $data['admission_method'],
                        'application_link' => $data['application_link'],
                        'website_url' => $data['application_link'],
                        'application_deadline_winter' => null,
                        'application_deadline_summer' => null,
                        'description' => $data['notes'],
                        'scholarship_available' => false,
                        'is_featured' => false,
                    ]
                );

                Program::query()->updateOrCreate(
                    ['slug' => $data['program_slug']],
                    [
                        'university_id' => $university->id,
                        'name' => $data['program_name'],
                        'slug' => $data['program_slug'],
                        'degree_level' => $data['degree_level'],
                        'field' => $data['field'],
                        'subject_category' => $data['subject_category'],
                        'intake' => $data['intake'],
                        'language_of_instruction' => $data['language_of_instruction'],
                        'admission_method' => $data['admission_method'],
                        'tuition_type' => $data['tuition_type'],
                        'tuition_fee' => $data['tuition_fee'],
                        'scholarship_amount' => null,
                        'english_requirements' => $data['english_requirements'],
                        'german_requirements' => $data['german_requirements'],
                        'eligibility_rules' => $data['eligibility_rules'],
                        'description' => $data['notes'],
                        'application_link' => $data['application_link'],
                        'daad_program_link' => $data['daad_program_link'],
                        'deadline_winter' => null,
                        'deadline_summer' => null,
                    ]
                );


                $processed++;
            } catch (\Throwable $throwable) {
                $failed++;
                $errors[] = ['row' => $rowNumber, 'error' => $throwable->getMessage()];
                Log::warning('Dataset import row failed', ['row' => $rowNumber, 'error' => $throwable->getMessage()]);
            }
        }

        return compact('processed', 'failed', 'errors');
    }

    private function normalizeRow(array|Collection $row): array
    {
        $source = Collection::make($row)->mapWithKeys(function ($value, $key) {
            return [Str::lower(Str::of((string) $key)->replace(['.', '-', '/', '(', ')', '_'], ' ')->squish()->toString()) => $value];
        });

        $universityName = trim((string) $this->getValue($source, 'university name'));
        $programName = trim((string) $this->getValue($source, 'program name'));
        if ($universityName === '' || $programName === '') {
            throw new \RuntimeException('University Name and Program Name are required.');
        }

        $feeAmount = $this->parseMoney($this->getFirstValue($source, ['fee amount', 'tuition fee', 'fee', 'tuition']));
        $germanGrade = $this->parseMinProgramGpaToGermanGrade(
            $this->getFirstValue($source, ['min german cgpa', 'min german grade', 'german grade', 'min cgpa', 'modnoten scale'])
        );
        $minIelts = $this->parseEnglishTestScore($this->getValue($source, 'min ielts'));
        $minToefl = $this->parseEnglishTestScore($this->getValue($source, 'min toefl'));
        $germanRequired = $this->normalizeYesNo($this->getValue($source, 'german language required'));
        $germanLevel = $this->normalizeGermanLevel($this->getValue($source, 'german language level'));
        $intake = $this->normalizeIntake($this->getValue($source, 'intake season'));
        $feeType = $this->normalizeTuitionType($this->getValue($source, 'fee type'));
        // Issue 1 fix: never let tuition_type and tuition_fee contradict each other.
        if ($feeType === 'free') {
            $feeAmount = 0.0;
        } elseif ($feeType === 'both' && $feeAmount === null) {
            $feeAmount = 0.0;
        } elseif ($feeType === 'paid' && ($feeAmount === null || $feeAmount <= 0)) {
            $feeType = 'both';
        }
        $admissionMode = $this->normalizeAdmissionMode($this->getValue($source, 'admission mode portal'));
        $degreeLevel = $this->normalizeDegreeLevel($this->getValue($source, 'degree level'));
        $city = $this->getFirstNonEmptyValue($source, ['city', 'location city']);
        $state = $this->getFirstNonEmptyValue($source, ['state', 'region']);
        $daadProgramLink = trim((string) $this->getFirstValue($source, ['daad program link', 'daad link', 'program link'])) ?: null;

        return [
            'university_name' => $universityName,
            'university_slug' => Str::slug($universityName),
            'program_name' => $programName,
            'program_slug' => Str::slug($universityName.' '.$programName),
            'degree_level' => $degreeLevel,
            'field' => trim((string) $this->getValue($source, 'field category')) ?: 'General',
            'subject_category' => $this->normalizeSubjectCategory($this->getValue($source, 'field category')),

            'intake' => $intake,
            'tuition_type' => $feeType,
            'tuition_fee' => $feeAmount,
            'ranking' => null,
            'city' => $city,
            'state' => $state,
            'admission_method' => $admissionMode,
            'application_link' => trim((string) $this->getValue($source, 'application link')) ?: null,
            'daad_program_link' => $daadProgramLink,
            'language_of_instruction' => $germanRequired ? 'mixed' : 'english',
            'english_requirements' => [
                'min_ielts' => $minIelts,
                'min_toefl' => $minToefl,
                'accepted_tests' => array_values(array_filter([
                    $minIelts !== null ? 'ielts' : null,
                    $minToefl !== null ? 'toefl' : null,
                    $germanRequired ? 'moi' : null,
                ])),
            ],
            'german_requirements' => [
                'required' => $germanRequired,
                'level' => $germanLevel,
            ],
            'eligibility_rules' => [
                'max_german_grade' => $germanGrade,
                'german_required' => $germanRequired,
                'german_level' => $germanLevel,
                'deadline_winter_raw' => $this->formatDeadlineValue($this->getValue($source, 'deadline winter intake')),
                'deadline_summer_raw' => $this->formatDeadlineValue($this->getValue($source, 'deadline summer intake')),
            ],
            'notes' => trim((string) $this->getFirstValue($source, ['notes', 'notes verify before client'])) ?: null,
        ];
    }

    private function formatDeadlineValue(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        // Case 1: PhpSpreadsheet/Maatwebsite Excel sometimes returns a
        // native DateTime/Carbon object for real date cells.
        if ($value instanceof \DateTimeInterface) {
            return $value->format('d F Y');
        }

        // Case 2: A raw Excel serial date number (e.g. 46174). Only
        // treat it as a serial date if it's purely numeric — free text
        // like "15 July" or "Not Specified (See Application Link)"
        // must NOT go through this branch.
        if (is_numeric($value)) {
            try {
                $date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((float) $value);
                return $date->format('d F Y');
            } catch (\Throwable) {
                return trim((string) $value);
            }
        }

        // Case 3: normal free text — keep exactly as-is (unchanged behavior).
        return trim((string) $value) ?: null;
    }

    private function getValue(Collection $source, string $key): mixed
    {
        return $source->get(Str::lower($key));
    }

    private function getFirstValue(Collection $source, array $keys): mixed
    {
        foreach ($keys as $key) {
            $value = $this->getValue($source, $key);
            if ($value !== null && $value !== '') {
                return $value;
            }
        }

        return null;
    }

    private function getFirstNonEmptyValue(Collection $source, array $keys): ?string
    {
        $value = $this->getFirstValue($source, $keys);

        return $value === null ? null : trim((string) $value);
    }

    private function parseMoney(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        $string = (string) $value;

        // Prefer numbers with comma-grouped thousands, e.g. "1,500" or "12,500.50"
        if (preg_match('/([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]+)?)/', $string, $matches) === 1) {
            return (float) str_replace(',', '', $matches[1]);
        }

        // Fall back to a plain decimal number, e.g. "180" or "154.5"
        if (preg_match('/([0-9]+(?:\.[0-9]+)?)/', $string, $matches) === 1) {
            return (float) $matches[1];
        }

        return null;
    }

    private function parseNumber(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        if (preg_match('/([0-9]+(?:[\.,][0-9]+)?)/', (string) $value, $matches) === 1) {
            return (float) str_replace(',', '.', $matches[1]);
        }

        return null;
    }

    private function parseGrade(mixed $value): ?float
    {
        return $this->parseNumber($value);
    }

    private function parseEnglishTestScore(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        $string = trim((string) $value);

        // If the cell is a bare CEFR level (optionally with extra text
        // like "6.0 (B2)" which already has a real number and should
        // NOT go through this branch), map it to an approximate IELTS
        // equivalent using the standard Cambridge/IELTS CEFR mapping.
        if (preg_match('/^\s*(a1|a2|b1|b2|c1|c2)\s*$/i', $string, $m) === 1) {
            $cefr = strtoupper($m[1]);

            return match ($cefr) {
                'A1' => null, // below minimum university admission level, not meaningfully expressible as IELTS
                'A2' => 3.5,
                'B1' => 4.5,
                'B2' => 6.0,
                'C1' => 7.0,
                'C2' => 8.5,
                default => null,
            };
        }

        // Otherwise (a real number, or a number with a CEFR level in
        // parentheses like "6.0 (B2)", or descriptive text), fall back
        // to the existing numeric extraction — unchanged behavior.
        return $this->parseNumber($string);
    }

    private function parseMinProgramGpaToGermanGrade(mixed $value): ?float
    {
        $raw = $value;
        if ($raw === null || $raw === '') {
            return null;
        }

        $string = trim((string) $raw);
        if ($string === '') {
            return null;
        }

        $isPercent = str_contains($string, '%');
        $stringNoPercent = str_replace(['%'], '', $string);

        // CGPA pattern: "x/y" e.g. "3.2/4", "8.2/10"
        if (preg_match('/^\s*([0-9]+(?:[\.,][0-9]+)?)\s*\/\s*([0-9]+(?:[\.,][0-9]+)?)\s*$/', $stringNoPercent, $m) === 1) {
            $got = (float) str_replace(',', '.', $m[1]);
            $outOf = (float) str_replace(',', '.', $m[2]);

            $denom = match (true) {
                $outOf <= 4.01 && $outOf >= 3.99 => 4.0,
                $outOf <= 5.01 && $outOf >= 4.99 => 5.0,
                $outOf <= 10.01 && $outOf >= 9.99 => 10.0,
                default => null,
            };

            if ($denom === null || $got <= 0 || $got > $denom) {
                return null;
            }

            $normalized = ($denom - $got) / $denom;
            $grade = 1 + 3 * $normalized;
            return round(max(1.0, min(4.0, $grade)), 2);
        }

        // Range pattern: "2.5 - 3.0" — take the more lenient (higher)
        // bound so fewer eligible students are excluded by an
        // ambiguous range written by the university.
        if (preg_match('/([0-9]+(?:[\.,][0-9]+)?)\s*-\s*([0-9]+(?:[\.,][0-9]+)?)/', $stringNoPercent, $m) === 1) {
            $a = (float) str_replace(',', '.', $m[1]);
            $b = (float) str_replace(',', '.', $m[2]);
            $rangeCandidate = max($a, $b);
            if (!$isPercent && $rangeCandidate >= 1.0 && $rangeCandidate <= 4.0) {
                return round($rangeCandidate, 2);
            }
        }

        $candidate = $this->parseNumber($stringNoPercent);
        if ($candidate === null) {
            return null;
        }

        // FIX: check for an already-German-scale grade (1.0-4.0) BEFORE
        // the percentage branch, since 1-4 is a subset of 0-100 and was
        // previously always caught by the percentage check first.
        if (!$isPercent && $candidate >= 1.0 && $candidate <= 4.0) {
            return round($candidate, 2);
        }

        if ($isPercent || ($candidate > 4.0 && $candidate <= 100 && !str_contains($stringNoPercent, '/'))) {
            $percent = $candidate;
            if ($percent < 0 || $percent > 100) {
                return null;
            }
            $normalized = (100.0 - $percent) / 100.0;
            $grade = 1 + 3 * $normalized;
            return round(max(1.0, min(4.0, $grade)), 2);
        }

        return null;
    }


    private function normalizeYesNo(mixed $value): bool
    {
        return in_array(Str::lower(trim((string) $value)), ['yes', 'true', '1', 'required'], true);
    }

    private function normalizeDegreeLevel(mixed $value): string
    {
        $normalized = Str::lower(trim((string) $value));

        return match (true) {
            str_contains($normalized, 'phd') || str_contains($normalized, 'doctoral') || str_contains($normalized, 'dr.') || str_contains($normalized, 'dr rer') => 'phd',
            str_contains($normalized, 'master') => 'master',
            default => 'bachelor',
        };
    }

    private function normalizeIntake(mixed $value): string
    {
        $normalized = Str::lower(trim((string) $value));

        return match (true) {
            str_contains($normalized, 'winter') && str_contains($normalized, 'summer') => 'both',
            str_contains($normalized, 'winter') => 'winter',
            str_contains($normalized, 'summer') => 'summer',
            default => 'both',
        };
    }

    private function normalizeTuitionType(mixed $value): string
    {
        $normalized = Str::lower(trim((string) $value));

        return match (true) {
            str_contains($normalized, 'paid') && str_contains($normalized, 'free') => 'both',
            str_contains($normalized, 'free') => 'free',
            str_contains($normalized, 'paid') => 'paid',
            default => 'both',
        };
    }

    private function normalizeAdmissionMode(mixed $value): string
    {
        $normalized = Str::lower(trim((string) $value));

        if (str_contains($normalized, 'uni-assist') && str_contains($normalized, 'direct')) {
            return 'both';
        }

        if (str_contains($normalized, 'uni-assist')) {
            return 'uni_assist';
        }

        return 'direct_portal';
    }

    private function normalizeGermanLevel(mixed $value): ?string
    {
        $normalized = Str::lower(trim((string) $value));

        return match (true) {
            str_contains($normalized, 'c2') => 'c2',
            str_contains($normalized, 'c1') => 'c1',
            str_contains($normalized, 'b2') => 'b2',
            str_contains($normalized, 'b1') => 'b1',
            str_contains($normalized, 'a2') => 'a2',
            str_contains($normalized, 'a1') => 'a1',
            default => null,
        };
    }

    private function normalizeSubjectCategory(mixed $value): ?string
    {
        $raw = trim((string) $value);
        if ($raw === '') {
            return null;
        }

        $n = Str::lower($raw);

        $map = [
            'computer science' => ['computer science', 'informatik', 'computing'],
            'software engineering' => ['software engineering', 'software'],
            'artificial intelligence' => ['artificial intelligence', ' ai ', 'machine learning', 'deep learning'],
            'data science' => ['data science', 'data analytics', 'bioinformatics'],
            'cyber security' => ['cyber security', 'cybersecurity', 'information security'],
            'information technology' => ['information technology', 'information systems'],
            'electrical engineering' => ['electrical engineering', 'computer engineering', 'photonics', 'quantum engineering'],
            'mechanical engineering' => ['mechanical engineering'],
            'civil engineering' => ['civil engineering', 'landscape architecture'],
            'chemical engineering' => ['chemical engineering'],
            'environmental engineering' => ['environmental engineering'],
            'biomedical engineering' => ['biomedical engineering', 'molecular medicine'],
            'industrial engineering' => ['industrial engineering', 'logistics', 'textile engineering'],
            'aerospace engineering' => ['aerospace engineering', 'automotive engineering'],
            'mechatronics & robotics' => ['mechatronics', 'robotics'],
            'energy engineering' => ['energy engineering', 'materials science'],
            'mathematics' => ['mathematics', 'math'],
            'physics' => ['physics', 'astrophysics'],
            'chemistry' => ['chemistry', 'biochemistry'],
            'biology' => ['biology', 'life sciences', 'ecology', 'food science', 'agricultural economics'],
            'neuroscience' => ['neuroscience', 'cognitive science'],
            'biotechnology' => ['biotechnology'],
            'geosciences' => ['geosciences', 'environmental science'],
            'medicine' => ['medicine', 'medical', 'health', 'sports science'],
            'architecture' => ['architecture'],
            'law' => ['law', 'legal', 'juris'],
            'media' => ['media', 'communication', 'journalism', 'tourism management'],
            'design' => ['design'],
            'business & management' => ['business', 'management', 'bwl', 'entrepreneurship'],
            'economics' => ['economics', 'agricultural economics'],
            'finance' => ['finance', 'financial', 'banking'],
            'marketing' => ['marketing'],
            'political science & international relations' => ['political science', 'international relations', 'development studies', 'public policy', 'international law'],
            'psychology' => ['psychology'],
            'sociology' => ['sociology', 'social work', 'social sciences', 'anthropology'],
            'history' => ['history'],
            'philosophy' => ['philosophy', 'theology'],
            'linguistics & cultural studies' => ['linguistics', 'cultural studies', 'european studies', 'german studies', 'humanities'],
            'german language' => ['german language'],
        ];

        foreach ($map as $category => $needles) {
            foreach ($needles as $needle) {
                $trimmedNeedle = trim($needle);
                if ($trimmedNeedle === '') {
                    continue;
                }
                if (str_contains($n, $trimmedNeedle)) {
                    return $category;
                }
            }
        }

        return null;
    }

}