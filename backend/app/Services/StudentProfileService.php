<?php

namespace App\Services;

use App\Models\StudentProfile;
use App\Repositories\Contracts\StudentProfileRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StudentProfileService
{
    public function __construct(
        private readonly StudentProfileRepositoryInterface $studentProfileRepository,
        private readonly GermanGradeService $germanGradeService,
    ) {
    }

    public function saveProfile(int $userId, array $data, ?UploadedFile $moiCertificate = null): StudentProfile
    {
        if (array_key_exists('obtained_gpa', $data) || array_key_exists('maximum_gpa', $data) || array_key_exists('passing_gpa', $data)) {
            $data['german_grade'] = $this->germanGradeService->calculate(
                isset($data['obtained_gpa']) ? (float) $data['obtained_gpa'] : null,
                isset($data['maximum_gpa']) ? (float) $data['maximum_gpa'] : null,
                isset($data['passing_gpa']) ? (float) $data['passing_gpa'] : null,
            );
        }

        if (isset($data['english_test_type']) && is_array($data['english_test_type'])) {
            $types = $data['english_test_type'];
            $data['english_test_type'] = in_array('ielts', $types, true)
                ? 'ielts'
                : (in_array('toefl', $types, true) ? 'toefl' : ($types[0] ?? null));
        }

        if ($moiCertificate !== null) {
            $data['moi_certificate_path'] = $moiCertificate->store('moi-certificates', 'public');
        }

        return $this->studentProfileRepository->updateOrCreateForUser($userId, $data);
    }
}
