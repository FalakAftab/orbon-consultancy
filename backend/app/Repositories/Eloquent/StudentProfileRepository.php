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
        $profile = new StudentProfile();
        $fillable = array_merge($profile->getFillable(), ['user_id']);
        $validData = array_intersect_key($data, array_flip($fillable));

        return StudentProfile::query()->updateOrCreate(
            ['user_id' => $userId],
            $validData
        );
    }
}
