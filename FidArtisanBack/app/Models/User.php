<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'etat'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function client() {
        return $this->hasOne(Client::class);
    }
    public function artisan() {
        return $this->hasOne(Artisan::class);
    }
    public function admin() {
        return $this->hasOne(Admin::class);
    }
    public function contactuser(){
        return $this->hasMany(ContactUser::class);
    }
    public function services(){
        return $this->hasMany(Service::class);
    }
    public function avis(){
        return $this->hasMany(AvisEtNote::class);
    }
    public function avisParArtisans(){
        return $this->hasMany(AvisArtisanClient::class);
    }
}
