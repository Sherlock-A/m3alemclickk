import { useMemo } from 'react';
import { Smile, Meh, Frown, TrendingUp, MessageSquare } from 'lucide-react';
type R = { approved?: boolean; comment?: string | null; rating?: number };

const POS_WORDS = [
  'excellent', 'parfait', 'rapide', 'professionnel', 'propre', 'sérieux', 'ponctuel',
  'efficace', 'qualité', 'recommande', 'super', 'bien', 'bravo', 'merci', 'satisfaction',
  'compétent', 'honnête', 'travail', 'impeccable', 'génial', 'fantastique', 'top', 'meilleur',
  'agréable', 'correct', 'soigneux', 'attentionné',
];
const NEG_WORDS = [
  'mauvais', 'lent', 'cher', 'problème', 'décevant', 'nul', 'incompétent', 'retard',
  'sale', 'déçu', 'arnaque', 'cher', 'bof', 'médiocre', 'pire', 'éviter', 'catastrophe',
  'horreur', 'nul', 'fuyez', 'vole', 'déçu', 'dommage',
];

function analyzeSentiment(comment: string): 'positive' | 'neutral' | 'negative' {
  if (!comment) return 'neutral';
  const text = comment.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  let pos = 0, neg = 0;
  POS_WORDS.forEach((w) => { if (text.includes(w)) pos++; });
  NEG_WORDS.forEach((w) => { if (text.includes(w)) neg++; });
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

type SentimentResult = { positive: number; neutral: number; negative: number; score: number; keywords: string[] };

function analyzeAll(reviews: R[]): SentimentResult {
  const approved = reviews.filter((r) => r.approved && r.comment);
  if (approved.length === 0) return { positive: 0, neutral: 0, negative: 0, score: 0, keywords: [] };

  let pos = 0, neu = 0, neg = 0;
  const kws = new Map<string, number>();

  approved.forEach((r) => {
    const s = analyzeSentiment(r.comment ?? '');
    if (s === 'positive') pos++;
    else if (s === 'negative') neg++;
    else neu++;

    const text = (r.comment || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    [...POS_WORDS, ...NEG_WORDS].forEach((w) => {
      if (text.includes(w)) kws.set(w, (kws.get(w) || 0) + 1);
    });
  });

  const keywords = [...kws.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);

  const score = approved.length > 0 ? Math.round(((pos + neu * 0.5) / approved.length) * 100) : 0;

  return { positive: pos, neutral: neu, negative: neg, score, keywords };
}

export function SentimentDashboard({ reviews }: { reviews: R[] }) {
  const result = useMemo(() => analyzeAll(reviews), [reviews]);
  const total = result.positive + result.neutral + result.negative;

  if (total === 0) return (
    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 py-8 text-center">
      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-200 dark:text-slate-700" />
      <p className="text-sm text-slate-500">Pas encore assez d'avis pour l'analyse.</p>
    </div>
  );

  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  const scoreColor = result.score >= 75 ? 'text-emerald-500' : result.score >= 50 ? 'text-amber-500' : 'text-red-500';
  const scoreLabel = result.score >= 75 ? 'Excellent' : result.score >= 50 ? 'Satisfaisant' : 'À améliorer';

  return (
    <div className="space-y-4">
      {/* Score global */}
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-600" />
            <circle
              cx="32" cy="32" r="28" fill="none" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${result.score * 1.759} 175.9`}
              className={result.score >= 75 ? 'text-emerald-500' : result.score >= 50 ? 'text-amber-500' : 'text-red-500'}
              stroke="currentColor"
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-lg font-black ${scoreColor}`}>{result.score}</span>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Score satisfaction</p>
          <p className={`text-xl font-black ${scoreColor}`}>{scoreLabel}</p>
          <p className="text-xs text-slate-400">{total} avis analysés par IA</p>
        </div>
      </div>

      {/* Sentiment bars */}
      <div className="space-y-2">
        {[
          { label: 'Positifs', icon: Smile, count: result.positive, pct: pct(result.positive), color: 'bg-emerald-400', text: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Neutres',  icon: Meh,   count: result.neutral,  pct: pct(result.neutral),  color: 'bg-amber-400',   text: 'text-amber-600 dark:text-amber-400' },
          { label: 'Négatifs', icon: Frown,  count: result.negative, pct: pct(result.negative), color: 'bg-red-400',     text: 'text-red-600 dark:text-red-400' },
        ].map(({ label, icon: Icon, count, pct: p, color, text }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className={`h-4 w-4 shrink-0 ${text}`} />
            <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${p}%` }} />
            </div>
            <span className="text-xs text-slate-500 w-16 text-right">{count} ({p}%)</span>
          </div>
        ))}
      </div>

      {/* Keywords */}
      {result.keywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Mots-clés fréquents
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.keywords.map((kw) => {
              const isPos = POS_WORDS.includes(kw);
              return (
                <span key={kw} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  isPos ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}>
                  {kw}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
