<?php

namespace App\Http\Controllers;

use App\Models\Artisan;
use Illuminate\Support\Facades\Auth;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $client = Auth::user()->client;
        return response()->json($client->favorites()->with('user')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $client = Auth::user()->client;

        $artisanId = $request->input('artisan_id');

        if ($client->favorites()->where('artisan_id', $artisanId)->exists()) {
            return response()->json(['message' => 'Artisan déjà dans vos favoris.'], 409);
        }

        $client->favorites()->attach($artisanId);
        return response()->json(['message' => 'Artisan ajouté aux favoris.']);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Favorite  $favorite
     * @return \Illuminate\Http\Response
     */
    public function show(Favorite $favorite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Favorite  $favorite
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Favorite $favorite)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Favorite  $favorite
     * @return \Illuminate\Http\Response
     */
    public function destroy($artisanId)
    {
        $client = Auth::user()->client;
        $client->favorites()->detach($artisanId);
        return response()->json(['message' => 'Artisan retiré des favoris.']);
    }
}
