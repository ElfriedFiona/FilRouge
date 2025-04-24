<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profession extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'categorie_id', // Relation vers la catégorie
    ];

    // Relation avec la catégorie
    public function categorie()
    {
        return $this->belongsTo(Category::class);
    }
    public function artisans(){
        return $this->hasMany(Artisan::class);
    }
}
