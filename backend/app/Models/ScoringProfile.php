<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScoringProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function weights()
    {
        return $this->hasMany(ScoringWeight::class);
    }
}
