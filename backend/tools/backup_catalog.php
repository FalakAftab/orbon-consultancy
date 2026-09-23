<?php

declare(strict_types=1);

use App\Models\Program;
use App\Models\University;

require dirname(__DIR__).'/vendor/autoload.php';
$app = require dirname(__DIR__).'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$output = $argv[1] ?? '';
if ($output === '') {
    fwrite(STDERR, "Usage: php backup_catalog.php <output-json>\n");
    exit(1);
}
$payload = [
    'created_at' => now()->toIso8601String(),
    'universities' => University::withTrashed()->get()->toArray(),
    'programs' => Program::withTrashed()->get()->toArray(),
];
file_put_contents($output, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
printf("universities=%d programs=%d output=%s\n", count($payload['universities']), count($payload['programs']), $output);
