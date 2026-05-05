import { X, Star, MapPin, BadgeCheck, MessageCircle, Phone } from 'lucide-react';
import { Professional } from '../types';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: `120px repeat(var(--cols), 1fr)` }}>
      <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-500 flex items-center">
        {label}
      </div>
      {children}
    </div>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 flex items-center justify-center text-center">
      {children}
    </div>
  );
}

type Props = {
  pros: Professional[];
  onRemove: (id: number) => void;
  onClose: () => void;
};

export function ComparePanel({ pros, onRemove, onClose }: Props) {
  if (pros.length < 2) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-2xl"
      style={{ ['--cols' as any]: pros.length }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-sm font-bold text-slate-700 dark:text-white">
          Comparer {pros.length} professionnels
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable compare table */}
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
        <div className="min-w-[500px]">
          {/* Name row */}
          <Row label="Professionnel">
            {pros.map((p) => (
              <Cell key={p.id}>
                <div className="flex flex-col items-center gap-1">
                  <div className="relative">
                    {p.photo
                      ? <img src={p.photo} alt={p.name} className="h-10 w-10 rounded-full object-cover" />
                      : <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-sm">{p.name[0]}</div>}
                    {p.verified && <BadgeCheck className="absolute -bottom-1 -right-1 h-4 w-4 text-emerald-500 bg-white rounded-full" />}
                  </div>
                  <a href={`/professionals/${p.slug}`} className="font-semibold text-xs text-slate-800 dark:text-white hover:text-orange-500 truncate max-w-[100px]">
                    {p.name}
                  </a>
                  <button type="button" onClick={() => onRemove(p.id)} className="text-[10px] text-slate-400 hover:text-red-500">
                    Retirer
                  </button>
                </div>
              </Cell>
            ))}
          </Row>

          <Row label="Métier">
            {pros.map((p) => <Cell key={p.id}><span className="text-orange-600 font-medium text-xs">{p.profession}</span></Cell>)}
          </Row>

          <Row label="Ville">
            {pros.map((p) => (
              <Cell key={p.id}>
                <MapPin className="h-3 w-3 text-slate-400 mr-1 shrink-0" />
                <span className="text-xs">{p.main_city}</span>
              </Cell>
            ))}
          </Row>

          <Row label="Note">
            {pros.map((p) => (
              <Cell key={p.id}>
                {p.rating > 0
                  ? <><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" /><span className="font-semibold text-amber-600">{p.rating.toFixed(1)}</span></>
                  : <span className="text-slate-400 text-xs">—</span>}
              </Cell>
            ))}
          </Row>

          <Row label="Missions">
            {pros.map((p) => (
              <Cell key={p.id}>
                <span className="font-semibold">{p.completed_missions ?? 0}</span>
              </Cell>
            ))}
          </Row>

          <Row label="Disponibilité">
            {pros.map((p) => (
              <Cell key={p.id}>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  p.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {p.is_available ? 'Disponible' : 'Occupé'}
                </span>
              </Cell>
            ))}
          </Row>

          <Row label="Contact">
            {pros.map((p) => (
              <Cell key={p.id}>
                <div className="flex gap-1.5">
                  <a href={`/api/whatsapp/${p.id}`}
                    className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-600">
                    <MessageCircle className="h-3 w-3" /> WA
                  </a>
                  <a href={`/api/call/${p.id}`}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white hover:bg-slate-700">
                    <Phone className="h-3 w-3" /> Tel
                  </a>
                </div>
              </Cell>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}
