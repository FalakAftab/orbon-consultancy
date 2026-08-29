<?php

namespace App\Repositories\Eloquent;

use App\Models\University;
use App\Repositories\Contracts\UniversityRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class UniversityRepository implements UniversityRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = University::query();

        if (! empty($filters['search'])) {
            $search = str_replace([' ', '-', '_', '.', ','], '', mb_strtolower(trim((string) $filters['search'])));
            $query->where(function ($builder) use ($search): void {
                $builder->whereRaw("REPLACE(REPLACE(REPLACE(LOWER(name), ' ', ''), '-', ''), '_', '') ILIKE ?", ['%'.$search.'%'])
                    ->orWhereRaw("REPLACE(REPLACE(REPLACE(LOWER(city), ' ', ''), '-', ''), '_', '') ILIKE ?", ['%'.$search.'%'])
                    ->orWhereRaw("REPLACE(REPLACE(REPLACE(LOWER(state), ' ', ''), '-', ''), '_', '') ILIKE ?", ['%'.$search.'%'])
                    ->orWhereRaw("REPLACE(REPLACE(REPLACE(LOWER(country), ' ', ''), '-', ''), '_', '') ILIKE ?", ['%'.$search.'%']);
            });
        }

        foreach (['name', 'city', 'state', 'country'] as $column) {
            if (! empty($filters[$column])) {
                $val = str_replace(' ', '', trim((string) $filters[$column]));
                $query->whereRaw("REPLACE({$column}, ' ', '') ILIKE ?", ['%'.$val.'%']);
            }
        }

        if (! empty($filters['tuition_type'])) {
            $query->whereIn('tuition_type', (array) $filters['tuition_type']);
        }

        if (! empty($filters['admission_method'])) {
            $query->whereIn('admission_method', (array) $filters['admission_method']);
        }

        if (array_key_exists('is_featured', $filters)) {
            $query->where('is_featured', (bool) $filters['is_featured']);
        }

        if (! empty($filters['ranking'])) {
            $val = str_replace(' ', '', trim((string) $filters['ranking']));
            $query->whereRaw("REPLACE(ranking, ' ', '') ILIKE ?", ['%'.$val.'%']);
        }


        return $query->latest()->paginate($perPage);
    }

    public function findById(int $id): ?University
    {
        return University::query()->find($id);
    }

    public function findBySlug(string $slug): ?University
    {
        return University::query()->where('slug', $slug)->first();
    }

    public function create(array $data): University
    {
        return University::query()->create($data);
    }

    public function update(University $university, array $data): University
    {
        $university->fill($data);
        $university->save();

        return $university->refresh();
    }

    public function delete(University $university): bool
    {
        return (bool) $university->delete();
    }

    public function restore(int $id): bool
    {
        $university = University::query()->withTrashed()->findOrFail($id);

        return (bool) $university->restore();
    }

    public function allForSelect(): Collection
    {
        return University::query()->orderBy('name')->get(['id', 'name', 'city']);
    }
}
