<?php

declare(strict_types=1);

use App\Models\Program;
use App\Models\University;

require dirname(__DIR__).'/vendor/autoload.php';
$app = require dirname(__DIR__).'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$input = $argv[1] ?? '';
$output = $argv[2] ?? '';
$scope = strtolower($argv[3] ?? 'masters');
if ($input === '' || $output === '' || ! is_file($input) || ! in_array($scope, ['masters', 'all'], true)) {
    fwrite(STDERR, "Usage: php build_master_merge_plan.php <staging-json> <output-json> [masters|all]\n");
    exit(1);
}

$staging = json_decode((string) file_get_contents($input), true, 512, JSON_THROW_ON_ERROR);
$normalize = static function (string $value): string {
    $value = strtolower(trim($value));
    $value = str_replace(['&', '–', '—', '-', '.', ',', '(', ')'], ['and', ' ', ' ', ' ', ' ', ' ', ' ', ' '], $value);
    return preg_replace('/\s+/', ' ', $value) ?: '';
};
$isMaster = static function (array $record): bool {
    $program = strtolower((string) ($record['program_name'] ?? ''));
    $degree = strtolower((string) ($record['degree'] ?? ''));
    $text = $program.' '.$degree;
    if ($degree === 'not specified' && ! str_contains($program, 'master') && ! preg_match('/\bm\.?\s*(sc|a|eng|ed|ba|phil|res)\.?\b/i', $program)) {
        return false;
    }
    return str_contains($text, 'master')
        || preg_match('/\bm\.?\s*(sc|a|eng|ed|ba|phil|res)\.?\b/i', $text) === 1
        || preg_match('/\bmba\b/i', $text) === 1;
};

$universities = University::withTrashed()->get(['id', 'name', 'slug']);
$programs = Program::withTrashed()->with('university')->get(['id', 'university_id', 'name', 'slug', 'degree_level']);
$universityMap = [];
foreach ($universities as $university) {
    $universityMap[$normalize((string) $university->name)] = $university;
}

$masterRecords = $scope === 'all'
    ? array_values(array_filter($staging['records'] ?? [], static fn (array $record): bool => trim((string) ($record['university_name'] ?? '')) !== ''))
    : array_values(array_filter($staging['records'] ?? [], $isMaster));
$matched = [];
$unmatched = [];
$duplicateExisting = [];
foreach ($masterRecords as $record) {
    $sourceUniversity = trim((string) ($record['university_name'] ?? ''));
    $sourceProgram = trim((string) ($record['program_name'] ?? ''));
    $university = $universityMap[$normalize($sourceUniversity)] ?? null;
    $existingPrograms = [];
    if ($university) {
        $existingPrograms = $programs->filter(
            fn (Program $program): bool => $program->university_id === $university->id
                && $normalize((string) $program->name) === $normalize($sourceProgram)
        )->values()->map(fn (Program $program): array => [
            'id' => $program->id,
            'name' => $program->name,
            'degree_level' => $program->degree_level,
        ])->all();
    }

    $item = [
        'source_file' => $record['source_file'],
        'university_name' => $sourceUniversity,
        'program_name' => $sourceProgram,
        'existing_university_id' => $university?->id,
        'existing_university_name' => $university?->name,
        'existing_programs' => $existingPrograms,
        'details' => $record,
    ];
    if (! $university) {
        $unmatched[] = $item;
    } else {
        $matched[] = $item;
        if ($existingPrograms !== []) {
            $duplicateExisting[] = $item;
        }
    }
}

usort($matched, static fn (array $a, array $b): int => strcasecmp(
    $a['university_name'].' '.$a['program_name'],
    $b['university_name'].' '.$b['program_name']
));
usort($unmatched, static fn (array $a, array $b): int => strcasecmp(
    $a['university_name'].' '.$a['program_name'],
    $b['university_name'].' '.$b['program_name']
));

$result = [
    'mode' => 'DRY_RUN_ONLY',
    'focus' => $scope === 'all' ? 'all_degree_programs' : 'master_programs',
    'existing_universities' => $universities->count(),
    'existing_programs' => $programs->count(),
    'staged_records' => count($masterRecords),
    'matched_to_existing_university' => count($matched),
    'unmatched_university' => count($unmatched),
    'already_existing_program_name_match' => count($duplicateExisting),
    'matched' => $matched,
    'unmatched' => $unmatched,
];
file_put_contents($output, json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
printf("%s=%d matched_universities=%d unmatched_universities=%d existing_program_matches=%d\n", $scope === 'all' ? 'all_programs' : 'masters', count($masterRecords), count($matched), count($unmatched), count($duplicateExisting));
