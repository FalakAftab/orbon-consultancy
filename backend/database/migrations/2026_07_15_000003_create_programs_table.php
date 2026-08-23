<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('university_id')->constrained()->cascadeOnDelete();
            $table->string('name')->index();
            $table->string('slug')->unique();
            $table->enum('degree_level', ['bachelor', 'master', 'phd'])->index();
            $table->string('field')->index();
            $table->enum('intake', ['winter', 'summer', 'both'])->default('both')->index();
            $table->enum('language_of_instruction', ['english', 'german', 'mixed'])->default('english')->index();
            $table->enum('admission_method', ['uni_assist', 'direct_portal', 'both'])->default('direct_portal')->index();
            $table->enum('tuition_type', ['free', 'paid', 'both'])->default('both')->index();
            $table->decimal('tuition_fee', 12, 2)->nullable();
            $table->decimal('scholarship_amount', 12, 2)->nullable();
            $table->jsonb('english_requirements')->nullable();
            $table->jsonb('german_requirements')->nullable();
            $table->jsonb('eligibility_rules')->nullable();
            $table->text('description')->nullable();
            $table->string('application_link')->nullable();
            $table->string('daad_program_link')->nullable();
            $table->date('deadline_winter')->nullable();
            $table->date('deadline_summer')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['university_id', 'degree_level']);
            $table->index(['field', 'degree_level', 'intake']);
            $table->index(['tuition_type', 'admission_method']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
