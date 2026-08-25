<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\RecommendationHistoryResource;
use App\Http\Resources\RecommendationHistorySummaryResource;
use App\Repositories\Contracts\RecommendationHistoryRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RecommendationHistoryController extends Controller
{
    public function __construct(private readonly RecommendationHistoryRepositoryInterface $history)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $entries = $this->history->paginateForUser($request->user()->id);

        return response()->json([
            'data' => RecommendationHistorySummaryResource::collection($entries),
            'meta' => [
                'current_page' => $entries->currentPage(),
                'last_page' => $entries->lastPage(),
                'total' => $entries->total(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        // Scoped by user_id inside the repository — a student can never open
        // another student's history entry, even by guessing the numeric ID.
        $entry = $this->history->findForUser($id, $request->user()->id);

        if ($entry === null) {
            return response()->json([
                'message' => 'Recommendation history entry not found.',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'data' => RecommendationHistoryResource::make($entry),
        ]);
    }
}
