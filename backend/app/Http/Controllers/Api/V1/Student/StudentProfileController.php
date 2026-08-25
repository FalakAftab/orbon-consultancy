<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StudentProfileRequest;
use App\Http\Resources\StudentProfileResource;
use App\Services\StudentProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentProfileController extends Controller
{
    public function __construct(private readonly StudentProfileService $studentProfileService)
    {
    }

    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'profile' => StudentProfileResource::make($request->user()->studentProfile),
        ]);
    }

    public function update(StudentProfileRequest $request): JsonResponse
    {
        $profile = $this->studentProfileService->saveProfile(
            $request->user()->id,
            $request->validated(),
            $request->file('moi_certificate')
        );

        return response()->json([
            'message' => 'Profile saved successfully.',
            'profile' => StudentProfileResource::make($profile),
        ]);
    }
}
