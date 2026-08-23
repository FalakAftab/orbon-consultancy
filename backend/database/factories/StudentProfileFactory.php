<?php

namespace Database\Factories;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentProfileFactory extends Factory
{
    protected $model = StudentProfile::class;

    public function definition(): array
    {
        $obtainedGpa = fake()->randomFloat(2, 2.0, 4.0);
        $maximumGpa = 4.0;

        return [
            'user_id' => User::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'phone' => fake()->phoneNumber(),
            'country' => fake()->country(),
            'last_degree' => fake()->randomElement(['High School', 'Bachelor', 'Master']),
            'degree_name' => fake()->words(3, true),
            'obtained_gpa' => $obtainedGpa,
            'maximum_gpa' => $maximumGpa,
            'graduation_year' => fake()->numberBetween(2018, (int) date('Y')),
            'previous_degree_country' => fake()->country(),
            'german_grade' => round(1 + 3 * (($maximumGpa - $obtainedGpa) / $maximumGpa), 2),
            'english_test_type' => fake()->randomElement(['ielts', 'toefl', 'moi']),
            'english_test_score' => fake()->randomFloat(2, 5, 8.5),
            'moi_certificate_path' => null,
            'german_level' => fake()->randomElement(['none', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']),
            'preferred_degree' => fake()->randomElement(['bachelor', 'master']),
            'preferred_field' => fake()->randomElement(['Computer Science', 'Business Administration', 'Mechanical Engineering', 'Data Science']),
            'preferred_intake' => fake()->randomElement(['winter', 'summer', 'both']),
            'admission_preference' => fake()->randomElement(['uni_assist_only', 'direct_portal_only', 'both']),
            'tuition_preference' => fake()->randomElement(['free_only', 'paid_only', 'both']),
            'maximum_budget' => fake()->optional()->randomFloat(2, 0, 12000),
        ];
    }
}