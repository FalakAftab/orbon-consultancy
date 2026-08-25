<?php

namespace App\Models;

use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;


class User extends Authenticatable implements MustVerifyEmailContract
{
    use HasApiTokens;
    use HasFactory;
    use MustVerifyEmail;
    use Notifiable;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'country',
        'role',
        'student_id',
        'subscription_status',
        'subscription_plan',
        'subscription_started_at',
        'subscription_expires_at',
        'fee_status',
        'payment_reference',
        'payment_proof',
        'fee_paid_at',
        'password',
    ];


    protected static function booted(): void
    {
        static::creating(function (self $user): void {
            if (($user->role ?? null) !== 'student') {
                return;
            }

            if (!empty($user->student_id)) {
                return;
            }

            $user->student_id = DB::transaction(function () {
                // Lock the latest row to safely increment under concurrency.
                $lastStudentId = self::query()
                    ->whereNotNull('student_id')
                    ->where('role', 'student')
                    ->lockForUpdate()
                    ->orderByDesc('id')
                    ->value('student_id');

                $nextNumber = 1;
                if ($lastStudentId && preg_match('/^STD-(\\d{6})$/', $lastStudentId, $m)) {
                    $nextNumber = ((int) $m[1]) + 1;
                }

                return sprintf('STD-%06d', $nextNumber);
            });
        });
    }


    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'subscription_started_at' => 'datetime',
            'subscription_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isPremium(): bool
    {
        return $this->subscription_status === 'active';
    }

    public function studentProfile()
    {
        return $this->hasOne(StudentProfile::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
    }

    public function premiumApplications()
    {
        return $this->hasMany(PremiumApplication::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class)->latest();
    }
}
