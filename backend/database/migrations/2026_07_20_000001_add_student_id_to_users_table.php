<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('student_id')->nullable()->unique()->after('role');
        });

        // Backfill existing student_id for already-created student users.
        // Must be ordered by users.id and use PHP logic (not raw SQL).
        $students = User::query()
            ->where('role', 'student')
            ->whereNull('student_id')
            ->orderBy('id')
            ->get(['id']);

        if ($students->isEmpty()) {
            return;
        }

        DB::transaction(function () use ($students): void {
            $index = 1;
            foreach ($students as $student) {
                $studentId = sprintf('STD-%06d', $index);
                $student->forceFill(['student_id' => $studentId])->save();
                $index++;
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('student_id');
        });
    }
};

