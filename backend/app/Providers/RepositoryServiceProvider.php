<?php

namespace App\Providers;

use App\Repositories\Contracts\ProgramRepositoryInterface;
use App\Repositories\Contracts\RecommendationHistoryRepositoryInterface;
use App\Repositories\Contracts\StudentProfileRepositoryInterface;
use App\Repositories\Contracts\UniversityRepositoryInterface;
use App\Repositories\Eloquent\ProgramRepository;
use App\Repositories\Eloquent\RecommendationHistoryRepository;
use App\Repositories\Eloquent\StudentProfileRepository;
use App\Repositories\Eloquent\UniversityRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UniversityRepositoryInterface::class, UniversityRepository::class);
        $this->app->bind(ProgramRepositoryInterface::class, ProgramRepository::class);
        $this->app->bind(StudentProfileRepositoryInterface::class, StudentProfileRepository::class);
        $this->app->bind(RecommendationHistoryRepositoryInterface::class, RecommendationHistoryRepository::class);
    }
}
