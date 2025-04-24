<?php

namespace Database\Factories;

use App\Models\Artisan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProjetRealiser>
 */
class ProjetRealiserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $locale = 'fr_CM';

    public function definition(): array
    {
        $dateDebut = $this->faker->dateTimeBetween('-3 years', '-1 years');
        $dateFin = $this->faker->dateTimeBetween($dateDebut, 'now');

        return [
            'artisan_id' => Artisan::inRandomOrder()->value('id'),
            'titre' => $this->faker->sentence(4),
            'description' => $this->faker->realText(),
            'date_debut' => $dateDebut->format('Y-m-d'),
            'date_fin' => $dateFin->format('Y-m-d'),
            'image' => $this->getRandomImageFromUploads('projet'),
        ];
    }

    protected function getRandomImageFromUploads(string $prefix = null): string
    {
        $files = Storage::disk('public')->files('uploads');
        if ($prefix) {
            $files = array_filter($files, fn($f) => str_contains($f, $prefix));
        }
        // Récupération du fichier aléatoire et suppression de "uploads/"
    return count($files) > 0 ? basename(Arr::random($files)) : 'default.jpg';
    }
}
