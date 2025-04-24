<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceProposer extends Model
{
    use HasFactory;

    protected $fillable = ['artisan_id', 'titre', 'description', 'montant'];

    public function artisan() {
        return $this->belongsTo(Artisan::class);
    }
}
