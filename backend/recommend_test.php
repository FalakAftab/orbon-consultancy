<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\RecommendationService;
use App\Repositories\Contracts\RecommendationHistoryRepositoryInterface;

$service = app(RecommendationService::class);

$subjects = [
    'Computer Science' => ['computer science'],
    'Artificial Intelligence' => ['artificial intelligence'],
    'Data Science' => ['data science'],
    'Cyber Security' => ['cyber security'],
    'Business' => ['business'],
    'Economics' => ['economics'],
    'Mechanical Engineering' => ['mechanical engineering'],
    'Electrical Engineering' => ['electrical engineering'],
];

$baseCriteria = [
    'first_name' => 'QA',
    'last_name' => 'Tester',
    'last_degree' => 'Bachelor of Science',
    'obtained_gpa' => 3.4,
    'maximum_gpa' => 4.0,
    'passing_gpa' => 2.0,
    'english_test_type' => 'ielts',
    'english_test_score' => 7.5,
    'german_level' => 'none',
    'preferred_degree' => 'master',
    'preferred_intake' => 'both',
    'admission_preference' => 'both',
    'tuition_preference' => 'free_only',
    'preferred_language' => 'english',
    'preferred_city' => null,
    'preferred_state' => null,
    'tuition_fee_max' => null,
];

echo "RECOMMENDATION SERVICE TEST (guest, no persistence)\n";
echo "====================================================\n";

foreach ($subjects as $label => $subjectList) {
    $payload = $baseCriteria;
    $payload['preferred_subjects'] = $subjectList;

    $result = $service->recommend($payload, null);

    $programs = $result['programs'] ?? [];
    $universities = $result['universities'] ?? [];

    echo "\n--- {$label} ---\n";
    echo "  programs returned: ".count($programs)."\n";
    echo "  universities grouped: ".count($universities)."\n";

    $allInSubject = true;
    $subjectSet = array_map('strtolower', $subjectList);
    foreach ($programs as $m) {
        $cat = strtolower(trim((string) ($m['program']->subject_category ?? '')));
        if ($cat === '' || ! in_array($cat, $subjectSet, true)) {
            $allInSubject = false;
            echo "  !! MISMATCH: program id={$m['id']} subject_category='{$cat}'\n";
        }
        echo "  score={$m['score']} eligible={$m['eligibility_status']} subject='{$cat}' program_id={$m['id']}\n";
    }
    echo "  ALL PROGRAMS BELONG TO SELECTED SUBJECT(S): ".($allInSubject ? 'YES' : 'NO')."\n";
}

echo "\nDONE\n";
