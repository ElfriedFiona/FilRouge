<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VilleController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\AvisArtisanClientController;
use App\Http\Controllers\AvisEtNoteController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompetencesController;
use App\Http\Controllers\ProfessionController;
use App\Http\Controllers\ProjetRealiserController;
use App\Http\Controllers\ServiceProposerController;
use App\Http\Controllers\ArtisanController;
use App\Http\Controllers\ServiceController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    if (! URL::hasValidSignature($request)) {
        return response()->json(['message' => 'Lien invalide ou expiré.'], 403);
    }

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email déjà vérifié.']);
    }

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Hash invalide.'], 403);
    }

    $user->markEmailAsVerified();
    event(new Verified($user));

    return response()->json(['message' => 'Email vérifié avec succès.']);
})->name('verification.verify');

Route::post('/email/resend', function (Request $request) {
    $user = \App\Models\User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
    }

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Adresse email déjà vérifiée.'], 400);
    }

    $user->sendEmailVerificationNotification();

    return response()->json(['message' => 'Lien de vérification renvoyé.']);
});

Route::get('/artisans/search', [ArtisanController::class, 'search']);
Route::get('/artisans/{artisan}/profil', [ArtisanController::class, 'showFullProfile']);
Route::get('/artisan/{artisanId}/languages', [ArtisanController::class, 'getLanguages']);
Route::get('/villes', [VilleController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'showById']);

    Route::get('/artisans',[UserController::class, 'listArtisans']);
    Route::get('/artisans/{id}',[UserController::class, 'showArtisan']);

    Route::put('/users/{id}/etat',  [UserController::class, 'changeEtat'])
         ->middleware('can:changeEtat,App\Models\User');

    Route::delete('/users/{id}',    [UserController::class, 'destroy'])
         ->middleware('can:delete,App\Models\User');

         Route::put('/profile/description', [UserController::class, 'updateDescription']);

    Route::get('/artisans', [ArtisanController::class, 'index']); // version light
     // profil complet
    Route::get('/artisans/{artisan}', [ArtisanController::class, 'show']); // version intermédiaire (si besoin)
    Route::put('/artisans/{artisan}', [ArtisanController::class, 'update']);
    Route::delete('/artisans/{artisan}', [ArtisanController::class, 'destroy']);

    Route::get('/artisans/profession/{professionId}', [ArtisanController::class, 'filterByProfession']);
    Route::get('/artisans/ville/{villeId}', [ArtisanController::class, 'filterByVille']);
    Route::get('/artisans/{id}/annonces', [ArtisanController::class, 'annoncesParArtisan']);

    

    // Annonces
    Route::apiResource('annonces', AnnonceController::class);
    Route::get('/annonces/{id}/artisan', [AnnonceController::class, 'artisanFromAnnonce']);


    // Avis et notes donnée par des clients aux artisans
    Route::apiResource('avis', AvisEtNoteController::class);
    // Filtrer les avis par client
    Route::get('/clients/{clientId}/avis', [AvisEtNoteController::class, 'getByClient']);
    // Filtrer les avis par artisan
    Route::get('/artisans/{artisanId}/avis', [AvisEtNoteController::class, 'getByArtisan']);

    // Avis et notes donnée par des artisans aux clients
    Route::apiResource('avis-artisan-cllients', AvisArtisanClientController::class);
    Route::get('/avis-artisan-clients/{clientId}', [AvisArtisanClientController::class, 'getByClient']);

    // Filtres
    Route::get('/artisans/{artisanId}/avis-clients',      [AvisArtisanClientController::class,'getByArtisan']);
    Route::get('/clients/{clientId}/avis-artisans',       [AvisArtisanClientController::class,'getByClient']);

    // Expériences
    Route::apiResource('experiences', ExperienceController::class);
    // Filtrer les expériences par artisan
    Route::get(
        '/artisans/{artisanId}/experiences',
        [ExperienceController::class, 'getByArtisan']
    );

    // Compétences
    Route::apiResource('competences', CompetencesController::class);
    Route::get('/competences/{artisanId}', [CompetencesController::class, 'getByArtisan']);

    // Projet réaliser
    Route::apiResource('projets', ProjetRealiserController::class);

    // Services Proposé par l'artisan
    Route::apiResource('services-proposes', ServiceProposerController::class);

    //Categories
    Route::apiResource('categories', CategoryController::class);

    //Professions
    Route::apiResource('professions', ProfessionController::class);



Route::apiResource('/services', ServiceController::class);
Route::get('/services/user/{id}', [ServiceController::class, 'getByUser']);
Route::get('/services/artisan/{id}', [ServiceController::class, 'getByArtisan']);



});

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/profile', [UserController::class, 'show']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{artisan}', [FavoriteController::class, 'destroy']);
});

