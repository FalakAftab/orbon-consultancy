<?php

namespace App\Repositories\Contracts;

use App\Models\RecommendationHistory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RecommendationHistoryRepositoryInterface
{
    public function create(int $userId, array $data): RecommendationHistory;

    public function paginateForUser(int $userId, int $perPage = 20): LengthAwarePaginator;

    public function findForUser(int $id, int $userId): ?RecommendationHistory;
}
