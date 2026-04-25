import { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

type PriceRange = { min: number; max: number; unit: string; details: string[] };

const PRICE_DB: Record<string, PriceRange> = {
  Plombier:      { min: 150, max: 600,  unit: 'MAD/intervention', details: ['Fuite robinet: 150–250 MAD', 'Debouchage: 200–400 MAD', 'Installation: 300–600 MAD'] },
  Electricien:   { min: 200, max: 800,  unit: 'MAD/intervention', details: ['Prise/interrupteur: 80–150 MAD', 'Tableau electrique: 400–800 MAD', 'Installation: 200–500 MAD'] },
  Peintre:       { min: 25,  max: 80,   unit: 'MAD/m2',           details: ['Peinture interieure: 25–50 MAD/m2', 'Peinture decorative: 50–80 MAD/m2', 'Preparation murs incluse'] },
  Climatisation: { min: 300, max: 1200, unit: 'MAD/intervention', details: ['Installation clim: 500–1200 MAD', 'Nettoyage/entretien: 200–350 MAD', 'Reparation: 300–600 MAD'] },
  Menuisier:     { min: 200, max: 1500, unit: 'MAD/piece',        details: ['Porte bois: 300–800 MAD', 'Placard sur mesure: 800–1500 MAD', 'Reparation: 200–400 MAD'] },
  Menage:        { min: 80,  max: 300,  unit: 'MAD/seance',       details: ['Menage maison: 80–150 MAD', 'Grand nettoyage: 200–350 MAD', 'Nettoyage bureau: 150–300 MAD'] },
  Macon:         { min: 200, max: 1000, unit: 'MAD/jour',         details: ['Carrelage: 80–150 MAD/m2', 'Maconnerie: 200–400 MAD/m2', 'Enduit/crepi: 50–100 MAD/m2'] },
  Serrurier:     { min: 150, max: 600,  unit: 'MAD/intervention', details: ['Ouverture porte: 150–300 MAD', 'Changement serrure: 200–400 MAD', 'Blindage: 400–600 MAD'] },
  Jardinier:     { min: 100, max: 500,  unit: 'MAD/seance',       details: ['Tonte + entretien: 100–200 MAD', 'Creation jardin: 300–500 MAD', 'Arrosage auto: 400–800 MAD'] },
  Informatique:  { min: 100, max: 400,  unit: 'MAD/intervention', details: ['Depannage PC: 100–200 MAD', 'Installation reseau: 200–400 MAD', 'Recuperation donnees: 300–500 MAD'] },
  Demenageur:    { min: 500, max: 3000, unit: 'MAD/demenagement', details: ['Studio: 500–1000 MAD', 'Appartement F3: 1000–2000 MAD', 'Grande villa: 2000–3000 MAD'] },
  Soudeur:       { min: 200, max: 1200, unit: 'MAD/piece',        details: ['Portail metal: 800–1500 MAD', 'Garde-corps: 400–800 MAD', 'Reparation: 200–400 MAD'] },
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
