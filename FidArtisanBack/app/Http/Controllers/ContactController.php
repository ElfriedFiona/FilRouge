<?php

namespace App\Http\Controllers;

use App\Models\ContactVisiteur;
use App\Models\ContactUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    
public function envoyerMessage(Request $request)
{
    $validated = $request->validate([
        'message' => 'required|string',
        'titre' => 'nullable|string',
        'nom' => 'nullable|string',
        'prenom' => 'nullable|string',
        'email' => 'nullable|email',
        'telephone' => 'nullable|string',
    ]);
    if (Auth::check()) {
        // L'utilisateur est authentifié
        $user = Auth::user();
        ContactUser::create([
            'user_id' => $user->id,
            'message' => $request->message,
        ]);
        $emailContent = "Message reçu d'un utilisateur connecté :\n\n" . $validated['message'];
    } else {
        // Visiteur
        ContactVisiteur::create([
            'nom' => $validated['nom'],
            'email' => $validated['email'],
            'telephone' => $validated['telephone'],
            'titre' => $validated['titre'],
            'message' => $validated['message'],
        ]);
        $emailContent = "Message reçu d'un visiteur :\n\nNom: {$validated['nom']}\nEmail: {$validated['email']}\nTel: {$validated['telephone']}\n\n{$validated['message']}";
    }    

    Mail::raw($emailContent, function ($message) {
        $message->to('elfriedfiona@gmail.com')->subject('Nouveau message de contact');
    });

    return response()->json(['message' => 'Message enregistré et envoyé.']);
}
}

