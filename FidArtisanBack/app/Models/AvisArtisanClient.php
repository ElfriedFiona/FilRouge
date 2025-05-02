<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvisArtisanClient extends Model
{
    use HasFactory;

    protected $fillable = [
        'artisan_id',
        'user_id',
        'service_id',
        'note',
        'commentaire',
    ];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function service()
    {
        return $this->belongsTo(Service::class);
    }


}
