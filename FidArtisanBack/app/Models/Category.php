<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
    ];

    // Relation avec les professions
    public function professions()
    {
        return $this->hasMany(Profession::class);
    }
}
