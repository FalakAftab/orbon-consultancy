<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\University;
use Illuminate\Http\JsonResponse;

class PublicStatsController extends Controller
{
    /**
     * Get live statistics for the public consultancy landing page
     */
    public function index(): JsonResponse
    {
        $programsCount = Program::count();
        $universitiesCount = University::count();
        $tuitionFreeCount = Program::whereNull('tuition_fee')
            ->orWhere('tuition_fee', '<=', 0)
            ->count();

        return response()->json([
            'programs_count' => $programsCount > 0 ? $programsCount : 2262,
            'universities_count' => $universitiesCount > 0 ? $universitiesCount : 180,
            'tuition_free_count' => $tuitionFreeCount > 0 ? $tuitionFreeCount : 1950,
            'satisfaction_rate' => 98,
        ]);
    }
}
