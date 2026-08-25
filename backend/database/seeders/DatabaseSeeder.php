<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\Excel\DatasetImportService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $datasetImportService = app(DatasetImportService::class);

        User::query()->updateOrCreate(

            ['email' => 'admin@germany-edu.test'],
            [
                'name' => 'System Admin',
                'phone' => null,
                'country' => 'Germany',
                'role' => 'admin',
                'password' => Hash::make('Password123!'),
            ]
        );

        $datasetPath = env('TEMP_DATASET_PATH', '../frontend/DAAD_Programs_Verified_Final..xlsx');
        $resolvedPath = str_starts_with($datasetPath, DIRECTORY_SEPARATOR) || preg_match('/^[A-Za-z]:\\\\/', $datasetPath) === 1
            ? $datasetPath
            : base_path($datasetPath);

        if (is_string($resolvedPath) && file_exists($resolvedPath)) {
            $datasetImportService->importWorkbook($resolvedPath);
        }
    }
}