<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('name_ar', 100)->nullable();
            $table->string('name_en', 100)->nullable();
            $table->string('region', 100)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Seed des principales villes marocaines
        DB::table('cities')->insert([
            ['name' => 'Casablanca',  'name_ar' => 'الدار البيضاء', 'name_en' => 'Casablanca',  'region' => 'Casablanca-Settat',    'latitude' => 33.5731, 'longitude' => -7.5898,  'active' => true, 'sort_order' => 1,  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rabat',       'name_ar' => 'الرباط',         'name_en' => 'Rabat',        'region' => 'Rabat-Salé-Kénitra',   'latitude' => 34.0209, 'longitude' => -6.8416,  'active' => true, 'sort_order' => 2,  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Marrakech',   'name_ar' => 'مراكش',          'name_en' => 'Marrakech',    'region' => 'Marrakech-Safi',       'latitude' => 31.6295, 'longitude' => -7.9811,  'active' => true, 'sort_order' => 3,  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Fès',         'name_ar' => 'فاس',            'name_en' => 'Fez',          'region' => 'Fès-Meknès',           'latitude' => 34.0181, 'longitude' => -5.0078,  'active' => true, 'sort_order' => 4,  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tanger',      'name_ar' => 'طنجة',           'name_en' => 'Tangier',      'region' => 'Tanger-Tétouan-Al Hoceïma', 'latitude' => 35.7595, 'longitude' => -5.8340, 'active' => true, 'sort_order' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Agadir',      'name_ar' => 'أكادير',         'name_en' => 'Agadir',       'region' => 'Souss-Massa',          'latitude' => 30.4278, 'longitude' => -9.5981,  'active' => true, 'sort_order' => 6,  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Meknès',      'name_ar' => 'مكناس',          'name_en' => 'Meknes',       'region' => 'Fès-Meknès',           'latitude' => 33.8935, 'longitude' => -5.5473,  'active' => true, 'sort_order' => 7,  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Oujda',       'name_ar' => 'وجدة',           'name_en' => 'Oujda',        'region' => 'Oriental',             'latitude' => 34.6805, 'longitude' => -1.9086,  'active' => true, 'sort_order' => 8,  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Kenitra',     'name_ar' => 'القنيطرة',       'name_en' => 'Kenitra',      'region' => 'Rabat-Salé-Kénitra',   'latitude' => 34.2610, 'longitude' => -6.5802,  'active' => true, 'sort_order' => 9,  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tétouan',     'name_ar' => 'تطوان',          'name_en' => 'Tetouan',      'region' => 'Tanger-Tétouan-Al Hoceïma', 'latitude' => 35.5889, 'longitude' => -5.3626, 'active' => true, 'sort_order' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Safi',        'name_ar' => 'آسفي',           'name_en' => 'Safi',         'region' => 'Marrakech-Safi',       'latitude' => 32.2994, 'longitude' => -9.2372,  'active' => true, 'sort_order' => 11, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'El Jadida',   'name_ar' => 'الجديدة',        'name_en' => 'El Jadida',    'region' => 'Casablanca-Settat',    'latitude' => 33.2316, 'longitude' => -8.5007,  'active' => true, 'sort_order' => 12, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
