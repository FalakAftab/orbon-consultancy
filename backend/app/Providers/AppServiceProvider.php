<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Sends the built-in Laravel "verify your email" notification whenever
        // a new user (self-registered OR admin-created) fires the Registered
        // event. Does NOT force verification anywhere — no route uses the
        // `verified` middleware, so existing/unverified accounts keep logging
        // in exactly as before. Uses whatever MAIL_MAILER is set in .env
        // (defaults to `log` locally, so nothing breaks without SMTP).
        Event::listen(Registered::class, SendEmailVerificationNotification::class);

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return "{$frontendUrl}/reset-password?token={$token}&email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
