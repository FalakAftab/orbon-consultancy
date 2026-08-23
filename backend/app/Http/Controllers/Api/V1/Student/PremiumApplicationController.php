<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Models\PremiumApplication;
use App\Models\Program;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PremiumApplicationController extends Controller
{
    /**
     * Request/Upgrade to Premium Subscription
     */
    public function subscribe(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->subscription_status === 'active') {
            return response()->json([
                'message' => 'You are already an active Premium member.',
                'user' => $user->fresh(),
            ]);
        }

        $user->update([
            'subscription_status' => 'pending',
            'subscription_plan' => 'premium_application',
        ]);

        return response()->json([
            'message' => 'Premium service requested successfully. Consultancy admin will review and activate your subscription.',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Get user's premium status and application summary
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        $applicationsCount = $user->premiumApplications()->count();

        return response()->json([
            'subscription_status' => $user->subscription_status ?? 'free',
            'subscription_plan' => $user->subscription_plan,
            'subscription_started_at' => $user->subscription_started_at,
            'subscription_expires_at' => $user->subscription_expires_at,
            'total_applications' => $applicationsCount,
        ]);
    }

    /**
     * List all premium application requests for authenticated student
     */
    public function index(Request $request): JsonResponse
    {
        $applications = $request->user()
            ->premiumApplications()
            ->with(['program.university'])
            ->latest()
            ->get();

        return response()->json([
            'subscription_status' => $request->user()->subscription_status ?? 'free',
            'data' => $applications,
        ]);
    }

    /**
     * Create a new "Apply for Me" application request
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'program_id' => ['required', 'exists:programs,id'],
            'student_notes' => ['nullable', 'string', 'max:2000'],
            'documents' => ['nullable', 'array'],
            'documents.*.name' => ['required', 'string', 'max:255'],
            'documents.*.url' => ['nullable', 'string', 'max:1000'],
        ]);

        // Auto-grant or check subscription status
        if ($user->subscription_status !== 'active') {
            // Allow requesting application which also flags user as pending/requesting premium
            $user->update([
                'subscription_status' => $user->subscription_status === 'free' ? 'pending' : $user->subscription_status,
                'subscription_plan' => 'premium_application',
            ]);
        }

        $application = PremiumApplication::create([
            'user_id' => $user->id,
            'program_id' => $validated['program_id'],
            'status' => 'pending',
            'student_notes' => $validated['student_notes'] ?? null,
            'documents' => $validated['documents'] ?? [],
        ]);

        return response()->json([
            'message' => 'Application assistance request submitted successfully!',
            'data' => $application->load(['program.university']),
        ], Response::HTTP_CREATED);
    }

    /**
     * Post a message in the application request communication feed
     */
    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $application = $user->premiumApplications()
            ->with(['program.university'])
            ->findOrFail($id);

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $messages = $application->messages ?? [];

        $newMessage = [
            'id' => count($messages) + 1,
            'sender' => 'student',
            'sender_name' => $user->name,
            'message' => $validated['message'],
            'created_at' => now()->toIso8601String(),
        ];

        $messages[] = $newMessage;

        $application->update([
            'messages' => $messages,
        ]);

        return response()->json([
            'message' => 'Message sent to consultancy team.',
            'data' => $application->fresh(['program.university']),
        ]);

    }

    /**
     * Get student PRO document vault
     */
    public function getVault(Request $request): JsonResponse
    {
        $profile = $request->user()->studentProfile;

        return response()->json([
            'data' => $profile->document_vault ?? [],
        ]);
    }

    /**
     * Update student PRO document vault
     */
    public function updateVault(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->studentProfile;

        if (! $profile) {
            return response()->json(['message' => 'Student profile not found.'], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'document_vault' => ['required', 'array'],
        ]);

        $profile->update([
            'document_vault' => $validated['document_vault'],
        ]);

        return response()->json([
            'message' => 'PRO Document Vault updated successfully.',
            'data' => $profile->fresh()->document_vault ?? [],
        ]);
    }
    public function getPaymentStatus(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'fee_status' => $user->fee_status ?? 'unpaid',
            'payment_reference' => $user->payment_reference,
            'payment_proof' => $user->payment_proof,
            'fee_paid_at' => $user->fee_paid_at,
            'subscription_status' => $user->subscription_status ?? 'free',
        ]);
    }

    /**
     * Submit consultancy fee payment proof / transaction reference
     */
    public function submitPayment(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'payment_reference' => ['required', 'string', 'max:255'],
            'payment_proof' => ['nullable', 'string', 'max:5000'],
        ]);

        $user->update([
            'fee_status' => 'submitted',
            'payment_reference' => $validated['payment_reference'],
            'payment_proof' => $validated['payment_proof'] ?? null,
            'subscription_status' => $user->subscription_status === 'free' ? 'pending' : $user->subscription_status,
        ]);

        return response()->json([
            'message' => 'Payment reference submitted successfully! Consultancy team will verify your fee and start admission processing.',
            'user' => $user->fresh(),
        ]);
    }
}


