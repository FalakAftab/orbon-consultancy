<?php

namespace App\Repositories\Eloquent;

use App\Models\RecommendationHistory;
use App\Repositories\Contracts\RecommendationHistoryRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RecommendationHistoryRepository implements RecommendationHistoryRepositoryInterface
{
    public function create(int $userId, array $data): RecommendationHistory
    {
        return RecommendationHistory::query()->create([
            'user_id' => $userId,
            ...$data,
        ]);
    }

    public function paginateForUser(int $userId, int $perPage = 20): LengthAwarePaginator
    {
        return RecommendationHistory::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    // Scoping by user_id here (not just the primary key) is what guarantees
    // one student can never open another student's history entry, even if
    // they guess/change the numeric ID in the URL.
    public function findForUser(int $id, int $userId): ?RecommendationHistory
    {
        return RecommendationHistory::query()
            ->where('id', $id)
            ->where('user_id', $userId)
            ->first();
    }
}
