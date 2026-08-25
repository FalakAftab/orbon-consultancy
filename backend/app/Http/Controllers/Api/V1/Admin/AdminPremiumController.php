<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\PremiumApplication;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminPremiumController extends Controller
{
    /**
     * Get summary metrics for Admin Premium Dashboard
     */
    public function dashboard(): JsonResponse
    {
        $totalRequests = PremiumApplication::count();
        $pendingRequests = PremiumApplication::where('status', 'pending')->count();
        $inProgressRequests = PremiumApplication::whereIn('status', ['under_review', 'in_progress', 'documents_required'])->count();
        $completedRequests = PremiumApplication::where('status', 'completed')->count();

        $activePremiumUsers = User::where('role', 'student')->where('subscription_status', 'active')->count();
        $pendingPremiumUsers = User::where('role', 'student')->where('subscription_status', 'pending')->count();

        return response()->json([
            'metrics' => [
                'total_application_requests' => $totalRequests,
                'pending_application_requests' => $pendingRequests,
                'in_progress_application_requests' => $inProgressRequests,
                'completed_application_requests' => $completedRequests,
                'active_premium_users' => $activePremiumUsers,
                'pending_premium_users' => $pendingPremiumUsers,
            ],
        ]);
    }

    /**
     * List all premium application requests with filtering
     */
    public function indexApplications(Request $request): JsonResponse
    {
        $query = PremiumApplication::with(['user.studentProfile', 'program.university']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%");
            })->orWhereHas('program', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }


        $applications = $query->latest()->paginate($request->query('per_page', 20));

        return response()->json($applications);
    }

    /**
     * Show detail of an application request
     */
    public function showApplication(int $id): JsonResponse
    {
        $application = PremiumApplication::with(['user.studentProfile', 'program.university'])->findOrFail($id);

        return response()->json([
            'data' => $application,
        ]);
    }

    /**
     * Update status and admin notes on an application request
     */
    public function updateApplicationStatus(Request $request, int $id): JsonResponse
    {
        $application = PremiumApplication::findOrFail($id);

        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in([
                    'pending',
                    'under_review',
                    'documents_required',
                    'in_progress',
                    'submitted',
                    'completed',
                    'rejected_cancelled',
                ]),
            ],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $application->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $application->admin_notes,
        ]);

        // Auto activate user's premium status if administration starts handling the application
        if (in_array($validated['status'], ['under_review', 'in_progress', 'submitted', 'completed'], true)) {
            $application->user->update([
                'subscription_status' => 'active',
                'subscription_plan' => $application->user->subscription_plan ?? 'premium_application',
                'subscription_started_at' => $application->user->subscription_started_at ?? now(),
            ]);
        }

        // Send notification to student regarding status update
        $statusLabels = [
            'pending' => 'Pending Review',
            'under_review' => 'Under Review',
            'documents_required' => 'Documents Required',
            'in_progress' => 'In Progress',
            'submitted' => 'Submitted to University',
            'completed' => 'Completed',
            'rejected_cancelled' => 'Cancelled',
        ];
        $statusName = $statusLabels[$validated['status']] ?? $validated['status'];

        Notification::notify(
            $application->user_id,
            'Application Status Updated',
            "Your application request status has been updated to '{$statusName}'.",
            'application_status',
            "/student/apply-for-me?app_id={$application->id}"
        );

        return response()->json([
            'message' => 'Application request status updated successfully.',
            'data' => $application->fresh(['user.studentProfile', 'program.university']),
        ]);
    }

    /**
     * List all student subscriptions for admin management
     */
    public function indexSubscriptions(Request $request): JsonResponse
    {
        $query = User::where('role', 'student');

        if ($request->filled('status')) {
            $query->where('subscription_status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%");
            });
        }


        $students = $query->withCount('premiumApplications')
            ->latest()
            ->paginate($request->query('per_page', 20));

        return response()->json($students);
    }

    /**
     * Activate or update student subscription status
     */
    public function updateUserSubscription(Request $request, int $userId): JsonResponse
    {
        $user = User::where('role', 'student')->findOrFail($userId);

        $validated = $request->validate([
            'subscription_status' => ['required', Rule::in(['free', 'pending', 'active', 'expired', 'rejected'])],
            'subscription_plan' => ['nullable', 'string', 'max:255'],
        ]);

        $updateData = [
            'subscription_status' => $validated['subscription_status'],
            'subscription_plan' => $validated['subscription_plan'] ?? ($user->subscription_plan ?? 'premium_application'),
        ];

        if ($validated['subscription_status'] === 'active' && ! $user->subscription_started_at) {
            $updateData['subscription_started_at'] = now();
        }

        $user->update($updateData);

        return response()->json([
            'message' => "Student subscription status updated to '{$validated['subscription_status']}'.",
            'data' => $user->fresh(),
        ]);
    }

    /**
     * Post an admin message to student on application request
     */
    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $admin = $request->user();
        $application = PremiumApplication::findOrFail($id);

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $messages = $application->messages ?? [];

        $newMessage = [
            'id' => count($messages) + 1,
            'sender' => 'admin',
            'sender_name' => $admin->name . ' (Consultancy Advisor)',
            'message' => $validated['message'],
            'created_at' => now()->toIso8601String(),
        ];

        $messages[] = $newMessage;

        $application->update([
            'messages' => $messages,
        ]);

        Notification::notify(
            $application->user_id,
            'New Message from Consultancy Advisor',
            "System Admin: \"{$validated['message']}\"",
            'advisor_message',
            "/student/apply-for-me?app_id={$application->id}"
        );

        return response()->json([
            'message' => 'Message sent to student.',
            'data' => $application->fresh(['user.studentProfile', 'program.university']),
        ]);
    }
}

