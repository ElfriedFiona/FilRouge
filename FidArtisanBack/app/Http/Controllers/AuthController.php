<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ✅ Enregistrement
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:6',
            'role' => 'required|in:client,artisan',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'etat' => 'actif',
        ]);

        // Créer le profil en fonction du rôle
        if ($request->role === 'client') {
            $user->client()->create([
                'user_id' => $user->id,
                'photo' => $request->photo ?? null,
                'telephone' => $request->telephone ?? null,
                'ville_id' => $request->ville_id ?? null,
                'sexe' => $request->sexe ?? null,
                'description' => $request->description ?? null,
                'langue' => $request->langue ? json_encode($request->langue) : null,
            ]);
        } elseif ($request->role === 'artisan') {
            $user->artisan()->create([
                'user_id' => $user->id,
                'photo' => $request->photo ?? null,
                'telephone' => $request->telephone ?? null,
                'profession_id' => $request->profession_id ?? null,
                'ville_id' => $request->ville_id ?? null,
                'description' => $request->description ?? null,
                'sexe' => $request->sexe ?? null,
                'langue' => $request->langue ?? null,
            ]);
        }

        // Envoi de l'email de vérification
        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Compte créé. Veuillez vérifier votre email.'], 201);
    }

    // ✅ Connexion
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.']
            ]);
        }

        if (! $user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Veuillez vérifier votre adresse email.'], 403);
        }

        if ($user->etat === 'inactif') {
            return response()->json(['message' => 'Votre compte a été désactivé.'], 403);
        }

        // Chargement du profil associé
        if ($user->role === 'artisan') {
        $user->load('artisan');
        } elseif ($user->role === 'client') {
        $user->load('client');
        }

        return response()->json([
            'token' => $user->createToken('authToken')->plainTextToken,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}
