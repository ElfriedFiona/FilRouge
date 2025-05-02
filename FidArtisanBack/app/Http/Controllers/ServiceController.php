<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use App\Mail\ServiceStatusNotification;
use Illuminate\Support\Facades\Mail;

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
            Service::with(['user', 'artisan.user','avisEtNote'])->latest()->get()
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
    public function show($artisanId)
{
    $service = Service::where('artisan_id', $artisanId)
                ->whereNotIn('statut', ['terminé', 'annulée','en cours']) // Filtre ici
                ->with('user') // si tu veux le nom du client par ex.
                ->latest()
                ->get();

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
            'type_de_service' => 'nullable|string',
            'budget'          => 'nullable|numeric',
            'date_limite'     => 'nullable|date|after_or_equal:today',
            'priorité'        => 'nullable|string',
            'fichiers'        => 'nullable|string',
            'adresse_details' => 'nullable|string',
            'image_path'      => 'nullable|string',
            'message_reponse' => 'nullable|string',
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
        $services = Service::where('user_id', $userId)->with('artisan.user','avisEtNote.user','avisParArtisans.artisan.user')->get();
        return response()->json($services);
    }

    public function getByArtisan($artisanId)
    {
        $services = Service::where('artisan_id', $artisanId)->with('user','avisEtNote.user','avisParArtisans.artisan.user')->get();
        return response()->json($services);
    }

    /**
 * L'artisan accepte la demande : passe en 'en cours' et notifie le client.
 */
public function acceptRequest(Request $request, $id)
{
    $request->validate([
        'message' => 'nullable|string|max:1000',
    ]);

    $service = Service::findOrFail($id);
    $service->statut = 'en cours';           // Mise à jour du statut global
    $service->statut_artisan = 'acceptée';   // Mise à jour du statut de l'artisan
    $service->message_reponse = $request->message;
    $service->save();

    $client = $service->user; // relation user()

    Mail::to($client->email)
        ->send(new ServiceStatusNotification($service, 'Acceptée'));

    return response()->json(['message' => 'Demande acceptée, le client a été notifié.']);
}

/**
 * L'artisan refuse la demande : passe en 'annulé' et notifie le client.
 */
public function refuseRequest(Request $request, $id)
{
    $request->validate([
        'message' => 'nullable|string|max:1000',
    ]);

    $service = Service::findOrFail($id);
    $service->statut = 'annulée';             // Mise à jour du statut global
    $service->statut_artisan = 'refusée';    // Mise à jour du statut de l'artisan
    $service->message_reponse = $request->message;
    $service->save();

    $client = $service->user;

    Mail::to($client->email)
        ->send(new ServiceStatusNotification($service, 'Refusée'));

    return response()->json(['message' => 'Demande refusée, le client a été notifié.']);
}

public function terminer($id)
{
    $service = Service::findOrFail($id);

    // Vérifie que le service est en cours
    if ($service->statut !== 'en cours') {
        return response()->json(['message' => 'Seuls les services en cours peuvent être terminés.'], 400);
    }

    $service->statut = 'terminé';
    $service->save();

    // Récupérer le client associé au service
    $client = $service->user;

    // Envoyer une notification par email au client
    Mail::to($client->email)
        ->send(new ServiceStatusNotification($service, 'Terminée'));

    return response()->json(['message' => 'Service marqué comme terminé et le client a été notifié.', 'service' => $service]);
}


}
