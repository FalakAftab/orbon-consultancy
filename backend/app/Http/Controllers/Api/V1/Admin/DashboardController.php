<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comparison;
use App\Models\Favorite;
use App\Models\Program;
use App\Models\Recommendation;
use App\Models\StudentProfile;
use App\Models\University;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // 1. Basic Counts
        $studentsCount = User::query()->where('role', 'student')->count();
        
        // 2. Search Trends over Time (Recommendations created in last 7 weeks)
        $trendData = [];
        for ($i = 6; $i >= 0; $i--) {
            $start = Carbon::now()->subWeeks($i)->startOfWeek();
            $end = Carbon::now()->subWeeks($i)->endOfWeek();
            $count = Recommendation::whereBetween('created_at', [$start, $end])->count();
            $trendData[] = [
                'name' => $start->format('M d'),
                'value' => $count
            ];
        }

        // 3. Top Enrolled Subject Areas (Most Favorited Programs by Field)
        $favorites = Favorite::with('program')->get();
        $fieldCounts = [];
        foreach ($favorites as $fav) {
            if ($fav->program && $fav->program->field) {
                $field = $fav->program->field;
                if (!isset($fieldCounts[$field])) {
                    $fieldCounts[$field] = 0;
                }
                $fieldCounts[$field]++;
            }
        }
        arsort($fieldCounts);
        $subjectData = [];
        $colors = ['#0F172A', '#C49746', '#1E293B', '#94A3B8', '#F1F5F9'];
        $cIndex = 0;
        foreach (array_slice($fieldCounts, 0, 5) as $name => $val) {
            $subjectData[] = [
                'name' => mb_strimwidth($name, 0, 15, "..."),
                'value' => $val,
                'fill' => $colors[$cIndex % count($colors)]
            ];
        }
        // Fallback if empty
        if (empty($subjectData)) {
            $subjectData = [
                ['name' => 'Informatics', 'value' => 0, 'fill' => '#0F172A'],
            ];
        }

        // 4. Geographic Origin (Users grouped by country)
        $usersByCountry = User::where('role', 'student')->whereNotNull('country')->get()->groupBy('country');
        $geoData = [];
        $totalWithCountry = 0;
        $countryCounts = [];
        foreach ($usersByCountry as $country => $users) {
            $countryCounts[$country] = $users->count();
            $totalWithCountry += $users->count();
        }
        arsort($countryCounts);
        $gIndex = 0;
        $geoColors = ['#0F172A', '#C49746', '#F1F5F9', '#94A3B8', '#1E293B'];
        foreach (array_slice($countryCounts, 0, 4) as $name => $val) {
            $percentage = $totalWithCountry > 0 ? round(($val / $totalWithCountry) * 100) : 0;
            $geoData[] = [
                'name' => mb_strimwidth($name, 0, 15, ""),
                'value' => $percentage,
                'fill' => $geoColors[$gIndex % count($geoColors)]
            ];
            $gIndex++;
        }
        if (empty($geoData)) {
            $geoData = [
                ['name' => 'Unknown', 'value' => 100, 'fill' => '#0F172A']
            ];
        }

        // 5. Monthly Registrations Growth
        $monthlyGrowth = [];
        $months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
        $currentYear = date('Y');
        $yearUsers = User::where('role', 'student')->whereYear('created_at', $currentYear)->get();
        for ($m = 1; $m <= 12; $m++) {
            $monthlyGrowth[] = [
                'name' => $months[$m - 1],
                'value' => $yearUsers->filter(function($u) use ($m) { return $u->created_at->month === $m; })->count()
            ];
        }

        return response()->json([
            'students' => $studentsCount,
            'admins' => User::query()->where('role', 'admin')->count(),
            'universities' => University::query()->count(),
            'programs' => Program::query()->count(),
            'student_profiles' => StudentProfile::query()->count(),
            'favorites' => Favorite::query()->count(),
            'comparisons' => Comparison::query()->count(),
            'recommendations' => Recommendation::query()->count(),
            
            // Advanced Analytics
            'trendData' => $trendData,
            'subjectData' => $subjectData,
            'geoData' => $geoData,
            'monthlyGrowth' => $monthlyGrowth,
        ]);
    }
}