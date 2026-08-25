<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecommendationHistorySummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'program_match_count' => $this->program_match_count,
            'preferred_subjects' => data_get($this->criteria_snapshot, 'preferred_subjects'),
            'preferred_degree' => data_get($this->criteria_snapshot, 'preferred_degree'),
            'created_at' => $this->created_at,
        ];
    }
}
