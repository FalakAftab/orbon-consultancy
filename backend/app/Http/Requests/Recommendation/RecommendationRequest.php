<?php

namespace App\Http\Requests\Recommendation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecommendationRequest extends FormRequest
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
            'last_degree' => ['nullable', 'string', 'max:255'],
            'obtained_gpa' => ['required', 'numeric', 'min:0', 'lte:maximum_gpa'],
            'maximum_gpa' => ['required', 'numeric', 'min:1'],
            'passing_gpa' => ['required', 'numeric', 'min:0', 'lte:maximum_gpa'],

            'english_test_type' => [
                'required',
                function ($attribute, $value, $fail) {
                    $allowed = ['ielts', 'toefl', 'moi'];
                    if (is_array($value)) {
                        if (empty($value)) {
                            $fail('At least one English test type must be selected.');
                        }
                        foreach ($value as $item) {
                            if (! in_array($item, $allowed, true)) {
                                $fail("Invalid English test type: {$item}.");
                            }
                        }
                    } elseif (! in_array($value, $allowed, true)) {
                        $fail('The selected English test type is invalid.');
                    }
                },
            ],
            'english_test_score' => [
                'nullable',
                'numeric',
                'min:0',
                Rule::requiredIf(function () {
                    $type = $this->input('english_test_type');
                    if (is_array($type)) {
                        return in_array('ielts', $type, true) || in_array('toefl', $type, true);
                    }
                    return $type !== 'moi';
                }),
            ],

            'preferred_intake' => ['required', Rule::in(['winter', 'summer', 'both'])],
            'admission_preference' => ['nullable', Rule::in(['uni_assist_only', 'direct_portal_only', 'both'])],
            'tuition_preference' => ['nullable', Rule::in(['free_only', 'paid_only', 'both'])],
            'preferred_degree' => ['required', 'string', 'max:255'],
            'preferred_language' => ['nullable', Rule::in(['english', 'german', 'mixed'])],
            'preferred_city' => ['nullable', 'string', 'max:255'],
            'preferred_state' => ['nullable', 'string', 'max:255'],
            'tuition_fee_min' => ['nullable', 'numeric', 'min:0'],
            'tuition_fee_max' => ['nullable', 'numeric', 'min:0'],
            'german_level' => ['nullable', Rule::in(['none', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'])],

            // Issue 2 fix: this was completely missing before, so
            // $request->validated() was silently dropping it.
            'preferred_subjects' => ['required', 'array', 'min:1'],
            'preferred_subjects.*' => ['string'],
        ];
    }
}