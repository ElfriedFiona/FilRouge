<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use Illuminate\Http\Request;

class AnnonceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Annonce::with('artisan.user')->get());
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
            'artisan_id'    => 'required|exists:artisans,id',
            'titre_annonce' => 'required|string|max:255',
            'detail_annonce'=> 'required|string',
        ]);

        $annonce = Annonce::create($data);
        return response()->json($annonce, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Annonce  $annonce
     * @return \Illuminate\Http\Response
     */
    public function show(Annonce $annonce)
    {
        return response()->json($annonce->load('artisan.user'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Annonce  $annonce
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Annonce $annonce)
    {
        $data = $request->validate([
            'titre_annonce' => 'sometimes|required|string|max:255',
            'detail_annonce'=> 'sometimes|required|string',
        ]);

        $annonce->update($data);
        return response()->json($annonce);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Annonce  $annonce
     * @return \Illuminate\Http\Response
     */
    public function destroy(Annonce $annonce)
    {
        $annonce->delete();
        return response()->json(null, 204);
    }

    /**
    * GET /api/annonces/{id}/artisan
    * Récupérer l'artisan qui a posté une annonce
    */
    public function artisanFromAnnonce($id)
    {
    $annonce = Annonce::with('artisan.user')->find($id);

    if (!$annonce) {
        return response()->json(['message' => 'Annonce non trouvée'], 404);
    }

    return response()->json($annonce->artisan, 200);
    }

}
