<?php

namespace Database\Factories;

use App\Models\Artisan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ServiceProposer>
 */
class ServiceProposerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $locale = 'fr_CM';

    public function definition(): array
    {
        return [
            'artisan_id' => Artisan::inRandomOrder()->value('id'),
            'titre' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(3),
            'montant' => $this->faker->randomFloat(0, 5000, 100000),
        ];
    }
}
