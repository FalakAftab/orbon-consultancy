<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Program\ProgramRequest;
use App\Http\Requests\Search\ProgramSearchRequest;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use App\Repositories\Contracts\ProgramRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ProgramController extends Controller
{
    public function __construct(private readonly ProgramRepositoryInterface $programs)
    {
    }

    public function index(ProgramSearchRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $programs = $this->programs->paginate($validated, (int) ($validated['per_page'] ?? 15));

        return response()->json($programs->through(fn (Program $program) => ProgramResource::make($program)));
    }

    public function show(Program $program): JsonResponse
    {
        return response()->json([
            'program' => ProgramResource::make($program->load('university')),
        ]);
    }

    public function store(ProgramRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $program = $this->programs->create($data);

        return response()->json([
            'message' => 'Program created successfully.',
            'program' => ProgramResource::make($program->load('university')),
        ], Response::HTTP_CREATED);
    }

    public function update(ProgramRequest $request, Program $program): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $program = $this->programs->update($program, $data);

        return response()->json([
            'message' => 'Program updated successfully.',
            'program' => ProgramResource::make($program->load('university')),
        ]);
    }

    public function destroy(Program $program): JsonResponse
    {
        $this->programs->delete($program);

        return response()->json([
            'message' => 'Program deleted successfully.',
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $this->programs->restore($id);

        return response()->json([
            'message' => 'Program restored successfully.',
        ]);
    }
}