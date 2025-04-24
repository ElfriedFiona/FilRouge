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
        Schema::create('artisans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('photo')->nullable();
            $table->enum('sexe',['M','F'])->nullable();
            $table->string('telephone')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('profession_id')->nullable()->constrained()->onDelete('set null')->nullOnDelete();
            $table->foreignId('ville_id')->nullable()->constrained()->onDelete('set null')->nullOnDelete();
            $table->enum('langue', ['Français','Anglais','Français et Anglais'])->default('Français');
            // $table->string('fichiers')->nullable();
            // $table->string('experience')->nullable();
            // $table->text('services_proposer')->nullable();
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
        Schema::dropIfExists('artisans');
    }
};
