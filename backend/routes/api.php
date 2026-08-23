<?php

use App\Http\Controllers\Api\V1\Admin\AdminPremiumController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\ImportController;
use App\Http\Controllers\Api\V1\Admin\StudentController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\V1\ComparisonController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\ProgramController;
use App\Http\Controllers\Api\V1\PublicStatsController;
use App\Http\Controllers\Api\V1\RecommendationController;
use App\Http\Controllers\Api\V1\RecommendationHistoryController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\ShortlistController;
use App\Http\Controllers\Api\V1\Student\PremiumApplicationController;
use App\Http\Controllers\Api\V1\Student\StudentProfileController;
use App\Http\Controllers\Api\V1\UniversityController;
use App\Http\Controllers\Api\V1\Auth\SocialAuthController;
use App\Http\Controllers\Api\V1\NotificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', function () {
        return response()->json(['status' => 'ok']);
    });

    Route::get('/stats', [PublicStatsController::class, 'index']);

    Route::prefix('auth')->group(function (): void {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);

        // Social Authentication (Google & Microsoft)
        Route::get('{provider}/redirect', [SocialAuthController::class, 'redirect']);
        Route::get('{provider}/callback', [SocialAuthController::class, 'callback']);

        // Signed link from the "verify your email" notification (Part 3).
        // Does not require auth: the signed hash in the URL is the proof.
        Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->middleware('signed')
            ->name('verification.verify');

        // Public resend, keyed by email — used by unverified users who have
        // no token yet (see EmailVerificationController::resendPublic).
        Route::post('email/resend', [EmailVerificationController::class, 'resendPublic'])
            ->middleware('throttle:6,1');

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('logout', [AuthController::class, 'logout']);
            Route::post('email/verification-notification', [EmailVerificationController::class, 'resend'])
                ->middleware('throttle:6,1');
        });
    });

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('student/profile', [StudentProfileController::class, 'show']);
        Route::post('student/profile', [StudentProfileController::class, 'update']);

        // Premium application service (student side)
        Route::post('student/premium/subscribe', [PremiumApplicationController::class, 'subscribe']);
        Route::get('student/premium/status', [PremiumApplicationController::class, 'status']);
        Route::get('student/premium-applications', [PremiumApplicationController::class, 'index']);
        Route::post('student/premium-applications', [PremiumApplicationController::class, 'store']);
        Route::get('student/premium-applications/{id}', [PremiumApplicationController::class, 'show']);
        Route::post('student/premium-applications/{id}/messages', [PremiumApplicationController::class, 'sendMessage']);
        Route::get('student/premium-vault', [PremiumApplicationController::class, 'getVault']);
        Route::post('student/premium-vault', [PremiumApplicationController::class, 'updateVault']);
        Route::get('student/payment/status', [PremiumApplicationController::class, 'getPaymentStatus']);
        Route::post('student/payment/submit', [PremiumApplicationController::class, 'submitPayment']);

        // Notification System
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

        Route::get('search/programs', [SearchController::class, 'index']);
        Route::post('recommendations', [RecommendationController::class, 'store']);
        Route::get('recommendations/history', [RecommendationHistoryController::class, 'index']);
        Route::get('recommendations/history/{id}', [RecommendationHistoryController::class, 'show']);
        Route::apiResource('favorites', FavoriteController::class)->only(['index', 'store', 'destroy']);
        Route::get('shortlist', [ShortlistController::class, 'index']);
        Route::post('shortlist', [ShortlistController::class, 'store']);
        Route::delete('shortlist/{shortlist}', [ShortlistController::class, 'destroy']);
        Route::patch('shortlist/{shortlist}/status', [ShortlistController::class, 'updateStatus']);
        Route::post('shortlist/{shortlist}/notes', [ShortlistController::class, 'storeNote']);
        Route::apiResource('comparisons', ComparisonController::class)->only(['index', 'store']);

        Route::get('universities', [UniversityController::class, 'index']);
        Route::get('universities/{university}', [UniversityController::class, 'show']);
        Route::get('programs', [ProgramController::class, 'index']);
        Route::get('programs/{program}', [ProgramController::class, 'show']);
    });

    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function (): void {
        Route::get('dashboard', [DashboardController::class, 'index']);
        Route::get('students', [StudentController::class, 'index']);
        Route::post('students', [StudentController::class, 'store']);
        Route::put('students/{id}', [StudentController::class, 'update']);
        Route::delete('students/{id}', [StudentController::class, 'destroy']);
        Route::post('students/{id}/recommendations', [RecommendationController::class, 'storeForStudent']);
        Route::post('imports', [ImportController::class, 'upload']);
        Route::post('imports/temporary', [ImportController::class, 'temporary']);
        Route::get('exports', [ImportController::class, 'export']);

        // Admin team management (Admin panel only)
        Route::get('admins', [\App\Http\Controllers\Api\V1\Admin\AdminManagerController::class, 'index']);
        Route::post('admins', [\App\Http\Controllers\Api\V1\Admin\AdminManagerController::class, 'store']);
        Route::delete('admins/{id}', [\App\Http\Controllers\Api\V1\Admin\AdminManagerController::class, 'destroy']);
        Route::patch('students/{id}/fee-status', [\App\Http\Controllers\Api\V1\Admin\AdminManagerController::class, 'updateFeeStatus']);

        // System Settings
        Route::post('settings/clear-cache', [\App\Http\Controllers\Api\V1\Admin\SettingsController::class, 'clearCache']);
        Route::post('settings/profile', [\App\Http\Controllers\Api\V1\Admin\SettingsController::class, 'updateProfile']);

        // Premium management (admin side)
        Route::get('premium/dashboard', [AdminPremiumController::class, 'dashboard']);
        Route::get('premium-applications', [AdminPremiumController::class, 'indexApplications']);
        Route::get('premium-applications/{id}', [AdminPremiumController::class, 'showApplication']);
        Route::patch('premium-applications/{id}/status', [AdminPremiumController::class, 'updateApplicationStatus']);
        Route::post('premium-applications/{id}/messages', [AdminPremiumController::class, 'sendMessage']);
        Route::get('premium-subscriptions', [AdminPremiumController::class, 'indexSubscriptions']);
        Route::patch('premium-subscriptions/{user}/status', [AdminPremiumController::class, 'updateUserSubscription']);



        Route::post('universities', [UniversityController::class, 'store']);
        Route::put('universities/{university}', [UniversityController::class, 'update']);
        Route::delete('universities/{university}', [UniversityController::class, 'destroy']);
        Route::post('universities/{id}/restore', [UniversityController::class, 'restore']);

        Route::post('programs', [ProgramController::class, 'store']);
        Route::put('programs/{program}', [ProgramController::class, 'update']);
        Route::delete('programs/{program}', [ProgramController::class, 'destroy']);
        Route::post('programs/{id}/restore', [ProgramController::class, 'restore']);
    });
});
