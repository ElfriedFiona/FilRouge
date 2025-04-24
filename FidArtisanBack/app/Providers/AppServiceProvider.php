<?php

namespace App\Providers;

use Laravel\Fortify\Fortify;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Fortify::verifyEmailView(function () {
            return response()->json(['message' => 'Email vérifié avec succès.']);
        });
    }
}
