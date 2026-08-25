<?php

namespace App\Repositories\Eloquent;

use App\Models\StudentProfile;
use App\Repositories\Contracts\StudentProfileRepositoryInterface;

class StudentProfileRepository implements StudentProfileRepositoryInterface
{
    public function findByUserId(int $userId): ?StudentProfile
    {
        return StudentProfile::query()->where('user_id', $userId)->first();
    }

    public function updateOrCreateForUser(int $userId, array $data): StudentProfile
    {
        return StudentProfile::query()->updateOrCreate(
            ['user_id' => $userId],
            $data
        );
    }
}
