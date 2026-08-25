<?php

namespace App\Exports;

use App\Models\University;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UniversitiesExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return University::query()->orderBy('name')->get([
            'name', 'slug', 'city', 'state', 'country', 'ranking', 'tuition_type', 'tuition_fee',
            'admission_method', 'application_link', 'website_url', 'application_deadline_winter',
            'application_deadline_summer', 'description', 'scholarship_available', 'is_featured',
        ]);
    }

    public function headings(): array
    {
        return [
            'name', 'slug', 'city', 'state', 'country', 'ranking', 'tuition_type', 'tuition_fee',
            'admission_method', 'application_link', 'website_url', 'application_deadline_winter',
            'application_deadline_summer', 'description', 'scholarship_available', 'is_featured',
        ];
    }
}