<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AdminManagerController extends Controller
{
    /**
     * List all Admin accounts
     */
    public function index(Request $request): JsonResponse
    {
        $admins = User::query()
            ->where('role', 'admin')
            ->latest()
            ->get();

        return response()->json([
            'data' => $admins,
        ]);
    }

    /**
     * Create a new Admin user account
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => 'admin',
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'New consultancy admin created successfully.',
            'data' => $admin,
        ], Response::HTTP_CREATED);
    }

    /**
     * Delete an Admin user account
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $currentUser = $request->user();
            if ($currentUser->id === $id) {
                return response()->json(['message' => 'You cannot delete your own admin account.'], Response::HTTP_FORBIDDEN);
            }

            $admin = User::where('role', 'admin')->findOrFail($id);
            \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
            $admin->delete();
            \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

            return response()->json([
                'message' => 'Admin account removed successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update student fee payment status (Confirm fee received & activate processing)
     */
    public function updateFeeStatus(Request $request, int $userId): JsonResponse
    {
        $student = User::where('role', 'student')->findOrFail($userId);

        $validated = $request->validate([
            'fee_status' => ['required', Rule::in(['unpaid', 'submitted', 'paid'])],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $updateData = [
            'fee_status' => $validated['fee_status'],
        ];

        if ($validated['fee_status'] === 'paid') {
            $updateData['fee_paid_at'] = now();
            // Automatically make subscription active if fee is paid
            $updateData['subscription_status'] = 'active';
        }

        $student->update($updateData);

        if ($validated['fee_status'] === 'paid') {
            Notification::notify(
                $student->id,
                'Fee Payment Confirmed!',
                'Your fee payment of PKR 45,000 has been verified. Your German university admission processing is actively underway!',
                'fee_update',
                '/student/apply-for-me'
            );
        }

        return response()->json([
            'message' => $validated['fee_status'] === 'paid'
                ? "Fee confirmed! Admission processing for {$student->name} is now ACTIVE."
                : "Student fee status updated to '{$validated['fee_status']}'.",
            'data' => $student->fresh(),
        ]);
    }
}
