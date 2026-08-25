<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Total Programs: " . \App\Models\Program::count() . "\n";
echo "Total Universities: " . \App\Models\University::count() . "\n\n";

$sample = \App\Models\Program::take(10)->get();
foreach ($sample as $p) {
    echo "ID: " . $p->id . " | " . $p->name . "\n";
    echo "  Degree: " . $p->degree_level . "\n";
    echo "  Subject Cat: " . $p->subject_category . "\n";
    echo "  Field: " . $p->field . "\n";
    echo "  Eng Req: " . json_encode($p->english_requirements) . "\n";
    echo "  Elig Rules: " . json_encode($p->eligibility_rules) . "\n\n";
}

echo "=== Subject Category Value Counts ===\n";
$cats = \DB::table('programs')->select('subject_category', \DB::raw('count(*) as total'))->groupBy('subject_category')->get();
foreach ($cats as $c) {
    echo " - " . ($c->subject_category ?? 'NULL') . ": " . $c->total . "\n";
}

echo "\n=== MOI Accepted Programs ===\n";
$moiCount = 0;
foreach (\App\Models\Program::all() as $prog) {
    $req = $prog->english_requirements;
    if (!empty($req['accepts_moi'])) {
        $moiCount++;
    }
}
echo "Programs with accepts_moi = true: " . $moiCount . " / " . \App\Models\Program::count() . "\n";
