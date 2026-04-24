import { Heart, Phone, MessageCircle, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Professional } from '../types';
import { RatingStars } from './RatingStars';
import { useFavorites } from '../contexts/FavoritesContext';

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative">
        <img
          src={professional.photo || 'https://placehold.co/800x500?text=M3allemClick'}
          alt={professional.name}
          className="h-52 w-full object-cover"
          loading="lazy"
        />
        <button
          onClick={() => toggleFavorite(professional.id)}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-700 shadow"
        >
          <Heart className={`h-4 w-4 ${isFavorite(professional.id) ? 'fill-current text-rose-500' : ''}`} />
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <a href={`/professionals/${professional.slug}`} className="text-lg font-semibold hover:text-brand-600">
              {professional.name}
            </a>
            <p className="text-sm text-slate-500">{professional.profession} • {professional.main_city}</p>
          </div>
          {professional.verified && <BadgeCheck className="h-5 w-5 text-emerald-500" />}
        </div>

        <RatingStars value={professional.rating} />

        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${professional.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {professional.status === 'available' ? 'Disponible' : 'Occupé'}
          </span>
          <span className="text-xs text-slate-500">{professional.completed_missions}+ missions</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a href={`/api/whatsapp/${professional.id}`} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a href={`/api/call/${professional.id}`} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
            <Phone className="h-4 w-4" /> Appeler
          </a>
        </div>
      </div>
    </motion.article>
  );
}
