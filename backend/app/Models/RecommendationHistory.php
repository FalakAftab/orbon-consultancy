<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecommendationHistory extends Model
{
    use HasFactory;

    protected $table = 'recommendation_history';

    protected $fillable = [
        'user_id',
        'criteria_snapshot',
        'results_snapshot',
        'program_match_count',
    ];

    protected function casts(): array
    {
        return [
            'criteria_snapshot' => 'array',
            'results_snapshot' => 'array',
            'program_match_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
