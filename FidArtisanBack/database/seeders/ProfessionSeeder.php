<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Profession;
use App\Models\Category;

class ProfessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $artCategory = Category::where('nom', 'Art')->first();
        $productionCategory = Category::where('nom', 'Production')->first();
        $serviceCategory = Category::where('nom', 'Service')->first();

        Profession::create(['nom' => 'Bijoutier-joaillier', 'categorie_id' => $artCategory->id]);
        Profession::create(['nom' => 'Peintre-décorateur / portraitiste', 'categorie_id' => $artCategory->id]);
        Profession::create(['nom' => 'Fleuriste', 'categorie_id' => $artCategory->id]);
        Profession::create(['nom' => 'Sculpteur / décorateur sur tous matériaux', 'categorie_id' => $artCategory->id]);
        Profession::create(['nom' => 'Ceramiste (Potier)', 'categorie_id' => $artCategory->id]);
        Profession::create(['nom' => 'Ferronnier art', 'categorie_id' => $artCategory->id]);
        Profession::create(['nom' => 'Paysagiste / Créateur d espaces verts', 'categorie_id' => $artCategory->id]);
        Profession::create(['nom' => 'Brodeur', 'categorie_id' => $artCategory->id]); // Ajout du brodeur

        Profession::create(['nom' => 'Maroquinier', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Forgeron', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Ebéniste', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Fabricant objets en bambou', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Vannier / Spartier', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Tôlier', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Soudeur', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Charpentier', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Menuisier-agenceur', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Fabricant de bougies', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Fabricant objets en plastique', 'categorie_id' => $productionCategory->id]);
        Profession::create(['nom' => 'Fabricant de rotin', 'categorie_id' => $productionCategory->id]); // Ajout du fabricant de rotin
        Profession::create(['nom' => 'Fabricant de pavés', 'categorie_id' => $productionCategory->id]); // Ajout du fabricant de pavés
        Profession::create(['nom' => 'Menuisier', 'categorie_id' => $productionCategory->id]); // Ajout du menuisier simple

        Profession::create(['nom' => 'Canalisateur', 'categorie_id' => $serviceCategory->id]);
        Profession::create(['nom' => 'Foreur / installateur de puits d’eau', 'categorie_id' => $serviceCategory->id]);
        Profession::create(['nom' => 'Électricien bâtiment', 'categorie_id' => $serviceCategory->id]);
        Profession::create(['nom' => 'Plombier (installateur sanitaire)', 'categorie_id' => $serviceCategory->id]);
        Profession::create(['nom' => 'Spécialiste de froid et climatisation', 'categorie_id' => $serviceCategory->id]);
        Profession::create(['nom' => 'Tresseur', 'categorie_id' => $serviceCategory->id]);
        Profession::create(['nom' => 'Mécanicien engins agricoles', 'categorie_id' => $serviceCategory->id]);

    }
}
