<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function artisans(){
        return $this->hasMany(Artisan::class);
    }

    public function clients() {
        return $this->hasMany(Client::class);
    }
}
