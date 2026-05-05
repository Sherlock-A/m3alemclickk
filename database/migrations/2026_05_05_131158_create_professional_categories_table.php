<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professional_categories', function (Blueprint $table) {
            $table->foreignId('professional_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->primary(['professional_id', 'category_id']);
        });

        // Migrate existing single category_id into the pivot table
        DB::statement('
            INSERT IGNORE INTO professional_categories (professional_id, category_id)
            SELECT id, category_id FROM professionals
            WHERE category_id IS NOT NULL
        ');
    }

    public function down(): void
    {
        Schema::dropIfExists('professional_categories');
    }
};
