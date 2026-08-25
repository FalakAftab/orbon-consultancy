<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Program;
use App\Models\University;
use App\Models\User;
use App\Models\RecommendationHistory;

echo "Programs: ".Program::count().PHP_EOL;
echo "Universities: ".University::count().PHP_EOL;
echo "Students: ".User::where('role', 'student')->count().PHP_EOL;
echo "History: ".RecommendationHistory::count().PHP_EOL;

echo "Distinct subject_category values:".PHP_EOL;
$subjects = Program::whereNotNull('subject_category')->where('subject_category', '<>', '')->distinct()->pluck('subject_category')->sort()->values();
foreach ($subjects as $s) {
    echo "  - ".$s.PHP_EOL;
}

echo "Distinct degree_level values:".PHP_EOL;
$degrees = Program::whereNotNull('degree_level')->distinct()->pluck('degree_level')->sort()->values();
foreach ($degrees as $d) {
    echo "  - ".$d.PHP_EOL;
}

echo "Distinct language_of_instruction values:".PHP_EOL;
$langs = Program::whereNotNull('language_of_instruction')->distinct()->pluck('language_of_instruction')->sort()->values();
foreach ($langs as $l) {
    echo "  - ".$l.PHP_EOL;
}
