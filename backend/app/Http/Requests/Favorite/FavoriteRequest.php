<?php

namespace App\Http\Requests\Favorite;

use Illuminate\Foundation\Http\FormRequest;

class FavoriteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'university_id' => ['nullable', 'required_without:program_id', 'exists:universities,id'],
            'program_id' => ['nullable', 'required_without:university_id', 'exists:programs,id'],
        ];
    }
}