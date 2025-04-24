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
        Schema::create('paiement_premium', function (Blueprint $table) {
            $table->id();
            $table->decimal('montant', 8, 2);
            $table->foreignId('artisan_id')->constrained('artisans')->onDelete('cascade');
            $table->enum('moyen_paiement', ['orangemoney', 'mtnmoney']);
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
        Schema::dropIfExists('paiement_premium');
    }
};
