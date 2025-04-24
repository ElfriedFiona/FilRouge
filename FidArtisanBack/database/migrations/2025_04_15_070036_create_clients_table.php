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
    Schema::create('clients', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('photo')->nullable();
        $table->string('telephone')->nullable();
        $table->enum('sexe',['M','F'])->nullable();
        $table->text('description')->nullable();
        $table->foreignId('ville_id')->nullable()->constrained('villes')->nullOnDelete();
        $table->enum('langue', ['Français','Anglais','Français et Anglais'])->default('Français');
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
        Schema::dropIfExists('clients');
    }
};
