<?php

namespace App\Repositories\Contracts;

use App\Models\University;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface UniversityRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?University;

    public function findBySlug(string $slug): ?University;

    public function create(array $data): University;

    public function update(University $university, array $data): University;

    public function delete(University $university): bool;

    public function restore(int $id): bool;

    public function allForSelect(): Collection;
}
