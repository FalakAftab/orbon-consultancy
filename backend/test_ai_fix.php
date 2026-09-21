<?php
$searchContext = " business economics finance management global logistics and supply chain management ";
$keyword = "ai";

function matchesKeyword(string $searchContext, string $keyword): bool
{
    $keyword = trim($keyword);
    if ($keyword === '') {
        return false;
    }
    
    // For short keywords (acronyms) or specific ones, enforce word boundaries
    // to avoid false positives (e.g. 'ai' in 'sustainability', 'iot' in 'physiotherapy')
    if (strlen($keyword) <= 3 || $keyword === 'ui/ux' || $keyword === 'game') {
        return preg_match('/\b' . preg_quote($keyword, '/') . '\b/i', $searchContext) === 1;
    }

    return str_contains($searchContext, $keyword);
}

if (matchesKeyword($searchContext, $keyword)) {
    echo "BUG: Still matches!\n";
} else {
    echo "FIXED: Does not match.\n";
}

$searchContext2 = " natural sciences global sustainability economics ";
if (matchesKeyword($searchContext2, $keyword)) {
    echo "BUG: Still matches sustainability!\n";
} else {
    echo "FIXED: Does not match sustainability.\n";
}

$searchContext3 = " computer science data science and artificial intelligence ";
if (matchesKeyword($searchContext3, $keyword)) {
    echo "BUG: artificial intelligence matched using 'ai'? Wait, artificial intelligence doesn't have \bai\b.\n";
} else {
    echo "Does not match artificial intelligence.\n";
}

$searchContext4 = " computer science applied ai for digital production management ";
if (matchesKeyword($searchContext4, $keyword)) {
    echo "Matches applied ai correctly.\n";
} else {
    echo "BUG: Does not match applied ai.\n";
}
