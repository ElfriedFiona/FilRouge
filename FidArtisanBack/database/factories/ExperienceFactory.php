<?php

namespace Database\Factories;

use App\Models\Artisan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Experience>
 */
class ExperienceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $locale = 'fr_CM';

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-10 years', '-2 years');
        $end = $this->faker->dateTimeBetween($start, 'now');

        return [
            'artisan_id' => Artisan::inRandomOrder()->value('id'),
            'poste' => $this->faker->jobTitle(),
            'lieu' => $this->faker->city(), // cohérent avec fr_CM
            'date_debut' => $start->format('Y-m-d'),
            'date_fin' => $end->format('Y-m-d'),
            'description' => $this->faker->realText(),
        ];
    }
}
