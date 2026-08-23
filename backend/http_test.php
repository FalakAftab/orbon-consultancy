<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\RecommendationHistory;
use Illuminate\Support\Facades\Http;

// Use Laravel's HTTP client against the running server
$base = 'http://127.0.0.1:8000/api/v1';

// 1. Login as a student
$login = Http::acceptJson()->post($base.'/auth/login', [
    'email' => 'falakjarral044@gmail.com',
    'password' => 'TestPass123!',
]);

echo "LOGIN STATUS: ".$login->status().PHP_EOL;
$loginBody = $login->json();
$token = $loginBody['token'] ?? null;
echo "LOGIN TOKEN PRESENT: ".($token ? 'YES' : 'NO').PHP_EOL;
if (! $token) {
    echo "LOGIN BODY: ".json_encode($loginBody).PHP_EOL;
    exit(1);
}

$headers = ['Accept' => 'application/json', 'Authorization' => 'Bearer '.$token];

// 2. Run a recommendation for Data Science as authenticated user
$recommend = Http::withHeaders($headers)->post($base.'/recommendations', [
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
    'preferred_subjects' => ['data science'],
]);

echo PHP_EOL.'RECOMMEND STATUS: '.$recommend->status().PHP_EOL;
$result = $recommend->json();
$programs = $result['programs'] ?? [];
$universities = $result['universities'] ?? [];
echo "RECOMMEND PROGRAMS: ".count($programs).PHP_EOL;
echo "RECOMMEND UNIVERSITIES: ".count($universities).PHP_EOL;
echo "RECOMMEND PROFILE: ".($result['profile'] ? 'present' : 'null').PHP_EOL;

// Verify all returned programs are data science
$allDataScience = true;
foreach ($programs as $m) {
    $cat = strtolower(trim((string) ($m['program']['subject_category'] ?? '')));
    if ($cat !== 'data science') { $allDataScience = false; echo "MISMATCH: {$cat}\n"; }
}
echo "ALL PROGRAMS ARE DATA SCIENCE: ".($allDataScience ? 'YES' : 'NO').PHP_EOL;

// 3. Check history persistence
$history = Http::withHeaders($headers)->get($base.'/recommendations/history?per_page=5');
echo PHP_EOL.'HISTORY STATUS: '.$history->status().PHP_EOL;
$historyBody = $history->json();
$historyData = $historyBody['data'] ?? [];
$meta = $historyBody['meta'] ?? [];
echo "HISTORY COUNT IN RESPONSE: ".count($historyData).PHP_EOL;
echo "HISTORY META: ".json_encode($meta).PHP_EOL;

// Verify DB has a history record for this user
$dbCount = RecommendationHistory::where('user_id', 2)->count();
echo "HISTORY DB ROWS FOR USER 2: ".$dbCount.PHP_EOL;

// 4. Admin pagination test (login as admin)
$adminLogin = Http::acceptJson()->post($base.'/auth/login', [
    'email' => 'admin@germany-edu.test',
    'password' => 'TestPass123!',
]);
$adminToken = $adminLogin->json('token');
echo PHP_EOL.'ADMIN LOGIN TOKEN: '.($adminToken ? 'YES' : 'NO').PHP_EOL;

$adminHeaders = ['Accept' => 'application/json', 'Authorization' => 'Bearer '.$adminToken];

// Programs page 1
$p1 = Http::withHeaders($adminHeaders)->get($base.'/programs?per_page=10&page=1');
echo PHP_EOL.'PROGRAMS P1 STATUS: '.$p1->status().PHP_EOL;
$p1Body = $p1->json();
echo "P1 DATA COUNT: ".count($p1Body['data'] ?? []).PHP_EOL;
echo "P1 META: ".json_encode($p1Body['meta'] ?? []).PHP_EOL;

// Programs page 2
$p2 = Http::withHeaders($adminHeaders)->get($base.'/programs?per_page=10&page=2');
$p2Body = $p2->json();
echo "P2 DATA COUNT: ".count($p2Body['data'] ?? []).PHP_EOL;
echo "P2 META: ".json_encode($p2Body['meta'] ?? []).PHP_EOL;

// Universities pagination
$u1 = Http::withHeaders($adminHeaders)->get($base.'/universities?per_page=10&page=1');
$u1Body = $u1->json();
echo "UNIVERSITIES P1 DATA COUNT: ".count($u1Body['data'] ?? []).PHP_EOL;
echo "UNIVERSITIES P1 META: ".json_encode($u1Body['meta'] ?? []).PHP_EOL;

// Students pagination
$s1 = Http::withHeaders($adminHeaders)->get($base.'/admin/students?per_page=2&page=1');
$s1Body = $s1->json();
echo "STUDENTS P1 DATA COUNT: ".count($s1Body['data'] ?? []).PHP_EOL;
echo "STUDENTS P1 META: ".json_encode($s1Body['meta'] ?? []).PHP_EOL;

echo PHP_EOL."DONE".PHP_EOL;
