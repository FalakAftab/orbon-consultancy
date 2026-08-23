<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comparison extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'university_ids',
        'program_ids',
    ];

    protected function casts(): array
    {
        return [
            'university_ids' => 'array',
            'program_ids' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
