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
            $search = strtolower(trim((string) $filters['search']));
            $query->where(function (Builder $builder) use ($search): void {
                $builder->whereRaw('LOWER(name) LIKE ?', ['%'.$search.'%'])
                    ->orWhereRaw('LOWER(field) LIKE ?', ['%'.$search.'%'])
                    ->orWhereHas('university', function (Builder $universityQuery) use ($search): void {
                        $universityQuery->whereRaw('LOWER(name) LIKE ?', ['%'.$search.'%'])
                            ->orWhereRaw('LOWER(city) LIKE ?', ['%'.$search.'%'])
                            ->orWhereRaw('LOWER(state) LIKE ?', ['%'.$search.'%']);
                    });
            });
        }

        foreach (['degree_level', 'field', 'subject_category', 'intake', 'language_of_instruction', 'admission_method', 'tuition_type', 'university_id'] as $column) {
            if (! empty($filters[$column])) {
                $value = $filters[$column];

                if ($column === 'degree_level') {
                    $rawValues = is_array($value) ? $value : [$value];
                    $normalizedDegrees = [];
                    foreach ($rawValues as $v) {
                        $vLower = strtolower(trim((string) $v));
                        if (str_contains($vLower, 'bachelor') || str_contains($vLower, 'b.sc') || str_contains($vLower, 'b.a') || str_contains($vLower, 'b.eng') || str_contains($vLower, 'bba')) {
                            $normalizedDegrees[] = 'bachelor';
                        } elseif (str_contains($vLower, 'master') || str_contains($vLower, 'm.sc') || str_contains($vLower, 'm.a') || str_contains($vLower, 'm.eng') || str_contains($vLower, 'mba')) {
                            $normalizedDegrees[] = 'master';
                        } elseif (str_contains($vLower, 'phd') || str_contains($vLower, 'doctorate')) {
                            $normalizedDegrees[] = 'phd';
                        } else {
                            $normalizedDegrees[] = $vLower;
                        }
                    }
                    $query->whereIn('degree_level', array_values(array_unique($normalizedDegrees)));
                } elseif (is_array($value)) {
                    $query->whereIn($column, $value);
                } else {
                    $query->where($column, $value);
                }
            }
        }

        foreach (['country', 'city', 'state'] as $column) {
            if (! empty($filters[$column])) {
                $val = strtolower(trim((string) $filters[$column]));
                $query->whereHas('university', function (Builder $builder) use ($val, $column): void {
                    $builder->whereRaw("LOWER({$column}) LIKE ?", ['%'.$val.'%']);
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
