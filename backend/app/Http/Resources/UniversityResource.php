<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniversityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'ranking' => $this->ranking,
            'tuition_type' => $this->tuition_type,
            'tuition_fee' => $this->tuition_fee,
            'admission_method' => $this->admission_method,
            'application_link' => $this->application_link,
            'website_url' => $this->website_url,
            'application_deadline_winter' => $this->application_deadline_winter,
            'application_deadline_summer' => $this->application_deadline_summer,
            'description' => $this->description,
            'scholarship_available' => $this->scholarship_available,
            'is_featured' => $this->is_featured,
            'program_count' => $this->whenCounted('programs'),
            'programs' => ProgramResource::collection($this->whenLoaded('programs')),
        ];
    }
}