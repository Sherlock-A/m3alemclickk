import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { Layout } from '../../components/Layout';
import {
  Search,
  Wrench, Zap, PaintRoller, Hammer, BrickWall, Grid3x3, Snowflake, Sparkles,
  Truck, Cctv, Scissors, Camera, Sprout, Palette, Square, KeyRound,
  SprayCan, LayoutGrid, Layers, ChefHat, Laptop, Flame, Home, Construction,
  Thermometer, PenTool, MapPinned, Paintbrush, ShieldCheck, Drill, Bug,
  Waves, Blinds, Refrigerator, CarFront, PaintBucket, BatteryCharging,
  Armchair, Shirt, Cake, GraduationCap, Languages, Brush, Code, Megaphone,
  Scale, Calculator, Gavel, Package, Container, Car, Baby, Sparkle, HandHeart,
  Heart, Flower2, Hand, PartyPopper, Music, Settings, Dumbbell, PersonStanding,
  Swords, Droplets, Dog, Bike, Smile,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─────────── Types ───────────
type CatEntry = {
  id:      number;
  fr:      string;
  ar:      string;
  Icon:    LucideIcon;
  color:   string;
  popular?: boolean;
  badge?:  boolean;
};

// ─────────── 70 Catégories ───────────
const CATEGORIES: CatEntry[] = [
  // ── Populaires (14) ──────────────────────────────────────────────────────
  { id:  1, fr:'Plomberie',              ar:'سباكة',               Icon:Wrench,         color:'#3B82F6', popular:true, badge:true  },
  { id:  2, fr:'Électricité',            ar:'كهرباء',              Icon:Zap,            color:'#F59E0B', popular:true              },
  { id:  3, fr:'Peinture',              ar:'دهان',                 Icon:PaintRoller,    color:'#A855F7', popular:true, badge:true  },
  { id:  4, fr:'Menuiserie',            ar:'نجارة',               Icon:Hammer,         color:'#F26B2A', popular:true              },
  { id:  5, fr:'Maçonnerie',            ar:'بناء',                 Icon:BrickWall,      color:'#EF4444', popular:true, badge:true  },
  { id:  6, fr:'Carrelage',             ar:'تبليط',               Icon:Grid3x3,        color:'#0EA5E9', popular:true              },
  { id:  7, fr:'Climatisation',         ar:'تكييف',               Icon:Snowflake,      color:'#06B6D4', popular:true              },
  { id:  8, fr:'Nettoyage maison',      ar:'تنظيف المنزل',        Icon:Sparkles,       color:'#14B8A6', popular:true, badge:true  },
  { id:  9, fr:'Déménagement',          ar:'نقل العفش',            Icon:Truck,          color:'#EC4899', popular:true              },
  { id: 10, fr:'Caméras surveillance',  ar:'كاميرات المراقبة',    Icon:Cctv,           color:'#F26B2A', popular:true, badge:true  },
  { id: 11, fr:'Coiffure',             ar:'حلاقة',               Icon:Scissors,       color:'#F43F5E', popular:true              },
  { id: 12, fr:'Photographie',          ar:'تصوير',               Icon:Camera,         color:'#0EA5E9', popular:true              },
  { id: 13, fr:'Jardinage',            ar:'بستنة',               Icon:Sprout,         color:'#22C55E', popular:true              },
  { id: 14, fr:'Décoration',           ar:'ديكور',               Icon:Palette,        color:'#D946EF', popular:true, badge:true  },

  // ── Reste (56) ───────────────────────────────────────────────────────────
  { id: 15, fr:'Vitrerie',             ar:'زجاجية',              Icon:Square,         color:'#6366F1' },
  { id: 16, fr:'Serrurerie',           ar:'حدادة وأقفال',        Icon:KeyRound,       color:'#3B82F6' },
  { id: 17, fr:'Nettoyage industriel', ar:'نظافة صناعية',        Icon:SprayCan,       color:'#06B6D4' },
  { id: 18, fr:'Aluminium',            ar:'الألمنيوم',           Icon:LayoutGrid,     color:'#0EA5E9' },
  { id: 19, fr:'Marbre',              ar:'رخام',                Icon:Layers,         color:'#F59E0B' },
  { id: 20, fr:'Cuisine & traiteur',  ar:'الطبخ والطهي',        Icon:ChefHat,        color:'#EF4444' },
  { id: 21, fr:'Informatique',        ar:'معلوميات',            Icon:Laptop,         color:'#A855F7' },
  { id: 22, fr:'Soudure',            ar:'لحام',                Icon:Flame,          color:'#F26B2A' },
  { id: 23, fr:'Toiture',            ar:'التسقيف',             Icon:Home,           color:'#F59E0B' },
  { id: 24, fr:'Charpenterie',       ar:'نجارة البناء',         Icon:Construction,   color:'#FB923C' },
  { id: 25, fr:'Chauffage',          ar:'تدفئة',               Icon:Thermometer,    color:'#EF4444' },
  { id: 26, fr:'Ferronnerie',        ar:'الحدادة الفنية',       Icon:PenTool,        color:'#F43F5E' },
  { id: 27, fr:'Topographie',        ar:'مساحة وخرائط',         Icon:MapPinned,      color:'#10B981' },
  { id: 28, fr:'Plâtrerie',          ar:'الجبس',               Icon:Paintbrush,     color:'#06B6D4' },
  { id: 29, fr:'Isolation',          ar:'العزل',               Icon:ShieldCheck,    color:'#84CC16' },
  { id: 30, fr:'Forage de puits',    ar:'حفر الآبار',           Icon:Drill,          color:'#F59E0B' },
  { id: 31, fr:'Désinsectisation',   ar:'إبادة الحشرات',        Icon:Bug,            color:'#22C55E' },
  { id: 32, fr:'Entretien piscine',  ar:'صيانة المسابح',        Icon:Waves,          color:'#0EA5E9' },
  { id: 33, fr:'Stores & rideaux',   ar:'الستائر',             Icon:Blinds,         color:'#A855F7' },
  { id: 34, fr:'Électroménager',     ar:'صيانة الأجهزة',        Icon:Refrigerator,   color:'#3B82F6' },
  { id: 35, fr:'Lavage auto',        ar:'غسيل السيارات',        Icon:CarFront,       color:'#06B6D4' },
  { id: 36, fr:'Mécanique auto',     ar:'ميكانيكي السيارات',    Icon:Wrench,         color:'#F26B2A' },
  { id: 37, fr:'Peinture auto',      ar:'صباغة السيارات',       Icon:PaintBucket,    color:'#F43F5E' },
  { id: 38, fr:'Électricien auto',   ar:'كهرباء السيارات',      Icon:BatteryCharging,color:'#F59E0B' },
  { id: 39, fr:'Tapisserie',         ar:'تنجيد',               Icon:Armchair,       color:'#EF4444' },
  { id: 40, fr:'Couture',           ar:'خياطة',               Icon:Shirt,          color:'#D946EF' },
  { id: 41, fr:'Pâtisserie',        ar:'حلويات',              Icon:Cake,           color:'#EC4899' },
  { id: 42, fr:'Cours particuliers', ar:'دروس خصوصية',          Icon:GraduationCap,  color:'#6366F1' },
  { id: 43, fr:'Traduction',         ar:'ترجمة',               Icon:Languages,      color:'#A855F7' },
  { id: 44, fr:'Design graphique',   ar:'تصميم جرافيك',         Icon:Brush,          color:'#F43F5E' },
  { id: 45, fr:'Développement web',  ar:'تطوير المواقع',        Icon:Code,           color:'#14B8A6' },
  { id: 46, fr:'Marketing digital',  ar:'تسويق رقمي',           Icon:Megaphone,      color:'#F26B2A' },
  { id: 47, fr:'Avocat',            ar:'محاماة',              Icon:Scale,          color:'#F59E0B' },
  { id: 48, fr:'Comptabilité',      ar:'محاسبة',              Icon:Calculator,     color:'#3B82F6' },
  { id: 49, fr:'Conseil juridique',  ar:'استشارات قانونية',     Icon:Gavel,          color:'#EF4444' },
  { id: 50, fr:'Livraison',         ar:'توصيل الطلبات',        Icon:Package,        color:'#F26B2A' },
  { id: 51, fr:'Transport marchand.',ar:'نقل البضائع',          Icon:Container,      color:'#0EA5E9' },
  { id: 52, fr:'Location voitures', ar:'كراء السيارات',        Icon:Car,            color:'#EF4444' },
  { id: 53, fr:'Chauffeur privé',   ar:'سائق خاص',            Icon:CarFront,       color:'#3B82F6' },
  { id: 54, fr:"Garde d'enfants",   ar:'حضانة الأطفال',        Icon:Baby,           color:'#EC4899' },
  { id: 55, fr:'Femme de ménage',   ar:'مدبرة منزل',           Icon:Sparkle,        color:'#A855F7' },
  { id: 56, fr:'Soins aux seniors', ar:'رعاية كبار السن',      Icon:HandHeart,      color:'#F43F5E' },
  { id: 57, fr:'Massage',           ar:'تدليك',               Icon:Heart,          color:'#FB7185' },
  { id: 58, fr:'Esthétique',        ar:'تجميل',               Icon:Flower2,        color:'#D946EF' },
  { id: 59, fr:'Maquillage',        ar:'مكياج',               Icon:Brush,          color:'#EC4899' },
  { id: 60, fr:'Manucure',          ar:'العناية بالأظافر',     Icon:Hand,           color:'#F43F5E' },
  { id: 61, fr:'Organisation event',ar:'تنظيم الحفلات',        Icon:PartyPopper,    color:'#F59E0B' },
  { id: 62, fr:'DJ & musique',      ar:'دي جي وموسيقى',        Icon:Music,          color:'#A855F7' },
  { id: 63, fr:'Location matériel', ar:'كراء المعدات',         Icon:Settings,       color:'#0EA5E9' },
  { id: 64, fr:'Coach sportif',     ar:'مدرب رياضي',           Icon:Dumbbell,       color:'#EF4444' },
  { id: 65, fr:'Yoga',              ar:'يوغا',                Icon:PersonStanding, color:'#10B981' },
  { id: 66, fr:'Arts martiaux',     ar:'فنون قتالية',          Icon:Swords,         color:'#F59E0B' },
  { id: 67, fr:'Cours de natation', ar:'دروس السباحة',         Icon:Droplets,       color:'#0EA5E9' },
  { id: 68, fr:'Vétérinaire',       ar:'طبيب بيطري',           Icon:Dog,            color:'#F59E0B' },
  { id: 69, fr:'Coursier',         ar:'ساعي',                Icon:Bike,           color:'#F26B2A' },
  { id: 70, fr:'Animation enfants', ar:'تنشيط الأطفال',        Icon:Smile,          color:'#84CC16' },
];

// ─────────── Card component ───────────
function CatCard({ cat, lang }: { cat: CatEntry; lang: 'fr' | 'ar' }) {
  const { t } = useTranslation();

  function handleClick() {
    router.get('/professionals', { profession: cat.fr });
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      className="relative flex flex-col items-center gap-4 rounded-[18px] border border-white/[0.06] bg-[#161E2E] px-4 py-6 text-center cursor-pointer min-h-[152px] transition-all duration-200 hover:-translate-y-[3px] hover:bg-[#1E2740] hover:border-white/[0.14] focus-visible:outline-2 focus-visible:outline-orange-500"
    >
      {/* Popular badge */}
      {cat.popular && (
        <span className="absolute top-2.5 start-2.5 rounded-full bg-orange-500/[0.12] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-400">
          {lang === 'ar' ? 'شائع' : t('cat_badge_popular')}
        </span>
      )}

      {/* Icon tile */}
      <div
        className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl shadow-[0_6px_18px_rgba(0,0,0,0.28)]"
        style={{ background: cat.color }}
      >
        <cat.Icon size={30} strokeWidth={2.2} className="text-white" />

        {/* Notification dot */}
        {cat.badge && (
          <span
            className="absolute -top-1 -end-1 h-3.5 w-3.5 rounded-full border-[3px] border-[#161E2E] bg-orange-500 transition-[border-color] duration-200"
            style={{ boxShadow: '0 0 0 4px rgba(242,107,42,0.18), 0 0 20px rgba(242,107,42,0.6)' }}
          />
        )}
      </div>

      {/* Label */}
      <span
        className="text-sm font-semibold leading-snug text-white px-1"
        style={lang === 'ar' ? { fontSize: '15px', fontFamily: "'Noto Kufi Arabic', sans-serif" } : undefined}
      >
        {cat[lang]}
      </span>
    </div>
  );
}

// ─────────── Page ───────────
export default function CategoriesPage() {
  const { t } = useTranslation();
  const { language, rtl } = useLanguage();
  const [query, setQuery] = useState('');

  const lang: 'fr' | 'ar' = language === 'ar' ? 'ar' : 'fr';

  const matches = (c: CatEntry) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.fr.toLowerCase().includes(q) || c.ar.includes(query.trim());
  };

  const popular = CATEGORIES.filter(c => c.popular && matches(c));
  const all     = CATEGORIES.filter(matches);

  const countLabel = (n: number) =>
    lang === 'ar' ? `${n} فئة` : `${n} catégorie${n > 1 ? 's' : ''}`;

  return (
    <Layout>
      <Head title={t('cat_page_head')} />

      {/* ── Dark page wrapper ────────────────────────────────────────────── */}
      <div
        dir={rtl ? 'rtl' : 'ltr'}
        className="relative min-h-screen overflow-hidden bg-[#0B1220]"
        style={{ fontFamily: lang === 'ar' ? "'Noto Kufi Arabic', 'DM Sans', sans-serif" : undefined }}
      >
        {/* Gradient decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(900px circle at 85% -10%, rgba(242,107,42,0.10), transparent 55%), ' +
              'radial-gradient(1000px circle at 5% 110%, rgba(59,130,246,0.07), transparent 55%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1340px] px-6 pb-20 pt-12 sm:px-8">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="mb-2">
            <h1
              className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl"
              style={{ letterSpacing: '-0.025em', maxWidth: 820, textWrap: 'balance' } as React.CSSProperties}
            >
              {lang === 'ar'
                ? <>اعثر على <span className="text-orange-500">المهني المناسب</span></>
                : <>{t('cat_title_1')} <span className="text-orange-500">{t('cat_title_2')}</span></>
              }
            </h1>
            <p className="mt-3.5 max-w-[680px] text-base leading-relaxed text-[#98A3BD]">
              {lang === 'ar'
                ? 'اكتشف 70 فئة من الخدمات في جميع أنحاء المغرب. سباكون، كهربائيون، مصورون — تواصل مع المهني الذي تحتاجه.'
                : t('cat_subtitle')}
            </p>

            {/* Search */}
            <div className="relative mt-7 max-w-[560px]">
              <Search
                size={18}
                className="pointer-events-none absolute start-[18px] top-1/2 -translate-y-1/2 text-[#5E6986]"
              />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث عن خدمة…' : t('cat_search_placeholder')}
                autoComplete="off"
                className="w-full rounded-[14px] border border-white/[0.06] bg-[#161E2E] py-[15px] text-[15px] text-white placeholder-[#5E6986] outline-none transition-colors focus:border-orange-500 focus:bg-[#1A2336] ps-[52px] pe-4"
              />
            </div>
          </div>

          {/* ── Section: Populaires ────────────────────────────────────── */}
          <div className="mb-[22px] mt-12 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
              {/* Glowing orange dot */}
              <span
                className="inline-flex h-[9px] w-[9px] shrink-0 rounded-full bg-orange-500"
                style={{ boxShadow: '0 0 0 4px rgba(242,107,42,0.18), 0 0 20px rgba(242,107,42,0.6)' }}
              />
              {lang === 'ar' ? 'الأكثر طلباً' : t('cat_popular_label')}
            </h2>
            <span className="text-sm font-medium tabular-nums text-[#5E6986]">
              {countLabel(popular.length)}
            </span>
          </div>

          {popular.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
              {popular.map(cat => <CatCard key={cat.id} cat={cat} lang={lang} />)}
            </div>
          )}

          {/* ── Section: Toutes ────────────────────────────────────────── */}
          <div className="mb-[22px] mt-12 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {lang === 'ar' ? 'جميع الفئات' : t('cat_all_label')}
            </h2>
            <span className="text-sm font-medium tabular-nums text-[#5E6986]">
              {countLabel(all.length)}
            </span>
          </div>

          {all.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
              {all.map(cat => <CatCard key={cat.id} cat={cat} lang={lang} />)}
            </div>
          )}

          {/* ── Footer hint ────────────────────────────────────────────── */}
          <div
            className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-[22px] border border-white/[0.06] px-8 py-7"
            style={{ background: 'linear-gradient(135deg, rgba(242,107,42,0.07), rgba(27,58,107,0.07))' }}
          >
            <p className="text-[15px] leading-relaxed text-[#98A3BD]" dir={rtl ? 'rtl' : 'ltr'}>
              {lang === 'ar'
                ? <><strong className="text-white font-bold">لم تجد الخدمة التي تبحث عنها؟</strong> صف لنا ما تحتاجه ونصلك بمحترف موثوق.</>
                : <><strong className="text-white font-bold">{t('cat_hint_q')}</strong> {t('cat_hint_a')}</>
              }
            </p>
            <a
              href="/contact"
              className="whitespace-nowrap rounded-full border border-white/[0.14] px-[22px] py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white hover:text-[#0B1220]"
            >
              {lang === 'ar' ? 'اطلب خدمة' : t('cat_hint_btn')}
            </a>
          </div>

        </div>
      </div>
    </Layout>
  );
}

function EmptyState({ lang }: { lang: 'fr' | 'ar' }) {
  const { t } = useTranslation();
  return (
    <div className="col-span-full rounded-[18px] border border-dashed border-white/[0.06] py-14 text-center text-[15px] text-[#98A3BD]">
      {lang === 'ar' ? 'لا توجد فئات مطابقة لبحثك.' : t('cat_empty')}
    </div>
  );
}
