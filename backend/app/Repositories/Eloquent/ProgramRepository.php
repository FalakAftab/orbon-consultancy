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
            $search = str_replace([' ', '-', '_', '.', ','], '', mb_strtolower(trim((string) $filters['search'])));
            $query->where(function (Builder $builder) use ($search): void {
                $builder->whereRaw("REPLACE(REPLACE(REPLACE(LOWER(name), ' ', ''), '-', ''), '_', '') ILIKE ?", ['%'.$search.'%'])
                    ->orWhereRaw("REPLACE(REPLACE(REPLACE(LOWER(field), ' ', ''), '-', ''), '_', '') ILIKE ?", ['%'.$search.'%'])
                    ->orWhereHas('university', function (Builder $universityQuery) use ($search): void {
                        $universityQuery->whereRaw("REPLACE(REPLACE(REPLACE(LOWER(name), ' ', ''), '-', ''), '_', '') ILIKE ?", ['%'.$search.'%'])
                            ->orWhereRaw("REPLACE(REPLACE(REPLACE(LOWER(city), ' ', ''), '-', ''), '_', '') ILIKE ?", ['%'.$search.'%'])
                            ->orWhereRaw("REPLACE(REPLACE(REPLACE(LOWER(state), ' ', ''), '-', ''), '_', '') ILIKE ?", ['%'.$search.'%']);
                    });
            });
        }

        foreach (['degree_level', 'field', 'subject_category', 'intake', 'language_of_instruction', 'admission_method', 'tuition_type', 'university_id'] as $column) {
            if (! empty($filters[$column])) {
                if ($column === 'degree_level') {
                    $val = strtolower(trim((string) $filters[$column]));
                    if (str_contains($val, 'bachelor')) {
                        $val = 'bachelor';
                    } elseif (str_contains($val, 'master') || $val === 'mba') {
                        $val = 'master';
                    } elseif (str_contains($val, 'phd') || str_contains($val, 'doctorate')) {
                        $val = 'phd';
                    }
                    $query->whereRaw("LOWER(degree_level) ILIKE ?", ['%'.$val.'%']);
                } elseif ($column === 'intake') {
                    $val = strtolower(trim((string) $filters[$column]));
                    if ($val === 'winter') {
                        $query->where(function (Builder $b): void {
                            $b->whereRaw("LOWER(intake) ILIKE 'winter'")
                                ->orWhereRaw("LOWER(intake) ILIKE 'both'");
                        });
                    } elseif ($val === 'summer') {
                        $query->where(function (Builder $b): void {
                            $b->whereRaw("LOWER(intake) ILIKE 'summer'")
                                ->orWhereRaw("LOWER(intake) ILIKE 'both'");
                        });
                    } elseif ($val !== 'both') {
                        $query->whereRaw("LOWER(intake) ILIKE ?", ['%'.$val.'%']);
                    }
                } elseif ($column === 'language_of_instruction') {
                    $val = strtolower(trim((string) $filters[$column]));
                    if ($val === 'english') {
                        $query->where(function (Builder $b): void {
                            $b->whereRaw("LOWER(language_of_instruction) ILIKE 'english'")
                                ->orWhereRaw("LOWER(language_of_instruction) ILIKE 'mixed'");
                        });
                    } elseif ($val === 'german') {
                        $query->where(function (Builder $b): void {
                            $b->whereRaw("LOWER(language_of_instruction) ILIKE 'german'")
                                ->orWhereRaw("LOWER(language_of_instruction) ILIKE 'mixed'");
                        });
                    } else {
                        $query->whereRaw("LOWER(language_of_instruction) ILIKE ?", ['%'.$val.'%']);
                    }
                } elseif ($column === 'tuition_type') {
                    $val = strtolower(trim((string) $filters[$column]));
                    if ($val === 'free') {
                        $query->where(function (Builder $b): void {
                            $b->whereNull('tuition_fee')
                                ->orWhere('tuition_fee', '<=', 0)
                                ->orWhereRaw("COALESCE(tuition_fee, 0) <= 0")
                                ->orWhereRaw("LOWER(tuition_type) IN ('free', 'both')");
                        });
                    } elseif ($val === 'paid') {
                        $query->where(function (Builder $b): void {
                            $b->where('tuition_fee', '>', 0)
                                ->orWhereRaw("COALESCE(tuition_fee, 0) > 0")
                                ->orWhereRaw("LOWER(tuition_type) = 'paid'");
                        });
                    }
                } elseif (in_array($column, ['admission_method', 'university_id'], true)) {
                    $query->where($column, $filters[$column]);
                } else {
                    $val = str_replace(' ', '', trim((string) $filters[$column]));
                    $query->whereRaw("REPLACE({$column}, ' ', '') ILIKE ?", ['%'.$val.'%']);
                }
            }
        }


        foreach (['country', 'city', 'state'] as $column) {
            if (! empty($filters[$column])) {
                $query->whereHas('university', function (Builder $builder) use ($filters, $column): void {
                    $val = str_replace(' ', '', trim((string) $filters[$column]));
                    $builder->whereRaw("REPLACE({$column}, ' ', '') ILIKE ?", ['%'.$val.'%']);
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

        // Classify free vs paid by actual tuition_fee value (the reliable
        // differentiator). Most records are labelled tuition_type='both' yet
        // are actually free (fee=0/null) or paid (fee>0), so we cannot rely
        // on the tuition_type column alone.
        if (! empty($filters['tuition_class'])) {
            if ($filters['tuition_class'] === 'free') {
                $query->where(function (Builder $builder): void {
                    $builder->whereNull('tuition_fee')
                        ->orWhere('tuition_fee', '<=', 0)
                        ->orWhereRaw("COALESCE(tuition_fee, 0) <= 0")
                        ->orWhereRaw("LOWER(tuition_type) IN ('free', 'both')");
                });
            } elseif ($filters['tuition_class'] === 'paid') {
                $query->where(function (Builder $builder): void {
                    $builder->where('tuition_fee', '>', 0)
                        ->orWhereRaw("COALESCE(tuition_fee, 0) > 0")
                        ->orWhereRaw("LOWER(tuition_type) = 'paid'");
                });
            }
        }
    }
}
