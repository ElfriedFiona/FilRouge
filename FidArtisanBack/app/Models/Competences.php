<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competences extends Model
{
    use HasFactory;

    protected  $fillable = ['artisan_id', 'competences'];

    public function artisan() {
        return $this->belongsTo(Artisan::class);
    }
}
