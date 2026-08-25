<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Recommendation\RecommendationRequest;
use App\Models\User;
use App\Services\RecommendationService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RecommendationController extends Controller
{
    public function __construct(private readonly RecommendationService $recommendationService)
    {
    }

    public function store(RecommendationRequest $request): JsonResponse
    {
        $result = $this->recommendationService->recommend(
            $request->validated(),
            $request->user()?->id
        );

        return response()->json($result);
    }

    /**
     * Admin-only: run the SAME recommendation engine, but save/associate the
     * result against the selected student — never the logged-in admin.
     * Reuses RecommendationService::recommend() untouched; only the $userId
     * passed to it changes (the target student's id instead of auth()->id()).
     */
    public function storeForStudent(RecommendationRequest $request, User $student): JsonResponse
    {
        abort_unless($student->role === 'student', Response::HTTP_NOT_FOUND);

        $result = $this->recommendationService->recommend(
            $request->validated(),
            $student->id
        );

        return response()->json($result);
    }
}