<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Exports\ProgramsExport;
use App\Exports\UniversitiesExport;
use App\Http\Controllers\Controller;
use App\Models\Import;
use App\Services\Excel\DatasetImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response;

class ImportController extends Controller
{
    public function __construct(private readonly DatasetImportService $datasetImportService)
    {
    }

    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:20480'],
        ]);

        $filePath = $request->file('file')->store('imports', 'public');
        $import = Import::query()->create([
            'user_id' => $request->user()->id,
            'type' => 'universities',
            'file_path' => $filePath,
            'status' => 'processing',
        ]);

        $result = $this->datasetImportService->importWorkbook(
            storage_path('app/public/'.$filePath),
            $request->boolean('sync_catalog', true)
        );

        $import->update([
            'status' => $result['failed'] > 0 ? 'failed' : 'completed',
            'total_rows' => $result['processed'] + $result['failed'] + $result['skipped'],
            'processed_rows' => $result['processed'],
            'failed_rows' => $result['failed'] + $result['skipped'],
            'notes' => $result['errors'] ? json_encode($result['errors']) : null,
        ]);

        return response()->json([
            'message' => 'Import processed successfully.',
            'import' => $import->fresh(),
            'errors' => $result['errors'],
            'skipped' => $result['skipped'],
            'synchronized_deleted' => $result['synchronized_deleted'],
            'synchronization_skipped' => $result['synchronization_skipped'],
        ], Response::HTTP_CREATED);
    }

    public function temporary(Request $request): JsonResponse
    {
        $path = $this->resolveTemporaryDatasetPath();

        if (! is_string($path) || ! file_exists($path)) {
            return response()->json([
                'message' => 'Temporary dataset file not found.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $import = Import::query()->create([
            'user_id' => $request->user()->id,
            'type' => 'universities',
            'file_path' => $path,
            'status' => 'processing',
        ]);

        $result = $this->datasetImportService->importWorkbook($path, true);

        $import->update([
            'status' => $result['failed'] > 0 ? 'failed' : 'completed',
            'total_rows' => $result['processed'] + $result['failed'] + $result['skipped'],
            'processed_rows' => $result['processed'],
            'failed_rows' => $result['failed'] + $result['skipped'],
            'notes' => $result['errors'] ? json_encode($result['errors']) : null,
        ]);

        return response()->json([
            'message' => 'Temporary dataset imported successfully.',
            'import' => $import->fresh(),
            'errors' => $result['errors'],
            'skipped' => $result['skipped'],
            'synchronized_deleted' => $result['synchronized_deleted'],
            'synchronization_skipped' => $result['synchronization_skipped'],
        ]);
    }

    public function export(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:universities,programs'],
        ]);

        return $validated['type'] === 'universities'
            ? Excel::download(new UniversitiesExport(), 'universities.xlsx')
            : Excel::download(new ProgramsExport(), 'programs.xlsx');
    }

    private function resolveTemporaryDatasetPath(): string
    {
        $configuredPath = env('TEMP_DATASET_PATH');
        if (is_string($configuredPath) && $configuredPath !== '') {
            $resolved = str_starts_with($configuredPath, DIRECTORY_SEPARATOR) || preg_match('/^[A-Za-z]:\\\\/', $configuredPath) === 1
                ? $configuredPath
                : base_path($configuredPath);

            if (file_exists($resolved)) {
                return $resolved;
            }
        }

        $frontendDirectory = realpath(base_path('../frontend')) ?: base_path('../frontend');
        $candidates = glob($frontendDirectory.DIRECTORY_SEPARATOR.'*.xlsx') ?: [];
        if ($candidates !== []) {
            usort($candidates, static fn (string $left, string $right): int => filemtime($right) <=> filemtime($left));
            return $candidates[0];
        }

        return $configuredPath ?: base_path('../frontend/DAAD_Programs_Verified_Final..xlsx');
    }
}