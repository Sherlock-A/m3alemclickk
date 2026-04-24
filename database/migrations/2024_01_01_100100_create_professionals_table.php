<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professionals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('phone');
            $table->string('profession');
            $table->string('main_city');
            $table->json('travel_cities')->nullable();
            $table->json('languages')->nullable();
            $table->text('description')->nullable();
            $table->string('photo')->nullable();
            $table->json('portfolio')->nullable();
            $table->string('status')->default('available');
            $table->unsignedBigInteger('views')->default(0);
            $table->unsignedBigInteger('whatsapp_clicks')->default(0);
            $table->unsignedBigInteger('calls')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->boolean('verified')->default(false);
            $table->unsignedInteger('completed_missions')->default(0);
            $table->boolean('is_available')->default(true);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamps();
            $table->index(['main_city', 'profession', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professionals');
    }
};
