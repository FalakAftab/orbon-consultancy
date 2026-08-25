<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\University\UniversityRequest;
use App\Http\Resources\UniversityResource;
use App\Models\University;
use App\Repositories\Contracts\UniversityRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class UniversityController extends Controller
{
    public function __construct(private readonly UniversityRepositoryInterface $universities)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string'],
            'name' => ['nullable', 'string'],
            'city' => ['nullable', 'string'],
            'state' => ['nullable', 'string'],
            'country' => ['nullable', 'string'],
            'tuition_type' => ['nullable', 'array'],
            'admission_method' => ['nullable', 'array'],
            'ranking' => ['nullable', 'string'],
            'is_featured' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $universities = $this->universities->paginate($validated, (int) ($validated['per_page'] ?? 15));

        return response()->json($universities->through(fn (University $university) => UniversityResource::make($university)));
    }

    public function show(University $university): JsonResponse
    {
        $university->load(['programs' => function ($query): void {
            $query->with('university')->latest();
        }])->loadCount('programs');

        return response()->json([
            'university' => UniversityResource::make($university),
        ]);
    }

    public function store(UniversityRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $data['country'] = $data['country'] ?? 'Germany';

        $university = $this->universities->create($data);

        return response()->json([
            'message' => 'University created successfully.',
            'university' => UniversityResource::make($university),
        ], Response::HTTP_CREATED);
    }

    public function update(UniversityRequest $request, University $university): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $university = $this->universities->update($university, $data);

        return response()->json([
            'message' => 'University updated successfully.',
            'university' => UniversityResource::make($university),
        ]);
    }

    public function destroy(University $university): JsonResponse
    {
        $this->universities->delete($university);

        return response()->json([
            'message' => 'University deleted successfully.',
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $this->universities->restore($id);

        return response()->json([
            'message' => 'University restored successfully.',
        ]);
    }
}