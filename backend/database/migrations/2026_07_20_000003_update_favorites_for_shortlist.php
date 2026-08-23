<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('favorites', function (Blueprint $table): void {
            // The old unique(user_id, university_id) constraint blocked a
            // student from shortlisting more than one program at the same
            // university. The Shortlist feature needs multiple programs per
            // university, so we drop it — unique(user_id, program_id) already
            // guarantees "cannot save the same program twice".
            $table->dropUnique(['user_id', 'university_id']);

            $table->enum('status', [
                'pending', 'preparing_documents', 'applied', 'interview',
                'offer_received', 'rejected', 'accepted', 'visa_process', 'enrolled',
            ])->default('pending')->after('program_id');
        });
    }

    public function down(): void
    {
        Schema::table('favorites', function (Blueprint $table): void {
            $table->dropColumn('status');
            $table->unique(['user_id', 'university_id']);
        });
    }
};
