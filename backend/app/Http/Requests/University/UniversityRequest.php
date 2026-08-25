<?php

namespace App\Http\Requests\University;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UniversityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('universities', 'slug')->ignore($this->route('university'))],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:100'],
            'ranking' => ['nullable', 'string', 'max:255'],
            'tuition_type' => ['required', Rule::in(['free', 'paid', 'both'])],
            'tuition_fee' => ['nullable', 'numeric', 'min:0'],
            'admission_method' => ['required', Rule::in(['uni_assist', 'direct_portal', 'both'])],
            'application_link' => ['nullable', 'url', 'max:2048'],
            'website_url' => ['nullable', 'url', 'max:2048'],
            'application_deadline_winter' => ['nullable', 'date'],
            'application_deadline_summer' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
            'scholarship_available' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }
}