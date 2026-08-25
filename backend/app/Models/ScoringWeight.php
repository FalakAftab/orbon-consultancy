<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScoringWeight extends Model
{
    use HasFactory;

    protected $fillable = [
        'scoring_profile_id',
        'criterion',
        'weight',
    ];

    protected function casts(): array
    {
        return [
            'weight' => 'decimal:2',
        ];
    }

    public function scoringProfile()
    {
        return $this->belongsTo(ScoringProfile::class);
    }
}
