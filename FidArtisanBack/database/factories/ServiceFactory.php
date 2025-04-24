<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Artisan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = \Faker\Factory::create('fr_CM');

        return [
            'user_id'        => User::inRandomOrder()->value('id'),
            'artisan_id'       => Artisan::inRandomOrder()->value('id'),
            'description'      => $faker->realText(200),
            'statut'           => 'en attente',
            'type_de_service'  => $faker->randomElement(['standard', 'urgent', 'planifié']),
            'budget'           => $faker->numberBetween(5000, 200000),
            'date_limite'      => $faker->dateTimeBetween('+1 week', '+2 months'),
            'priorité'         => $faker->randomElement(['basse', 'moyenne', 'haute']),
            'fichiers'         => null,
            'adresse_details'  => $faker->randomElement([
                'Quartier Bonamoussadi, Douala',
                'Essos, Yaoundé',
                'Marché A, Bafoussam',
                'Avenue Kennedy, Yaoundé',
                'Derrière lycée bilingue, Douala',
            ]),
            'statut_artisan'   => 'en attente',
            'image_path'       => $this->getRandomImageFromUploads(), // 📷 Méthode custom ci-dessous
        ];
    }

    protected function getRandomImageFromUploads(): ?string
{
    $files = Storage::disk('public')->files('uploads');

    $images = array_filter($files, fn($file) =>
        preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)
    );

    return !empty($images) ? basename($this->faker->randomElement($images)) : null;
}

}
