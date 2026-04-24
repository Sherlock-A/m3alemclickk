<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('professionals', function (Blueprint $table) {
            $table->index('rating',       'idx_professionals_rating');
            $table->index('views',        'idx_professionals_views');
            $table->index('is_available', 'idx_professionals_available');
            $table->index('verified',     'idx_professionals_verified');
            $table->index('created_at',   'idx_professionals_created');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index(['professional_id', 'approved'], 'idx_reviews_pro_approved');
        });

        Schema::table('trackings', function (Blueprint $table) {
            $table->index(['professional_id', 'created_at'], 'idx_trackings_pro_date');
        });
    }

    public function down(): void
    {
        Schema::table('professionals', function (Blueprint $table) {
            $table->dropIndex('idx_professionals_rating');
            $table->dropIndex('idx_professionals_views');
            $table->dropIndex('idx_professionals_available');
            $table->dropIndex('idx_professionals_verified');
            $table->dropIndex('idx_professionals_created');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex('idx_reviews_pro_approved');
        });

        Schema::table('trackings', function (Blueprint $table) {
            $table->dropIndex('idx_trackings_pro_date');
        });
    }
};
