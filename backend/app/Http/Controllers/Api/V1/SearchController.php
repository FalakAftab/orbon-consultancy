<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Search\ProgramSearchRequest;
use App\Http\Resources\ProgramResource;
use App\Repositories\Contracts\ProgramRepositoryInterface;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    public function __construct(private readonly ProgramRepositoryInterface $programs)
    {
    }

    public function index(ProgramSearchRequest $request): JsonResponse
    {
        $programs = $this->programs->paginate($request->validated(), (int) ($request->integer('per_page', 15) ?? 15));

        return response()->json([
            'data' => ProgramResource::collection($programs->items()),
            'meta' => [
                'current_page' => $programs->currentPage(),
                'per_page' => $programs->perPage(),
                'total' => $programs->total(),
                'last_page' => $programs->lastPage(),
            ],
        ]);
    }
}