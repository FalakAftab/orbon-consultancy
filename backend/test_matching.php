<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = app(\App\Services\RecommendationService::class);

// Test payload matching the user's exact screenshot inputs:
$payload = [
    'first_name' => 'Falak',
    'last_name' => 'Aftab',
    'last_degree' => 'Bachelor of Computer Science (BSCS / BSIT)',
    'obtained_gpa' => '2.4',
    'maximum_gpa' => '4.0',
    'passing_gpa' => '2.0',
    'english_test_type' => 'moi',
    'english_test_score' => '',
    'german_level' => 'none',
    'preferred_degree' => 'master',
    'preferred_subjects' => ['Software Engineering'],
    'preferred_intake' => 'both',
    'admission_preference' => 'both',
    'tuition_preference' => 'both',
    'preferred_language' => 'english',
    'preferred_city' => '',
    'preferred_state' => '',
    'tuition_fee_max' => '',
];

$res = $service->recommend($payload, null);
echo "Programs matched for user payload: " . count($res['programs']) . "\n";
foreach (array_slice($res['programs']->toArray(), 0, 5) as $item) {
    $p = $item['program'];
    echo " - " . ($p['name'] ?? '') . " | Score: " . ($item['score'] ?? 0) . " | Eligibility: " . ($item['eligibility_status'] ?? '') . "\n";
}
