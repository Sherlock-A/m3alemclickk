import { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

type PriceRange = { min: number; max: number; unit: string; details: string[] };

const PRICE_DB: Record<string, PriceRange> = {
  Plomberie:      { min: 150, max: 600,  unit: 'MAD/intervention', details: ['Fuite robinet: 150–250 MAD', 'Débouchage: 200–400 MAD', 'Installation: 300–600 MAD'] },
  Électricité:    { min: 200, max: 800,  unit: 'MAD/intervention', details: ['Prise/interrupteur: 80–150 MAD', 'Tableau électrique: 400–800 MAD', 'Installation: 200–500 MAD'] },
  Peinture:       { min: 25,  max: 80,   unit: 'MAD/m²',           details: ['Peinture intérieure: 25–50 MAD/m²', 'Peinture décorative: 50–80 MAD/m²', 'Préparation murs incluse'] },
  Climatisation:  { min: 300, max: 1200, unit: 'MAD/intervention', details: ['Installation clim: 500–1200 MAD', 'Nettoyage/entretien: 200–350 MAD', 'Réparation: 300–600 MAD'] },
  Menuiserie:     { min: 200, max: 1500, unit: 'MAD/pièce',        details: ['Porte bois: 300–800 MAD', 'Placard sur mesure: 800–1500 MAD', 'Réparation: 200–400 MAD'] },
  Ménage:         { min: 80,  max: 300,  unit: 'MAD/séance',       details: ['Ménage maison: 80–150 MAD', 'Grand nettoyage: 200–350 MAD', 'Nettoyage bureau: 150–300 MAD'] },
};

export function PriceEstimator({ profession }: { profession: string }) {
  const [open, setOpen] = useState(false);

  const found = Object.entries(PRICE_DB).find(([key]) =>
    profession.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(profession.toLowerCase())
  );

  if (!found) return null;
  const [key, range] = found;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800 dark:text-white">🔮 Estimation de prix IA</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{key}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-green-600 dark:text-green-400">{range.min}–{range.max} {range.unit.split('/')[1] ? '' : ''}<span className="text-xs font-normal text-slate-400 ml-0.5">MAD</span></span>
          {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Fourchette estimée</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{range.unit}</span>
          </div>
          {/* Visual bar */}
          <div className="relative h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: '100%' }} />
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-green-600">{range.min} MAD</span>
            <span className="text-slate-500">prix moyen</span>
            <span className="text-green-600">{range.max} MAD</span>
          </div>
          <ul className="mt-3 space-y-1.5">
            {range.details.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-green-500 mt-0.5">•</span> {d}
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-slate-400 mt-2">* Prix indicatifs. Le tarif final dépend du travail et de la région.</p>
        </div>
      )}
    </div>
  );
}
