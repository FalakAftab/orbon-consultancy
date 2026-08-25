<?php

namespace App\Http\Requests\Program;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'university_id' => ['required', 'exists:universities,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('programs', 'slug')->ignore($this->route('program'))],
            'degree_level' => ['required', Rule::in(['bachelor', 'master', 'phd'])],
            'field' => ['required', 'string', 'max:255'],
            'intake' => ['required', Rule::in(['winter', 'summer', 'both'])],
            'language_of_instruction' => ['required', Rule::in(['english', 'german', 'mixed'])],
            'admission_method' => ['required', Rule::in(['uni_assist', 'direct_portal', 'both'])],
            'tuition_type' => ['required', Rule::in(['free', 'paid', 'both'])],
            'tuition_fee' => ['nullable', 'numeric', 'min:0'],
            'scholarship_amount' => ['nullable', 'numeric', 'min:0'],
            'english_requirements' => ['nullable', 'array'],
            'german_requirements' => ['nullable', 'array'],
            'eligibility_rules' => ['nullable', 'array'],
            'description' => ['nullable', 'string'],
            'application_link' => ['nullable', 'url', 'max:2048'],
            'daad_program_link' => ['nullable', 'url', 'max:2048'],
            'deadline_winter' => ['nullable', 'date'],
            'deadline_summer' => ['nullable', 'date'],
        ];
    }
}