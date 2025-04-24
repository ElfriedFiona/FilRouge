<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilArtisanSignale extends Model
{
    use HasFactory;

    protected $fillable = ['client_id', 'artisan_id'];

    public function artisan() {
        return $this->belongsTo(Artisan::class);
    }

    public function client() {
        return $this->belongsTo(Client::class);
    }
}
