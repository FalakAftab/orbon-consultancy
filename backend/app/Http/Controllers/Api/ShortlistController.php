<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shortlist\ShortlistRequest;
use App\Http\Resources\ShortlistResource;
use App\Models\Favorite;
use App\Models\Program;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ShortlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $shortlist = Favorite::query()
            ->with(['university', 'program'])
            ->whereNotNull('program_id')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => ShortlistResource::collection($shortlist),
        ]);
    }

    public function store(ShortlistRequest $request): JsonResponse
    {
        $program = Program::query()->findOrFail($request->integer('program_id'));

        // firstOrCreate on (user_id, program_id) is the app-level guard;
        // the DB-level unique(user_id, program_id) index is the real
        // guarantee against duplicates, even under concurrent requests —
        // this satisfies "A student cannot save the same program twice."
        $entry = Favorite::query()->firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'program_id' => $program->id,
            ],
            [
                'university_id' => $program->university_id,
                'status' => 'pending',
            ]
        );

        return response()->json([
            'message' => $entry->wasRecentlyCreated
                ? 'Program added to your shortlist.'
                : 'This program is already in your shortlist.',
            'data' => ShortlistResource::make($entry->load(['university', 'program'])),
        ], $entry->wasRecentlyCreated ? Response::HTTP_CREATED : Response::HTTP_OK);
    }

    public function destroy(Request $request, Favorite $shortlist): JsonResponse
    {
        // Ownership check — a student can only remove their own shortlist
        // entries, never another student's.
        abort_unless($shortlist->user_id === $request->user()->id, Response::HTTP_FORBIDDEN);

        $shortlist->delete();

        return response()->json([
            'message' => 'Removed from shortlist.',
        ]);
    }
}
