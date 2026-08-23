<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PremiumApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'program_id',
        'status',
        'student_notes',
        'admin_notes',
        'documents',
        'messages',
    ];

    protected $casts = [
        'documents' => 'array',
        'messages' => 'array',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}
