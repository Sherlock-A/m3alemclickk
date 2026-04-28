<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * FULLTEXT index on professionals for fast search.
 * Applies to MySQL only — SQLite is handled in PHP (ProfessionalController::norm).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        // Add FULLTEXT index for MySQL full-text search
        DB::statement('ALTER TABLE professionals ADD FULLTEXT ft_pros_search (name, profession, description)');
        DB::statement('ALTER TABLE categories    ADD FULLTEXT ft_cats_search (name, description)');
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE professionals DROP INDEX ft_pros_search');
        DB::statement('ALTER TABLE categories    DROP INDEX ft_cats_search');
    }
};
