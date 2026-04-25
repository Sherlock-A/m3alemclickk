<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            // Grand Casablanca-Settat
            ['name' => 'Casablanca',  'name_ar' => 'الدار البيضاء', 'name_en' => 'Casablanca',  'region' => 'Grand Casablanca-Settat', 'latitude' => 33.5731, 'longitude' => -7.5898,  'sort_order' => 1],
            ['name' => 'Mohammedia', 'name_ar' => 'المحمدية',       'name_en' => 'Mohammedia',  'region' => 'Grand Casablanca-Settat', 'latitude' => 33.6862, 'longitude' => -7.3833,  'sort_order' => 2],
            ['name' => 'El Jadida',  'name_ar' => 'الجديدة',        'name_en' => 'El Jadida',   'region' => 'Grand Casablanca-Settat', 'latitude' => 33.2316, 'longitude' => -8.5007,  'sort_order' => 3],
            ['name' => 'Settat',     'name_ar' => 'سطات',           'name_en' => 'Settat',      'region' => 'Grand Casablanca-Settat', 'latitude' => 33.0014, 'longitude' => -7.6196,  'sort_order' => 4],
            // Rabat-Salé-Kénitra
            ['name' => 'Rabat',      'name_ar' => 'الرباط',         'name_en' => 'Rabat',       'region' => 'Rabat-Salé-Kénitra',     'latitude' => 34.0209, 'longitude' => -6.8416,  'sort_order' => 5],
            ['name' => 'Salé',       'name_ar' => 'سلا',            'name_en' => 'Salé',        'region' => 'Rabat-Salé-Kénitra',     'latitude' => 34.0380, 'longitude' => -6.7985,  'sort_order' => 6],
            ['name' => 'Kénitra',    'name_ar' => 'القنيطرة',       'name_en' => 'Kenitra',     'region' => 'Rabat-Salé-Kénitra',     'latitude' => 34.2610, 'longitude' => -6.5802,  'sort_order' => 7],
            ['name' => 'Témara',     'name_ar' => 'تمارة',          'name_en' => 'Temara',      'region' => 'Rabat-Salé-Kénitra',     'latitude' => 33.9261, 'longitude' => -6.9094,  'sort_order' => 8],
            // Marrakech-Safi
            ['name' => 'Marrakech',  'name_ar' => 'مراكش',          'name_en' => 'Marrakech',   'region' => 'Marrakech-Safi',         'latitude' => 31.6295, 'longitude' => -7.9811,  'sort_order' => 9],
            ['name' => 'Safi',       'name_ar' => 'آسفي',           'name_en' => 'Safi',        'region' => 'Marrakech-Safi',         'latitude' => 32.2994, 'longitude' => -9.2372,  'sort_order' => 10],
            ['name' => 'Essaouira',  'name_ar' => 'الصويرة',        'name_en' => 'Essaouira',   'region' => 'Marrakech-Safi',         'latitude' => 31.5085, 'longitude' => -9.7595,  'sort_order' => 11],
            // Tanger-Tétouan-Al Hoceïma
            ['name' => 'Tanger',     'name_ar' => 'طنجة',           'name_en' => 'Tangier',     'region' => 'Tanger-Tétouan-Al Hoceïma', 'latitude' => 35.7595, 'longitude' => -5.8340, 'sort_order' => 12],
            ['name' => 'Tétouan',    'name_ar' => 'تطوان',          'name_en' => 'Tetouan',     'region' => 'Tanger-Tétouan-Al Hoceïma', 'latitude' => 35.5785, 'longitude' => -5.3684, 'sort_order' => 13],
            ['name' => 'Al Hoceïma', 'name_ar' => 'الحسيمة',       'name_en' => 'Al Hoceima',  'region' => 'Tanger-Tétouan-Al Hoceïma', 'latitude' => 35.2517, 'longitude' => -3.9372, 'sort_order' => 14],
            // Fès-Meknès
            ['name' => 'Fès',        'name_ar' => 'فاس',            'name_en' => 'Fez',         'region' => 'Fès-Meknès',             'latitude' => 34.0331, 'longitude' => -5.0003,  'sort_order' => 15],
            ['name' => 'Meknès',     'name_ar' => 'مكناس',          'name_en' => 'Meknes',      'region' => 'Fès-Meknès',             'latitude' => 33.8935, 'longitude' => -5.5473,  'sort_order' => 16],
            // Souss-Massa
            ['name' => 'Agadir',     'name_ar' => 'أكادير',         'name_en' => 'Agadir',      'region' => 'Souss-Massa',            'latitude' => 30.4278, 'longitude' => -9.5981,  'sort_order' => 17],
            ['name' => 'Tiznit',     'name_ar' => 'تيزنيت',         'name_en' => 'Tiznit',      'region' => 'Souss-Massa',            'latitude' => 29.6974, 'longitude' => -9.7316,  'sort_order' => 18],
            ['name' => 'Inezgane',   'name_ar' => 'إنزكان',         'name_en' => 'Inezgane',    'region' => 'Souss-Massa',            'latitude' => 30.3586, 'longitude' => -9.5350,  'sort_order' => 19],
            // Oriental
            ['name' => 'Oujda',      'name_ar' => 'وجدة',           'name_en' => 'Oujda',       'region' => 'Oriental',               'latitude' => 34.6814, 'longitude' => -1.9086,  'sort_order' => 20],
            ['name' => 'Nador',      'name_ar' => 'الناظور',        'name_en' => 'Nador',       'region' => 'Oriental',               'latitude' => 35.1740, 'longitude' => -2.9287,  'sort_order' => 21],
            // Beni Mellal-Khénifra
            ['name' => 'Beni Mellal','name_ar' => 'بني ملال',       'name_en' => 'Beni Mellal', 'region' => 'Beni Mellal-Khénifra',   'latitude' => 32.3372, 'longitude' => -6.3498,  'sort_order' => 22],
            // Drâa-Tafilalet
            ['name' => 'Errachidia', 'name_ar' => 'الراشيدية',      'name_en' => 'Errachidia',  'region' => 'Drâa-Tafilalet',         'latitude' => 31.9314, 'longitude' => -4.4249,  'sort_order' => 23],
            ['name' => 'Ouarzazate', 'name_ar' => 'ورزازات',        'name_en' => 'Ouarzazate',  'region' => 'Drâa-Tafilalet',         'latitude' => 30.9335, 'longitude' => -6.9370,  'sort_order' => 24],
        ];

        foreach ($cities as $city) {
            City::firstOrCreate(
                ['name' => $city['name']],
                array_merge($city, ['active' => true])
            );
        }
    }
}
