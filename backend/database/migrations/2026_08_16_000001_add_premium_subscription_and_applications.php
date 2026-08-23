<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            if (! Schema::hasColumn('users', 'subscription_status')) {
                $table->string('subscription_status')->default('free')->after('role');
            }
            if (! Schema::hasColumn('users', 'subscription_plan')) {
                $table->string('subscription_plan')->nullable()->after('subscription_status');
            }
            if (! Schema::hasColumn('users', 'subscription_started_at')) {
                $table->timestamp('subscription_started_at')->nullable()->after('subscription_plan');
            }
            if (! Schema::hasColumn('users', 'subscription_expires_at')) {
                $table->timestamp('subscription_expires_at')->nullable()->after('subscription_started_at');
            }
        });

        if (! Schema::hasTable('premium_applications')) {
            Schema::create('premium_applications', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('program_id')->constrained()->cascadeOnDelete();
                $table->string('status')->default('pending');
                $table->text('student_notes')->nullable();
                $table->text('admin_notes')->nullable();
                $table->json('documents')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('premium_applications');

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn([
                'subscription_status',
                'subscription_plan',
                'subscription_started_at',
                'subscription_expires_at',
            ]);
        });
    }
};
