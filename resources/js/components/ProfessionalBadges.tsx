import { Professional } from '../types';

type Badge = { icon: string; label: string; color: string; bg: string };

export function computeBadges(pro: Professional): Badge[] {
  const badges: Badge[] = [];
  const reviewCount = (pro.reviews || []).filter((r) => r.approved).length;

  if (pro.verified)
    badges.push({ icon: '✅', label: 'Vérifié', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' });

  if (pro.rating >= 4.5 && reviewCount >= 3)
    badges.push({ icon: '🏆', label: 'Top Pro', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' });

  if (pro.completed_missions >= 10)
    badges.push({ icon: '🎖️', label: 'Expert', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' });

  if (pro.status === 'available')
    badges.push({ icon: '⚡', label: 'Pro Rapide', color: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800' });

  if (reviewCount >= 10)
    badges.push({ icon: '💼', label: 'Expérimenté', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' });

  if (pro.rating >= 5 && reviewCount >= 5)
    badges.push({ icon: '🌟', label: 'Excellence', color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' });

  return badges;
}

export function ProfessionalBadges({ professional, size = 'md' }: { professional: Professional; size?: 'sm' | 'md' }) {
  const badges = computeBadges(professional);
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <span
          key={b.label}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold ${b.bg} ${b.color} ${size === 'sm' ? 'text-xs' : 'text-xs'}`}
          title={b.label}
        >
          <span>{b.icon}</span> {b.label}
        </span>
      ))}
    </div>
  );
}
