<?php

declare(strict_types=1);

use App\Models\Program;
use App\Models\University;
use App\Services\Excel\DatasetImportService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

require dirname(__DIR__).'/vendor/autoload.php';
$app = require dirname(__DIR__).'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$input = $argv[1] ?? '';
$mode = strtolower($argv[2] ?? 'dry-run');
$scope = strtolower($argv[3] ?? 'all');
if ($input === '' || ! is_file($input) || ! in_array($mode, ['dry-run', 'write'], true) || ! in_array($scope, ['all', 'masters'], true)) {
    fwrite(STDERR, "Usage: php import_staged_program_details.php <staging-json> [dry-run|write] [all|masters]\n");
    exit(1);
}

$payload = json_decode((string) file_get_contents($input), true, 512, JSON_THROW_ON_ERROR);
$normalize = static function (string $value): string {
    $value = Str::ascii(strtolower(trim($value)));
    $value = str_replace(['&', '–', '—', '-', '.', ',', '(', ')'], ['and', ' ', ' ', ' ', ' ', ' ', ' ', ' '], $value);
    return preg_replace('/\s+/', ' ', $value) ?: '';
};
$first = static function (string $value): string {
    $value = trim($value);
    return $value === '' || strtolower($value) === 'not specified' ? '' : $value;
};
$degree = static function (array $record): string {
    $text = strtolower(($record['program_name'] ?? '').' '.($record['degree'] ?? ''));
    if (str_contains($text, 'phd') || str_contains($text, 'doctoral')) return 'phd';
    if (str_contains($text, 'master') || preg_match('/\bm\.?\s*(sc|a|eng|ed|phil|res)\.?\b/i', $text) || str_contains($text, 'mba')) return 'master';
    return 'bachelor';
};
$isMaster = static function (array $record) use ($degree): bool {
    return $degree($record) === 'master';
};
$intake = static function (string $value): string {
    $value = strtolower($value);
    if (str_contains($value, 'winter') && str_contains($value, 'summer')) return 'both';
    if (str_contains($value, 'summer')) return 'summer';
    return 'winter';
};
$language = static function (string $value): string {
    $value = strtolower($value);
    if (str_contains($value, 'mixed') || (str_contains($value, 'english') && str_contains($value, 'german'))) return 'mixed';
    return str_contains($value, 'german') && ! str_contains($value, 'english') ? 'german' : 'english';
};
$tuitionType = static function (string $value): string {
    $value = strtolower($value);
    if ($value === '' || str_contains($value, 'none') || str_contains($value, 'free')) return 'free';
    if (preg_match('/[0-9]/', $value)) return 'paid';
    return 'both';
};
$money = static function (string $value): ?float {
    if ($value === '') return null;
    if (preg_match('/([0-9]{1,3}(?:[,.][0-9]{3})*(?:[,.][0-9]+)?)/', $value, $match) !== 1) return null;
    $number = str_replace('.', '', $match[1]);
    $number = str_replace(',', '.', $number);
    return is_numeric($number) ? (float) $number : null;
};
$subjectCategory = static function (string $value): ?string {
    return app(DatasetImportService::class)->normalizeSubjectCategory($value);
};

$universities = University::withTrashed()->get(['id', 'name']);
$universityMap = [];
foreach ($universities as $university) $universityMap[$normalize((string) $university->name)] = $university;
$programs = Program::withTrashed()->get(['id', 'university_id', 'name', 'slug', 'degree_level', 'field', 'subject_category', 'description', 'english_requirements', 'german_requirements', 'eligibility_rules', 'application_link', 'daad_program_link', 'deadline_winter', 'deadline_summer', 'tuition_type', 'tuition_fee', 'intake', 'language_of_instruction']);
$programMap = [];
foreach ($programs as $program) $programMap[$program->university_id.'|'.$normalize((string) $program->name)] = $program;

