<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(
            Service::with(['user', 'artisan.user'])->latest()->get()
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
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'artisan_id' => 'required|exists:artisans,id',
        'description' => 'required|string',
        'type_de_service' => 'required|string',
        'budget' => 'required|numeric|min:10|max:10000',
        'date_limite' => 'nullable|date|after:today',
        'priorité' => 'nullable|string',
        'adresse_details' => 'nullable|string',
        'image_path' => 'nullable|file|mimes:jpg,jpeg,png,bmp,webp',
        'fichiers' => 'nullable|file|mimes:pdf,doc,docx,zip,txt,jpg,jpeg,png',
    ]);

    // Handle image upload
    if ($request->hasFile('image_path')) {
        $path = $request->file('image_path')->store('uploads', 'public');
        $validated['image_path'] = 'storage/' . $path;
    }

    // Handle file upload
    if ($request->hasFile('fichiers')) {
        $path = $request->file('fichiers')->store('uploads', 'public');
        $validated['fichiers'] = 'storage/' . $path;
    }

    $service = Service::create($validated);

    return response()->json([
        'message' => 'Service créé avec succès',
        'data' => $service
    ], 201);
}



    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Service  $service
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $service = Service::with(['user', 'artisan.user'])->findOrFail($id);
        return response()->json($service);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Service  $service
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $data = $request->validate([
            'description'     => 'nullable|string',
            'statut'          => 'nullable|string',
            'type_de_service' => 'nullable|string',
            'budget'          => 'nullable|numeric',
            'date_limite'     => 'nullable|date|after_or_equal:today',
            'priorité'        => 'nullable|string',
            'fichiers'        => 'nullable|string',
            'adresse_details' => 'nullable|string',
            'statut_artisan'  => 'nullable|string',
            'image_path'      => 'nullable|string',
        ]);

        $service->update($data);
        return response()->json($service);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Service  $service
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return response()->json(['message' => 'Service supprimé avec succès']);
    }

    public function getByUser($userId)
    {
        $services = Service::where('user_id', $userId)->with('artisan.user')->get();
        return response()->json($services);
    }

    public function getByArtisan($artisanId)
    {
        $services = Service::where('artisan_id', $artisanId)->with('user')->get();
        return response()->json($services);
    }
}
