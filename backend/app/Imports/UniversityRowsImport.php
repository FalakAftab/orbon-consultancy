<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UniversityRowsImport implements ToCollection, WithHeadingRow
{
    public function collection(\Illuminate\Support\Collection $rows)
    {
        return $rows;
    }
}