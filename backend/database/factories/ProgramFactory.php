<?php

namespace Database\Factories;

use App\Models\Program;
use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProgramFactory extends Factory
{
    protected $model = Program::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true).' Program';

        return [
            'university_id' => University::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'degree_level' => fake()->randomElement(['bachelor', 'master']),
            'field' => fake()->randomElement(['Computer Science', 'Business Administration', 'Mechanical Engineering', 'Data Science']),
            'intake' => fake()->randomElement(['winter', 'summer', 'both']),
            'language_of_instruction' => fake()->randomElement(['english', 'german', 'mixed']),
            'admission_method' => fake()->randomElement(['uni_assist', 'direct_portal', 'both']),
            'tuition_type' => fake()->randomElement(['free', 'paid', 'both']),
            'tuition_fee' => fake()->optional()->randomFloat(2, 0, 10000),
            'scholarship_amount' => fake()->optional()->randomFloat(2, 0, 5000),
            'english_requirements' => ['test_type' => 'ielts', 'min_score' => 6.0, 'accepted_tests' => ['ielts', 'toefl']],
            'german_requirements' => ['min_level' => 'b1'],
            'eligibility_rules' => ['max_german_grade' => 2.5],
            'description' => fake()->paragraph(),
            'application_link' => fake()->url(),
            'deadline_winter' => now()->addMonths(fake()->numberBetween(1, 5))->toDateString(),
            'deadline_summer' => now()->addMonths(fake()->numberBetween(5, 9))->toDateString(),
        ];
    }
}