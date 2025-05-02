<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'artisan_id',
        'description',
        'statut',
        'type_de_service',
        'budget',
        'date_limite',
        'priorité',
        'fichiers',
        'adresse_details',
        'statut_artisan',
        'image_path',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function artisan(){
        return $this->belongsTo(Artisan::class);
    }

    public function avisEtNote(){
        return $this->hasOne(AvisEtNote::class);
    }

    public function avisParArtisans(){
        return $this->hasOne(AvisArtisanClient::class);
    }
}
