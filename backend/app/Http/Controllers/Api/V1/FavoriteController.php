<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Favorite\FavoriteRequest;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $favorites = Favorite::query()->with(['university', 'program', 'program.university'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate((int) $request->integer('per_page', 15));

        return response()->json($favorites);
    }

    public function store(FavoriteRequest $request): JsonResponse
    {
        $favorite = Favorite::query()->firstOrCreate([
            'user_id' => $request->user()->id,
            'university_id' => $request->input('university_id'),
            'program_id' => $request->input('program_id'),
        ]);

        return response()->json([
            'message' => 'Favorite saved successfully.',
            'favorite' => $favorite->load(['university', 'program']),
        ], Response::HTTP_CREATED);
    }

    public function destroy(Request $request, Favorite $favorite): JsonResponse
    {
        abort_unless($favorite->user_id === $request->user()->id, Response::HTTP_FORBIDDEN);

        $favorite->delete();

        return response()->json([
            'message' => 'Favorite removed successfully.',
        ]);
    }
}