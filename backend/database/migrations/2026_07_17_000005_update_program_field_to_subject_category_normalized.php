<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // No-op: this migration exists only to reserve the numbering/ordering slot.
        // Normalization is handled during dataset import (DatasetImportService).
    }

    public function down(): void
    {
        // No-op
    }
};

