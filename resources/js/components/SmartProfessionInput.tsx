import { useEffect, useRef, useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

// Synonym map: user input → canonical profession name (must match category names in DB)
const SYNONYMS: Record<string, string> = {
  // Plomberie
  plombier: 'Plomberie', plombiere: 'Plomberie', plomber: 'Plomberie',
  'fuite eau': 'Plomberie', 'fuite': 'Plomberie', robinet: 'Plomberie',
  tuyau: 'Plomberie', sanitaire: 'Plomberie', wc: 'Plomberie',
  // Électricité
  electricien: 'Électricité', electricite: 'Électricité', electrique: 'Électricité',
  'panne electrique': 'Électricité', disjoncteur: 'Électricité', courant: 'Électricité',
  // Peinture
  peintre: 'Peinture', peindre: 'Peinture', badigeon: 'Peinture',
  mur: 'Peinture', enduit: 'Peinture', ravalement: 'Peinture',
  // Climatisation
  clim: 'Climatisation', climatiseur: 'Climatisation', 'air conditionne': 'Climatisation',
  froid: 'Climatisation', chaud: 'Climatisation', chauffage: 'Climatisation',
  // Menuiserie
  menuisier: 'Menuiserie', bois: 'Menuiserie', porte: 'Menuiserie',
  fenetre: 'Menuiserie', placard: 'Menuiserie', meuble: 'Menuiserie',
  // Ménage
  menage: 'Ménage', nettoyage: 'Ménage', femme: 'Ménage', propre: 'Ménage',
  nettoyeur: 'Ménage', maison: 'Ménage', appartement: 'Ménage',
};

// All known professions (canonical names matching DB categories)
const PROFESSIONS = [
  'Plomberie', 'Électricité', 'Peinture', 'Climatisation', 'Menuiserie', 'Ménage',
];

// Levenshtein distance for spell correction
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

type Suggestion = { label: string; canonical: string; type: 'exact' | 'synonym' | 'fuzzy' };

function getSuggestions(query: string): Suggestion[] {
  if (!query.trim()) return [];
  const q = normalize(query);
  const results: Suggestion[] = [];
  const seen = new Set<string>();

  // 1. Exact / prefix match on profession names
  for (const p of PROFESSIONS) {
    const pn = normalize(p);
    if (pn.startsWith(q) || pn.includes(q)) {
      if (!seen.has(p)) { results.push({ label: p, canonical: p, type: 'exact' }); seen.add(p); }
    }
  }

  // 2. Synonym lookup
  for (const [key, canonical] of Object.entries(SYNONYMS)) {
    const kn = normalize(key);
    if (kn.startsWith(q) || kn.includes(q)) {
      if (!seen.has(canonical)) {
        results.push({ label: `${canonical} (${key})`, canonical, type: 'synonym' }); seen.add(canonical);
      }
    }
  }

  // 3. Fuzzy spell correction (only when no exact matches)
  if (results.length === 0 && q.length >= 3) {
    const candidates: { p: string; dist: number }[] = [];
    for (const p of PROFESSIONS) {
      const dist = levenshtein(q, normalize(p));
      if (dist <= 3) candidates.push({ p, dist });
    }
    for (const [key, canonical] of Object.entries(SYNONYMS)) {
      const dist = levenshtein(q, normalize(key));
      if (dist <= 2 && !seen.has(canonical)) candidates.push({ p: canonical, dist });
    }
    candidates.sort((a, b) => a.dist - b.dist);
    for (const { p } of candidates.slice(0, 3)) {
      if (!seen.has(p)) { results.push({ label: p, canonical: p, type: 'fuzzy' }); seen.add(p); }
    }
  }

  return results.slice(0, 5);
}

type Props = {
  value: string;
  onChange: (v: string) => void;
  onResolvedCanonical?: (canonical: string) => void;
  placeholder?: string;
};

export function SmartProfessionInput({ value, onChange, onResolvedCanonical, placeholder = 'Métier, service...' }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sugg = getSuggestions(value);
    setSuggestions(sugg);
    setOpen(sugg.length > 0 && value.trim().length > 0);
    // If the user typed something that maps exactly to a canonical name, resolve it
    const q = normalize(value);
    const direct = SYNONYMS[q];
    if (direct) onResolvedCanonical?.(direct);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Show AI badge after user has typed 2+ chars without a direct match
  useEffect(() => {
    setShowAi(value.trim().length >= 2 && suggestions.some((s) => s.type === 'fuzzy'));
  }, [suggestions, value]);

  const pick = (s: Suggestion) => {
    onChange(s.canonical);
    onResolvedCanonical?.(s.canonical);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
      <Search className="h-4 w-4 text-slate-500 shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full border-none bg-transparent py-3 text-sm focus:ring-0 focus:outline-none"
      />
      {showAi && (
        <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-semibold text-violet-500 bg-violet-50 dark:bg-violet-900/20 rounded-full px-1.5 py-0.5">
          <Sparkles className="h-2.5 w-2.5" /> IA
        </span>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 top-full z-50 mt-1 w-full rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={() => pick(s)}
                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {s.type === 'fuzzy' && <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0" />}
                  {s.label}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
              </button>
            </li>
          ))}
          {suggestions.some((s) => s.type === 'fuzzy') && (
            <li className="px-4 py-1.5 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-violet-400" /> Suggestions IA basées sur votre saisie
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
