<?php

use Illuminate\Support\Facades\Route;

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

