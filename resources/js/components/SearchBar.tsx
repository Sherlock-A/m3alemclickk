import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { MapPin, LocateFixed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { SmartProfessionInput } from './SmartProfessionInput';

const searchSchema = z.object({
  city: z.string().optional(),
  profession: z.string().optional(),
});

type SearchValues = z.infer<typeof searchSchema>;

function CityAutocomplete({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    try {
      const res = await axios.get<string[]>('/api/cities/autocomplete', { params: { q } });
      setSuggestions(res.data.slice(0, 6));
      setOpen(true);
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestions(value), 200);
    return () => clearTimeout(t);
  }, [value, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
      <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full border-none bg-transparent py-3 text-sm focus:ring-0 focus:outline-none"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 top-full z-50 mt-1 w-full rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
          {suggestions.map((city) => (
            <li key={city}>
              <button
                type="button"
                onMouseDown={() => { onChange(city); setOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SearchBar({ initialCity = '', initialProfession = '' }: { initialCity?: string; initialProfession?: string }) {
  const { t } = useTranslation();
  const form = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { city: initialCity, profession: initialProfession },
  });

  const cityValue = form.watch('city') || '';

  const onSubmit = (values: SearchValues) => {
    const params: Record<string, string> = {};
    if (values.city?.trim()) params.city = values.city.trim();
    if (values.profession?.trim()) params.profession = values.profession.trim();
    router.get('/professionals', params);
  };

  const geolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`,
          { headers: { 'User-Agent': 'Jobly/1.0' } }
        );
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
        if (city) form.setValue('city', city);
      } catch {}
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="glass grid gap-3 rounded-3xl p-4 shadow-soft md:grid-cols-[1fr_1fr_auto_auto]">
      <CityAutocomplete
        value={cityValue}
        onChange={(v) => form.setValue('city', v)}
        placeholder={t('city')}
      />

      <SmartProfessionInput
        value={form.watch('profession') || ''}
        onChange={(v) => form.setValue('profession', v)}
        placeholder={t('profession')}
      />

      <button
        type="button"
        onClick={geolocate}
        title="Détecter ma position"
        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors"
      >
        <LocateFixed className="h-4 w-4 text-orange-500" />
        <span className="hidden sm:inline">GPS</span>
      </button>

      <button type="submit" className="rounded-2xl bg-orange-500 hover:bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors shadow-sm">
        {t('search')}
      </button>
    </form>
  );
}
