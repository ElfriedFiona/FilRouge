<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('avis_artisan_clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artisan_id')
                  ->constrained('artisans')
                  ->onDelete('cascade');
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->foreignId('service_id')
                  ->constrained('services')
                  ->onDelete('cascade');
            $table->tinyInteger('note')->unsigned();    // 1 à 5
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('avis_artisan_clients');
    }
};
