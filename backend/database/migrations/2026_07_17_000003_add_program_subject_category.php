<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('programs', function (Blueprint $table): void {
            $table->string('subject_category')->nullable()->after('field');
            $table->index('subject_category', 'programs_subject_category_idx');
        });
    }

    public function down(): void
    {
        Schema::table('programs', function (Blueprint $table): void {
            $table->dropIndex('programs_subject_category_idx');
            $table->dropColumn('subject_category');
        });
    }
};

