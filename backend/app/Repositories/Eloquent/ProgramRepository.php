<?php

namespace App\Repositories\Eloquent;

use App\Models\Program;
use App\Repositories\Contracts\ProgramRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ProgramRepository implements ProgramRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Program::query()->with('university');
        $this->applyFilters($query, $filters);

        return $query->latest()->paginate($perPage);
    }

    public function findById(int $id): ?Program
    {
        return Program::query()->with('university')->find($id);
    }

    public function findBySlug(string $slug): ?Program
    {
        return Program::query()->with('university')->where('slug', $slug)->first();
    }

    public function create(array $data): Program
    {
        return Program::query()->create($data);
    }

    public function update(Program $program, array $data): Program
    {
        $program->fill($data);
        $program->save();

        return $program->refresh();
    }

    public function delete(Program $program): bool
    {
        return (bool) $program->delete();
    }

    public function restore(int $id): bool
    {
        $program = Program::query()->withTrashed()->findOrFail($id);

        return (bool) $program->restore();
    }

    public function searchCandidates(array $filters = []): Collection
    {
        $query = Program::query()->with('university');
        $this->applyFilters($query, $filters);

        return $query->get();
    }

    private function applyFilters(Builder $query, array $filters): void
    {
        if (! empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $query->where(function (Builder $builder) use ($search): void {
                $builder->where('name', 'ilike', '%'.$search.'%')
                    ->orWhere('field', 'ilike', '%'.$search.'%')
                    ->orWhereHas('university', function (Builder $universityQuery) use ($search): void {
                        $universityQuery->where('name', 'ilike', '%'.$search.'%')
                            ->orWhere('city', 'ilike', '%'.$search.'%')
                            ->orWhere('state', 'ilike', '%'.$search.'%');
                    });
            });
        }

        foreach (['degree_level', 'field', 'subject_category', 'intake', 'language_of_instruction', 'admission_method', 'tuition_type', 'university_id'] as $column) {
            if (! empty($filters[$column])) {
                $value = $filters[$column];

                if (is_array($value)) {
                    $query->whereIn($column, $value);
                } else {
                    $query->where($column, $value);
                }
            }
        }

        foreach (['country', 'city', 'state'] as $column) {
            if (! empty($filters[$column])) {
                $query->whereHas('university', function (Builder $builder) use ($filters, $column): void {
                    $builder->where($column, 'ilike', '%'.trim((string) $filters[$column]).'%');
                });
            }
        }

        if (! empty($filters['german_language_required'])) {
            $query->where(function (Builder $builder): void {
                $builder->where('language_of_instruction', 'german')
                    ->orWhere(function (Builder $nested): void {
                        $nested->where('language_of_instruction', 'mixed')
                            ->whereNotNull('german_requirements');
                    });
            });
        }

        if (! empty($filters['english_test_type'])) {
            $query->whereJsonContains('english_requirements->test_type', $filters['english_test_type']);
        }

        if (isset($filters['english_test_score']) && $filters['english_test_score'] !== '') {
            $query->where(function (Builder $builder) use ($filters): void {
                $builder->whereRaw("COALESCE((english_requirements->>'min_score')::numeric, 0) <= ?", [(float) $filters['english_test_score']]);
            });
        }

        if (isset($filters['german_grade']) && $filters['german_grade'] !== '') {
            $query->where(function (Builder $builder) use ($filters): void {
                $builder->whereRaw("COALESCE((eligibility_rules->>'max_german_grade')::numeric, 4) >= ?", [(float) $filters['german_grade']]);
            });
        }

        if (! empty($filters['moi'])) {
            $query->where(function (Builder $builder): void {
                $builder->where('language_of_instruction', 'german')
                    ->orWhereJsonContains('english_requirements->accepted_tests', 'moi');
            });
        }

        if (isset($filters['minimum_tuition_fee']) && $filters['minimum_tuition_fee'] !== '') {
            $query->where(function (Builder $builder) use ($filters): void {
                $builder->whereNull('tuition_fee')
                    ->orWhere('tuition_fee', '>=', (float) $filters['minimum_tuition_fee']);
            });
        }

        if (! empty($filters['maximum_tuition_fee'])) {
            $query->where(function (Builder $builder) use ($filters): void {
                $builder->whereNull('tuition_fee')
                    ->orWhere('tuition_fee', '<=', (float) $filters['maximum_tuition_fee']);
            });
        }
    }
}
