<?php

namespace App\Services;

class EctsService
{
    public function normalize(int $credits, int $minimumCredits = 180): bool
    {
        return $credits >= $minimumCredits;
    }
}
