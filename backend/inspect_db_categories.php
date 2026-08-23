<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Program;

$categories = Program::query()->distinct()->pluck('subject_category')->sort()->values();
echo "DISTINCT SUBJECT CATEGORIES IN DB (" . count($categories) . " total):\n";
foreach ($categories as $cat) {
    $count = Program::query()->where('subject_category', $cat)->count();
    echo " - '{$cat}': {$count} programs\n";
}
