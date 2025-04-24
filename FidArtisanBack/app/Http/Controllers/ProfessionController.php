<?php

namespace App\Http\Controllers;

use App\Models\Profession;
use Illuminate\Http\Request;

class ProfessionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $professions = Profession::with('categorie')->get();
        return response()->json($professions, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'categorie_id' => 'required|exists:categories,id',
        ]);

        $profession = Profession::create([
            'nom' => $request->nom,
            'categorie_id' => $request->categorie_id,
        ]);

        return response()->json([
            'message' => 'Profession créée avec succès',
            'data' => $profession
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Profession  $profession
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $profession = Profession::with('categorie')->find($id);

        if (!$profession) {
            return response()->json(['message' => 'Profession non trouvée'], 404);
        }

        return response()->json($profession, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Profession  $profession
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $profession = Profession::find($id);

        if (!$profession) {
            return response()->json(['message' => 'Profession non trouvée'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'categorie_id' => 'required|exists:categories,id',
        ]);

        $profession->update([
            'nom' => $request->nom,
            'categorie_id' => $request->categorie_id,
        ]);

        return response()->json([
            'message' => 'Profession mise à jour avec succès',
            'data' => $profession
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Profession  $profession
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $profession = Profession::find($id);

        if (!$profession) {
            return response()->json(['message' => 'Profession non trouvée'], 404);
        }

        $profession->delete();

        return response()->json(['message' => 'Profession supprimée avec succès'], 200);
    }
}
