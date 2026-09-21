<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Program;
use App\Models\University;

echo "Total Programs: " . Program::count() . "\n";
echo "Total Universities: " . University::count() . "\n";
echo "Null Categories: " . Program::whereNull('subject_category')->count() . "\n";

$categories = Program::select('subject_category')
    ->groupBy('subject_category')
    ->pluck('subject_category');
echo "Categories:\n";
foreach($categories as $cat) {
    echo "- " . ($cat ?? 'NULL') . "\n";
}

echo "Degrees:\n";
$degrees = Program::select('degree_level')
    ->groupBy('degree_level')
    ->pluck('degree_level');
foreach($degrees as $deg) {
    echo "- " . ($deg ?? 'NULL') . "\n";
}
