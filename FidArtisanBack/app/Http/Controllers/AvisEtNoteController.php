<?php

namespace App\Http\Controllers;

use App\Models\AvisEtNote;
use Illuminate\Http\Request;

class AvisEtNoteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(
            AvisEtNote::with(['user','artisan.user'])->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'note'       => 'required|integer|min:1|max:5',
            'user_id'    => 'required|exists:users,id',
            'artisan_id' => 'required|exists:artisans,id',
            'service_id' => 'required|exists:services,id',
            'commentaire'=> 'nullable|string',
        ]);
        
        // On empêche le doublon
        $exists = AvisEtNote::where('user_id', $data['user_id'])
                            ->where('service_id', $data['service_id'])
                            ->exists();
        
        if ($exists) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis pour ce service.'], 400);
        }
        
        
        $avis = AvisEtNote::create($data);
        return response()->json($avis, 201);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AvisEtNote  $avisEtNote
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $avis = AvisEtNote::with(['user', 'artisan.user'])->findOrFail($id);
    return response()->json($avis);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AvisEtNote  $avisEtNote
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
{
    $avis = AvisEtNote::findOrFail($id);

    $validated = $request->validate([
        'note' => 'required|integer|min:1|max:5',
        'commentaire' => 'nullable|string|max:1000',
    ]);

    $avis->update($validated);

    // On recharge les relations client et artisan si tu veux les inclure
    $avis->load(['user', 'artisan']);

    return response()->json($avis);
}

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AvisEtNote  $avisEtNote
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
{
    $avis = AvisEtNote::findOrFail($id);
    $avis->delete();

    return response()->json(['message' => 'Avis supprimé avec succès'], 200);
}

    /**
     * Récupérer tous les avis d'un client donné.
     *
     * @param  int  $clientId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByUser($userId)
    {
        $avis = AvisEtNote::where('user_id', $userId)
            ->with(['user', 'artisan.user'])
            ->get();

        if ($avis->isEmpty()) {
            return response()->json([
                'message' => 'Aucun avis trouvé pour ce client'
            ], 404);
        }

        return response()->json($avis, 200);
    }

    /**
     * Récupérer tous les avis d'un artisan donné.
     *
     * @param  int  $artisanId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByArtisan($artisanId)
    {
        $avis = AvisEtNote::where('artisan_id', $artisanId)
            ->with(['user', 'artisan.user'])
            ->get();

        if ($avis->isEmpty()) {
            return response()->json([
                'message' => 'Aucun avis trouvé pour cet artisan'
            ], 404);
        }

        return response()->json($avis, 200);
    }
}
