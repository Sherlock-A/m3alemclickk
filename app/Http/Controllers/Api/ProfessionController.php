<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfessionController extends Controller
{
    private const PROFESSIONS = [
        // Plomberie ──────────────────────────────────────────────────────────
        ['label' => 'Plombier',              'label_ar' => 'سباك',                   'category' => 'Plomberie',     'category_ar' => 'السباكة',          'keywords' => ['plomb'],                     'keywords_ar' => ['سباك','سبك','sabak']],
        ['label' => 'Plombier Sanitaire',    'label_ar' => 'سباك صحي',               'category' => 'Plomberie',     'category_ar' => 'السباكة',          'keywords' => ['plomb','sanit'],             'keywords_ar' => ['سباك','صحي','sabak']],
        ['label' => 'Plombier Chauffagiste', 'label_ar' => 'سباك تدفئة',             'category' => 'Plomberie',     'category_ar' => 'السباكة',          'keywords' => ['plomb','chauff'],            'keywords_ar' => ['سباك','تدفئة','sabak']],
        ['label' => 'Plombier Dépannage',    'label_ar' => 'سباك مناوبة',            'category' => 'Plomberie',     'category_ar' => 'السباكة',          'keywords' => ['plomb','depann'],            'keywords_ar' => ['سباك','مناوبة','طوارئ']],
        ['label' => 'Plombier Rénovation',   'label_ar' => 'سباك ترميم',             'category' => 'Plomberie',     'category_ar' => 'السباكة',          'keywords' => ['plomb','renov'],             'keywords_ar' => ['سباك','ترميم']],
        // Electricité ────────────────────────────────────────────────────────
        ['label' => 'Électricien',           'label_ar' => 'كهربائي',                'category' => 'Electricite',   'category_ar' => 'الكهرباء',         'keywords' => ['electri'],                   'keywords_ar' => ['كهربائي','كهرب','kahrab']],
        ['label' => 'Électricien Général',   'label_ar' => 'كهربائي عام',            'category' => 'Electricite',   'category_ar' => 'الكهرباء',         'keywords' => ['electri'],                   'keywords_ar' => ['كهربائي','كهرب']],
        ['label' => 'Électricien Bâtiment',  'label_ar' => 'كهربائي بناء',           'category' => 'Electricite',   'category_ar' => 'الكهرباء',         'keywords' => ['electri','batim'],           'keywords_ar' => ['كهربائي','بناء']],
        ['label' => 'Électricien Industriel','label_ar' => 'كهربائي صناعي',          'category' => 'Electricite',   'category_ar' => 'الكهرباء',         'keywords' => ['electri','indus'],           'keywords_ar' => ['كهربائي','صناعي']],
        ['label' => 'Électricien Dépannage', 'label_ar' => 'كهربائي مناوبة',         'category' => 'Electricite',   'category_ar' => 'الكهرباء',         'keywords' => ['electri','depann'],          'keywords_ar' => ['كهربائي','مناوبة','طوارئ']],
        // Peinture ───────────────────────────────────────────────────────────
        ['label' => 'Peintre Bâtiment',      'label_ar' => 'طلاء بناء',              'category' => 'Peinture',      'category_ar' => 'الطلاء',           'keywords' => ['peintr','batim'],            'keywords_ar' => ['طلاء','دهان','talaa']],
        ['label' => 'Peintre Décorateur',    'label_ar' => 'طلاء ديكور',             'category' => 'Peinture',      'category_ar' => 'الطلاء',           'keywords' => ['peintr','decor'],            'keywords_ar' => ['طلاء','ديكور']],
        ['label' => 'Peintre Intérieur',     'label_ar' => 'طلاء داخلي',             'category' => 'Peinture',      'category_ar' => 'الطلاء',           'keywords' => ['peintr','inter'],            'keywords_ar' => ['طلاء','داخلي']],
        ['label' => 'Peintre Façade',        'label_ar' => 'طلاء واجهات',            'category' => 'Peinture',      'category_ar' => 'الطلاء',           'keywords' => ['peintr','facad'],            'keywords_ar' => ['طلاء','واجهة']],
        // Climatisation ──────────────────────────────────────────────────────
        ['label' => 'Technicien Climatisation','label_ar' => 'تقني تكييف',           'category' => 'Climatisation', 'category_ar' => 'التكييف',          'keywords' => ['clim','tech','froid'],       'keywords_ar' => ['تكييف','تقني','takiif']],
        ['label' => 'Technicien Froid et Clim','label_ar' => 'تقني تبريد وتكييف',   'category' => 'Climatisation', 'category_ar' => 'التكييف',          'keywords' => ['clim','froid','tech'],       'keywords_ar' => ['تكييف','تبريد','تقني']],
        ['label' => 'Technicien HVAC',       'label_ar' => 'تقني HVAC',              'category' => 'Climatisation', 'category_ar' => 'التكييف',          'keywords' => ['hvac','clim','tech'],        'keywords_ar' => ['hvac','تكييف','تقني']],
        ['label' => 'Installateur Clim',     'label_ar' => 'مثبت تكييف',             'category' => 'Climatisation', 'category_ar' => 'التكييف',          'keywords' => ['clim','instal'],             'keywords_ar' => ['تكييف','تثبيت']],
        // Menuiserie ─────────────────────────────────────────────────────────
        ['label' => 'Menuisier Bois',        'label_ar' => 'نجار خشب',               'category' => 'Menuiserie',    'category_ar' => 'النجارة',          'keywords' => ['menuisi','bois'],            'keywords_ar' => ['نجار','خشب','najar']],
        ['label' => 'Menuisier Aluminium',   'label_ar' => 'نجار ألومنيوم',          'category' => 'Menuiserie',    'category_ar' => 'النجارة',          'keywords' => ['menuisi','alum'],            'keywords_ar' => ['نجار','ألومنيوم']],
        ['label' => 'Menuisier PVC',         'label_ar' => 'نجار PVC',               'category' => 'Menuiserie',    'category_ar' => 'النجارة',          'keywords' => ['menuisi','pvc'],             'keywords_ar' => ['نجار','pvc']],
        ['label' => 'Menuisier Décoration',  'label_ar' => 'نجار ديكور',             'category' => 'Menuiserie',    'category_ar' => 'النجارة',          'keywords' => ['menuisi','decor'],           'keywords_ar' => ['نجار','ديكور']],
        ['label' => 'Charpentier Menuisier', 'label_ar' => 'نجار بناء',              'category' => 'Menuiserie',    'category_ar' => 'النجارة',          'keywords' => ['charpen','menuisi'],         'keywords_ar' => ['نجار','بناء']],
        // Ménage ─────────────────────────────────────────────────────────────
        ['label' => 'Femme de ménage',       'label_ar' => 'عاملة منزلية',           'category' => 'Menage',        'category_ar' => 'التنظيف المنزلي',  'keywords' => ['menage','femme'],            'keywords_ar' => ['عاملة','منزلية','تنظيف','menage']],
        ['label' => 'Aide ménagère',         'label_ar' => 'مساعدة منزلية',          'category' => 'Menage',        'category_ar' => 'التنظيف المنزلي',  'keywords' => ['menage','aide'],             'keywords_ar' => ['مساعدة','منزلية','تنظيف']],
        ['label' => 'Service ménage domicile','label_ar' => 'خدمة تنظيف منزلي',     'category' => 'Menage',        'category_ar' => 'التنظيف المنزلي',  'keywords' => ['menage','domicil'],          'keywords_ar' => ['تنظيف','منزل','خدمة']],
        // Maçonnerie ─────────────────────────────────────────────────────────
        ['label' => 'Maçon',                 'label_ar' => 'بنّاء',                   'category' => 'Maconnerie',    'category_ar' => 'البناء',           'keywords' => ['macon'],                     'keywords_ar' => ['بناء','بنا','macon']],
        ['label' => 'Maçon Rénovateur',      'label_ar' => 'بنّاء ترميم',             'category' => 'Maconnerie',    'category_ar' => 'البناء',           'keywords' => ['macon','renov'],             'keywords_ar' => ['بناء','ترميم']],
        ['label' => 'Maçon Constructeur',    'label_ar' => 'مقاول بناء',             'category' => 'Maconnerie',    'category_ar' => 'البناء',           'keywords' => ['macon','constr'],            'keywords_ar' => ['بناء','مقاول','إنشاء']],
        ['label' => 'Carreleur Maçon',       'label_ar' => 'بنّاء ورصاف',            'category' => 'Maconnerie',    'category_ar' => 'البناء',           'keywords' => ['macon','carrel'],            'keywords_ar' => ['بناء','بلاط','رصاف']],
        // Plâtrerie ──────────────────────────────────────────────────────────
        ['label' => 'Plâtrier',              'label_ar' => 'جصاص',                   'category' => 'Maconnerie',    'category_ar' => 'البناء',           'keywords' => ['platr','platri','gyps'],     'keywords_ar' => ['جصاص','جص','platr']],
        ['label' => 'Plâtrier Finition',     'label_ar' => 'جصاص تشطيب',             'category' => 'Maconnerie',    'category_ar' => 'البناء',           'keywords' => ['platr','fini'],              'keywords_ar' => ['جصاص','تشطيب']],
        // Serrurerie ─────────────────────────────────────────────────────────
        ['label' => 'Serrurier',             'label_ar' => 'حداد أقفال',             'category' => 'Serrurerie',    'category_ar' => 'الأقفال',          'keywords' => ['serrur'],                    'keywords_ar' => ['أقفال','حداد','serrur']],
        ['label' => 'Serrurier Urgence 24h', 'label_ar' => 'حداد أقفال طارئ 24ساعة','category' => 'Serrurerie',    'category_ar' => 'الأقفال',          'keywords' => ['serrur','urgent'],           'keywords_ar' => ['أقفال','طارئ','طوارئ']],
        ['label' => 'Serrurier Blindage',    'label_ar' => 'حداد أقفال مدرعة',       'category' => 'Serrurerie',    'category_ar' => 'الأقفال',          'keywords' => ['serrur','blind'],            'keywords_ar' => ['أقفال','تدريع','مدرعة']],
        // Jardinage ──────────────────────────────────────────────────────────
        ['label' => 'Jardinier',             'label_ar' => 'بستاني',                 'category' => 'Jardinage',     'category_ar' => 'الحدائق',          'keywords' => ['jardin'],                    'keywords_ar' => ['بستاني','حديقة','jardinage']],
        ['label' => 'Paysagiste Jardinier',  'label_ar' => 'مهندس حدائق',            'category' => 'Jardinage',     'category_ar' => 'الحدائق',          'keywords' => ['paysag','jardin'],           'keywords_ar' => ['حدائق','مهندس','بستاني']],
        ['label' => 'Jardinier Entretien',   'label_ar' => 'بستاني صيانة',           'category' => 'Jardinage',     'category_ar' => 'الحدائق',          'keywords' => ['jardin','entret'],           'keywords_ar' => ['بستاني','صيانة','حدائق']],
        // Informatique ───────────────────────────────────────────────────────
        ['label' => 'Technicien Informatique','label_ar' => 'تقني معلوميات',         'category' => 'Informatique',  'category_ar' => 'الإعلاميات',       'keywords' => ['info','tech'],               'keywords_ar' => ['معلوميات','تقني','إعلاميات','info']],
        ['label' => 'Technicien Réseau',     'label_ar' => 'تقني شبكات',             'category' => 'Informatique',  'category_ar' => 'الإعلاميات',       'keywords' => ['reseau','tech','info'],      'keywords_ar' => ['شبكات','تقني','معلوميات']],
        ['label' => 'Support Informatique',  'label_ar' => 'دعم تقني معلوميات',      'category' => 'Informatique',  'category_ar' => 'الإعلاميات',       'keywords' => ['info','support'],            'keywords_ar' => ['دعم','معلوميات','تقني']],
        ['label' => 'Développeur Web',       'label_ar' => 'مطور ويب',               'category' => 'Informatique',  'category_ar' => 'الإعلاميات',       'keywords' => ['dev','web','info'],          'keywords_ar' => ['مطور','ويب','web']],
        // Déménagement ───────────────────────────────────────────────────────
        ['label' => 'Déménageur',            'label_ar' => 'ناقل عفش',               'category' => 'Demenagement',  'category_ar' => 'النقل',            'keywords' => ['demena'],                    'keywords_ar' => ['نقل','عفش','demena']],
        ['label' => 'Déménageur Pro',        'label_ar' => 'ناقل عفش محترف',         'category' => 'Demenagement',  'category_ar' => 'النقل',            'keywords' => ['demena','pro'],              'keywords_ar' => ['نقل','عفش','محترف']],
        // Soudure ────────────────────────────────────────────────────────────
        ['label' => 'Soudeur',               'label_ar' => 'لحام',                   'category' => 'Soudure',       'category_ar' => 'اللحام',           'keywords' => ['soud'],                      'keywords_ar' => ['لحام','لحم','soud']],
        ['label' => 'Soudeur Métalliste',    'label_ar' => 'لحام معدن',              'category' => 'Soudure',       'category_ar' => 'اللحام',           'keywords' => ['soud','metal'],              'keywords_ar' => ['لحام','معدن']],
        ['label' => 'Ferronnier',            'label_ar' => 'حداد',                   'category' => 'Soudure',       'category_ar' => 'اللحام',           'keywords' => ['ferronn','metal'],           'keywords_ar' => ['حداد','حدادة','ferronn']],
        // Carrelage ──────────────────────────────────────────────────────────
        ['label' => 'Carreleur',             'label_ar' => 'رصاف',                   'category' => 'Carrelage',     'category_ar' => 'البلاط',           'keywords' => ['carrel'],                    'keywords_ar' => ['رصاف','بلاط','carrelage']],
        ['label' => 'Carreleur Faïenceur',   'label_ar' => 'رصاف فيانس',             'category' => 'Carrelage',     'category_ar' => 'البلاط',           'keywords' => ['carrel','faien'],            'keywords_ar' => ['رصاف','فيانس','بلاط']],
        ['label' => 'Carreleur Marbre',      'label_ar' => 'رصاف رخام',              'category' => 'Carrelage',     'category_ar' => 'البلاط',           'keywords' => ['carrel','marbre'],           'keywords_ar' => ['رصاف','رخام','بلاط']],
        // Vitrerie ───────────────────────────────────────────────────────────
        ['label' => 'Vitrier',               'label_ar' => 'زجاج',                   'category' => 'Vitrerie',      'category_ar' => 'الزجاج',           'keywords' => ['vitr'],                      'keywords_ar' => ['زجاج','زجا','vitr']],
        ['label' => 'Vitrier Double Vitrage','label_ar' => 'زجاج مزدوج',             'category' => 'Vitrerie',      'category_ar' => 'الزجاج',           'keywords' => ['vitr','double'],             'keywords_ar' => ['زجاج','مزدوج']],
        // Chauffage ──────────────────────────────────────────────────────────
        ['label' => 'Chauffagiste',          'label_ar' => 'تقني تدفئة',             'category' => 'Chauffage',     'category_ar' => 'التدفئة',          'keywords' => ['chauff'],                    'keywords_ar' => ['تدفئة','تقني','chauff']],
        ['label' => 'Tech Chauffage Gaz',    'label_ar' => 'تقني تدفئة غاز',         'category' => 'Chauffage',     'category_ar' => 'التدفئة',          'keywords' => ['chauff','gaz'],              'keywords_ar' => ['تدفئة','غاز','تقني']],
        ['label' => 'Installateur Chaudière','label_ar' => 'مثبت مرجل تدفئة',        'category' => 'Chauffage',     'category_ar' => 'التدفئة',          'keywords' => ['chauff','chaudier'],         'keywords_ar' => ['تدفئة','مرجل','تثبيت']],
        // Décoration ─────────────────────────────────────────────────────────
        ['label' => 'Décorateur Intérieur',  'label_ar' => 'مزين داخلي',             'category' => 'Decoration',    'category_ar' => 'الديكور',          'keywords' => ['decor','inter'],             'keywords_ar' => ['ديكور','داخلي','تزيين']],
        ['label' => 'Designer Intérieur',    'label_ar' => 'مصمم داخلي',             'category' => 'Decoration',    'category_ar' => 'الديكور',          'keywords' => ['design','inter'],            'keywords_ar' => ['ديكور','تصميم','داخلي']],
        ['label' => 'Architecte Décorateur', 'label_ar' => 'مهندس ديكور',            'category' => 'Decoration',    'category_ar' => 'الديكور',          'keywords' => ['archi','decor'],             'keywords_ar' => ['ديكور','مهندس','معماري']],
        // Nettoyage ──────────────────────────────────────────────────────────
        ['label' => 'Agent de Nettoyage',    'label_ar' => 'عامل تنظيف',             'category' => 'Nettoyage',     'category_ar' => 'التنظيف',          'keywords' => ['nettoy'],                    'keywords_ar' => ['تنظيف','عامل','nettoyage']],
        ['label' => 'Nettoyage Professionnel','label_ar' => 'تنظيف احترافي',         'category' => 'Nettoyage',     'category_ar' => 'التنظيف',          'keywords' => ['nettoy','pro'],              'keywords_ar' => ['تنظيف','احترافي']],
        ['label' => 'Nettoyage Après Chantier','label_ar' => 'تنظيف ما بعد البناء',  'category' => 'Nettoyage',     'category_ar' => 'التنظيف',          'keywords' => ['nettoy','chant'],            'keywords_ar' => ['تنظيف','بناء','ورشة']],
        // Charpenterie ───────────────────────────────────────────────────────
        ['label' => 'Charpentier Couvreur',  'label_ar' => 'نجار تسقيف',             'category' => 'Charpenterie',  'category_ar' => 'النجارة الخشبية',  'keywords' => ['charpen','couvreur'],        'keywords_ar' => ['تسقيف','نجار','سقف']],
        ['label' => 'Couvreur Zingueur',     'label_ar' => 'مقاول تسقيف',            'category' => 'Charpenterie',  'category_ar' => 'النجارة الخشبية',  'keywords' => ['couvreur','zingu'],          'keywords_ar' => ['تسقيف','مقاول','سقف']],
        // Coiffure ───────────────────────────────────────────────────────────
        ['label' => 'Coiffeur à Domicile',   'label_ar' => 'حلاق متنقل',             'category' => 'Coiffure',      'category_ar' => 'الحلاقة',          'keywords' => ['coiff','domicil'],           'keywords_ar' => ['حلاق','متنقل','حلاقة']],
        ['label' => 'Coiffeuse Visagiste',   'label_ar' => 'حلاقة ومكياج',           'category' => 'Coiffure',      'category_ar' => 'الحلاقة',          'keywords' => ['coiff','visag'],             'keywords_ar' => ['حلاقة','مكياج','تزيين']],
        ['label' => 'Coiffeuse Mariage',     'label_ar' => 'حلاقة أعراس',            'category' => 'Coiffure',      'category_ar' => 'الحلاقة',          'keywords' => ['coiff','mariage'],           'keywords_ar' => ['حلاقة','أعراس','زفاف']],
        ['label' => 'Barbier',               'label_ar' => 'حلاق',                   'category' => 'Coiffure',      'category_ar' => 'الحلاقة',          'keywords' => ['barbier','coiff'],           'keywords_ar' => ['حلاق','barbier','حلاقة']],
        // Photographie ───────────────────────────────────────────────────────
        ['label' => 'Photographe Événements','label_ar' => 'مصور فعاليات',           'category' => 'Photographie',  'category_ar' => 'التصوير',          'keywords' => ['photo','event'],             'keywords_ar' => ['مصور','فعاليات','تصوير']],
        ['label' => 'Photographe Mariages',  'label_ar' => 'مصور أعراس',             'category' => 'Photographie',  'category_ar' => 'التصوير',          'keywords' => ['photo','mariage'],           'keywords_ar' => ['مصور','أعراس','زفاف']],
        ['label' => 'Photographe Studio',    'label_ar' => 'مصور ستوديو',            'category' => 'Photographie',  'category_ar' => 'التصوير',          'keywords' => ['photo','studio'],            'keywords_ar' => ['مصور','ستوديو','تصوير']],
    ];

    public function autocomplete(Request $request)
    {
        $q = $request->string('q')->trim()->toString();
        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $norm   = $this->norm($q);
        $isAr   = (bool) preg_match('/[\x{0600}-\x{06FF}]/u', $q);
        $results = [];

        foreach (self::PROFESSIONS as $p) {
            $score = 0;

            if ($isAr) {
                // ── Arabic search ──────────────────────────────────────────
                $labelNorm = $this->normAr($p['label_ar']);
                $catNorm   = $this->normAr($p['category_ar']);
                $qNorm     = $this->normAr($q);

                if ($labelNorm === $qNorm)                            { $score = 100; }
                elseif (mb_strpos($labelNorm, $qNorm) === 0)          { $score = 80;  }
                elseif (mb_strpos($labelNorm, $qNorm) !== false)      { $score = 60;  }
                elseif (mb_strpos($catNorm, $qNorm) !== false)        { $score = 50;  }
                else {
                    foreach ($p['keywords_ar'] as $kw) {
                        $kwNorm = $this->normAr($kw);
                        if (mb_strpos($kwNorm, $qNorm) === 0 || mb_strpos($qNorm, $kwNorm) === 0) {
                            $score = 40;
                            break;
                        }
                    }
                }
            } else {
                // ── French search (existing logic) ─────────────────────────
                $labelNorm = $this->norm($p['label']);
                $catNorm   = $this->norm($p['category']);

                if ($labelNorm === $norm)                                { $score = 100; }
                elseif (str_starts_with($labelNorm, $norm))              { $score = 80;  }
                elseif (str_contains($labelNorm, $norm))                 { $score = 60;  }
                elseif (str_contains($catNorm, $norm))                   { $score = 50;  }
                else {
                    foreach ($p['keywords'] as $kw) {
                        if (str_starts_with($norm, $kw) || str_starts_with($kw, $norm)) {
                            $score = 40;
                            break;
                        }
                    }
                }
            }

            if ($score > 0) {
                $results[] = [
                    'label'       => $p['label'],
                    'label_ar'    => $p['label_ar'],
                    'category'    => $p['category'],
                    'category_ar' => $p['category_ar'],
                    'score'       => $score,
                ];
            }
        }

        usort($results, fn ($a, $b) => $b['score'] <=> $a['score'] ?: strcmp($a['label'], $b['label']));

        return response()->json(array_slice($results, 0, 8));
    }

    private function norm(string $s): string
    {
        $from = ['é','è','ê','ë','à','â','ä','ô','ö','ù','û','ü','î','ï','ç','É','È','Ê','Ë','À','Â','Ä','Ô','Ö','Ù','Û','Ü','Î','Ï','Ç'];
        $to   = ['e','e','e','e','a','a','a','o','o','u','u','u','i','i','c','e','e','e','e','a','a','a','o','o','u','u','u','i','i','c'];
        return mb_strtolower(str_replace($from, $to, $s), 'UTF-8');
    }

    private function normAr(string $s): string
    {
        // Strip Arabic diacritics (tashkeel) for fuzzy matching
        return preg_replace('/[\x{064B}-\x{065F}\x{0670}]/u', '', mb_strtolower($s, 'UTF-8')) ?? $s;
    }
}
