<?php

namespace App\Http\Requests\Search;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProgramSearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'degree_level' => ['nullable', Rule::in(['bachelor', 'master', 'phd'])],
            'field' => ['nullable', 'string', 'max:255'],
            'intake' => ['nullable', Rule::in(['winter', 'summer', 'both'])],
            'language_of_instruction' => ['nullable', Rule::in(['english', 'german', 'mixed'])],
            'admission_method' => ['nullable', Rule::in(['uni_assist', 'direct_portal', 'both'])],
            'tuition_type' => ['nullable', Rule::in(['free', 'paid', 'both'])],
            'country' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'german_grade' => ['nullable', 'numeric', 'min:1', 'max:4'],
            'english_test_type' => ['nullable', Rule::in(['ielts', 'toefl', 'moi'])],
            'english_test_score' => ['nullable', 'numeric', 'min:0'],
            'moi' => ['nullable', 'boolean'],
            'german_language_required' => ['nullable', 'boolean'],
            'maximum_tuition_fee' => ['nullable', 'numeric', 'min:0'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}