$stats = ['source_records' => 0, 'matched_universities' => 0, 'updated_existing' => 0, 'created_programs' => 0, 'skipped_university' => 0, 'errors' => []];
$records = array_values(array_filter($payload['records'] ?? [], static fn (array $record): bool => trim((string) ($record['university_name'] ?? '')) !== ''));
if ($scope === 'masters') {
    $records = array_values(array_filter($records, $isMaster));
}
$run = function () use (&$stats, $records, $universityMap, &$programMap, $normalize, $first, $degree, $intake, $language, $tuitionType, $money, $subjectCategory, $mode): void {
    foreach ($records as $record) {
        $stats['source_records']++;
        $university = $universityMap[$normalize((string) $record['university_name'])] ?? null;
        if (! $university) { $stats['skipped_university']++; continue; }
        $stats['matched_universities']++;
        $name = $first((string) ($record['program_name'] ?? ''));
        if ($name === '') continue;
        $key = $university->id.'|'.$normalize($name);
        $existing = $programMap[$key] ?? null;
        $description = $first((string) ($record['description'] ?? ''));
        $category = $subjectCategory($name.' '.$description);
        $fee = $money($first((string) ($record['tuition_fee'] ?? '')));
        $languageRequirements = $first((string) ($record['language_requirements'] ?? ''));
        $english = [
            'raw' => $languageRequirements,
            'min_ielts' => preg_match('/ielts[^0-9]*([0-9]+(?:\.[0-9]+)?)/i', $languageRequirements, $ielts) === 1 ? (float) $ielts[1] : null,
            'min_toefl' => preg_match('/toefl[^0-9]*([0-9]+(?:\.[0-9]+)?)/i', $languageRequirements, $toefl) === 1 ? (float) $toefl[1] : null,
            'accepts_moi' => (bool) preg_match('/medium of instruction|\bmoi\b/i', $languageRequirements),
            'source' => 'staged_document',
        ];
        $german = ['raw' => $first((string) ($record['language_details'] ?? '')), 'source' => 'staged_document'];
        $eligibility = [
            'academic_requirements' => $first((string) ($record['academic_requirements'] ?? '')),
            'course_location' => $first((string) ($record['course_location'] ?? '')),
            'duration' => $first((string) ($record['programme_duration'] ?? '')),
            'deadlines' => $first((string) ($record['deadlines'] ?? '')),
            'application_details' => $first((string) ($record['application_details'] ?? '')),
            'source_file' => $record['source_file'] ?? null,
        ];
        $links = $record['links'] ?? [];
        $daad = collect($links)->first(fn ($link) => str_contains(strtolower((string) $link), 'daad.de'));
        $application = collect($links)->first(fn ($link) => ! str_contains(strtolower((string) $link), 'daad.de'));
        $fields = [
            'degree_level' => $degree($record),
            'field' => $category ?? 'General',
            'subject_category' => $category,
            'intake' => $intake($first((string) ($record['intake'] ?? ''))),
            'language_of_instruction' => $language($first((string) ($record['teaching_language'] ?? '').' '.($record['language_details'] ?? ''))),
            'tuition_type' => $tuitionType($first((string) ($record['tuition_fee'] ?? ''))),
            'tuition_fee' => $fee,
            'english_requirements' => $english,
            'german_requirements' => $german,
            'eligibility_rules' => $eligibility,
            'description' => $description ?: null,
            'application_link' => $application,
            'daad_program_link' => $daad,
        ];
        $fields = array_filter($fields, static fn ($value): bool => $value !== null && $value !== '');
        if ($existing) {
            $update = [];
            foreach ($fields as $field => $value) {
                if (in_array($field, ['english_requirements', 'german_requirements', 'eligibility_rules'], true)) {
                    $current = is_array($existing->{$field}) ? $existing->{$field} : [];
                    $update[$field] = array_merge($value, $current);
                } elseif ($field === 'field' && in_array(trim((string) $existing->{$field}), ['', 'General'], true)) {
                    $update[$field] = $value;
                } elseif ($field === 'subject_category' && ($existing->{$field} === null || $existing->{$field} === '')) {
                    $update[$field] = $value;
                } elseif ($existing->{$field} === null || $existing->{$field} === '') {
                    $update[$field] = $value;
                }
            }
            if ($mode === 'write' && $update !== []) $existing->update($update);
            if ($update !== []) $stats['updated_existing']++;
            continue;
        }
        $fields['university_id'] = $university->id;
        $fields['name'] = $name;
        $fields['slug'] = Str::slug($university->name.' '.$name);
        $fields['admission_method'] = 'both';
        if ($mode === 'write') {
            $created = Program::create($fields);
            $programMap[$key] = $created;
        }
        $stats['created_programs']++;
    }
};

if ($mode === 'write') DB::transaction($run); else $run();
print json_encode(['mode' => strtoupper($mode), 'scope' => $scope, 'stats' => $stats], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES).PHP_EOL;
