import { Heart, Phone, MessageCircle, BadgeCheck, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Category, Professional } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCatName } from '../hooks/useCatName';

const AVATAR_GRADIENTS = [
  'from-orange-400 to-orange-600',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-orange-400',
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-emerald-400 to-teal-600',
];

function Avatar({ name, photo, size = 48 }: { name: string; photo?: string | null; size?: number }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="rounded-full object-cover border-2 border-orange-200 dark:border-orange-700 shadow-sm shrink-0"
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }
  const grad = AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
  return (
    <div
      className={`rounded-full bg-gradient-to-br ${grad} flex items-center justify-center font-black text-white shrink-0 shadow-sm`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {name[0].toUpperCase()}
    </div>
  );
}

type CardProps = {
  professional: Professional;
  onCompare?: (p: Professional) => void;
  inCompare?: boolean;
  compareDisabled?: boolean;
  index?: number;
};

export function ProfessionalCard({ professional, onCompare, inCompare, compareDisabled, index = 0 }: CardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useTranslation();
  const getCatName = useCatName();

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(249,115,22,0.14)' }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 h-full"
    >
      <div className="p-4">
        {/* ── Header: avatar + nom + métier + ville ── */}
        <div className="flex items-start gap-3">
          <Avatar name={professional.name} photo={professional.photo} size={48} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <a
                href={professional.slug ? `/professionals/${professional.slug}` : `/professionals?search=${encodeURIComponent(professional.name)}`}
                className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate"
              >
                {professional.name}
              </a>
              {professional.verified && (
                <span className="inline-flex items-center gap-0.5 shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                  <BadgeCheck className="h-3 w-3" />
                  {t('verified')}
                </span>
              )}
            </div>
            <p className="text-sm text-orange-600 font-medium truncate">{professional.profession}</p>
            <p className="flex items-center gap-0.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0" /> {professional.main_city}
            </p>
            {(professional.categories ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {(professional.categories as Category[]).slice(0, 3).map(cat => (
                  <span key={cat.id}
                    className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-300">
                    {cat.icon} {getCatName(cat)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => toggleFavorite(professional.id)}
            aria-label={isFavorite(professional.id) ? t('show_fav_remove') : t('show_fav_add')}
            className="shrink-0 rounded-full p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
          >
            <Heart className={`h-4 w-4 ${isFavorite(professional.id) ? 'fill-current text-rose-500' : ''}`} aria-hidden="true" />
          </button>
        </div>

        {/* ── Rating + statut ── */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {professional.rating > 0 ? (
              <>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-amber-600">{professional.rating.toFixed(1)}</span>
              </>
            ) : (
              <span className="text-xs text-slate-400">{t('card_new')}</span>
            )}
            {professional.completed_missions > 0 && (
              <span className="text-xs text-slate-400">· {professional.completed_missions} missions</span>
            )}
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            professional.status === 'available'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {professional.status === 'available' ? t('card_available') : t('card_busy')}
          </span>
        </div>

        {/* ── CTA ── */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={`/api/whatsapp/${professional.id}`}
            aria-label={`WhatsApp — ${professional.name}`}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp
          </a>
          <a
            href={`/api/call/${professional.id}`}
            aria-label={`${t('call')} ${professional.name}`}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-slate-700 hover:bg-slate-800 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {t('call')}
          </a>
        </div>

        {/* ── Compare checkbox ── */}
        {onCompare && (
          <button
            type="button"
            onClick={() => onCompare(professional)}
            disabled={compareDisabled && !inCompare}
            className={`mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
              inCompare
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                : compareDisabled
                  ? 'border-slate-200 text-slate-300 dark:border-slate-700 dark:text-slate-600 cursor-not-allowed'
                  : 'border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            <span className={`h-3.5 w-3.5 rounded border flex-shrink-0 flex items-center justify-center ${inCompare ? 'border-brand-500 bg-brand-500' : 'border-slate-300 dark:border-slate-600'}`}>
              {inCompare && <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white fill-white"><path d="M10 3L5 8.5 2 5.5"/></svg>}
            </span>
            {inCompare ? t('card_in_compare') : t('card_compare')}
          </button>
        )}
      </div>
    </motion.article>
  );
}
