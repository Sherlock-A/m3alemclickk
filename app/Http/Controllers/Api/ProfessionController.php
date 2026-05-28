<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfessionController extends Controller
{
    private const PROFESSIONS = [
        // ── Plomberie ────────────────────────────────────────────────────────
        ['label' => 'Plombier',               'label_ar' => 'سباك',                    'category' => 'Plomberie',        'category_ar' => 'السباكة',              'keywords' => ['plomb'],                         'keywords_ar' => ['سباك','سبك']],
        ['label' => 'Plombier Sanitaire',     'label_ar' => 'سباك صحي',                'category' => 'Plomberie',        'category_ar' => 'السباكة',              'keywords' => ['plomb','sanit'],                 'keywords_ar' => ['سباك','صحي']],
        ['label' => 'Plombier Chauffagiste',  'label_ar' => 'سباك تدفئة',              'category' => 'Plomberie',        'category_ar' => 'السباكة',              'keywords' => ['plomb','chauff'],                'keywords_ar' => ['سباك','تدفئة']],
        ['label' => 'Plombier Dépannage',     'label_ar' => 'سباك مناوبة',             'category' => 'Plomberie',        'category_ar' => 'السباكة',              'keywords' => ['plomb','depann'],                'keywords_ar' => ['سباك','مناوبة','طوارئ']],
        ['label' => 'Plombier Rénovation',    'label_ar' => 'سباك ترميم',              'category' => 'Plomberie',        'category_ar' => 'السباكة',              'keywords' => ['plomb','renov'],                 'keywords_ar' => ['سباك','ترميم']],
        // ── Electricite ──────────────────────────────────────────────────────
        ['label' => 'Électricien',            'label_ar' => 'كهربائي',                 'category' => 'Electricite',      'category_ar' => 'الكهرباء',             'keywords' => ['electri'],                       'keywords_ar' => ['كهربائي','كهرب']],
        ['label' => 'Électricien Général',    'label_ar' => 'كهربائي عام',             'category' => 'Electricite',      'category_ar' => 'الكهرباء',             'keywords' => ['electri'],                       'keywords_ar' => ['كهربائي']],
        ['label' => 'Électricien Bâtiment',   'label_ar' => 'كهربائي بناء',            'category' => 'Electricite',      'category_ar' => 'الكهرباء',             'keywords' => ['electri','batim'],               'keywords_ar' => ['كهربائي','بناء']],
        ['label' => 'Électricien Industriel', 'label_ar' => 'كهربائي صناعي',           'category' => 'Electricite',      'category_ar' => 'الكهرباء',             'keywords' => ['electri','indus'],               'keywords_ar' => ['كهربائي','صناعي']],
        ['label' => 'Électricien Dépannage',  'label_ar' => 'كهربائي مناوبة',          'category' => 'Electricite',      'category_ar' => 'الكهرباء',             'keywords' => ['electri','depann'],              'keywords_ar' => ['كهربائي','مناوبة','طوارئ']],
        // ── Peinture ─────────────────────────────────────────────────────────
        ['label' => 'Peintre Bâtiment',       'label_ar' => 'طلاء بناء',               'category' => 'Peinture',         'category_ar' => 'الطلاء',               'keywords' => ['peintr','batim'],                'keywords_ar' => ['طلاء','دهان']],
        ['label' => 'Peintre Décorateur',     'label_ar' => 'طلاء ديكور',              'category' => 'Peinture',         'category_ar' => 'الطلاء',               'keywords' => ['peintr','decor'],                'keywords_ar' => ['طلاء','ديكور']],
        ['label' => 'Peintre Intérieur',      'label_ar' => 'طلاء داخلي',              'category' => 'Peinture',         'category_ar' => 'الطلاء',               'keywords' => ['peintr','inter'],                'keywords_ar' => ['طلاء','داخلي']],
        ['label' => 'Peintre Façade',         'label_ar' => 'طلاء واجهات',             'category' => 'Peinture',         'category_ar' => 'الطلاء',               'keywords' => ['peintr','facad'],                'keywords_ar' => ['طلاء','واجهة']],
        // ── Climatisation ────────────────────────────────────────────────────
        ['label' => 'Technicien Climatisation','label_ar' => 'تقني تكييف',             'category' => 'Climatisation',    'category_ar' => 'التكييف',              'keywords' => ['clim','tech','froid'],           'keywords_ar' => ['تكييف','تقني']],
        ['label' => 'Technicien Froid et Clim','label_ar' => 'تقني تبريد وتكييف',     'category' => 'Climatisation',    'category_ar' => 'التكييف',              'keywords' => ['clim','froid','tech'],           'keywords_ar' => ['تكييف','تبريد','تقني']],
        ['label' => 'Technicien HVAC',        'label_ar' => 'تقني HVAC',               'category' => 'Climatisation',    'category_ar' => 'التكييف',              'keywords' => ['hvac','clim','tech'],            'keywords_ar' => ['hvac','تكييف','تقني']],
        ['label' => 'Installateur Clim',      'label_ar' => 'مثبت تكييف',              'category' => 'Climatisation',    'category_ar' => 'التكييف',              'keywords' => ['clim','instal'],                 'keywords_ar' => ['تكييف','تثبيت']],
        // ── Menuiserie ───────────────────────────────────────────────────────
        ['label' => 'Menuisier Bois',         'label_ar' => 'نجار خشب',                'category' => 'Menuiserie',       'category_ar' => 'النجارة',              'keywords' => ['menuisi','bois'],                'keywords_ar' => ['نجار','خشب']],
        ['label' => 'Menuisier Aluminium',    'label_ar' => 'نجار ألومنيوم',           'category' => 'Menuiserie',       'category_ar' => 'النجارة',              'keywords' => ['menuisi','alum'],                'keywords_ar' => ['نجار','ألومنيوم']],
        ['label' => 'Menuisier PVC',          'label_ar' => 'نجار PVC',                'category' => 'Menuiserie',       'category_ar' => 'النجارة',              'keywords' => ['menuisi','pvc'],                 'keywords_ar' => ['نجار','pvc']],
        ['label' => 'Menuisier Décoration',   'label_ar' => 'نجار ديكور',              'category' => 'Menuiserie',       'category_ar' => 'النجارة',              'keywords' => ['menuisi','decor'],               'keywords_ar' => ['نجار','ديكور']],
        ['label' => 'Charpentier Menuisier',  'label_ar' => 'نجار بناء',               'category' => 'Menuiserie',       'category_ar' => 'النجارة',              'keywords' => ['charpen','menuisi'],             'keywords_ar' => ['نجار','بناء']],
        // ── Menage ───────────────────────────────────────────────────────────
        ['label' => 'Femme de ménage',        'label_ar' => 'عاملة منزلية',            'category' => 'Menage',           'category_ar' => 'التنظيف المنزلي',     'keywords' => ['menage','femme'],                'keywords_ar' => ['عاملة','منزلية','تنظيف']],
        ['label' => 'Aide ménagère',          'label_ar' => 'مساعدة منزلية',           'category' => 'Menage',           'category_ar' => 'التنظيف المنزلي',     'keywords' => ['menage','aide'],                 'keywords_ar' => ['مساعدة','منزلية','تنظيف']],
        ['label' => 'Service ménage domicile','label_ar' => 'خدمة تنظيف منزلي',       'category' => 'Menage',           'category_ar' => 'التنظيف المنزلي',     'keywords' => ['menage','domicil'],              'keywords_ar' => ['تنظيف','منزل','خدمة']],
        // ── Maconnerie ───────────────────────────────────────────────────────
        ['label' => 'Maçon',                  'label_ar' => 'بنّاء',                    'category' => 'Maconnerie',       'category_ar' => 'البناء',               'keywords' => ['macon'],                         'keywords_ar' => ['بناء','بنا']],
        ['label' => 'Maçon Rénovateur',       'label_ar' => 'بنّاء ترميم',              'category' => 'Maconnerie',       'category_ar' => 'البناء',               'keywords' => ['macon','renov'],                 'keywords_ar' => ['بناء','ترميم']],
        ['label' => 'Maçon Constructeur',     'label_ar' => 'مقاول بناء',              'category' => 'Maconnerie',       'category_ar' => 'البناء',               'keywords' => ['macon','constr'],                'keywords_ar' => ['بناء','مقاول','إنشاء']],
        // ── Serrurerie ───────────────────────────────────────────────────────
        ['label' => 'Serrurier',              'label_ar' => 'حداد أقفال',              'category' => 'Serrurerie',       'category_ar' => 'الأقفال',              'keywords' => ['serrur'],                        'keywords_ar' => ['أقفال','حداد']],
        ['label' => 'Serrurier Urgence 24h',  'label_ar' => 'حداد أقفال طارئ 24ساعة', 'category' => 'Serrurerie',       'category_ar' => 'الأقفال',              'keywords' => ['serrur','urgent'],               'keywords_ar' => ['أقفال','طارئ','طوارئ']],
        ['label' => 'Serrurier Blindage',     'label_ar' => 'حداد أقفال مدرعة',        'category' => 'Serrurerie',       'category_ar' => 'الأقفال',              'keywords' => ['serrur','blind'],                'keywords_ar' => ['أقفال','تدريع']],
        // ── Jardinage ────────────────────────────────────────────────────────
        ['label' => 'Jardinier',              'label_ar' => 'بستاني',                  'category' => 'Jardinage',        'category_ar' => 'الحدائق',              'keywords' => ['jardin'],                        'keywords_ar' => ['بستاني','حديقة']],
        ['label' => 'Paysagiste Jardinier',   'label_ar' => 'مهندس حدائق',             'category' => 'Jardinage',        'category_ar' => 'الحدائق',              'keywords' => ['paysag','jardin'],               'keywords_ar' => ['حدائق','مهندس','بستاني']],
        ['label' => 'Jardinier Entretien',    'label_ar' => 'بستاني صيانة',            'category' => 'Jardinage',        'category_ar' => 'الحدائق',              'keywords' => ['jardin','entret'],               'keywords_ar' => ['بستاني','صيانة']],
        // ── Informatique ─────────────────────────────────────────────────────
        ['label' => 'Technicien Informatique','label_ar' => 'تقني معلوميات',           'category' => 'Informatique',     'category_ar' => 'الإعلاميات',           'keywords' => ['info','tech'],                   'keywords_ar' => ['معلوميات','تقني','إعلاميات']],
        ['label' => 'Technicien Réseau',      'label_ar' => 'تقني شبكات',              'category' => 'Informatique',     'category_ar' => 'الإعلاميات',           'keywords' => ['reseau','tech','info'],          'keywords_ar' => ['شبكات','تقني','معلوميات']],
        ['label' => 'Support Informatique',   'label_ar' => 'دعم تقني معلوميات',       'category' => 'Informatique',     'category_ar' => 'الإعلاميات',           'keywords' => ['info','support'],                'keywords_ar' => ['دعم','معلوميات','تقني']],
        // ── Demenagement ─────────────────────────────────────────────────────
        ['label' => 'Déménageur',             'label_ar' => 'ناقل عفش',                'category' => 'Demenagement',     'category_ar' => 'النقل',                'keywords' => ['demena'],                        'keywords_ar' => ['نقل','عفش']],
        ['label' => 'Déménageur Pro',         'label_ar' => 'ناقل عفش محترف',          'category' => 'Demenagement',     'category_ar' => 'النقل',                'keywords' => ['demena','pro'],                  'keywords_ar' => ['نقل','عفش','محترف']],
        ['label' => 'Transport & Déménagement','label_ar' => 'نقل وتحويل',             'category' => 'Demenagement',     'category_ar' => 'النقل',                'keywords' => ['demena','transp'],               'keywords_ar' => ['نقل','تحويل']],
        // ── Soudure ──────────────────────────────────────────────────────────
        ['label' => 'Soudeur',                'label_ar' => 'لحام',                    'category' => 'Soudure',          'category_ar' => 'اللحام',               'keywords' => ['soud'],                          'keywords_ar' => ['لحام','لحم']],
        ['label' => 'Soudeur Métalliste',     'label_ar' => 'لحام معدن',               'category' => 'Soudure',          'category_ar' => 'اللحام',               'keywords' => ['soud','metal'],                  'keywords_ar' => ['لحام','معدن']],
        ['label' => 'Ferronnier Soudeur',     'label_ar' => 'حداد لحام',               'category' => 'Soudure',          'category_ar' => 'اللحام',               'keywords' => ['ferronn','soud','metal'],        'keywords_ar' => ['حداد','لحام']],
        // ── Carrelage ────────────────────────────────────────────────────────
        ['label' => 'Carreleur',              'label_ar' => 'رصاف',                    'category' => 'Carrelage',        'category_ar' => 'البلاط',               'keywords' => ['carrel'],                        'keywords_ar' => ['رصاف','بلاط']],
        ['label' => 'Carreleur Faïenceur',    'label_ar' => 'رصاف فيانس',              'category' => 'Carrelage',        'category_ar' => 'البلاط',               'keywords' => ['carrel','faien'],                'keywords_ar' => ['رصاف','فيانس','بلاط']],
        ['label' => 'Carreleur Marbre',       'label_ar' => 'رصاف رخام',               'category' => 'Carrelage',        'category_ar' => 'البلاط',               'keywords' => ['carrel','marbre'],               'keywords_ar' => ['رصاف','رخام']],
        // ── Vitrerie ─────────────────────────────────────────────────────────
        ['label' => 'Vitrier',                'label_ar' => 'صانع زجاج',               'category' => 'Vitrerie',         'category_ar' => 'الزجاج',               'keywords' => ['vitr'],                          'keywords_ar' => ['زجاج']],
        ['label' => 'Vitrier Double Vitrage', 'label_ar' => 'زجاج مزدوج',              'category' => 'Vitrerie',         'category_ar' => 'الزجاج',               'keywords' => ['vitr','double'],                 'keywords_ar' => ['زجاج','مزدوج']],
        // ── Chauffage ────────────────────────────────────────────────────────
        ['label' => 'Chauffagiste',           'label_ar' => 'تقني تدفئة',              'category' => 'Chauffage',        'category_ar' => 'التدفئة',              'keywords' => ['chauff'],                        'keywords_ar' => ['تدفئة','تقني']],
        ['label' => 'Tech Chauffage Gaz',     'label_ar' => 'تقني تدفئة غاز',          'category' => 'Chauffage',        'category_ar' => 'التدفئة',              'keywords' => ['chauff','gaz'],                  'keywords_ar' => ['تدفئة','غاز']],
        ['label' => 'Installateur Chaudière', 'label_ar' => 'مثبت مرجل تدفئة',         'category' => 'Chauffage',        'category_ar' => 'التدفئة',              'keywords' => ['chauff','chaudier'],             'keywords_ar' => ['تدفئة','مرجل']],
        // ── Decoration ───────────────────────────────────────────────────────
        ['label' => 'Décorateur Intérieur',   'label_ar' => 'مزين داخلي',              'category' => 'Decoration',       'category_ar' => 'الديكور',              'keywords' => ['decor','inter'],                 'keywords_ar' => ['ديكور','داخلي','تزيين']],
        ['label' => 'Designer Intérieur',     'label_ar' => 'مصمم داخلي',              'category' => 'Decoration',       'category_ar' => 'الديكور',              'keywords' => ['design','inter'],                'keywords_ar' => ['ديكور','تصميم','داخلي']],
        ['label' => 'Architecte Décorateur',  'label_ar' => 'مهندس ديكور',             'category' => 'Decoration',       'category_ar' => 'الديكور',              'keywords' => ['archi','decor'],                 'keywords_ar' => ['ديكور','مهندس']],
        // ── Nettoyage ────────────────────────────────────────────────────────
        ['label' => 'Agent de Nettoyage',     'label_ar' => 'عامل تنظيف',              'category' => 'Nettoyage',        'category_ar' => 'التنظيف',              'keywords' => ['nettoy'],                        'keywords_ar' => ['تنظيف','عامل']],
        ['label' => 'Nettoyage Professionnel','label_ar' => 'تنظيف احترافي',           'category' => 'Nettoyage',        'category_ar' => 'التنظيف',              'keywords' => ['nettoy','pro'],                  'keywords_ar' => ['تنظيف','احترافي']],
        ['label' => 'Nettoyage Après Chantier','label_ar' => 'تنظيف ما بعد البناء',   'category' => 'Nettoyage',        'category_ar' => 'التنظيف',              'keywords' => ['nettoy','chant'],                'keywords_ar' => ['تنظيف','بناء']],
        // ── Charpenterie ─────────────────────────────────────────────────────
        ['label' => 'Charpentier Couvreur',   'label_ar' => 'نجار تسقيف',              'category' => 'Charpenterie',     'category_ar' => 'النجارة الخشبية',      'keywords' => ['charpen','couvreur'],            'keywords_ar' => ['تسقيف','نجار','سقف']],
        ['label' => 'Couvreur Zingueur',      'label_ar' => 'مقاول تسقيف',             'category' => 'Charpenterie',     'category_ar' => 'النجارة الخشبية',      'keywords' => ['couvreur','zingu'],              'keywords_ar' => ['تسقيف','مقاول']],
        // ── Coiffure ─────────────────────────────────────────────────────────
        ['label' => 'Coiffeur à Domicile',    'label_ar' => 'حلاق متنقل',              'category' => 'Coiffure',         'category_ar' => 'الحلاقة',              'keywords' => ['coiff','domicil'],               'keywords_ar' => ['حلاق','متنقل','حلاقة']],
        ['label' => 'Coiffeuse Mariage',      'label_ar' => 'حلاقة أعراس',             'category' => 'Coiffure',         'category_ar' => 'الحلاقة',              'keywords' => ['coiff','mariage'],               'keywords_ar' => ['حلاقة','أعراس','زفاف']],
        ['label' => 'Barbier',                'label_ar' => 'حلاق',                    'category' => 'Coiffure',         'category_ar' => 'الحلاقة',              'keywords' => ['barbier','coiff'],               'keywords_ar' => ['حلاق','حلاقة']],
        // ── Photographie ─────────────────────────────────────────────────────
        ['label' => 'Photographe Événements', 'label_ar' => 'مصور فعاليات',            'category' => 'Photographie',     'category_ar' => 'التصوير',              'keywords' => ['photo','event'],                 'keywords_ar' => ['مصور','فعاليات','تصوير']],
        ['label' => 'Photographe Mariages',   'label_ar' => 'مصور أعراس',              'category' => 'Photographie',     'category_ar' => 'التصوير',              'keywords' => ['photo','mariage'],               'keywords_ar' => ['مصور','أعراس']],
        ['label' => 'Photographe Studio',     'label_ar' => 'مصور ستوديو',             'category' => 'Photographie',     'category_ar' => 'التصوير',              'keywords' => ['photo','studio'],                'keywords_ar' => ['مصور','ستوديو']],
        ['label' => 'Vidéaste',               'label_ar' => 'مصور فيديو',              'category' => 'Photographie',     'category_ar' => 'التصوير',              'keywords' => ['video','vid','photo'],           'keywords_ar' => ['فيديو','مصور']],
        // ── Topographie ──────────────────────────────────────────────────────
        ['label' => 'Topographe',             'label_ar' => 'مساح أراضي',              'category' => 'Topographie',      'category_ar' => 'المساحة',              'keywords' => ['topog','mesur'],                 'keywords_ar' => ['مساح','أراضي','مساحة']],
        ['label' => 'Géomètre Expert',        'label_ar' => 'مهندس مساحة',             'category' => 'Topographie',      'category_ar' => 'المساحة',              'keywords' => ['topog','geome','expert'],        'keywords_ar' => ['مهندس','مساحة']],
        // ── Alarme ───────────────────────────────────────────────────────────
        ['label' => 'Technicien Alarme',      'label_ar' => 'تقني إنذار وأمن',         'category' => 'Alarme',           'category_ar' => 'الإنذار والأمن',       'keywords' => ['alarm','secur','sureté'],        'keywords_ar' => ['إنذار','أمن','كاميرا']],
        ['label' => 'Installateur Alarme',    'label_ar' => 'مثبت كاميرات مراقبة',     'category' => 'Alarme',           'category_ar' => 'الإنذار والأمن',       'keywords' => ['alarm','instal','camera'],       'keywords_ar' => ['كاميرا','مراقبة','إنذار']],
        ['label' => 'Technicien Vidéosurveillance','label_ar' => 'تقني كاميرات المراقبة','category' => 'Alarme',          'category_ar' => 'الإنذار والأمن',       'keywords' => ['alarm','camera','video'],        'keywords_ar' => ['كاميرا','مراقبة','تقني']],
        // ── Platrier ─────────────────────────────────────────────────────────
        ['label' => 'Plâtrier',               'label_ar' => 'جصاص',                    'category' => 'Platrier',         'category_ar' => 'الجص والبياض',         'keywords' => ['platr','platri','platrer'],      'keywords_ar' => ['جصاص','جص','بياض']],
        ['label' => 'Plâtrier Finition',      'label_ar' => 'جصاص تشطيب',              'category' => 'Platrier',         'category_ar' => 'الجص والبياض',         'keywords' => ['platr','fini'],                  'keywords_ar' => ['جصاص','تشطيب']],
        ['label' => 'Enduit Facade',          'label_ar' => 'بياض ومعجون',             'category' => 'Platrier',         'category_ar' => 'الجص والبياض',         'keywords' => ['platr','enduit','crep'],         'keywords_ar' => ['بياض','معجون','جصاص']],
        // ── Facadier ─────────────────────────────────────────────────────────
        ['label' => 'Facadier',               'label_ar' => 'مقاول واجهات',            'category' => 'Facadier',         'category_ar' => 'واجهات المباني',       'keywords' => ['facad'],                         'keywords_ar' => ['واجهة','مباني']],
        ['label' => 'Ravalement de Façade',   'label_ar' => 'تجديد الواجهات',          'category' => 'Facadier',         'category_ar' => 'واجهات المباني',       'keywords' => ['facad','raval'],                 'keywords_ar' => ['واجهة','تجديد']],
        ['label' => 'Nettoyage Façade',       'label_ar' => 'تنظيف الواجهات',          'category' => 'Facadier',         'category_ar' => 'واجهات المباني',       'keywords' => ['facad','nettoy'],                'keywords_ar' => ['واجهة','تنظيف']],
        // ── Toiture ──────────────────────────────────────────────────────────
        ['label' => 'Couvreur Toiture',       'label_ar' => 'مقاول تسقيف',             'category' => 'Toiture',          'category_ar' => 'السقف',                'keywords' => ['toitur','couv'],                 'keywords_ar' => ['سقف','تسقيف']],
        ['label' => 'Réparateur Toiture',     'label_ar' => 'إصلاح سطح',               'category' => 'Toiture',          'category_ar' => 'السقف',                'keywords' => ['toitur','repar'],                'keywords_ar' => ['سقف','إصلاح','سطح']],
        ['label' => 'Tuiles & Ardoises',      'label_ar' => 'قرميد وسقف',              'category' => 'Toiture',          'category_ar' => 'السقف',                'keywords' => ['toitur','tuile'],                'keywords_ar' => ['سقف','قرميد']],
        // ── MecaniqueAuto ────────────────────────────────────────────────────
        ['label' => 'Mécanicien Auto',        'label_ar' => 'ميكانيكي سيارات',         'category' => 'MecaniqueAuto',    'category_ar' => 'ميكانيك السيارات',     'keywords' => ['mecan','auto','voitur'],         'keywords_ar' => ['ميكانيكي','سيارات','سيارة']],
        ['label' => 'Mécanicien Domicile',    'label_ar' => 'ميكانيكي متنقل',          'category' => 'MecaniqueAuto',    'category_ar' => 'ميكانيك السيارات',     'keywords' => ['mecan','domicil'],               'keywords_ar' => ['ميكانيكي','متنقل']],
        ['label' => 'Électricien Auto',       'label_ar' => 'كهربائي سيارات',          'category' => 'MecaniqueAuto',    'category_ar' => 'ميكانيك السيارات',     'keywords' => ['electri','auto','mecan'],        'keywords_ar' => ['كهربائي','سيارات']],
        // ── Electronique ─────────────────────────────────────────────────────
        ['label' => 'Technicien Électronique','label_ar' => 'تقني إلكترونيات',         'category' => 'Electronique',     'category_ar' => 'الإلكترونيات',         'keywords' => ['electron','tech'],               'keywords_ar' => ['إلكترونيات','تقني']],
        ['label' => 'Réparateur TV & Écrans', 'label_ar' => 'مصلح أجهزة وشاشات',      'category' => 'Electronique',     'category_ar' => 'الإلكترونيات',         'keywords' => ['electron','tv','repar'],         'keywords_ar' => ['إلكترونيات','شاشات','تصليح']],
        ['label' => 'Réparateur Électroménager','label_ar' => 'مصلح أجهزة منزلية',     'category' => 'Electronique',     'category_ar' => 'الإلكترونيات',         'keywords' => ['electron','menager','repar'],    'keywords_ar' => ['أجهزة','منزلية','تصليح']],
        // ── Telephonie ───────────────────────────────────────────────────────
        ['label' => 'Réparateur Téléphones',  'label_ar' => 'مصلح هواتف',              'category' => 'Telephonie',       'category_ar' => 'الهاتف والاتصالات',    'keywords' => ['teleph','phone','mobile'],        'keywords_ar' => ['هاتف','هواتف','تصليح']],
        ['label' => 'Technicien Téléphonie',  'label_ar' => 'تقني اتصالات',            'category' => 'Telephonie',       'category_ar' => 'الهاتف والاتصالات',    'keywords' => ['teleph','tech'],                 'keywords_ar' => ['اتصالات','تقني','هاتف']],
        ['label' => 'Installateur Réseau GSM','label_ar' => 'مثبت شبكة هاتفية',        'category' => 'Telephonie',       'category_ar' => 'الهاتف والاتصالات',    'keywords' => ['teleph','reseau','gsm'],         'keywords_ar' => ['شبكة','هاتف','تركيب']],
        // ── Parquet ──────────────────────────────────────────────────────────
        ['label' => 'Parqueteur',             'label_ar' => 'فارش باركيه',              'category' => 'Parquet',          'category_ar' => 'الباركيه',             'keywords' => ['parquet','parquet'],             'keywords_ar' => ['باركيه','فارش']],
        ['label' => 'Poseur Parquet',         'label_ar' => 'مثبت باركيه',              'category' => 'Parquet',          'category_ar' => 'الباركيه',             'keywords' => ['parquet','poseur'],              'keywords_ar' => ['باركيه','تركيب']],
        ['label' => 'Parquet & Stratifié',    'label_ar' => 'باركيه وأرضيات',          'category' => 'Parquet',          'category_ar' => 'الباركيه',             'keywords' => ['parquet','strati'],              'keywords_ar' => ['باركيه','أرضيات']],
        // ── Isolation ────────────────────────────────────────────────────────
        ['label' => 'Isolateur Thermique',    'label_ar' => 'عازل حراري',              'category' => 'Isolation',        'category_ar' => 'العزل الحراري',        'keywords' => ['isol','therm'],                  'keywords_ar' => ['عزل','حراري']],
        ['label' => 'Isolateur Acoustique',   'label_ar' => 'عازل صوتي',               'category' => 'Isolation',        'category_ar' => 'العزل الحراري',        'keywords' => ['isol','acoust','son'],           'keywords_ar' => ['عزل','صوتي']],
        ['label' => 'Isolation Toiture',      'label_ar' => 'عزل سقف',                 'category' => 'Isolation',        'category_ar' => 'العزل الحراري',        'keywords' => ['isol','toitur'],                 'keywords_ar' => ['عزل','سقف']],
        // ── Etancheite ───────────────────────────────────────────────────────
        ['label' => 'Étanchéiste',            'label_ar' => 'عازل مائي',               'category' => 'Etancheite',       'category_ar' => 'العزل المائي',         'keywords' => ['etanch','imperm'],               'keywords_ar' => ['عزل','مائي','ماء']],
        ['label' => 'Étanchéité Terrasse',    'label_ar' => 'عزل مائي تراس',           'category' => 'Etancheite',       'category_ar' => 'العزل المائي',         'keywords' => ['etanch','terras'],               'keywords_ar' => ['عزل','مائي','سطح']],
        ['label' => 'Étanchéité Toiture',     'label_ar' => 'عزل مائي سقف',            'category' => 'Etancheite',       'category_ar' => 'العزل المائي',         'keywords' => ['etanch','toitur'],               'keywords_ar' => ['عزل','مائي','تسقيف']],
        // ── Piscine ──────────────────────────────────────────────────────────
        ['label' => 'Pisciniste',             'label_ar' => 'مقاول مسابح',             'category' => 'Piscine',          'category_ar' => 'المسبح',               'keywords' => ['piscin'],                        'keywords_ar' => ['مسبح','حوض','سباحة']],
        ['label' => 'Construction Piscine',   'label_ar' => 'بناء مسابح',              'category' => 'Piscine',          'category_ar' => 'المسبح',               'keywords' => ['piscin','constr'],               'keywords_ar' => ['مسبح','بناء']],
        ['label' => 'Entretien Piscine',      'label_ar' => 'صيانة مسابح',             'category' => 'Piscine',          'category_ar' => 'المسبح',               'keywords' => ['piscin','entret'],               'keywords_ar' => ['مسبح','صيانة']],
        // ── Marbre ───────────────────────────────────────────────────────────
        ['label' => 'Marbrier',               'label_ar' => 'رخامي',                   'category' => 'Marbre',           'category_ar' => 'الرخام',               'keywords' => ['marbre','marbr'],                'keywords_ar' => ['رخام','رخامي']],
        ['label' => 'Poseur Marbre',          'label_ar' => 'مثبت رخام',               'category' => 'Marbre',           'category_ar' => 'الرخام',               'keywords' => ['marbre','poseur'],               'keywords_ar' => ['رخام','تركيب']],
        ['label' => 'Marbre & Granit',        'label_ar' => 'رخام وغرانيت',            'category' => 'Marbre',           'category_ar' => 'الرخام',               'keywords' => ['marbre','granit'],               'keywords_ar' => ['رخام','غرانيت']],
        // ── Ferronnerie ──────────────────────────────────────────────────────
        ['label' => 'Ferronnier',             'label_ar' => 'حداد فني',                'category' => 'Ferronnerie',      'category_ar' => 'الحدادة الفنية',       'keywords' => ['ferronn','metal'],               'keywords_ar' => ['حداد','حدادة']],
        ['label' => 'Ferronnier Décorateur',  'label_ar' => 'حداد ديكور',              'category' => 'Ferronnerie',      'category_ar' => 'الحدادة الفنية',       'keywords' => ['ferronn','decor'],               'keywords_ar' => ['حداد','ديكور']],
        ['label' => 'Garde-Corps & Rampes',   'label_ar' => 'درابزين وحواجز',          'category' => 'Ferronnerie',      'category_ar' => 'الحدادة الفنية',       'keywords' => ['ferronn','garde','rampe'],       'keywords_ar' => ['درابزين','حواجز','حداد']],
        // ── Portail ──────────────────────────────────────────────────────────
        ['label' => 'Installateur Portail',   'label_ar' => 'مثبت بوابات',             'category' => 'Portail',          'category_ar' => 'البوابات',             'keywords' => ['portail','portal'],              'keywords_ar' => ['بوابة','بوابات','تركيب']],
        ['label' => 'Portail Automatique',    'label_ar' => 'بوابة أوتوماتيكية',       'category' => 'Portail',          'category_ar' => 'البوابات',             'keywords' => ['portail','auto'],                'keywords_ar' => ['بوابة','أوتوماتيك','تلقائي']],
        ['label' => 'Portail Battant & Coulissant','label_ar' => 'بوابة ذات ورقتين',   'category' => 'Portail',          'category_ar' => 'البوابات',             'keywords' => ['portail','battant','couliss'],   'keywords_ar' => ['بوابة','منزلق']],
        // ── Volets ───────────────────────────────────────────────────────────
        ['label' => 'Installateur Volets',    'label_ar' => 'مثبت مصاريع',             'category' => 'Volets',           'category_ar' => 'المصاريع',             'keywords' => ['volet','instal'],                'keywords_ar' => ['مصاريع','تركيب']],
        ['label' => 'Volets Roulants',        'label_ar' => 'مصاريع دوارة',            'category' => 'Volets',           'category_ar' => 'المصاريع',             'keywords' => ['volet','roulant'],               'keywords_ar' => ['مصاريع','دوارة']],
        ['label' => 'Volets Motorisés',       'label_ar' => 'مصاريع آلية',             'category' => 'Volets',           'category_ar' => 'المصاريع',             'keywords' => ['volet','motor'],                 'keywords_ar' => ['مصاريع','آلية','كهربائية']],
        // ── Cuisine ──────────────────────────────────────────────────────────
        ['label' => 'Cuisiniste',             'label_ar' => 'مصمم مطابخ',              'category' => 'Cuisine',          'category_ar' => 'المطبخ',               'keywords' => ['cuisi','cuisin'],                'keywords_ar' => ['مطبخ','تصميم']],
        ['label' => 'Monteur Cuisine',        'label_ar' => 'مركّب مطابخ',             'category' => 'Cuisine',          'category_ar' => 'المطبخ',               'keywords' => ['cuisi','mont'],                  'keywords_ar' => ['مطبخ','تركيب']],
        ['label' => 'Cuisine Sur Mesure',     'label_ar' => 'مطبخ على المقاس',         'category' => 'Cuisine',          'category_ar' => 'المطبخ',               'keywords' => ['cuisi','mesur'],                 'keywords_ar' => ['مطبخ','مقاس','خاص']],
        // ── SalleDeBain ──────────────────────────────────────────────────────
        ['label' => 'Rénovation Salle de Bain','label_ar' => 'تجديد الحمام',           'category' => 'SalleDeBain',      'category_ar' => 'الحمام',               'keywords' => ['salle','bain','sanit'],          'keywords_ar' => ['حمام','تجديد']],
        ['label' => 'Plombier Salle de Bain', 'label_ar' => 'سباك حمام',               'category' => 'SalleDeBain',      'category_ar' => 'الحمام',               'keywords' => ['salle','bain','plomb'],          'keywords_ar' => ['حمام','سباك']],
        ['label' => 'Carreleur Salle de Bain','label_ar' => 'رصاف حمام',               'category' => 'SalleDeBain',      'category_ar' => 'الحمام',               'keywords' => ['salle','bain','carrel'],         'keywords_ar' => ['حمام','رصاف','بلاط']],
        // ── Dressing ─────────────────────────────────────────────────────────
        ['label' => 'Menuisier Dressing',     'label_ar' => 'نجار خزانة ملابس',        'category' => 'Dressing',         'category_ar' => 'غرفة الملابس',         'keywords' => ['dress','placard','menuisi'],     'keywords_ar' => ['خزانة','ملابس','نجار']],
        ['label' => 'Dressing Sur Mesure',    'label_ar' => 'غرفة ملابس مخصصة',        'category' => 'Dressing',         'category_ar' => 'غرفة الملابس',         'keywords' => ['dress','mesur'],                 'keywords_ar' => ['خزانة','ملابس','مخصصة']],
        // ── Escalier ─────────────────────────────────────────────────────────
        ['label' => 'Fabricant Escalier',     'label_ar' => 'صانع درج',                'category' => 'Escalier',         'category_ar' => 'الدرج',                'keywords' => ['escali'],                        'keywords_ar' => ['درج','سلم']],
        ['label' => 'Escalier Bois & Métal',  'label_ar' => 'درج خشب ومعدن',           'category' => 'Escalier',         'category_ar' => 'الدرج',                'keywords' => ['escali','bois'],                 'keywords_ar' => ['درج','خشب','معدن']],
        // ── Plafond ──────────────────────────────────────────────────────────
        ['label' => 'Plafonniste',            'label_ar' => 'مقاول أسقف',              'category' => 'Plafond',          'category_ar' => 'الأسقف',               'keywords' => ['plafond','plafonn'],             'keywords_ar' => ['سقف','أسقف']],
        ['label' => 'Faux Plafond',           'label_ar' => 'سقف مستعار',              'category' => 'Plafond',          'category_ar' => 'الأسقف',               'keywords' => ['plafond','faux'],                'keywords_ar' => ['سقف','مستعار','جبس']],
        ['label' => 'Plafond Plâtre',         'label_ar' => 'سقف جبس',                 'category' => 'Plafond',          'category_ar' => 'الأسقف',               'keywords' => ['plafond','platr'],               'keywords_ar' => ['سقف','جبس']],
        // ── Moustiquaire ─────────────────────────────────────────────────────
        ['label' => 'Poseur Moustiquaire',    'label_ar' => 'مثبت شبك الحشرات',        'category' => 'Moustiquaire',     'category_ar' => 'شبك الحشرات',          'keywords' => ['moustiqu','insect'],             'keywords_ar' => ['شبك','حشرات']],
        ['label' => 'Moustiquaire Plissée',   'label_ar' => 'شبك حشرات قابل للطي',     'category' => 'Moustiquaire',     'category_ar' => 'شبك الحشرات',          'keywords' => ['moustiqu','pliss'],              'keywords_ar' => ['شبك','حشرات','قابل']],
        // ── NettoyageVitre ───────────────────────────────────────────────────
        ['label' => 'Laveur de Vitres',       'label_ar' => 'منظف زجاج',               'category' => 'NettoyageVitre',   'category_ar' => 'تنظيف الزجاج',         'keywords' => ['nettoy','vitre','vitr'],         'keywords_ar' => ['تنظيف','زجاج']],
        ['label' => 'Nettoyage Vitres Hauteur','label_ar' => 'تنظيف زجاج على الارتفاع','category' => 'NettoyageVitre',   'category_ar' => 'تنظيف الزجاج',         'keywords' => ['nettoy','vitre','hauteur'],      'keywords_ar' => ['تنظيف','زجاج','ارتفاع']],
        // ── BabySitter ───────────────────────────────────────────────────────
        ['label' => 'Baby-sitter',            'label_ar' => 'حاضنة أطفال',             'category' => 'BabySitter',       'category_ar' => 'جليسة الأطفال',        'keywords' => ['baby','sitter'],                 'keywords_ar' => ['حاضنة','أطفال','جليسة']],
        ['label' => 'Nounou à Domicile',      'label_ar' => 'مربية منزلية',            'category' => 'BabySitter',       'category_ar' => 'جليسة الأطفال',        'keywords' => ['baby','sitter','nounou'],        'keywords_ar' => ['مربية','أطفال','منزلية']],
        // ── AidePersonnes ────────────────────────────────────────────────────
        ['label' => 'Aide à domicile',        'label_ar' => 'مساعد منزلي',             'category' => 'AidePersonnes',    'category_ar' => 'مساعدة الأشخاص',      'keywords' => ['aide','domicil'],                'keywords_ar' => ['مساعد','منزلي']],
        ['label' => 'Auxiliaire de Vie',      'label_ar' => 'مساعد كبار السن',         'category' => 'AidePersonnes',    'category_ar' => 'مساعدة الأشخاص',      'keywords' => ['aide','senior','vie'],           'keywords_ar' => ['مساعد','مسنين','كبار']],
        // ── CoursParticuliers ────────────────────────────────────────────────
        ['label' => 'Professeur Cours Particuliers','label_ar' => 'أستاذ دروس خصوصية','category' => 'CoursParticuliers', 'category_ar' => 'الدروس الخصوصية',     'keywords' => ['cours','prof','enseign'],        'keywords_ar' => ['دروس','خصوصية','أستاذ']],
        ['label' => 'Répétiteur Scolaire',    'label_ar' => 'مدرس خاص',                'category' => 'CoursParticuliers', 'category_ar' => 'الدروس الخصوصية',     'keywords' => ['cours','repet','scolaire'],      'keywords_ar' => ['مدرس','خاص','دروس']],
        ['label' => 'Coach Langues',          'label_ar' => 'مدرس لغات',               'category' => 'CoursParticuliers', 'category_ar' => 'الدروس الخصوصية',     'keywords' => ['cours','langue','coach'],        'keywords_ar' => ['لغات','مدرس','دروس']],
        // ── Traduction ───────────────────────────────────────────────────────
        ['label' => 'Traducteur',             'label_ar' => 'مترجم',                   'category' => 'Traduction',       'category_ar' => 'الترجمة',              'keywords' => ['traduc'],                        'keywords_ar' => ['مترجم','ترجمة']],
        ['label' => 'Traducteur Assermenté',  'label_ar' => 'مترجم محلف',              'category' => 'Traduction',       'category_ar' => 'الترجمة',              'keywords' => ['traduc','asserm'],               'keywords_ar' => ['مترجم','محلف','قانوني']],
        // ── Comptabilite ─────────────────────────────────────────────────────
        ['label' => 'Expert Comptable',       'label_ar' => 'خبير محاسب',              'category' => 'Comptabilite',     'category_ar' => 'المحاسبة',             'keywords' => ['compt','expert'],                'keywords_ar' => ['محاسب','خبير']],
        ['label' => 'Comptable',              'label_ar' => 'محاسب',                   'category' => 'Comptabilite',     'category_ar' => 'المحاسبة',             'keywords' => ['compt'],                         'keywords_ar' => ['محاسب','محاسبة']],
        ['label' => 'Gestionnaire Paie',      'label_ar' => 'مدير أجور',               'category' => 'Comptabilite',     'category_ar' => 'المحاسبة',             'keywords' => ['compt','paie','gest'],           'keywords_ar' => ['أجور','محاسب','رواتب']],
        // ── Juridique ────────────────────────────────────────────────────────
        ['label' => 'Avocat',                 'label_ar' => 'محامي',                   'category' => 'Juridique',        'category_ar' => 'الاستشارات القانونية', 'keywords' => ['avoc','jurid'],                  'keywords_ar' => ['محامي','قانون']],
        ['label' => 'Conseiller Juridique',   'label_ar' => 'مستشار قانوني',           'category' => 'Juridique',        'category_ar' => 'الاستشارات القانونية', 'keywords' => ['jurid','conseil'],               'keywords_ar' => ['مستشار','قانوني','قانون']],
        ['label' => 'Notaire',                'label_ar' => 'موثق عدل',                'category' => 'Juridique',        'category_ar' => 'الاستشارات القانونية', 'keywords' => ['notaire','not'],                 'keywords_ar' => ['موثق','عدل','قانون']],
        // ── Architecture ─────────────────────────────────────────────────────
        ['label' => 'Architecte',             'label_ar' => 'مهندس معماري',            'category' => 'Architecture',     'category_ar' => 'الهندسة المعمارية',    'keywords' => ['archi'],                         'keywords_ar' => ['مهندس','معماري','هندسة']],
        ['label' => 'Bureau d\'études',       'label_ar' => 'مكتب دراسات هندسية',      'category' => 'Architecture',     'category_ar' => 'الهندسة المعمارية',    'keywords' => ['archi','bureau'],                'keywords_ar' => ['مكتب','هندسي','دراسات']],
        ['label' => 'Architecte d\'Intérieur','label_ar' => 'مهندس ديكور داخلي',       'category' => 'Architecture',     'category_ar' => 'الهندسة المعمارية',    'keywords' => ['archi','inter'],                 'keywords_ar' => ['مهندس','داخلي','ديكور']],
        // ── DesignGraphique ──────────────────────────────────────────────────
        ['label' => 'Graphiste',              'label_ar' => 'مصمم جرافيك',             'category' => 'DesignGraphique',  'category_ar' => 'التصميم الجرافيكي',    'keywords' => ['graph','design'],                'keywords_ar' => ['جرافيك','تصميم','مصمم']],
        ['label' => 'Designer Graphique',     'label_ar' => 'مصمم بصري',               'category' => 'DesignGraphique',  'category_ar' => 'التصميم الجرافيكي',    'keywords' => ['graph','design'],                'keywords_ar' => ['تصميم','بصري','جرافيك']],
        ['label' => 'Illustrateur',           'label_ar' => 'رسام ومصمم',              'category' => 'DesignGraphique',  'category_ar' => 'التصميم الجرافيكي',    'keywords' => ['graph','illust'],                'keywords_ar' => ['رسام','تصميم','جرافيك']],
        // ── WebDev ───────────────────────────────────────────────────────────
        ['label' => 'Développeur Web',        'label_ar' => 'مطور مواقع',              'category' => 'WebDev',           'category_ar' => 'تطوير الويب',          'keywords' => ['dev','web'],                     'keywords_ar' => ['مطور','مواقع','ويب']],
        ['label' => 'Développeur Full Stack', 'label_ar' => 'مطور فول ستاك',           'category' => 'WebDev',           'category_ar' => 'تطوير الويب',          'keywords' => ['dev','web','full'],              'keywords_ar' => ['مطور','فول ستاك','ويب']],
        ['label' => 'Créateur de Sites Web',  'label_ar' => 'منشئ مواقع إلكترونية',    'category' => 'WebDev',           'category_ar' => 'تطوير الويب',          'keywords' => ['web','site'],                    'keywords_ar' => ['مواقع','إلكترونية','تصميم']],
        // ── Marketing ────────────────────────────────────────────────────────
        ['label' => 'Consultant Marketing',   'label_ar' => 'مستشار تسويق',            'category' => 'Marketing',        'category_ar' => 'التسويق',              'keywords' => ['market'],                        'keywords_ar' => ['تسويق','مستشار']],
        ['label' => 'Community Manager',      'label_ar' => 'مدير صفحات اجتماعية',     'category' => 'Marketing',        'category_ar' => 'التسويق',              'keywords' => ['market','community','social'],   'keywords_ar' => ['تسويق','اجتماعي','مدير']],
        ['label' => 'SEO & Publicité Digitale','label_ar' => 'تحسين محركات البحث',     'category' => 'Marketing',        'category_ar' => 'التسويق',              'keywords' => ['market','seo','pub'],            'keywords_ar' => ['سيو','تسويق','رقمي']],
        // ── Traiteur ─────────────────────────────────────────────────────────
        ['label' => 'Traiteur',               'label_ar' => 'مورد طعام',               'category' => 'Traiteur',         'category_ar' => 'الطعام والتموين',      'keywords' => ['traiteur','cuisine'],            'keywords_ar' => ['طعام','تموين','مطبخ']],
        ['label' => 'Traiteur Mariage',       'label_ar' => 'مورد طعام أعراس',         'category' => 'Traiteur',         'category_ar' => 'الطعام والتموين',      'keywords' => ['traiteur','mariage'],            'keywords_ar' => ['طعام','أعراس','تموين']],
        ['label' => 'Chef Cuisinier',         'label_ar' => 'طباخ محترف',              'category' => 'Traiteur',         'category_ar' => 'الطعام والتموين',      'keywords' => ['traiteur','chef','cuis'],        'keywords_ar' => ['طباخ','محترف','طعام']],
        // ── Evenementiel ─────────────────────────────────────────────────────
        ['label' => 'Organisateur d\'Événements','label_ar' => 'منظم فعاليات',        'category' => 'Evenementiel',     'category_ar' => 'تنظيم الفعاليات',      'keywords' => ['event','evenem'],                'keywords_ar' => ['فعاليات','منظم','تنظيم']],
        ['label' => 'Décorateur Mariage',     'label_ar' => 'مزين أعراس',              'category' => 'Evenementiel',     'category_ar' => 'تنظيم الفعاليات',      'keywords' => ['event','mariage','decor'],       'keywords_ar' => ['أعراس','مزين','تنظيم']],
        ['label' => 'DJ & Animation',         'label_ar' => 'دي جي وتنشيط',            'category' => 'Evenementiel',     'category_ar' => 'تنظيم الفعاليات',      'keywords' => ['event','dj','anim'],             'keywords_ar' => ['دي جي','تنشيط','فعاليات']],
        // ── GardeAnimaux ─────────────────────────────────────────────────────
        ['label' => 'Garde d\'Animaux',       'label_ar' => 'راعي حيوانات',            'category' => 'GardeAnimaux',     'category_ar' => 'رعاية الحيوانات',      'keywords' => ['animal','garde'],                'keywords_ar' => ['حيوانات','رعاية']],
        ['label' => 'Pet Sitter',             'label_ar' => 'حاضن حيوانات أليفة',      'category' => 'GardeAnimaux',     'category_ar' => 'رعاية الحيوانات',      'keywords' => ['animal','pet','sitter'],         'keywords_ar' => ['حيوانات','أليفة','رعاية']],
        // ── Veterinaire ──────────────────────────────────────────────────────
        ['label' => 'Vétérinaire',            'label_ar' => 'طبيب بيطري',              'category' => 'Veterinaire',      'category_ar' => 'الطب البيطري',         'keywords' => ['veter','vet'],                   'keywords_ar' => ['بيطري','طبيب','حيوانات']],
        ['label' => 'Vétérinaire à Domicile', 'label_ar' => 'طبيب بيطري متنقل',        'category' => 'Veterinaire',      'category_ar' => 'الطب البيطري',         'keywords' => ['veter','domicil'],               'keywords_ar' => ['بيطري','متنقل','طبيب']],
        // ── CoachSportif ─────────────────────────────────────────────────────
        ['label' => 'Coach Sportif',          'label_ar' => 'مدرب رياضي',              'category' => 'CoachSportif',     'category_ar' => 'المدرب الرياضي',       'keywords' => ['coach','sport'],                 'keywords_ar' => ['مدرب','رياضي']],
        ['label' => 'Coach Fitness',          'label_ar' => 'مدرب لياقة بدنية',        'category' => 'CoachSportif',     'category_ar' => 'المدرب الرياضي',       'keywords' => ['coach','fitness','sport'],       'keywords_ar' => ['مدرب','لياقة','بدنية']],
        ['label' => 'Coach Personnel',        'label_ar' => 'مدرب شخصي',               'category' => 'CoachSportif',     'category_ar' => 'المدرب الرياضي',       'keywords' => ['coach','person'],                'keywords_ar' => ['مدرب','شخصي']],
        // ── Bien-etre ────────────────────────────────────────────────────────
        ['label' => 'Praticien Bien-être',    'label_ar' => 'معالج نفسي وجسدي',        'category' => 'Bien-etre',        'category_ar' => 'العافية والاسترخاء',   'keywords' => ['bienetre','bien','relaxation'],  'keywords_ar' => ['عافية','استرخاء','معالج']],
        ['label' => 'Yoga & Méditation',      'label_ar' => 'يوغا وتأمل',              'category' => 'Bien-etre',        'category_ar' => 'العافية والاسترخاء',   'keywords' => ['yoga','bien','medit'],           'keywords_ar' => ['يوغا','تأمل','استرخاء']],
        // ── Esthetique ───────────────────────────────────────────────────────
        ['label' => 'Esthéticienne',          'label_ar' => 'خبيرة تجميل',             'category' => 'Esthetique',       'category_ar' => 'التجميل',              'keywords' => ['esthet','beaute'],               'keywords_ar' => ['تجميل','خبيرة']],
        ['label' => 'Esthéticienne à Domicile','label_ar' => 'خبيرة تجميل متنقلة',     'category' => 'Esthetique',       'category_ar' => 'التجميل',              'keywords' => ['esthet','domicil'],              'keywords_ar' => ['تجميل','متنقلة','منزل']],
        ['label' => 'Onglerie',               'label_ar' => 'نقش أظافر',               'category' => 'Esthetique',       'category_ar' => 'التجميل',              'keywords' => ['ongle','esthet'],                'keywords_ar' => ['أظافر','نقش','تجميل']],
        // ── Massage ──────────────────────────────────────────────────────────
        ['label' => 'Masseur Professionnel',  'label_ar' => 'معالج مساج محترف',        'category' => 'Massage',          'category_ar' => 'المساج',               'keywords' => ['masseur','mass'],                'keywords_ar' => ['مساج','معالج']],
        ['label' => 'Masseur à Domicile',     'label_ar' => 'مساج منزلي',              'category' => 'Massage',          'category_ar' => 'المساج',               'keywords' => ['masseur','domicil'],             'keywords_ar' => ['مساج','منزلي']],
        // ── Maquillage ───────────────────────────────────────────────────────
        ['label' => 'Maquilleuse',            'label_ar' => 'خبيرة مكياج',             'category' => 'Maquillage',       'category_ar' => 'المكياج',              'keywords' => ['maquil','makeup'],               'keywords_ar' => ['مكياج','خبيرة']],
        ['label' => 'Maquilleuse Mariage',    'label_ar' => 'مكياج أعراس',             'category' => 'Maquillage',       'category_ar' => 'المكياج',              'keywords' => ['maquil','mariage'],              'keywords_ar' => ['مكياج','أعراس','زفاف']],
        // ── Couture ──────────────────────────────────────────────────────────
        ['label' => 'Couturier / Couturière', 'label_ar' => 'خياط / خياطة',            'category' => 'Couture',          'category_ar' => 'الخياطة',              'keywords' => ['couture','coutur'],              'keywords_ar' => ['خياط','خياطة']],
        ['label' => 'Retouche Vêtements',     'label_ar' => 'تعديل ملابس',             'category' => 'Couture',          'category_ar' => 'الخياطة',              'keywords' => ['couture','retouch'],             'keywords_ar' => ['خياطة','تعديل','ملابس']],
        ['label' => 'Couture Sur Mesure',     'label_ar' => 'خياطة على المقاس',        'category' => 'Couture',          'category_ar' => 'الخياطة',              'keywords' => ['couture','mesur'],               'keywords_ar' => ['خياطة','مقاس']],
        // ── Pressing ─────────────────────────────────────────────────────────
        ['label' => 'Presseur Teinturier',    'label_ar' => 'تنظيف جاف وكي',           'category' => 'Pressing',         'category_ar' => 'التنظيف الجاف',        'keywords' => ['press','nettoye','teintur'],     'keywords_ar' => ['تنظيف','جاف','كي']],
        ['label' => 'Pressing à Domicile',    'label_ar' => 'تنظيف جاف منزلي',         'category' => 'Pressing',         'category_ar' => 'التنظيف الجاف',        'keywords' => ['press','domicil'],               'keywords_ar' => ['تنظيف','جاف','منزلي']],
        // ── Livraison ────────────────────────────────────────────────────────
        ['label' => 'Livreur',                'label_ar' => 'موصل / ساعي',             'category' => 'Livraison',        'category_ar' => 'التوصيل',              'keywords' => ['livr'],                          'keywords_ar' => ['توصيل','موصل']],
        ['label' => 'Coursier Express',       'label_ar' => 'ساعي سريع',               'category' => 'Livraison',        'category_ar' => 'التوصيل',              'keywords' => ['livr','cour','express'],         'keywords_ar' => ['توصيل','سريع']],
        // ── Carrosserie ──────────────────────────────────────────────────────
        ['label' => 'Carrossier',             'label_ar' => 'سمكري سيارات',            'category' => 'Carrosserie',      'category_ar' => 'سمكرة السيارات',       'keywords' => ['carross'],                       'keywords_ar' => ['سمكري','سيارات']],
        ['label' => 'Carrossier Peinture Auto','label_ar' => 'طلاء هياكل السيارات',    'category' => 'Carrosserie',      'category_ar' => 'سمكرة السيارات',       'keywords' => ['carross','peintr'],              'keywords_ar' => ['سمكري','طلاء','سيارات']],
        // ── Pergola ──────────────────────────────────────────────────────────
        ['label' => 'Installateur Pergola',   'label_ar' => 'مثبت بيرغولا',            'category' => 'Pergola',          'category_ar' => 'البيرغولا',            'keywords' => ['pergol'],                        'keywords_ar' => ['بيرغولا','تركيب']],
        ['label' => 'Pergola & Tonnelle',     'label_ar' => 'بيرغولا وظلة',            'category' => 'Pergola',          'category_ar' => 'البيرغولا',            'keywords' => ['pergol','tonnell'],              'keywords_ar' => ['بيرغولا','ظلة']],
        // ── PanneauxSolaires ─────────────────────────────────────────────────
        ['label' => 'Installateur Solaire',   'label_ar' => 'مثبت ألواح شمسية',        'category' => 'PanneauxSolaires', 'category_ar' => 'الألواح الشمسية',      'keywords' => ['solaire','panneaux'],            'keywords_ar' => ['شمسية','ألواح','طاقة']],
        ['label' => 'Technicien Solaire',     'label_ar' => 'تقني طاقة شمسية',         'category' => 'PanneauxSolaires', 'category_ar' => 'الألواح الشمسية',      'keywords' => ['solaire','tech'],                'keywords_ar' => ['شمسية','تقني','طاقة']],
        ['label' => 'Panneaux Photovoltaïques','label_ar' => 'ألواح كهروضوئية',        'category' => 'PanneauxSolaires', 'category_ar' => 'الألواح الشمسية',      'keywords' => ['solaire','photovolt'],           'keywords_ar' => ['شمسية','كهروضوئية','ألواح']],
        // ── Ascenseur ────────────────────────────────────────────────────────
        ['label' => 'Technicien Ascenseur',   'label_ar' => 'تقني مصاعد',              'category' => 'Ascenseur',        'category_ar' => 'المصاعد',              'keywords' => ['ascens'],                        'keywords_ar' => ['مصعد','مصاعد','تقني']],
        ['label' => 'Maintenance Ascenseur',  'label_ar' => 'صيانة مصاعد',             'category' => 'Ascenseur',        'category_ar' => 'المصاعد',              'keywords' => ['ascens','maint'],                'keywords_ar' => ['مصعد','صيانة']],
        // ── Domotique ────────────────────────────────────────────────────────
        ['label' => 'Technicien Domotique',   'label_ar' => 'تقني منزل ذكي',           'category' => 'Domotique',        'category_ar' => 'المنزل الذكي',         'keywords' => ['domot','smart'],                 'keywords_ar' => ['منزل','ذكي','تقني']],
        ['label' => 'Installateur Smart Home','label_ar' => 'مثبت أنظمة ذكية',         'category' => 'Domotique',        'category_ar' => 'المنزل الذكي',         'keywords' => ['domot','smart','home'],          'keywords_ar' => ['ذكي','أنظمة','منزل']],
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
        return preg_replace('/[\x{064B}-\x{065F}\x{0670}]/u', '', mb_strtolower($s, 'UTF-8')) ?? $s;
    }
}
