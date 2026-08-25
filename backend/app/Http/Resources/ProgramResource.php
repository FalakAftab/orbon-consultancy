<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'university_id' => $this->university_id,
            'university' => UniversityResource::make($this->whenLoaded('university')),
            'name' => $this->name,
            'slug' => $this->slug,
            'degree_level' => $this->degree_level,
            'field' => $this->field,
            'subject_category' => $this->subject_category,
            'intake' => $this->intake,
            'language_of_instruction' => $this->language_of_instruction,
            'admission_method' => $this->admission_method,
            'tuition_type' => $this->tuition_type,
            'tuition_fee' => $this->tuition_fee,
            'scholarship_amount' => $this->scholarship_amount,
            'english_requirements' => $this->english_requirements,
            'german_requirements' => $this->german_requirements,
            'eligibility_rules' => $this->eligibility_rules,
            'description' => $this->description,
            'application_link' => $this->application_link,
            'daad_program_link' => $this->daad_program_link,
            'deadline_winter' => $this->deadline_winter,
            'deadline_summer' => $this->deadline_summer,
            'deadline_winter_text' => data_get($this->eligibility_rules, 'deadline_winter_raw'),
            'deadline_summer_text' => data_get($this->eligibility_rules, 'deadline_summer_raw'),
        ];
    }
}