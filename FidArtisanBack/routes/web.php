<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Auth::routes(['verify' => true]);
Route::get('/', function () {
    return view('welcome');
});

Route::get('/migrate-client-to-user', function () {
    $services = \App\Models\Service::whereNotNull('client_id')->get();

    foreach ($services as $service) {
        $client = \App\Models\Client::find($service->client_id);
        if ($client && $client->user_id) {
            $service->user_id = $client->user_id;
            $service->save();
        }
    }

    return 'Migration terminée';
});

Route::get('/uploads/{filename}', function ($filename) {
    $path = storage_path('app/public/uploads/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    $file = file_get_contents($path);
    $type = mime_content_type($path);

    return response($file, 200)
            ->header('Content-Type', $type)
            ->header('Access-Control-Allow-Origin', '*');
});
