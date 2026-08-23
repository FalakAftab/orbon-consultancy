<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Import extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'type',
        'file_path',
        'status',
        'total_rows',
        'processed_rows',
        'failed_rows',
        'notes',
    ];

    public function rows()
    {
        return $this->hasMany(ImportRow::class);
    }
}
