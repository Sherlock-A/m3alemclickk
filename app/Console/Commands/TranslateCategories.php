<?php

namespace App\Console\Commands;

use App\Models\Category;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class TranslateCategories extends Command
{
    protected $signature   = 'categories:translate {--force : Re-translate even if translations already exist}';
    protected $description = 'Auto-translate all category names via MyMemory API (fr → ar, en, dz, tzm)';

    // Pre-built translations for the main Moroccan trade categories
    private const KNOWN = [
        'Plomberie'     => ['fr'=>'Plomberie',     'ar'=>'السباكة',        'en'=>'Plumbing',          'dz'=>'السباكة',        'tzm'=>'Tasebbakt'],
        'Électricité'   => ['fr'=>'Électricité',   'ar'=>'الكهرباء',       'en'=>'Electricity',       'dz'=>'الكهرباء',       'tzm'=>'Taɣlit'],
        'Electricité'   => ['fr'=>'Électricité',   'ar'=>'الكهرباء',       'en'=>'Electricity',       'dz'=>'الكهرباء',       'tzm'=>'Taɣlit'],
        'Peinture'      => ['fr'=>'Peinture',      'ar'=>'الدهان',         'en'=>'Painting',          'dz'=>'الدهان',         'tzm'=>'Tasrit'],
        'Climatisation' => ['fr'=>'Climatisation', 'ar'=>'التكييف',        'en'=>'Air Conditioning',  'dz'=>'التكييف',        'tzm'=>'Taɣzi'],
        'Menuiserie'    => ['fr'=>'Menuiserie',    'ar'=>'النجارة',        'en'=>'Carpentry',         'dz'=>'النجارة',        'tzm'=>'Tanajart'],
        'Ménage'        => ['fr'=>'Ménage',        'ar'=>'التنظيف المنزلي','en'=>'Housekeeping',      'dz'=>'النضافة',        'tzm'=>'Asiggen'],
        'Maçonnerie'    => ['fr'=>'Maçonnerie',    'ar'=>'البناء',         'en'=>'Masonry',           'dz'=>'البنا',          'tzm'=>'Abenniw'],
        'Serrurerie'    => ['fr'=>'Serrurerie',    'ar'=>'الحدادة',        'en'=>'Locksmithing',      'dz'=>'الحدادة',        'tzm'=>'Tasraft'],
        'Jardinage'     => ['fr'=>'Jardinage',     'ar'=>'البستنة',        'en'=>'Gardening',         'dz'=>'الجردينة',       'tzm'=>'Tabustant'],
        'Informatique'  => ['fr'=>'Informatique',  'ar'=>'الإعلام الآلي', 'en'=>'IT / Computing',    'dz'=>'الإعلاميات',     'tzm'=>'Informatique'],
        'Déménagement'  => ['fr'=>'Déménagement',  'ar'=>'نقل الأثاث',    'en'=>'Moving / Removal',  'dz'=>'نقل العفش',      'tzm'=>'Aɣerruy'],
        'Soudure'       => ['fr'=>'Soudure',       'ar'=>'اللحام',         'en'=>'Welding',           'dz'=>'اللحام',         'tzm'=>'Allaḥ'],
        'Carrelage'     => ['fr'=>'Carrelage',     'ar'=>'تركيب البلاط',  'en'=>'Tiling',            'dz'=>'الكاريلاج',      'tzm'=>'Akarralag'],
        'Vitrerie'      => ['fr'=>'Vitrerie',      'ar'=>'الزجاج',         'en'=>'Glazing',           'dz'=>'الزجاج',         'tzm'=>'Azajaj'],
        'Chauffage'     => ['fr'=>'Chauffage',     'ar'=>'التدفئة',        'en'=>'Heating',           'dz'=>'التدفية',        'tzm'=>'Asusem'],
        'Décoration'    => ['fr'=>'Décoration',    'ar'=>'الديكور',        'en'=>'Decoration',        'dz'=>'الديكور',        'tzm'=>'Aseggem'],
        'Nettoyage'     => ['fr'=>'Nettoyage',     'ar'=>'التنظيف',        'en'=>'Cleaning',          'dz'=>'النضافة',        'tzm'=>'Asiggen'],
        'Charpenterie'  => ['fr'=>'Charpenterie',  'ar'=>'النجارة الثقيلة','en'=>'Framework',         'dz'=>'الشاربنتة',      'tzm'=>'Tanajart'],
        'Aluminium'     => ['fr'=>'Aluminium',     'ar'=>'الألمنيوم',      'en'=>'Aluminium',         'dz'=>'الألمنيوم',      'tzm'=>'Aluminium'],
        'Ferronnerie'   => ['fr'=>'Ferronnerie',   'ar'=>'الحدادة الفنية', 'en'=>'Ironwork',          'dz'=>'الحدادة',        'tzm'=>'Aḥdad'],
        'Cuisine'       => ['fr'=>'Cuisine',       'ar'=>'الطبخ',          'en'=>'Cooking',           'dz'=>'الطيبة',         'tzm'=>'Adif'],
        'Coiffure'      => ['fr'=>'Coiffure',      'ar'=>'الحلاقة',        'en'=>'Hairdressing',      'dz'=>'الكوافير',       'tzm'=>'Talaqqayt'],
        'Photographie'  => ['fr'=>'Photographie',  'ar'=>'التصوير',        'en'=>'Photography',       'dz'=>'التصوير',        'tzm'=>'Tasuqelt'],
    ];

    public function handle(): int
    {
        $categories = Category::all();
        $force      = $this->option('force');
        $translated  = 0;
        $skipped     = 0;

        foreach ($categories as $category) {
            if (! $force && ! empty($category->translations)) {
                $skipped++;
                continue;
            }

            // First: check known translations dict (instant, no API call)
            $found = null;
            foreach (self::KNOWN as $key => $langs) {
                if (mb_strtolower($category->name) === mb_strtolower($key)) {
                    $found = $langs;
                    break;
                }
            }

            if ($found) {
                $category->update(['translations' => $found]);
                $this->line("  ✓ {$category->name} → known translations applied");
                $translated++;
                continue;
            }

            // Fallback: call MyMemory API for unknown categories
            $translations = $this->translateViaApi($category->name);
            if ($translations) {
                $category->update(['translations' => $translations]);
                $this->line("  ✓ {$category->name} → API translations applied");
                $translated++;
                sleep(1); // Rate limit: 1 req/sec
            } else {
                $category->update(['translations' => ['fr' => $category->name, 'ar' => $category->name, 'en' => $category->name, 'dz' => $category->name, 'tzm' => $category->name]]);
                $this->warn("  ⚠ {$category->name} → API failed, kept original name");
                $translated++;
            }
        }

        $this->info("Done. {$translated} translated, {$skipped} skipped.");

        return self::SUCCESS;
    }

    private function translateViaApi(string $text): ?array
    {
        $pairs = ['fr|ar', 'fr|en', 'fr|ar', 'fr|ar'];
        $results = ['fr' => $text];

        foreach ([
            'ar'  => 'fr|ar',
            'en'  => 'fr|en',
            'dz'  => 'fr|ar',
            'tzm' => 'fr|ar',
        ] as $lang => $pair) {
            try {
                $resp = Http::timeout(5)->get('https://api.mymemory.translated.net/get', [
                    'q'        => $text,
                    'langpair' => $pair,
                ]);

                if ($resp->successful()) {
                    $translated = $resp->json('responseData.translatedText');
                    $results[$lang] = $translated ?: $text;
                } else {
                    $results[$lang] = $text;
                }
            } catch (\Throwable) {
                $results[$lang] = $text;
            }
        }

        return $results;
    }
}
