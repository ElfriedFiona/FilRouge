<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Ville;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $this->faker->locale('fr_CM');

        return [
            'user_id' => User::factory()->client(),
            'photo' => $this->getRandomImageFromUploads('client'),
            'telephone' => '6' . $this->faker->numerify('########'),            'ville_id' => Ville::inRandomOrder()->first()?->id ?? Ville::factory(),
            'sexe' => $this->faker->randomElement(['M', 'F']),
            'description' => $this->faker->realText(),
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
