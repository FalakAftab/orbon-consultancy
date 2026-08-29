<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        $adminEmail = env('ADMIN_SEED_EMAIL', 'malikmohsinn17@gmail.com');
        $adminPassword = env('ADMIN_SEED_PASSWORD', 'icaniwill1122');

        User::query()->updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Malik Mohsin',
                'phone' => null,
                'country' => 'Germany',
                'role' => 'admin',
                'password' => Hash::make($adminPassword),
            ]
        );
    }

    public function down(): void
    {
        // Keep admin account intact
    }
};
