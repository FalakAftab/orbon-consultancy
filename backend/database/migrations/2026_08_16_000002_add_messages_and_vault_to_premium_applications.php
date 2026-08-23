<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('premium_applications', function (Blueprint $table): void {
            if (! Schema::hasColumn('premium_applications', 'messages')) {
                $table->json('messages')->nullable()->after('documents');
            }
        });

        Schema::table('student_profiles', function (Blueprint $table): void {
            if (! Schema::hasColumn('student_profiles', 'document_vault')) {
                $table->json('document_vault')->nullable()->after('study_preferences');
            }
        });
    }

    public function down(): void
    {
        Schema::table('premium_applications', function (Blueprint $table): void {
            if (Schema::hasColumn('premium_applications', 'messages')) {
                $table->dropColumn('messages');
            }
        });

        Schema::table('student_profiles', function (Blueprint $table): void {
            if (Schema::hasColumn('student_profiles', 'document_vault')) {
                $table->dropColumn('document_vault');
            }
        });
    }
};
