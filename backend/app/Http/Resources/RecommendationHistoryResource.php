<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecommendationHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'criteria_snapshot' => $this->criteria_snapshot,
            'results_snapshot' => $this->results_snapshot,
            'program_match_count' => $this->program_match_count,
            'created_at' => $this->created_at,
        ];
    }
}
