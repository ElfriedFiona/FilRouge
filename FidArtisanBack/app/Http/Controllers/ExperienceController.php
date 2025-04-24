<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Experience::with('artisan.user')->get());
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
            'artisan_id' => 'required|exists:artisans,id',
            'poste'      => 'required|string|max:255',
            'lieu'       => 'required|string|max:255',
            'date_debut' => 'required|date',
            'date_fin'   => 'nullable|date|after_or_equal:date_debut',
            'description'=> 'nullable|string',
        ]);

        $exp = Experience::create($data);
        return response()->json($exp, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Experience  $experience
     * @return \Illuminate\Http\Response
     */
    public function show(Experience $experience)
    {
        return response()->json($experience->load('artisan.user'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Experience  $experience
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Experience $experience)
    {
        $data = $request->validate([
            'poste'      => 'sometimes|required|string|max:255',
            'lieu'       => 'sometimes|required|string|max:255',
            'date_debut' => 'sometimes|required|date',
            'date_fin'   => 'nullable|date|after_or_equal:date_debut',
            'description'=> 'sometimes|nullable|string',
        ]);

        $experience->update($data);
        return response()->json($experience);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Experience  $experience
     * @return \Illuminate\Http\Response
     */
    public function destroy(Experience $experience)
    {
        $experience->delete();
        return response()->json(null, 204);
    }

    /**
     * Récupérer toutes les expériences d'un artisan donné.
     *
     * @param  int  $artisanId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByArtisan($artisanId)
    {
        $exps = Experience::where('artisan_id', $artisanId)
            ->with('artisan.user')
            ->get();

        if ($exps->isEmpty()) {
            return response()->json([
                'message' => 'Aucune expérience trouvée pour cet artisan'
            ], 404);
        }

        return response()->json($exps, 200);
    }
}
