<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comparison\ComparisonRequest;
use App\Models\Comparison;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ComparisonController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $comparisons = Comparison::query()->where('user_id', $request->user()->id)->latest()->paginate((int) $request->integer('per_page', 15));

        return response()->json($comparisons);
    }

    public function store(ComparisonRequest $request): JsonResponse
    {
        $comparison = Comparison::query()->create([
            'user_id' => $request->user()->id,
            'university_ids' => array_values($request->validated()['university_ids']),
            'program_ids' => array_values($request->validated()['program_ids'] ?? []),
        ]);

        return response()->json([
            'message' => 'Comparison saved successfully.',
            'comparison' => $comparison,
        ], Response::HTTP_CREATED);
    }
}