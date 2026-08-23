<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'university_id',
        'program_id',
        'eligibility_status',
        'score',
        'reasons',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'decimal:2',
            'reasons' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
