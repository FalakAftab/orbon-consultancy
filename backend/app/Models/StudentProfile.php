<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentProfile extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone',
        'country',
        'address',
        'last_degree',
        'degree_name',
        'obtained_gpa',
        'maximum_gpa',
        'graduation_year',
        'previous_degree_country',
        'german_grade',
        'english_test_type',
        'english_test_score',
        'moi_certificate_path',
        'german_level',
        'preferred_degree',
        'preferred_field',
        'preferred_subjects',
        'passing_gpa',
        'preferred_intake',
        'admission_preference',
        'tuition_preference',
        'document_vault',
    ];

    protected function casts(): array
    {
        return [
            'obtained_gpa' => 'decimal:2',
            'maximum_gpa' => 'decimal:2',
            'german_grade' => 'decimal:2',
            'english_test_score' => 'decimal:2',
            'passing_gpa' => 'decimal:2',
            'preferred_subjects' => 'array',
            'graduation_year' => 'integer',
            'document_vault' => 'array',
        ];
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
