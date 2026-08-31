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

        if (! empty($validData['preferred_degree'])) {
            $validData['preferred_degree'] = $this->normalizeDegreeLevel($validData['preferred_degree']);
        }

        return StudentProfile::query()->updateOrCreate(
            ['user_id' => $userId],
            $validData
        );
    }

    private function normalizeDegreeLevel(?string $degree): ?string
    {
        if ($degree === null || $degree === '') {
            return null;
        }
        $d = strtolower(trim($degree));
        if (str_contains($d, 'bachelor') || str_contains($d, 'b.sc') || str_contains($d, 'b.a') || str_contains($d, 'b.eng') || str_contains($d, 'bba')) {
            return 'bachelor';
        }
        if (str_contains($d, 'master') || str_contains($d, 'm.sc') || str_contains($d, 'm.a') || str_contains($d, 'm.eng') || str_contains($d, 'mba')) {
            return 'master';
        }
        if (str_contains($d, 'phd') || str_contains($d, 'doctorate')) {
            return 'phd';
        }

        return $d;
    }
}
