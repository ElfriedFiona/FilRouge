<?php

namespace Database\Seeders;

use App\Models\Ville;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VilleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Ville::create(['nom' => 'Douala']);
        Ville::create(['nom' => 'Yaoundé']);
        Ville::create(['nom' => 'Bafoussam']);
    }
}
