<?php

namespace App\Repositories\Contracts;

use App\Models\StudentProfile;

interface StudentProfileRepositoryInterface
{
    public function findByUserId(int $userId): ?StudentProfile;

    public function updateOrCreateForUser(int $userId, array $data): StudentProfile;
}
