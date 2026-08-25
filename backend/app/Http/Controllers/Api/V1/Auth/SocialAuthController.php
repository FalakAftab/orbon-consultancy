<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect student to Google/Microsoft OAuth provider
     */
    public function redirect(string $provider): JsonResponse|RedirectResponse
    {
        if ($provider !== 'google') {
            return response()->json(['message' => 'Invalid social authentication provider.'], 400);
        }

        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver($provider);
            $url = $driver->stateless()->redirect()->getTargetUrl();

            return response()->json(['url' => $url]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => "Social login for '{$provider}' is not configured yet in .env.",
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle OAuth Callback from Google/Microsoft
     */
    public function callback(Request $request, string $provider): RedirectResponse|JsonResponse
    {
        if ($provider !== 'google') {
            return response()->json(['message' => 'Invalid provider'], 400);
        }

        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver($provider);
            $socialUser = $driver->stateless()->user();

            $user = User::where('email', $socialUser->getEmail())->first();

            if (! $user) {
                $user = User::create([
                    'name' => $socialUser->getName() ?: 'Student User',
                    'email' => $socialUser->getEmail(),
                    'role' => 'student',
                    'subscription_status' => 'free',
                    'password' => bcrypt(Str::random(16)),
                    'email_verified_at' => now(),
                ]);
            }

            $token = $user->createToken('social_login_token')->plainTextToken;

            // Redirect back to frontend with sanctum auth token
            $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

            return redirect()->to("{$frontendUrl}/login?token={$token}&user_id={$user->id}&role={$user->role}");
        } catch (\Throwable $e) {
            $frontendUrl = config('app.frontend_url', 'http://localhost:5174');
            $errorMsg = urlencode('Google Login Error: ' . ($e->getMessage() ?: 'Invalid OAuth configuration.'));
            return redirect()->to("{$frontendUrl}/login?error={$errorMsg}");
        }
    }
}
