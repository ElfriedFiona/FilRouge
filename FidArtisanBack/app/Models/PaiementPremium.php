<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaiementPremium extends Model
{
    use HasFactory;

    protected $table = 'paiement_premium';
    protected $fillable = ['montant', 'artisan_id', 'moyen_paiement'];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }
}
