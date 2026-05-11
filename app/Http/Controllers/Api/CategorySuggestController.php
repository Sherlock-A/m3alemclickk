<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class CategorySuggestController extends Controller
{
    // Built-in translations for common trades
    private const KNOWN = [
        'سباكة'          => ['fr'=>'Plomberie',     'ar'=>'السباكة',        'en'=>'Plumbing',         'dz'=>'السباكة',        'tzm'=>'Tasebbakt',  'icon'=>'🔧'],
        'السباكة'        => ['fr'=>'Plomberie',     'ar'=>'السباكة',        'en'=>'Plumbing',         'dz'=>'السباكة',        'tzm'=>'Tasebbakt',  'icon'=>'🔧'],
        'كهرباء'         => ['fr'=>'Électricité',   'ar'=>'الكهرباء',       'en'=>'Electricity',      'dz'=>'الكهرباء',       'tzm'=>'Taɣlit',     'icon'=>'⚡'],
        'الكهرباء'       => ['fr'=>'Électricité',   'ar'=>'الكهرباء',       'en'=>'Electricity',      'dz'=>'الكهرباء',       'tzm'=>'Taɣlit',     'icon'=>'⚡'],
        'دهان'           => ['fr'=>'Peinture',      'ar'=>'الدهان',         'en'=>'Painting',         'dz'=>'الدهان',         'tzm'=>'Tasrit',     'icon'=>'🎨'],
        'تكييف'          => ['fr'=>'Climatisation', 'ar'=>'التكييف',        'en'=>'Air Conditioning', 'dz'=>'التكييف',        'tzm'=>'Taɣzi',      'icon'=>'❄️'],
        'نجارة'          => ['fr'=>'Menuiserie',    'ar'=>'النجارة',        'en'=>'Carpentry',        'dz'=>'النجارة',        'tzm'=>'Tanajart',   'icon'=>'🪚'],
        'بناء'           => ['fr'=>'Maçonnerie',    'ar'=>'البناء',         'en'=>'Masonry',          'dz'=>'البنا',          'tzm'=>'Abenniw',    'icon'=>'🧱'],
        'تنظيف'          => ['fr'=>'Nettoyage',     'ar'=>'التنظيف',        'en'=>'Cleaning',         'dz'=>'النضافة',        'tzm'=>'Asiggen',    'icon'=>'🧹'],
        'حدادة'          => ['fr'=>'Ferronnerie',   'ar'=>'الحدادة الفنية', 'en'=>'Ironwork',         'dz'=>'الحدادة',        'tzm'=>'Aḥdad',      'icon'=>'⚙️'],
        'تصوير'          => ['fr'=>'Photographie',  'ar'=>'التصوير',        'en'=>'Photography',      'dz'=>'التصوير',        'tzm'=>'Tasuqelt',   'icon'=>'📷'],
        'معلوماتية'      => ['fr'=>'Informatique',  'ar'=>'الإعلام الآلي', 'en'=>'IT / Computing',   'dz'=>'الإعلاميات',     'tzm'=>'Informatique','icon'=>'💻'],
        'كاميرات'        => ['fr'=>'Vidéosurveillance','ar'=>'كاميرات المراقبة','en'=>'CCTV / Security','dz'=>'كاميرات المراقبة','tzm'=>'Cameras',  'icon'=>'📹'],
        'كاميرات المراقبة'=>['fr'=>'Vidéosurveillance','ar'=>'كاميرات المراقبة','en'=>'CCTV / Security','dz'=>'كاميرات المراقبة','tzm'=>'Cameras',  'icon'=>'📹'],
        'اميرات المراقبة'=>['fr'=>'Vidéosurveillance','ar'=>'كاميرات المراقبة','en'=>'CCTV / Security','dz'=>'كاميرات المراقبة','tzm'=>'Cameras',  'icon'=>'📹'],
        'مراقبة'         => ['fr'=>'Vidéosurveillance','ar'=>'كاميرات المراقبة','en'=>'CCTV / Security','dz'=>'كاميرات المراقبة','tzm'=>'Cameras',  'icon'=>'📹'],
        'انترنت'         => ['fr'=>'Internet / Réseau','ar'=>'الإنترنت والشبكات','en'=>'Internet & Networks','dz'=>'الإنترنت','tzm'=>'Internet',  'icon'=>'📡'],
        'مصعد'           => ['fr'=>'Ascenseur',     'ar'=>'المصعد',         'en'=>'Elevator',         'dz'=>'المصعد',         'tzm'=>'Asankur',    'icon'=>'🛗'],
        'زليج'           => ['fr'=>'Carrelage',     'ar'=>'تركيب البلاط',  'en'=>'Tiling',           'dz'=>'الكاريلاج',      'tzm'=>'Akarralag',  'icon'=>'🪟'],
    ];

    public function suggest(Request $request)
    {
        $request->validate(['name' => ['required', 'string', 'min:2', 'max:100']]);

        $inputName = trim($request->input('name'));

        // 1. Check if category already exists (exact or close match)
        $existing = Category::where('name', $inputName)
            ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(translations, '$.fr')) = ?", [$inputName])
            ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(translations, '$.ar')) = ?", [$inputName])
            ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(translations, '$.en')) = ?", [$inputName])
            ->first();

        if ($existing) {
            return response()->json([
                'category' => $existing,
                'created'  => false,
            ]);
        }

        // 2. Detect language and build translations
        $translations = $this->buildTranslations($inputName);
        $icon = $this->detectIcon($inputName, $translations['fr'] ?? $inputName);

        // Use French name for slug/name if detected, else keep original
        $canonicalName = $translations['fr'] ?? $inputName;

        // 3. Create the category (pending review by admin, but immediately usable)
        $category = Category::create([
            'name'         => $canonicalName,
            'icon'         => $icon,
            'active'       => true,
            'translations' => $translations,
            'sort_order'   => 999,
        ]);

        Cache::forget('categories_active');

        return response()->json([
            'category' => $category,
            'created'  => true,
        ], 201);
    }

    private function buildTranslations(string $input): array
    {
        // Check known dictionary
        $lower = mb_strtolower(trim($input));
        foreach (self::KNOWN as $key => $langs) {
            if (mb_strtolower($key) === $lower) {
                return collect($langs)->except('icon')->toArray();
            }
        }

        // Detect language by character range
        $lang = $this->detectLang($input);

        $results = [$lang => $input];

        // Translate to missing languages via MyMemory
        $targets = ['fr', 'ar', 'en'];
        foreach ($targets as $target) {
            if ($target === $lang) continue;
            $translated = $this->translateViaApi($input, $lang, $target);
            $results[$target] = $translated ?? $input;
        }

        // Darija ≈ Arabic for now
        $results['dz']  = $results['ar'] ?? $input;
        $results['tzm'] = $results['fr'] ?? $input;

        return $results;
    }

    private function detectLang(string $text): string
    {
        // Arabic Unicode range
        if (preg_match('/[\x{0600}-\x{06FF}]/u', $text)) return 'ar';
        // Latin characters → French default
        return 'fr';
    }

    private function detectIcon(string $input, string $frName): string
    {
        $search = mb_strtolower($input . ' ' . $frName);
        $map = [
            'surveil' => '📹', 'camera' => '📹', 'caméra' => '📹', 'cctv' => '📹', 'مراقبة' => '📹',
            'plomb' => '🔧', 'sbaak' => '🔧',
            'elect' => '⚡', 'كهرب' => '⚡',
            'peintu' => '🎨', 'دهان' => '🎨',
            'clim' => '❄️', 'تكيي' => '❄️',
            'menuis' => '🪚', 'نجار' => '🪚',
            'maçon' => '🧱', 'بناء' => '🧱',
            'nettoy' => '🧹', 'ménage' => '🧹',
            'inform' => '💻', 'internet' => '📡',
            'photo' => '📷', 'تصوير' => '📷',
            'jardin' => '🌿',
            'déménag' => '📦',
            'carrel' => '🪟',
            'coffre' => '✂️', 'coiffu' => '✂️',
        ];

        foreach ($map as $keyword => $icon) {
            if (str_contains($search, $keyword)) return $icon;
        }

        return '🔨'; // default
    }

    private function translateViaApi(string $text, string $from, string $to): ?string
    {
        try {
            $resp = Http::timeout(5)->get('https://api.mymemory.translated.net/get', [
                'q'        => $text,
                'langpair' => "{$from}|{$to}",
            ]);

            if ($resp->successful()) {
                $translated = $resp->json('responseData.translatedText');
                return $translated ?: null;
            }
        } catch (\Throwable) {}

        return null;
    }
}
