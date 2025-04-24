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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('artisan_id')->constrained('artisans')->onDelete('cascade');
            $table->text('description');
            $table->enum('statut', ['en attente', 'en cours', 'terminé', 'annulée'])->default('en attente');
            $table->enum('type_de_service', ['standard', 'urgent', 'planifié'])->default('standard');
            $table->decimal('budget', 10, 2)->nullable();
            $table->date('date_limite')->nullable();
            $table->enum('priorité', ['basse', 'moyenne', 'haute'])->default('moyenne');
            $table->string('fichiers')->nullable(); // URL des fichiers
            $table->string('adresse_details')->nullable();
            // $table->enum('statut_client', ['en attente', 'confirmée', 'annulée'])->default('en attente'); // SUPPRIMER CETTE LIGNE
            $table->enum('statut_artisan', ['acceptée', 'en attente', 'refusée'])->default('en attente');
            $table->string('image_path')->nullable();
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
        Schema::dropIfExists('services');
    }
};
