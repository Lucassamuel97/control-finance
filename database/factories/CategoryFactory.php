<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement(['Salário', 'Freelance', 'Investimentos', 'Aluguel', 'Alimentação', 'Transporte', 'Lazer']),
            'type' => fake()->randomElement(['income', 'expense']),
        ];
    }
}
