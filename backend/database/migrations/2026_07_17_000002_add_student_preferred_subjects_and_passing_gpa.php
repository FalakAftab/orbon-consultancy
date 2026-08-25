<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table): void {
            $table->jsonb('preferred_subjects')->nullable()->after('preferred_field');
            $table->decimal('passing_gpa', 4, 2)->nullable()->after('maximum_gpa');
        });
    }

    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table): void {
            $table->dropColumn(['preferred_subjects', 'passing_gpa']);
        });
    }
};

