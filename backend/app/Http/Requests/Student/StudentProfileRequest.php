<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'country' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:1000'],
            'last_degree' => ['nullable', 'string', 'max:255'],
            'degree_name' => ['nullable', 'string', 'max:255'],
            'obtained_gpa' => ['nullable', 'numeric', 'min:0', 'lte:maximum_gpa'],
            'maximum_gpa' => ['nullable', 'numeric', 'min:1'],

            // Issue 4 fix: passing_gpa was missing here, so it was
            // silently stripped by $request->validated() and never saved.
            'passing_gpa' => ['nullable', 'numeric', 'min:0', 'lte:maximum_gpa'],

            'graduation_year' => ['nullable', 'integer', 'min:1900', 'max:'.(int) date('Y')],
            'previous_degree_country' => ['nullable', 'string', 'max:100'],
            'english_test_type' => ['nullable', Rule::in(['ielts', 'toefl', 'moi'])],
            'english_test_score' => ['nullable', 'numeric', 'min:0'],
            'moi_certificate' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,doc,docx', 'max:10240'],
            'german_level' => ['nullable', Rule::in(['none', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'])],
            'preferred_degree' => ['nullable', Rule::in(['bachelor', 'bachelor_arts', 'bachelor_eng', 'master', 'master_arts', 'master_eng', 'mba', 'phd'])],
            'preferred_field' => ['nullable', 'string', 'max:255'],

            // Issue 2 fix: same missing-rule problem as RecommendationRequest.
            'preferred_subjects' => ['nullable', 'array'],
            'preferred_subjects.*' => ['string'],

            'preferred_intake' => ['nullable', Rule::in(['winter', 'summer', 'both'])],
            'admission_preference' => ['nullable', Rule::in(['uni_assist_only', 'direct_portal_only', 'both'])],
            'tuition_preference' => ['nullable', Rule::in(['free_only', 'paid_only', 'both'])],

            // Issue 7 fix: 'maximum_budget' rule removed — the column
            // was already dropped from the DB in an earlier migration,
            // so this leftover rule was dead/confusing code.
        ];
    }
}