<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShortlistResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'date_added' => $this->created_at,
            'university' => [
                'id' => $this->university?->id,
                'name' => $this->university?->name,
                'city' => $this->university?->city,
            ],
            'program' => [
                'id' => $this->program?->id,
                'name' => $this->program?->name,
                'degree_level' => $this->program?->degree_level,
                'tuition_type' => $this->program?->tuition_type,
                'tuition_fee' => $this->program?->tuition_fee,
                'admission_method' => $this->program?->admission_method,
                'application_link' => $this->program?->application_link,
            ],
            'status_history' => $this->whenLoaded('statusHistory', fn () => $this->statusHistory->map(fn ($h) => [
                'old_status' => $h->old_status,
                'new_status' => $h->new_status,
                'changed_at' => $h->changed_at,
            ]), []),
            'notes' => $this->whenLoaded('notes', fn () => $this->notes->map(fn ($n) => [
                'id' => $n->id,
                'note' => $n->note,
                'created_at' => $n->created_at,
            ]), []),
        ];
    }
}
