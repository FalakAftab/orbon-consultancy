<?php

namespace App\Repositories\Contracts;

use App\Models\Program;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ProgramRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Program;

    public function findBySlug(string $slug): ?Program;

    public function create(array $data): Program;

    public function update(Program $program, array $data): Program;

    public function delete(Program $program): bool;

    public function restore(int $id): bool;

    public function searchCandidates(array $filters = []): Collection;
}
