<?php

namespace App\Exports;

use App\Models\Program;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProgramsExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Program::query()->with('university')->orderBy('name')->get([
            'university_id', 'name', 'slug', 'degree_level', 'field', 'intake', 'language_of_instruction',
            'admission_method', 'tuition_type', 'tuition_fee', 'scholarship_amount', 'english_requirements',
            'german_requirements', 'eligibility_rules', 'description', 'application_link', 'daad_program_link', 'deadline_winter', 'deadline_summer',
        ]);
    }

    public function headings(): array
    {
        return [
            'university_id', 'name', 'slug', 'degree_level', 'field', 'intake', 'language_of_instruction',
            'admission_method', 'tuition_type', 'tuition_fee', 'scholarship_amount', 'english_requirements',
            'german_requirements', 'eligibility_rules', 'description', 'application_link', 'daad_program_link', 'deadline_winter', 'deadline_summer',
        ];
    }
}