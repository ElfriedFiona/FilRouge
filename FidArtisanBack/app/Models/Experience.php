<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = ['artisan_id', 'poste', 'lieu', 'date_debut', 'date_fin', 'description'];

    public function artisan() {
        return $this->belongsTo(Artisan::class);
    }
}
