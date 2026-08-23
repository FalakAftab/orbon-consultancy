<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('application_status_history', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('favorite_id')->constrained()->cascadeOnDelete();
            $table->string('old_status')->nullable();
            $table->string('new_status');
            $table->timestamp('changed_at')->useCurrent();
        });

        Schema::create('application_notes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('favorite_id')->constrained()->cascadeOnDelete();
            $table->text('note');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_notes');
        Schema::dropIfExists('application_status_history');
    }
};

