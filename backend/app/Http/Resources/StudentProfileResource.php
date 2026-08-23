<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->user?->email,
            'phone' => $this->phone,
            'country' => $this->country,
            'address' => $this->address,
            'last_degree' => $this->last_degree,
            'degree_name' => $this->degree_name,
            'obtained_gpa' => $this->obtained_gpa,
            'maximum_gpa' => $this->maximum_gpa,
            'graduation_year' => $this->graduation_year,
            'previous_degree_country' => $this->previous_degree_country,
            'german_grade' => $this->german_grade,
            'english_test_type' => $this->english_test_type,
            'english_test_score' => $this->english_test_score,
            'moi_certificate_path' => $this->moi_certificate_path,
            'german_level' => $this->german_level,
            'preferred_degree' => $this->preferred_degree,
            'preferred_field' => $this->preferred_field,
            'preferred_intake' => $this->preferred_intake,
            'admission_preference' => $this->admission_preference,
            'tuition_preference' => $this->tuition_preference,
            'maximum_budget' => $this->maximum_budget,
        ];
    }
}
