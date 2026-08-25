<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class University extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'city',
        'state',
        'country',
        'ranking',
        'tuition_type',
        'tuition_fee',
        'admission_method',
        'application_link',
        'website_url',
        'application_deadline_winter',
        'application_deadline_summer',
        'description',
        'scholarship_available',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'tuition_fee' => 'decimal:2',
            'application_deadline_winter' => 'date',
            'application_deadline_summer' => 'date',
            'scholarship_available' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function programs()
    {
        return $this->hasMany(Program::class);
    }
}
