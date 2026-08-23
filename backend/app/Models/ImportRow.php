<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportRow extends Model
{
    use HasFactory;

    protected $fillable = [
        'import_id',
        'row_number',
        'status',
        'payload',
        'errors',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'errors' => 'array',
        ];
    }

    public function import()
    {
        return $this->belongsTo(Import::class);
    }
}
