<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

class SettingsController extends Controller
{
    public function clearCache(): JsonResponse
    {
        try {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');

            return response()->json(['message' => 'System cache cleared successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to clear cache.', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $admin = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $admin->id,
            'phone' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:100',
        ]);

        $admin->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $admin
        ]);
    }
}
