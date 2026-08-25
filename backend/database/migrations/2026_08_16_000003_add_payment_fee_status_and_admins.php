<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            if (! Schema::hasColumn('users', 'fee_status')) {
                $table->string('fee_status')->default('unpaid')->after('subscription_status');
            }
            if (! Schema::hasColumn('users', 'payment_reference')) {
                $table->string('payment_reference')->nullable()->after('fee_status');
            }
            if (! Schema::hasColumn('users', 'payment_proof')) {
                $table->text('payment_proof')->nullable()->after('payment_reference');
            }
            if (! Schema::hasColumn('users', 'fee_paid_at')) {
                $table->timestamp('fee_paid_at')->nullable()->after('payment_proof');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['fee_status', 'payment_reference', 'payment_proof', 'fee_paid_at']);
        });
    }
};
