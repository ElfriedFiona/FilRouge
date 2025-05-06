<?php

namespace App\Http\Controllers;

use App\Models\ProjetRealiser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjetRealiserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // Lister tous les projets réalisés
    public function index()
    {
        $projets = ProjetRealiser::with('artisan.user')->get();
        return response()->json($projets, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // Créer un nouveau projet
    public function store(Request $request)
{
    $data = $request->validate([
        'artisan_id' => 'required|exists:artisans,id',
        'titre' => 'required|string|max:255',
        'description' => 'nullable|string',
        'date_debut' => 'nullable|date',
        'date_fin' => 'nullable|date|after_or_equal:date_debut',
        'image' => 'nullable|file|mimes:jpg,jpeg,png,bmp,webp', // Modification ici
    ]);

    // Gestion de l'upload de l'image
    if ($request->hasFile('image')) {
        $photo = $request->file('image');
        $filename = time() . '_' . $photo->getClientOriginalName();
        $path = $photo->storeAs('uploads', $filename, 'public');
        $data['image'] = $filename; // Enregistrement du nom du fichier uniquement
    }

    $projet = ProjetRealiser::create($data);
    return response()->json($projet, 201);
}

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProjetRealiser  $projetRealiser
     * @return \Illuminate\Http\Response
     */
    // Voir un projet spécifique
    public function show($id)
    {
        $projet = ProjetRealiser::with('artisan.user')->find($id);
        if (! $projet) {
            return response()->json(['message' => 'Projet non trouvé'], 404);
        }

        return response()->json($projet, 200);
    }

    // Récupérer les projets d'un artisan donné
public function getByArtisan($artisanId)
{
    $projets = ProjetRealiser::where('artisan_id', $artisanId)
        ->with('artisan.user')
        ->get();

    if ($projets->isEmpty()) {
        return response()->json(['message' => 'Aucun projet trouvé pour cet artisan'], 404);
    }

    return response()->json($projets, 200);
}


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProjetRealiser  $projetRealiser
     * @return \Illuminate\Http\Response
     */
    // Mettre à jour un projet
    public function update(Request $request, $id)
{
    $projet = ProjetRealiser::find($id);
    if (! $projet) {
        return response()->json(['message' => 'Projet non trouvé'], 404);
    }

    $rules = [
        'titre' => 'required|string|max:255',
        'description' => 'nullable|string',
        'date_debut' => 'nullable|date',
        'date_fin' => 'nullable|date|after_or_equal:date_debut',
        'image' => 'nullable|file|mimes:jpg,jpeg,png,bmp,webp', // Règle pour l'upload
    ];

    $validatedData = $request->validate($rules);

    // Gestion de l'upload de la nouvelle image
    if ($request->hasFile('image')) {
        $photo = $request->file('image');
        $filename = time() . '_' . $photo->getClientOriginalName();
        $path = $photo->storeAs('uploads', $filename, 'public');
        $validatedData['image'] = $filename; // Enregistrement du nom du fichier uniquement

        // Supprimer l'ancienne image si elle existe
        if ($projet->image) {
            Storage::disk('public')->delete('uploads/' . basename($projet->image));
        }
    }

    $projet->update($validatedData);
    return response()->json($projet, 200);
}

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProjetRealiser  $projetRealiser
     * @return \Illuminate\Http\Response
     */
    // Supprimer un projet
    public function destroy($id)
    {
        $projet = ProjetRealiser::find($id);
        if (! $projet) {
            return response()->json(['message' => 'Projet non trouvé'], 404);
        }

        $projet->delete();
        return response()->json(['message' => 'Projet supprimé'], 200);
    }
}
