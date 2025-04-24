<?php

namespace App\Models;

use Faker\Provider\ar_EG\Company;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artisan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'photo',
        'sexe',
        'telephone',
        'description',
        'profession_id',
        'ville_id',
        'langue'

        // 'fichiers',
        // 'experience',
        // 'service_proposer'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function profession() {
        return $this->belongsTo(Profession::class);
    }

    public function ville() {
        return $this->belongsTo(Ville::class);
    }

    public function services() {
        return $this->hasMany(Service::class);
    }

    public function avis() {
        return $this->hasMany(AvisEtNote::class);
    }

    public function annonces() {
        return $this->hasMany(Annonce::class);
    }

    public function paiements() {
        return $this->hasMany(PaiementPremium::class);
    }

    public function servicesproposer() {
        return $this->hasMany(ServiceProposer::class);
    }

    public function projets() {
        return $this->hasMany(ProjetRealiser::class);
    }

    public function competences() {
        return $this->hasMany(Competences::class);
    }

    public function experiences() {
        return $this->hasMany(Experience::class);
    }

    public function favoritedBy()
    {
    return $this->hasMany(Favorite::class);
    }

    public function avisClients()
    {
    return $this->hasMany(AvisArtisanClient::class, 'artisan_id');
    }

}
