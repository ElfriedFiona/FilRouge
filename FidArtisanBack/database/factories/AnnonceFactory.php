<?php

namespace Database\Factories;

use App\Models\Artisan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Annonce>
 */
class AnnonceFactory extends Factory
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
            'titre_annonce' => $this->faker->sentence(4),
            'detail_annonce' => $this->faker->paragraph(),
        ];
    }
}
