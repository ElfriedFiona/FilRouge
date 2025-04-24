<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Annonce extends Model
{
    use HasFactory;

    protected $fillable = ['artisan_id', 'titre_annonce', 'detail_annonce'];

    public function artisan(){
        return $this->belongsTo(Artisan::class);
    }
}
