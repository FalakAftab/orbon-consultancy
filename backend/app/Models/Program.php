<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'university_id',
        'name',
        'slug',
        'degree_level',
        'field',
        'subject_category',
        'intake',
        'language_of_instruction',
        'admission_method',
        'tuition_type',
        'tuition_fee',
        'scholarship_amount',
        'english_requirements',
        'german_requirements',
        'eligibility_rules',
        'description',
        'application_link',
        'daad_program_link',
        'deadline_winter',
        'deadline_summer',
    ];

    protected function casts(): array
    {
        return [
            'tuition_fee' => 'decimal:2',
            'scholarship_amount' => 'decimal:2',
            'english_requirements' => 'array',
            'german_requirements' => 'array',
            'eligibility_rules' => 'array',
            'deadline_winter' => 'date',
            'deadline_summer' => 'date',
        ];
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }
}
