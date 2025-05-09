<?php

namespace App\Http\Controllers;

use App\Models\AvisArtisanClient;
use Illuminate\Http\Request;

class AvisArtisanClientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(
            AvisArtisanClient::with(['artisan.user','user'])->get()
        , 200);
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
            'artisan_id'  => 'required|exists:artisans,id',
            'user_id'   => 'required|exists:users,id',
            'note'        => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string',
            'service_id' => 'required|exists:services,id',
        ]);

        $avis = AvisArtisanClient::create($data);
        return response()->json($avis, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AvisArtisanClient  $avisArtisanClient
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $avis = AvisArtisanClient::with(['artisan.user','user'])
            ->findOrFail($id);

        return response()->json($avis, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AvisArtisanClient  $avisArtisanClient
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $avis = AvisArtisanClient::findOrFail($id);

        $data = $request->validate([
            'note'        => 'sometimes|required|integer|min:1|max:5',
            'commentaire' => 'sometimes|nullable|string',
        ]);

        $avis->update($data);
        return response()->json($avis->load(['artisan.user','user']), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AvisArtisanClient  $avisArtisanClient
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $avis = AvisArtisanClient::findOrFail($id);
        $avis->delete();
        return response()->json(['message' => 'Avis supprimé'], 200);
    }

    // Filtrer par artisan
    public function getByArtisan($artisanId)
    {
        $avis = AvisArtisanClient::where('artisan_id', $artisanId)
            ->with(['artisan.user', 'user'])
            ->get();
    
        if ($avis->isEmpty()) {
            return response()->json(['message' => 'Aucun avis trouvé pour cet artisan'], 404);
        }
    
        return response()->json($avis, 200);
    }
    

    // Filtrer par client
    public function getByClient($userId)
    {
        $avis = AvisArtisanClient::where('user_id', $userId)
            ->with(['artisan.user','user'])
            ->get();

        if ($avis->isEmpty()) {
            return response()->json(['message'=>'Aucun avis pour ce client'], 404);
        }

        return response()->json($avis, 200);
    }
}
