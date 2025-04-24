<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvisEtNote extends Model
{
    use HasFactory;

    protected $fillable = ['note', 'user_id', 'artisan_id','service_id', 'commentaire'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function artisan() {
        return $this->belongsTo(Artisan::class);
    }

    public function service(){
        return $this->belongsTo(Service::class);
    }
}
