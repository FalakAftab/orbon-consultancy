<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    public const STATUSES = [
        'pending',
        'preparing_documents',
        'applied',
        'interview',
        'offer_received',
        'rejected',
        'accepted',
        'visa_process',
        'enrolled',
    ];

    protected $fillable = [
        'user_id',
        'university_id',
        'program_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function statusHistory()
    {
        return $this->hasMany(ApplicationStatusHistory::class)->orderByDesc('changed_at');
    }

    public function notes()
    {
        return $this->hasMany(ApplicationNote::class)->orderByDesc('created_at');
    }
}
