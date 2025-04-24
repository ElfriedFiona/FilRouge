<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'photo', 'telephone','sexe', 'description', 'ville_id'];

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function ville(){
        return $this->belongsTo(Ville::class);
    }

    public function favorites()
    {
    return $this->hasMany(Favorite::class);
    }

}
