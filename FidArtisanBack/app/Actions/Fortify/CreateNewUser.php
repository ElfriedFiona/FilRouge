<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Models\Client;
use App\Models\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input)
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'in:client,artisan'],
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'role' => $input['role'],
            'etat' => 'actif',
        ]);

        if ($input['role'] === 'client') {
            Client::create([
                'user_id' => $user->id,
                'telephone' => $input['telephone'] ?? null,
                'ville_id' => $input['ville_id'] ?? null,


            ]);
        }

        if ($input['role'] === 'artisan') {
            Artisan::create([
                'user_id' => $user->id,
                'photo' => $input['photo'] ?? null,
                'telephone' => $input['telephone'] ?? null,
                'fichiers' => $input['fichiers'] ?? null,
                'profession_id' => $input['profession_id'] ?? null,
                'ville_id' => $input['ville_id'] ?? null,
                'description' => $input['description'] ?? null,
                'experience' => $input['experience'] ?? null,
                'services_proposer' => $input['services_proposer'] ?? null,

            ]);
        }


        return $user;
        $user->sendEmailVerificationNotification();
    }
}
