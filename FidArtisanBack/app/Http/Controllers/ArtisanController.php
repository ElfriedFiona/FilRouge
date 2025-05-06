<?php

namespace App\Http\Controllers;

use App\Models\Artisan;
use Illuminate\Http\Request;

class ArtisanController extends Controller
{
    /**
 * GET /api/artisans
 * Liste des artisans avec leurs relations de base (user, profession, ville)
 */
    public function index()
    {
    $artisans = Artisan::with(['user', 'profession', 'ville'])->get();

    return response()->json($artisans, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Artisan  $artisan
     * @return \Illuminate\Http\Response
     */
    public function show(Artisan $artisan)
    {
        return response()->json(
            $artisan->load(['user', 'profession', 'ville']),
            200
        );
    }

    /**
     * PUT /api/artisans/{artisan}
     * Mettre à jour un artisan
     */
    public function update(Request $request, Artisan $artisan)
    {
        $data = $request->validate([
            'photo'         => 'nullable|string',
            'telephone'     => 'sometimes|required|string',
            'profession_id' => 'sometimes|required|exists:professions,id',
            'ville_id'      => 'sometimes|required|exists:villes,id',
            'description'   => 'nullable|string',
            'sexe'          => 'sometimes|required|in:homme,femme',
            'langue'        => 'nullable|string',
        ]);

        $artisan->update($data);

        return response()->json(
            $artisan->load(['user', 'profession', 'ville']),
            200
        );
    }

    /**
     * DELETE /api/artisans/{artisan}
     * Supprimer un artisan
     */
    public function destroy(Artisan $artisan)
    {
        $artisan->delete();
        return response()->json(['message' => 'Artisan supprimé'], 200);
    }

    /**
     * GET /api/artisans/profession/{professionId}
     * Filtrer les artisans par profession
     */
    public function filterByProfession($professionId)
    {
        $artisans = Artisan::with(['user', 'profession', 'ville'])
            ->where('profession_id', $professionId)
            ->get();

        if ($artisans->isEmpty()) {
            return response()->json([
                'message' => 'Aucun artisan trouvé pour cette profession'
            ], 404);
        }

        return response()->json($artisans, 200);
    }

    /**
     * GET /api/artisans/ville/{villeId}
     * Filtrer les artisans par ville
     */
    public function filterByVille($villeId)
    {
        $artisans = Artisan::with(['user', 'profession', 'ville'])
            ->where('ville_id', $villeId)
            ->get();

        if ($artisans->isEmpty()) {
            return response()->json([
                'message' => 'Aucun artisan trouvé dans cette ville'
            ], 404);
        }

        return response()->json($artisans, 200);
    }

    public function annoncesParArtisan($id)
{
    $artisan = \App\Models\Artisan::with('annonces')->find($id);

    if (!$artisan) {
        return response()->json(['message' => 'Artisan non trouvé'], 404);
    }

    return response()->json($artisan->annonces, 200);
}

    /**
 * GET /api/artisans/{artisan}/profil
 * Afficher le profil complet d'un artisan avec toutes ses relations
 */
public function showFullProfile(Artisan $artisan)
{
    $artisan->load([
        'user',
        'profession',
        'ville',
        'servicesproposer',
        'projets',
        'experiences',
        'competences',
        // charger les users pour chaque avis
        'avis.user',
    ]);

    return response()->json($artisan, 200);
}

/**
 * GET /api/artisans/search?q=mot-clé
 * Recherche d'artisans par nom, profession ou ville
 */
public function search(Request $request)
{
    $keyword = $request->query('q');
    $ville   = $request->query('ville');

    $query = Artisan::with(['user','profession','ville','avis','services'])
        ->when($keyword, fn($q) => 
            $q->whereHas('user', fn($q2)=> $q2->where('name','like',"%{$keyword}%"))
              ->orWhereHas('profession', fn($q2)=> $q2->where('nom','like',"%{$keyword}%"))
        )
        ->when($ville, fn($q)=> 
            $q->whereHas('ville', fn($q2)=> $q2->where('nom','like',"%{$ville}%"))
        );

    $artisans = $query->get();

    if ($artisans->isEmpty()) {
        return response()->json(['message' => 'Aucun artisan trouvé.'], 404);
    }
    return response()->json($artisans, 200);
}

}
