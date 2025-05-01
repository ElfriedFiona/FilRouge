<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarEvent extends Model
{
    use HasFactory;

    protected $fillable = ['artisan_id', 'title', 'start', 'end'];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }
}
