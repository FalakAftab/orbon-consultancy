<?php

declare(strict_types=1);

use App\Models\Program;
use App\Services\Excel\HeadingsImport;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

require dirname(__DIR__).'/vendor/autoload.php';
$app = require dirname(__DIR__).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$path = $argv[1] ?? '';
if ($path === '' || ! is_file($path)) {
    fwrite(STDERR, "Usage: php audit_catalog.php <workbook.xlsx>\n");
    exit(1);
}

$rows = Excel::toCollection(new HeadingsImport(), $path)->first() ?? collect();
$sourceSlugs = $rows
    ->map(function ($row): ?string {
        $university = trim((string) ($row['university_name'] ?? ''));
        $program = trim((string) ($row['program_name'] ?? ''));

        return $university !== '' && $program !== ''
            ? Str::slug($university.' '.$program)
            : null;
    })
    ->filter()
    ->unique()
    ->values();

$databaseSlugs = Program::query()->pluck('slug');
$missing = $sourceSlugs->diff($databaseSlugs)->values();
$stale = $databaseSlugs->diff($sourceSlugs)->values();

echo json_encode([
    'excel_unique_programs' => $sourceSlugs->count(),
    'database_programs' => $databaseSlugs->count(),
    'excel_missing_from_database' => $missing->count(),
    'database_not_in_excel' => $stale->count(),
    'stale_with_null_subject_category' => Program::query()
        ->whereIn('slug', $stale)
        ->whereNull('subject_category')
        ->count(),
    'missing_examples' => $missing->take(3)->values(),
    'stale_examples' => $stale->take(3)->values(),
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).PHP_EOL;