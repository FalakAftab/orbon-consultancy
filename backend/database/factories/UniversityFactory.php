<?php

namespace Database\Factories;

use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UniversityFactory extends Factory
{
    protected $model = University::class;

    public function definition(): array
    {
        $name = fake()->unique()->company().' University';

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'country' => 'Germany',
            'ranking' => (string) fake()->numberBetween(1, 500),
            'tuition_type' => fake()->randomElement(['free', 'paid', 'both']),
            'tuition_fee' => fake()->optional()->randomFloat(2, 0, 12000),
            'admission_method' => fake()->randomElement(['uni_assist', 'direct_portal', 'both']),
            'application_link' => fake()->url(),
            'website_url' => fake()->url(),
            'application_deadline_winter' => now()->addMonths(fake()->numberBetween(1, 6))->toDateString(),
            'application_deadline_summer' => now()->addMonths(fake()->numberBetween(6, 10))->toDateString(),
            'description' => fake()->paragraph(),
            'scholarship_available' => fake()->boolean(),
            'is_featured' => fake()->boolean(20),
        ];
    }
}