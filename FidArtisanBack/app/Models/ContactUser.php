<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactUser extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'message'];

    public function users(){
        return $this->belongsTo(User::class);
    }
}
