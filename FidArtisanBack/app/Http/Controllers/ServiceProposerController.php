<?php

namespace App\Http\Controllers;

use App\Models\ServiceProposer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ServiceProposerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // Afficher tous les services proposés
    public function index()
    {
        $services = ServiceProposer::with('artisan.user')->get();
        return response()->json($services, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // Ajouter un nouveau service
    public function store(Request $request)
    {
        $data = $request->validate([
            'artisan_id'  => 'required|exists:artisans,id',
            'titre'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'montant'     => 'required|numeric|min:0',
        ]);

        $service = ServiceProposer::create($data);
        return response()->json($service, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ServiceProposer  $serviceProposer
     * @return \Illuminate\Http\Response
     */
    // Voir un service spécifique
    public function show($id)
    {
        $service = ServiceProposer::with('artisan.user')->find($id);
        if (! $service) {
            return response()->json(['message' => 'Service non trouvé'], 404);
        }

        return response()->json($service, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ServiceProposer  $serviceProposer
     * @return \Illuminate\Http\Response
     */
    // Mettre à jour un service
    public function update(Request $request, $id)
    {
        $service = ServiceProposer::find($id);
        if (! $service) {
            return response()->json(['message' => 'Service non trouvé'], 404);
        }

        $data = $request->validate([
            'titre'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'montant'     => 'required|numeric|min:0',
        ]);

        $service->update($data);
        return response()->json($service, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ServiceProposer  $serviceProposer
     * @return \Illuminate\Http\Response
     */
    // Supprimer un service
    public function destroy($id)
    {
        $service = ServiceProposer::find($id);
        if (! $service) {
            return response()->json(['message' => 'Service non trouvé'], 404);
        }

        $service->delete();
        return response()->json(['message' => 'Service supprimé'], 200);
    }

    /**
     * Récupérer les services proposés d'un artisan donné
     *
     * @param  int  $artisanId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByArtisan($artisanId)
    {
        $services = ServiceProposer::where('artisan_id', $artisanId)
            ->with('artisan.user')
            ->get();

        if ($services->isEmpty()) {
            return response()->json([
                'message' => 'Aucun service trouvé pour cet artisan'
            ], 404);
        }

        return response()->json($services, 200);
    }
}
