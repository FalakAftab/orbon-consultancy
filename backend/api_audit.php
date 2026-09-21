<?php

// Test function to fetch recommendations from an API
function fetchRecommendations($url, $payload) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return "ERROR: HTTP $httpCode - $response";
    }
    
    $data = json_decode($response, true);
    
    $results = [];
    if (isset($data['programs'])) {
        foreach (array_slice($data['programs'], 0, 5) as $match) {
            $results[] = $match['match_percentage'] . "% - " . $match['program']['name'] . " (" . $match['program']['subject_category'] . ")";
        }
    }
    
    return [
        'count' => count($data['programs'] ?? []),
        'top_matches' => $results
    ];
}

$payloads = [
    'Computer Science' => [
        'preferred_subjects' => ['computer science'],
        'preferred_degree' => 'master',
        'preferred_language' => 'english'
    ],
    'Engineering' => [
        'preferred_subjects' => ['engineering'],
        'preferred_degree' => 'master',
        'preferred_language' => 'english'
    ],
    'AI' => [
        'preferred_subjects' => ['artificial intelligence'],
        'preferred_degree' => 'master',
        'preferred_language' => 'english'
    ]
];

$localUrl = 'http://localhost:8000/api/v1/recommendations';
$prodUrl = 'https://api.orbon.aiotstudio.online/api/v1/recommendations';

foreach ($payloads as $name => $payload) {
    echo "=============================\n";
    echo "Testing: $name\n";
    echo "=============================\n";
    
    echo "\nLOCAL RESULTS:\n";
    $local = fetchRecommendations($localUrl, $payload);
    if (is_array($local)) {
        echo "Count: " . $local['count'] . "\n";
        echo implode("\n", $local['top_matches']) . "\n";
    } else {
        echo $local . "\n";
    }
    
    echo "\nPRODUCTION RESULTS:\n";
    $prod = fetchRecommendations($prodUrl, $payload);
    if (is_array($prod)) {
        echo "Count: " . $prod['count'] . "\n";
        echo implode("\n", $prod['top_matches']) . "\n";
    } else {
        echo $prod . "\n";
    }
    
    echo "\n";
}
