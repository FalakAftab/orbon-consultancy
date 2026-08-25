<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('universities', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->index();
            $table->string('slug')->unique();
            $table->string('city')->index();
            $table->string('state')->nullable()->index();
            $table->string('country', 100)->default('Germany')->index();
            $table->string('ranking')->nullable()->index();
            $table->enum('tuition_type', ['free', 'paid', 'both'])->default('both')->index();
            $table->decimal('tuition_fee', 12, 2)->nullable();
            $table->enum('admission_method', ['uni_assist', 'direct_portal', 'both'])->default('direct_portal')->index();
            $table->string('application_link')->nullable();
            $table->string('website_url')->nullable();
            $table->date('application_deadline_winter')->nullable();
            $table->date('application_deadline_summer')->nullable();
            $table->text('description')->nullable();
            $table->boolean('scholarship_available')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['city', 'country']);
            $table->index(['state', 'country']);
            $table->index(['tuition_type', 'admission_method']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
