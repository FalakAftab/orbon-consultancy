<?php

namespace App\Http\Requests\Shortlist;

use Illuminate\Foundation\Http\FormRequest;

class ShortlistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Shortlist entries are always tied to a specific program — the
            // university is derived from the program server-side, so the
            // student never has to (and cannot) send a mismatched pair.
            'program_id' => ['required', 'integer', 'exists:programs,id'],
        ];
    }
}
