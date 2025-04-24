<?php

namespace App\Http\Controllers;

use App\Models\Competences;
use Illuminate\Http\Request;

class CompetencesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // Récupérer toutes les compétences (avec info artisan)
    public function index()
    {
        $all = Competences::with('artisan.user')->get();
        return response()->json($all, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // Créer une nouvelle compétence pour un artisan
    public function store(Request $request)
    {
        $data = $request->validate([
            'artisan_id'  => 'required|exists:artisans,id',
            'competences'=> 'required|string|max:255',
        ]);

        $comp = Competences::create($data);
        return response()->json($comp, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Competences  $competences
     * @return \Illuminate\Http\Response
     */
    // Récupérer une compétence spécifique
    public function show($id)
    {
        $comp = Competences::with('artisan.user')->find($id);

        if (! $comp) {
            return response()->json(['message' => 'Compétence non trouvée'], 404);
        }

        return response()->json($comp, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Competences  $competences
     * @return \Illuminate\Http\Response
     */
    // Mettre à jour une compétence existante
    public function update(Request $request, $id)
    {
        $comp = Competences::find($id);
        if (! $comp) {
            return response()->json(['message' => 'Compétence non trouvée'], 404);
        }

        $data = $request->validate([
            'competences'=> 'required|string|max:255',
        ]);

        $comp->update($data);
        return response()->json($comp, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Competences  $competences
     * @return \Illuminate\Http\Response
     */
    // Supprimer une compétence
    public function destroy($id)
    {
        $comp = Competences::find($id);
        if (! $comp) {
            return response()->json(['message' => 'Compétence non trouvée'], 404);
        }

        $comp->delete();
        return response()->json(['message' => 'Compétence supprimée'], 200);
    }

    /**
     * Récupérer les compétences par artisan
     *
     * @param  int  $artisanId
     * @return \Illuminate\Http\Response
     */
    public function getByArtisan($artisanId)
    {
        $competences = Competences::where('artisan_id', $artisanId)
            ->with('artisan.user')
            ->get();

        if ($competences->isEmpty()) {
            return response()->json(['message' => 'Aucune compétence trouvée pour cet artisan'], 404);
        }

        return response()->json($competences, 200);
    }
}
