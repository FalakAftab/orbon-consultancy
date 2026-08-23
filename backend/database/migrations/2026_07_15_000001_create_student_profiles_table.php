<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->string('country', 100)->nullable();
            $table->string('last_degree')->nullable();
            $table->string('degree_name')->nullable();
            $table->decimal('obtained_gpa', 4, 2)->nullable();
            $table->decimal('maximum_gpa', 4, 2)->nullable();
            $table->unsignedSmallInteger('graduation_year')->nullable();
            $table->string('previous_degree_country', 100)->nullable();
            $table->decimal('german_grade', 4, 2)->nullable()->index();
            $table->enum('english_test_type', ['ielts', 'toefl', 'moi'])->nullable()->index();
            $table->decimal('english_test_score', 5, 2)->nullable();
            $table->string('moi_certificate_path')->nullable();
            $table->enum('german_level', ['none', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'])->default('none')->index();
            $table->enum('preferred_degree', ['bachelor', 'master', 'phd'])->nullable()->index();
            $table->string('preferred_field')->nullable()->index();
            $table->enum('preferred_intake', ['winter', 'summer', 'both'])->nullable()->index();
            $table->enum('admission_preference', ['uni_assist_only', 'direct_portal_only', 'both'])->nullable()->index();
            $table->enum('tuition_preference', ['free_only', 'paid_only', 'both'])->nullable()->index();
            $table->decimal('maximum_budget', 12, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};
