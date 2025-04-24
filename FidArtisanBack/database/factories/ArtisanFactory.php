<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Profession;
use App\Models\Ville;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Artisan>
 */
class ArtisanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->artisan(),
            'photo' => $this->getRandomImageFromUploads('artisan'),
'telephone' => '6' . $this->faker->numerify('########'),            'profession_id' => Profession::inRandomOrder()->first()?->id ?? Profession::factory(),
            'ville_id' => Ville::inRandomOrder()->first()?->id ?? Ville::factory(),
            'description' => $this->faker->realText(),
            'sexe' => $this->faker->randomElement(['M', 'F']),
            'langue' => $this->faker->randomElement(['Français', 'Anglais', 'Français et Anglais']),
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
