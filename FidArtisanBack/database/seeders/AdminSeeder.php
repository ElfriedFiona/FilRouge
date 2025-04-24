<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('fiona90'),
            'role' => 'admin',
            'etat' => 'actif',
            'email_verified_at' => now(),
        ]);

        Admin::create([
            'user_id' => $user->id,
            'statut' => 'super administrateur',
        ]);
    }
}
