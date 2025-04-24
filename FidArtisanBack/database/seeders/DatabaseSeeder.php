<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use App\Models\Category;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $this->copyDemoImagesToStorage();
        $this->call([
            CategorySeeder::class,
            ProfessionSeeder::class,
            VilleSeeder::class,
            AdminSeeder::class,
        ]);

        \App\Models\Client::factory(30)->create();
        \App\Models\Artisan::factory(30)->create();
        \App\Models\Annonce::factory(50)->create();
        // \App\Models\AvisEtNote::factory(200)->create();
        // \App\Models\AvisArtisanClient::factory(200)->create();
        \App\Models\Experience::factory(100)->create();
        \App\Models\Competences::factory(100)->create();
        \App\Models\ServiceProposer::factory(50)->create();
        \App\Models\ProjetRealiser::factory(30)->create();
        \App\Models\Service::factory(60)->create();


        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }



private function copyDemoImagesToStorage(): void
{
    $sourcePath = database_path('seeders/assets/uploads');
    $targetDisk = Storage::disk('public');
    $targetPath = 'uploads';

    if (!File::isDirectory($sourcePath)) {
        echo "Le dossier source d’images n’existe pas : $sourcePath\n";
        return;
    }

    // Crée le dossier target si pas existant
    if (!$targetDisk->exists($targetPath)) {
        $targetDisk->makeDirectory($targetPath);
    }

    $files = File::files($sourcePath);

    foreach ($files as $file) {
        $filename = $file->getFilename();

        if ($targetDisk->exists("$targetPath/$filename")) {
            echo "Image déjà existante : $filename — ignorée\n";
            continue;
        }

        $targetDisk->putFileAs($targetPath, $file, $filename);
        echo "Image copiée : $filename\n";
    }
}

}
