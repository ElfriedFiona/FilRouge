<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjetRealiser extends Model
{
    use HasFactory;

    protected $fillable = [
        'artisan_id',
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'image'
    ];

    public function artisan() {
        return $this->belongsTo(Artisan::class);
    }
}
