import { useEffect } from 'react';
import { useCookieConsent } from '../contexts/CookieConsentContext';

const GA4_ID    = (import.meta.env.VITE_GA4_ID      as string | undefined) || '';
const FB_PIXEL  = (import.meta.env.VITE_FB_PIXEL_ID as string | undefined) || '';

declare global {
  interface Window {
    dataLayer: any[];
    gtag:      (...args: any[]) => void;
    fbq:       (...args: any[]) => void;
    _fbq:      any;
  }
}

export function ConsentScripts() {
  const { prefs } = useCookieConsent();

  // ── Google Analytics 4 ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!GA4_ID) return;

    if (prefs.analytics) {
      if (document.getElementById('ga4-script')) return;

      // Initialisation dans le bundle React — pas de script inline → pas de nonce requis
      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: any[]) => { window.dataLayer.push(args); };
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID, { anonymize_ip: true });

      const s = document.createElement('script');
      s.id    = 'ga4-script';
      s.src   = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      s.async = true;
      document.head.appendChild(s);
    } else {
      document.getElementById('ga4-script')?.remove();
    }
  }, [prefs.analytics]);

  // ── Facebook Pixel ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!FB_PIXEL) return;

    if (prefs.marketing) {
      if (document.getElementById('fb-pixel')) return;

      // Initialisation dans le bundle React — pas de script inline
      const fbq = (...args: any[]) => {
        if ((fbq as any).callMethod) (fbq as any).callMethod(...args);
        else (fbq as any).queue.push(args);
      };
      (fbq as any).push    = fbq;
      (fbq as any).loaded  = true;
      (fbq as any).version = '2.0';
      (fbq as any).queue   = [];
      window.fbq  = fbq;
      window._fbq = fbq;
      fbq('init', FB_PIXEL);
      fbq('track', 'PageView');

      const s = document.createElement('script');
      s.id    = 'fb-pixel';
      s.src   = 'https://connect.facebook.net/en_US/fbevents.js';
      s.async = true;
      document.head.appendChild(s);
    } else {
      document.getElementById('fb-pixel')?.remove();
    }
  }, [prefs.marketing]);

  return null;
}
