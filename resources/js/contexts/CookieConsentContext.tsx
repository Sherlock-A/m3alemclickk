import { createContext, useContext, useMemo, useState } from 'react';

export type ConsentPrefs = { analytics: boolean; marketing: boolean };

type ConsentContextValue = {
  consented:    boolean;
  prefs:        ConsentPrefs;
  grantAll:     () => void;
  denyAll:      () => void;
  savePrefs:    (p: ConsentPrefs) => void;
  resetConsent: () => void;
};

const STORAGE_KEY = 'jobly_cookie_consent';

function readStorage(): { consented: boolean; prefs: ConsentPrefs } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { consented: false, prefs: { analytics: false, marketing: false } };
    const p = JSON.parse(raw);
    return { consented: true, prefs: { analytics: !!p.analytics, marketing: !!p.marketing } };
  } catch {
    return { consented: false, prefs: { analytics: false, marketing: false } };
  }
}

const CookieConsentContext = createContext<ConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const init = readStorage();
  const [consented, setConsented] = useState(init.consented);
  const [prefs, setPrefsState]    = useState<ConsentPrefs>(init.prefs);

  function persist(p: ConsentPrefs) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
    setPrefsState(p);
    setConsented(true);
  }

  const value = useMemo(() => ({
    consented,
    prefs,
    grantAll:     () => persist({ analytics: true, marketing: true }),
    denyAll:      () => persist({ analytics: false, marketing: false }),
    savePrefs:    persist,
    resetConsent: () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setConsented(false);
      setPrefsState({ analytics: false, marketing: false });
    },
  }), [consented, prefs]);

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be inside CookieConsentProvider');
  return ctx;
}
