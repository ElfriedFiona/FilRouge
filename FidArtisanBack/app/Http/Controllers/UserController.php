<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
{
    $this->authorize('viewAny', User::class);

    $users = User::with(['client', 'artisan'])->get();
    return response()->json($users);
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $user = Auth::user();
        $profile = $user->only(['id', 'name', 'email', 'role', 'email_verified_at']);

        if ($user->role === 'client' && $user->client) {
            $profile['client'] = $user->client->only([
                'photo','telephone', 'ville_id', 'sexe', 'description','langue'
            ]);
        } elseif ($user->role === 'artisan' && $user->artisan) {
                // On charge explicitement toutes les relations métier
                $artisan = $user
                    ->artisan
                    ->load([
                        'ville',
                        'profession',
                        'servicesproposer',
                        'projets',
                        'competences',
                        'experiences',
                        'paiements',
                        'annonces',
                        'avis',
                    ]);

                $profile['artisan'] = [
                    'id'                  => $artisan->id,
                    'photo'             => $artisan->photo,
                    'telephone'         => $artisan->telephone,
                    'ville'             => $artisan->ville->nom ?? null,
                    'profession'        => $artisan->profession->nom ?? null,
                    'description'       => $artisan->description,
                    'sexe'              => $artisan->sexe,
                    'langue'            => $artisan->langue,

                    // Relations multiples
                    'serviceproposer'   => $artisan->serviceproposer,
                    'projets'           => $artisan->projets,
                    'competences'       => $artisan->competences,
                    'experiences'       => $artisan->experiences,

                    // Autres relations
                    'paiements'         => $artisan->paiements,
                    'annonces'          => $artisan->annonces,
                    'avis'              => $artisan->avis,
                ];
            }

        return response()->json($profile);
    }

    // Affichage public d'un profil utilisateur
    public function showById($id)
    {
        $user = User::with([
            // Pour le client : sa fiche
            'client.ville',
            // Pour les favoris : on part de client->favoris pivot vers artisan->user/profession
            'client.favorites.artisan.user',
            'client.favorites.artisan.profession',
            // Pour les avis reçus : artisan->avis where artisan_id = ce user si role=artisan,
            // ou si client, artisan a déposé un avis sur lui
            'avisParArtisans.artisan.user',
            'services.artisan.user',
        ])->findOrFail($id);

        // Construire la réponse propre
        $profile = [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ];

        if ($user->role === 'client' && $user->client) {
            $c = $user->client;
            $profile['client'] = [
                'telephone' => $c->telephone,
                'langue'    => $c->langue,
                'sexe'      => $c->sexe,
                'ville'     => $c->ville->nom ?? null,
                'photo'     => $c->photo,
                'description'     => $c->description,
            ];

            // artisans favoris
            $profile['favorites'] = $c->favorites->map(function($fav) {
                $art = $fav->artisan;
                return [
                    'id'             => $art->id,
                    'name'           => $art->user->name,
                    'profilePicture' => $art->photo ? asset($art->photo) : null,
                    'profession'     => $art->profession->nom ?? null,
                ];
            });

            // avis reçus (la relation avisRecus doit être définie sur User comme hasMany(AvisEtNote::class,'client_id'))
            $profile['avisParArtisans'] = $user->avisParArtisans->map(function($avis) {
                return [
                    'note'       => $avis->note,
                    'commentaire'=> $avis->commentaire,
                    'artisan'    => [
                        'id'   => $avis->artisan->id,
                        'name' => $avis->artisan->user->name,
                        'photo'=> asset($avis->artisan->photo),
                    ],
                    'created_at' => $avis->created_at->toDateTimeString(),
                ];
            });

            $profile['services'] = $user->services
    ->where('statut') // on filtre ici
    ->map(function($service) {
        return [
            'id'       => $service->id,
            'service'  => $service->description,
            'statut'   => $service->statut,
            'date_limite'     => \Carbon\Carbon::parse($service->date)->format('d M Y'),
            'budget'    => number_format($service->budget, 0, ',', ' ') . ' FCFA',
            'artisan'  => [
                'id'   => $service->artisan->id,
                'name' => $service->artisan->user->name,
            ]
        ];
    })->values(); // pour réindexer proprement

        }
        elseif ($user->role === 'artisan' && $user->artisan) {
            $a = $user->artisan;
            $profile['artisan'] = [
                'photo'       => $a->photo ? asset($a->photo) : null,
                'telephone'   => $a->telephone,
                'langue'      => $a->langue,
                'sexe'        => $a->sexe,
                'ville'       => $a->ville->nom ?? null,
                'profession'  => $a->profession->nom ?? null,
                'description' => $a->description,
            ];
            // vous pourriez aussi exposer ici ses annonces, projets, etc.
        }

        return response()->json($profile, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
        // Met à jour le profil de l'utilisateur connecté
        public function update(Request $request)
{
    $user = Auth::user();
    $this->authorize('update', $user);

    $baseRules = [
        'name' => ['required', 'string', 'max:255'],
        'email' => [
            'required', 'email', 'max:255',
            Rule::unique('users')->ignore($user->id),
        ],
    ];

    $photoRules = ['photo' => ['nullable', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048']];

    $clientRules = array_merge($photoRules, [
        'telephone' => ['nullable', 'string'],
        'ville_id' => ['nullable', 'exists:villes,id'],
        'sexe' => ['nullable', 'in:M,F'],
        'description' => ['nullable', 'string'],
    ]);

    $artisanRules = array_merge($photoRules, [
        'telephone' => ['nullable', 'string'],
        'ville_id' => ['nullable', 'exists:villes,id'],
        'profession_id' => ['nullable', 'exists:professions,id'],
        'description' => ['nullable', 'string'],
        'sexe' => ['nullable', 'in:homme,femme,M,F'],
        'langue' => ['nullable', 'string'],
    ]);

    $rules = $baseRules;

    if ($user->role === 'client') {
        $rules = array_merge($rules, $clientRules);
    } elseif ($user->role === 'artisan') {
        $rules = array_merge($rules, $artisanRules);
    }

    $validated = $request->validate($rules);

    if ($validated['email'] !== $user->email && $user instanceof MustVerifyEmail) {
        $user->forceFill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'email_verified_at' => null,
        ])->save();

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Email modifié. Veuillez vérifier votre nouvelle adresse.'
        ]);
    }

    $userData = [
        'name' => $validated['name'],
        'email' => $validated['email'],
    ];

    $photoFilename = null; // Variable pour stocker le nom du fichier

    if ($request->hasFile('photo')) {
        $photo = $request->file('photo');
        $filename = time() . '_' . $photo->getClientOriginalName();
        $path = $photo->storeAs('uploads', $filename, 'public');
        $photoFilename = $filename; // On enregistre juste le nom du fichier

        if ($user->role === 'artisan' && $user->artisan) {
            if ($user->artisan->photo && Storage::disk('public')->exists('uploads/' . basename($user->artisan->photo))) {
                Storage::disk('public')->delete('uploads/' . basename($user->artisan->photo));
            }
            $user->artisan->update(['photo' => $photoFilename]);
        }

        if ($user->role === 'client' && $user->client) {
            if ($user->client->photo && Storage::disk('public')->exists('uploads/' . basename($user->client->photo))) {
                Storage::disk('public')->delete('uploads/' . basename($user->client->photo));
            }
            $user->client->update(['photo' => $photoFilename]);
        }

        $photoUrlResponse = asset('storage/uploads/' . $photoFilename);
    } else {
        $photoUrlResponse = $user->role === 'artisan' && $user->artisan
            ? ($user->artisan->photo ? asset('storage/uploads/' . $user->artisan->photo) : null)
            : ($user->client && $user->client->photo ? asset('storage/uploads/' . $user->client->photo) : null);
    }

    $user->update($userData);

    if ($user->role === 'client' && $user->client) {
        $user->client->update($request->only([
            'telephone', 'ville_id', 'sexe', 'description'
        ]));
    }

    if ($user->role === 'artisan' && $user->artisan) {
        $user->artisan->update($request->only([
            'telephone', 'ville_id', 'profession_id',
            'description', 'sexe', 'langue'
        ]));
    }

    return response()->json([
        'message' => 'Profil mis à jour avec succès.',
        'photo_url' => $photoUrlResponse,
    ]);
}


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $this->authorize('delete', $user);

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }

    public function showArtisan($id)
    {
        $artisanUser = User::where('role', 'artisan')
            ->where('etat', 'actif')
            ->with([
                'artisan.ville',
                'artisan.profession',
                'artisan.serviceproposer',
                'artisan.projets',
                'artisan.competences',
                'artisan.experiences',
                'artisan.paiements',
                'artisan.annonces',
                'artisan.avis',
            ])
            ->findOrFail($id);

        $this->authorize('view', $artisanUser);

        // On renvoie l'utilisateur avec son profil complet
        return response()->json($artisanUser);
    }

    /**
     * Liste tous les artisans actifs (avec leurs profils allégés).
     */
    public function listArtisans()
    {
        $this->authorize('viewAny', User::class);

        $artisans = User::where('role', 'artisan')
            ->where('etat', 'actif')
            ->with(['artisan.ville', 'artisan.profession'])
            ->get()
            ->map(function (User $user) {
                $a = $user->artisan;
                return [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'photo'       => $a->photo,
                    'ville'       => $a->ville->nom ?? null,
                    'profession'  => $a->profession->nom ?? null,
                ];
            });

        return response()->json($artisans);
    }

    public function updateDescription(Request $request)
 {
  $user = Auth::user();
  $this->authorize('update', $user);

  $validated = $request->validate([
   'description' => ['nullable', 'string'],
  ]);

  if ($user->role === 'client' && $user->client) {
   $user->client->update($validated);
  } elseif ($user->role === 'artisan' && $user->artisan) {
   $user->artisan->update($validated);
  }

  return response()->json(['message' => 'Description mise à jour avec succès.']);
 }

  // Admin : change l'état d'un utilisateur (actif/inactif)
  public function changeEtat(Request $request, $id)
{
    // Vérification si l'utilisateur existe
    $user = User::find($id);
    if (!$user) {
        return response()->json(['error' => 'Utilisateur non trouvé'], 404);
    }

    // Mise à jour de l'état de l'utilisateur
    try {
        $user->etat = $request->input('etat');  // Vérifiez que 'etat' existe dans le corps de la requête
        $user->save();

        return response()->json(['message' => 'État mis à jour avec succès']);
    } catch (\Exception $e) {
        // Log de l'erreur si nécessaire
        \Log::error('Erreur lors de la mise à jour de l\'état de l\'utilisateur : ' . $e->getMessage());

        return response()->json(['error' => 'Erreur interne du serveur'], 500);
    }
}




  public function getAllClients()
{
    $clients = User::whereHas('client')
        ->with(['client.ville'])
        ->get()
        ->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'etat' => $user->etat,

                'client' => [
                    'photo' => $user->client->photo,
                    'telephone' => $user->client->telephone,
                    'ville_id' => $user->client->ville_id,
                    'ville' => $user->client->ville ? $user->client->ville->nom : null,
                    'sexe' => $user->client->sexe,
                    'description' => $user->client->description,
                    'langue' => $user->client->langue,
                ]
            ];
        });

    return response()->json($clients);
}




}
