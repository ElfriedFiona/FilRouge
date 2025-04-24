<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'artisan_id',
    ];

    // Un favori appartient à un client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    // Un favori appartient à un artisan
    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }
}
