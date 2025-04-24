<?php

namespace App\Providers;

use Laravel\Fortify\Contracts\LoginViewResponse;
use Laravel\Fortify\Contracts\RegisterViewResponse;
use Laravel\Fortify\Contracts\VerifyEmailViewResponse;
use Laravel\Fortify\Contracts\RequestPasswordResetLinkViewResponse;
use Laravel\Fortify\Contracts\ResetPasswordViewResponse;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Hash;
use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;
use App\Models\User;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        Fortify::createUsersUsing(CreateNewUser::class);

    // Login : autoriser admin sans vérif email, artisan/client OUI
    Fortify::authenticateUsing(function (Request $request) {
        $user = User::where('email', $request->email)->first();

        if (
            $user &&
            Hash::check($request->password, $user->password) &&
            ($user->role === 'admin' || $user->hasVerifiedEmail())
        ) {
            return $user;
        }
        return null;
    });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        $this->app->singleton(LoginViewResponse::class, function () {
            abort(404, 'Login view not available.');
        });
        $this->app->singleton(RegisterViewResponse::class, function () {
            abort(404, 'Register view not available.');
        });
        $this->app->singleton(VerifyEmailViewResponse::class, function () {
            return Response::json(['message' => 'Email verified successfully']);
        });
        $this->app->singleton(RequestPasswordResetLinkViewResponse::class, function () {
            abort(404, 'Password reset request view not available.');
        });
        $this->app->singleton(ResetPasswordViewResponse::class, function () {
            abort(404, 'Reset password view not available.');
        });
    }
}
