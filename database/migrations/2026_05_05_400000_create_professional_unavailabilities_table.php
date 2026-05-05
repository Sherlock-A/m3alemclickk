<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professional_unavailabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professional_id')->constrained()->cascadeOnDelete();
            $table->date('from_date');
            $table->date('to_date');
            $table->string('reason', 200)->nullable();
            $table->timestamps();

            $table->index(['professional_id', 'from_date', 'to_date'], 'pro_unavail_dates_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professional_unavailabilities');
    }
};
