type Props = {
  name: string;
  size?: number;
  className?: string;
};

// Maps category name (case-insensitive, partial match) → SVG
const ICONS: Record<string, JSX.Element> = {
  plomb: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#3b82f6"/>
      <rect x="6" y="20" width="22" height="8" rx="3" fill="white"/>
      <rect x="22" y="8" width="8" height="14" rx="3" fill="white"/>
      <rect x="20" y="6" width="12" height="6" rx="3" fill="white"/>
      <ellipse cx="26" cy="37" rx="3" ry="4" fill="white" opacity="0.7"/>
      <path d="M32 22 Q36 18 40 22 Q38 24 36 23 L34 25 L32 23 Z" fill="#f59e0b"/>
      <rect x="30" y="23" width="10" height="3" rx="1.5" fill="#f59e0b" transform="rotate(-45 35 24.5)"/>
    </svg>
  ),
  electr: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#f59e0b"/>
      <path d="M28 6 L16 26 L22 26 L20 42 L32 22 L26 22 Z" fill="white"/>
    </svg>
  ),
  peint: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#8b5cf6"/>
      <rect x="28" y="8" width="4" height="20" rx="2" fill="white"/>
      <rect x="14" y="8" width="16" height="4" rx="2" fill="white"/>
      <rect x="10" y="10" width="10" height="14" rx="3" fill="white" opacity="0.9"/>
      <ellipse cx="13" cy="27" rx="2" ry="3" fill="white" opacity="0.6"/>
      <ellipse cx="18" cy="29" rx="2" ry="4" fill="white" opacity="0.6"/>
      <path d="M8 34 Q8 40 14 40 L34 40 Q40 40 40 36 L40 34 Z" fill="white" opacity="0.8"/>
      <ellipse cx="20" cy="34" rx="8" ry="3" fill="#c4b5fd" opacity="0.8"/>
    </svg>
  ),
  menuiser: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#d97706"/>
      <path d="M8 30 L10 26 L12 30 L14 26 L16 30 L18 26 L20 30 L22 26 L24 30 L26 26 L28 30 L28 34 L8 34 Z" fill="white"/>
      <path d="M26 20 L40 14 L40 18 L30 26 L28 30 Z" fill="white" opacity="0.9"/>
      <rect x="6" y="36" width="36" height="6" rx="2" fill="white" opacity="0.5"/>
      <line x1="14" y1="36" x2="14" y2="42" stroke="#d97706" strokeWidth="1" opacity="0.5"/>
      <line x1="24" y1="36" x2="24" y2="42" stroke="#d97706" strokeWidth="1" opacity="0.5"/>
      <line x1="34" y1="36" x2="34" y2="42" stroke="#d97706" strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  macon: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#64748b"/>
      <rect x="6" y="30" width="16" height="8" rx="2" fill="white" opacity="0.9"/>
      <rect x="24" y="30" width="18" height="8" rx="2" fill="white" opacity="0.9"/>
      <rect x="6" y="20" width="10" height="8" rx="2" fill="white" opacity="0.75"/>
      <rect x="18" y="20" width="18" height="8" rx="2" fill="white" opacity="0.75"/>
      <rect x="38" y="20" width="4" height="8" rx="2" fill="white" opacity="0.75"/>
      <path d="M28 6 L38 16 L34 18 L24 8 Z" fill="#f59e0b"/>
      <rect x="36" y="14" width="3" height="10" rx="1.5" fill="#f59e0b" transform="rotate(45 37.5 19)"/>
    </svg>
  ),
  carrel: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0891b2"/>
      <g transform="rotate(-15 24 24)">
        <rect x="8" y="8" width="13" height="13" rx="2" fill="white" opacity="0.9"/>
        <rect x="23" y="8" width="13" height="13" rx="2" fill="white" opacity="0.6"/>
        <rect x="8" y="23" width="13" height="13" rx="2" fill="white" opacity="0.6"/>
        <rect x="23" y="23" width="13" height="13" rx="2" fill="white" opacity="0.9"/>
      </g>
      <circle cx="38" cy="38" r="7" fill="#f59e0b"/>
      <path d="M35 38 L38 34 L41 38 L38 42 Z" fill="white"/>
    </svg>
  ),
  clim: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#06b6d4"/>
      <rect x="6" y="10" width="36" height="18" rx="5" fill="white" opacity="0.9"/>
      <rect x="10" y="15" width="28" height="2" rx="1" fill="#06b6d4" opacity="0.5"/>
      <rect x="10" y="20" width="28" height="2" rx="1" fill="#06b6d4" opacity="0.5"/>
      <line x1="24" y1="32" x2="24" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="18" y1="35" x2="30" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="35" x2="18" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="32" r="1.5" fill="white"/>
      <circle cx="24" cy="44" r="1.5" fill="white"/>
      <circle cx="18" cy="35" r="1.5" fill="white"/>
      <circle cx="30" cy="41" r="1.5" fill="white"/>
      <circle cx="30" cy="35" r="1.5" fill="white"/>
      <circle cx="18" cy="41" r="1.5" fill="white"/>
    </svg>
  ),
  serrur: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#1d4ed8"/>
      <circle cx="16" cy="18" r="8" fill="none" stroke="white" strokeWidth="4"/>
      <circle cx="16" cy="18" r="3" fill="white"/>
      <rect x="22" y="16" width="18" height="4" rx="2" fill="white"/>
      <rect x="32" y="20" width="4" height="5" rx="1" fill="white"/>
      <rect x="38" y="20" width="4" height="8" rx="1" fill="white"/>
      <rect x="10" y="30" width="16" height="12" rx="3" fill="white" opacity="0.85"/>
      <path d="M13 30 L13 25 Q13 20 18 20 Q23 20 23 25 L23 30" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="18" cy="36" r="2.5" fill="#1d4ed8"/>
      <rect x="17" y="36" width="2" height="4" rx="1" fill="#1d4ed8"/>
    </svg>
  ),
  jardin: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#16a34a"/>
      <path d="M24 42 Q24 30 24 18" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M24 28 Q14 22 12 12 Q20 14 24 24" fill="white" opacity="0.85"/>
      <path d="M24 22 Q34 16 36 8 Q28 10 24 20" fill="white"/>
      <path d="M8 42 Q8 38 14 38 L34 38 Q40 38 40 42 Z" fill="white" opacity="0.5"/>
      <circle cx="16" cy="40" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="24" cy="41" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="32" cy="40" r="1.5" fill="white" opacity="0.6"/>
    </svg>
  ),
  menage: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0284c7"/>
      <rect x="22" y="6" width="4" height="26" rx="2" fill="white"/>
      <path d="M12 32 Q12 44 24 44 Q36 44 36 32 Z" fill="white" opacity="0.9"/>
      <line x1="18" y1="36" x2="16" y2="44" stroke="#0284c7" strokeWidth="1.5" opacity="0.4"/>
      <line x1="24" y1="34" x2="24" y2="44" stroke="#0284c7" strokeWidth="1.5" opacity="0.4"/>
      <line x1="30" y1="36" x2="32" y2="44" stroke="#0284c7" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="38" cy="14" r="4" fill="white" opacity="0.5"/>
      <circle cx="34" cy="8" r="2.5" fill="white" opacity="0.4"/>
      <circle cx="42" cy="22" r="3" fill="white" opacity="0.35"/>
    </svg>
  ),
  nettoy: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0284c7"/>
      <rect x="22" y="6" width="4" height="26" rx="2" fill="white"/>
      <path d="M12 32 Q12 44 24 44 Q36 44 36 32 Z" fill="white" opacity="0.9"/>
      <line x1="18" y1="36" x2="16" y2="44" stroke="#0284c7" strokeWidth="1.5" opacity="0.4"/>
      <line x1="24" y1="34" x2="24" y2="44" stroke="#0284c7" strokeWidth="1.5" opacity="0.4"/>
      <line x1="30" y1="36" x2="32" y2="44" stroke="#0284c7" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="38" cy="14" r="4" fill="white" opacity="0.5"/>
      <circle cx="34" cy="8" r="2.5" fill="white" opacity="0.4"/>
      <circle cx="42" cy="22" r="3" fill="white" opacity="0.35"/>
    </svg>
  ),
  demenag: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#dc2626"/>
      <rect x="4" y="22" width="26" height="16" rx="3" fill="white" opacity="0.9"/>
      <path d="M30 30 L30 38 L44 38 L44 32 L38 22 L30 22 Z" fill="white" opacity="0.8"/>
      <path d="M32 24 L38 24 L42 30 L32 30 Z" fill="#dc2626" opacity="0.5"/>
      <circle cx="12" cy="38" r="5" fill="#dc2626"/>
      <circle cx="12" cy="38" r="2.5" fill="white" opacity="0.6"/>
      <circle cx="36" cy="38" r="5" fill="#dc2626"/>
      <circle cx="36" cy="38" r="2.5" fill="white" opacity="0.6"/>
      <rect x="8" y="14" width="14" height="10" rx="2" fill="#f59e0b"/>
      <line x1="15" y1="14" x2="15" y2="24" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <line x1="8" y1="19" x2="22" y2="19" stroke="white" strokeWidth="1.5" opacity="0.7"/>
    </svg>
  ),
  informat: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#7c3aed"/>
      <rect x="6" y="28" width="36" height="4" rx="2" fill="white" opacity="0.7"/>
      <rect x="10" y="12" width="28" height="18" rx="3" fill="white" opacity="0.9"/>
      <rect x="13" y="15" width="10" height="2" rx="1" fill="#7c3aed" opacity="0.5"/>
      <rect x="13" y="19" width="16" height="2" rx="1" fill="#7c3aed" opacity="0.4"/>
      <rect x="13" y="23" width="12" height="2" rx="1" fill="#7c3aed" opacity="0.4"/>
      <path d="M30 20 L30 27 L32 25 L34 29 L35.5 28.5 L33.5 24.5 L36 24.5 Z" fill="#f59e0b"/>
      <rect x="14" y="34" width="20" height="2" rx="1" fill="white" opacity="0.5"/>
    </svg>
  ),
  toiture: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#b45309"/>
      <path d="M6 28 L24 8 L42 28 Z" fill="white" opacity="0.9"/>
      <path d="M14 22 Q14 19 18 19 Q18 22 14 22Z" fill="#b45309" opacity="0.3"/>
      <path d="M20 18 Q20 15 24 15 Q24 18 20 18Z" fill="#b45309" opacity="0.3"/>
      <path d="M26 22 Q26 19 30 19 Q30 22 26 22Z" fill="#b45309" opacity="0.3"/>
      <path d="M18 26 Q18 23 22 23 Q22 26 18 26Z" fill="#b45309" opacity="0.3"/>
      <path d="M24 26 Q24 23 28 23 Q28 26 24 26Z" fill="#b45309" opacity="0.3"/>
      <rect x="12" y="28" width="24" height="14" rx="2" fill="white" opacity="0.8"/>
      <rect x="20" y="34" width="8" height="8" rx="2" fill="#b45309" opacity="0.6"/>
      <rect x="32" y="16" width="6" height="12" rx="1" fill="white" opacity="0.75"/>
      <path d="M33 14 Q31 10 34 8 Q37 6 35 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
  piscine: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0369a1"/>
      <rect x="6" y="24" width="36" height="18" rx="4" fill="white" opacity="0.85"/>
      <path d="M6 30 Q12 27 18 30 Q24 33 30 30 Q36 27 42 30" fill="none" stroke="#0369a1" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      <path d="M6 36 Q12 33 18 36 Q24 39 30 36 Q36 33 42 36" fill="none" stroke="#0369a1" strokeWidth="2" opacity="0.3" strokeLinecap="round"/>
      <line x1="36" y1="14" x2="36" y2="28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="42" y1="14" x2="42" y2="28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="36" y1="18" x2="42" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="36" y1="23" x2="42" y2="23" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="6" fill="#f59e0b"/>
      <line x1="16" y1="7" x2="16" y2="5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="10" x2="24" y2="8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="10" x2="8" y2="8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  soudure: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#374151"/>
      <rect x="6" y="22" width="24" height="6" rx="3" fill="white" opacity="0.85"/>
      <path d="M28 23 L34 21 L36 24 L34 27 L28 25 Z" fill="white" opacity="0.75"/>
      <path d="M36 24 Q40 18 38 12 Q42 16 42 22 Q44 18 42 14 Q46 20 44 28 Q42 34 36 28 Q38 26 36 24Z" fill="#f59e0b"/>
      <circle cx="40" cy="12" r="1.5" fill="#fcd34d" opacity="0.8"/>
      <circle cx="44" cy="16" r="1" fill="#fcd34d" opacity="0.7"/>
      <circle cx="38" cy="8" r="1" fill="white" opacity="0.6"/>
      <path d="M6 25 Q6 38 14 40 L20 40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  securit: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#dc2626"/>
      <path d="M24 6 L38 12 L38 26 Q38 36 24 42 Q10 36 10 26 L10 12 Z" fill="white" opacity="0.9"/>
      <path d="M17 24 L22 29 L31 18" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  antenne: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0f172a"/>
      <path d="M8 30 Q8 14 24 10 Q40 14 40 30 Z" fill="white" opacity="0.85"/>
      <path d="M8 30 Q8 34 16 34 L32 34 Q40 34 40 30" fill="white" opacity="0.6"/>
      <line x1="24" y1="14" x2="34" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="34" cy="10" r="4" fill="#f59e0b"/>
      <rect x="22" y="34" width="4" height="10" rx="2" fill="white" opacity="0.7"/>
      <rect x="14" y="42" width="20" height="3" rx="1.5" fill="white" opacity="0.5"/>
      <path d="M38 6 Q42 10 38 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M40 3 Q46 8 40 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  ),
  chauff: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#ef4444"/>
      <rect x="10" y="14" width="28" height="22" rx="5" fill="white" opacity="0.9"/>
      <circle cx="24" cy="25" r="7" fill="#ef4444" opacity="0.7"/>
      <circle cx="24" cy="25" r="4" fill="white" opacity="0.9"/>
      <line x1="24" y1="25" x2="24" y2="20" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
      <rect x="16" y="36" width="4" height="8" rx="2" fill="white" opacity="0.8"/>
      <rect x="28" y="36" width="4" height="8" rx="2" fill="white" opacity="0.8"/>
      <path d="M20 14 Q18 8 24 6 Q22 10 26 8 Q28 12 24 14Z" fill="#f59e0b"/>
      <circle cx="14" cy="22" r="2" fill="#ef4444" opacity="0.6"/>
      <circle cx="14" cy="28" r="2" fill="#ef4444" opacity="0.6"/>
    </svg>
  ),
  vitr: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0ea5e9"/>
      <rect x="6" y="8" width="36" height="32" rx="3" fill="none" stroke="white" strokeWidth="3"/>
      <line x1="24" y1="8" x2="24" y2="40" stroke="white" strokeWidth="2.5"/>
      <line x1="6" y1="24" x2="42" y2="24" stroke="white" strokeWidth="2.5"/>
      <path d="M10 12 L18 12 L10 20 Z" fill="white" opacity="0.35"/>
      <line x1="11" y1="20" x2="18" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M28 28 L34 34 M31 28 L36 33" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <circle cx="38" cy="10" r="5" fill="#f59e0b"/>
      <circle cx="38" cy="10" r="2.5" fill="white" opacity="0.8"/>
    </svg>
  ),
  coiff: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#7c3aed"/>
      <path d="M8 8 L28 28" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M28 8 L8 28" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="18" cy="18" r="3.5" fill="#7c3aed"/>
      <circle cx="18" cy="18" r="2" fill="white"/>
      <circle cx="6" cy="32" r="6" fill="none" stroke="white" strokeWidth="3"/>
      <circle cx="30" cy="32" r="6" fill="none" stroke="white" strokeWidth="3"/>
      <rect x="34" y="10" width="10" height="3" rx="1.5" fill="#f59e0b"/>
      <line x1="35" y1="13" x2="35" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="38" y1="13" x2="38" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="41" y1="13" x2="41" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  photo: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#1e293b"/>
      <rect x="6" y="16" width="36" height="24" rx="5" fill="white" opacity="0.9"/>
      <path d="M16 16 L16 10 Q16 8 18 8 L26 8 Q28 8 28 10 L28 16Z" fill="white" opacity="0.75"/>
      <circle cx="24" cy="28" r="9" fill="#1e293b" opacity="0.8"/>
      <circle cx="24" cy="28" r="7" fill="#1e293b"/>
      <circle cx="24" cy="28" r="5" fill="#334155"/>
      <circle cx="24" cy="28" r="3" fill="#0f172a"/>
      <circle cx="22" cy="26" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="11" cy="22" r="2.5" fill="#f59e0b"/>
    </svg>
  ),
  decor: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#ec4899"/>
      <rect x="6" y="28" width="36" height="10" rx="4" fill="white" opacity="0.9"/>
      <rect x="8" y="20" width="32" height="10" rx="4" fill="white" opacity="0.75"/>
      <rect x="5" y="22" width="7" height="14" rx="3" fill="white" opacity="0.85"/>
      <rect x="36" y="22" width="7" height="14" rx="3" fill="white" opacity="0.85"/>
      <rect x="11" y="22" width="11" height="8" rx="3" fill="#ec4899" opacity="0.5"/>
      <rect x="26" y="22" width="11" height="8" rx="3" fill="#ec4899" opacity="0.5"/>
      <path d="M36 8 Q36 4 40 4 Q44 4 44 8 Q44 14 40 16 Q36 14 36 8Z" fill="#4ade80" opacity="0.9"/>
      <line x1="24" y1="4" x2="24" y2="12" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <path d="M19 12 Q24 20 29 12Z" fill="#f59e0b" opacity="0.8"/>
    </svg>
  ),
  charpen: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#92400e"/>
      <path d="M6 28 L24 8 L42 28 Z" fill="white" opacity="0.9"/>
      <line x1="15" y1="18" x2="33" y2="18" stroke="#92400e" strokeWidth="1.5" opacity="0.25"/>
      <line x1="10" y1="23" x2="38" y2="23" stroke="#92400e" strokeWidth="1.5" opacity="0.25"/>
      <rect x="22" y="6" width="4" height="4" rx="1" fill="#f59e0b"/>
      <rect x="10" y="28" width="28" height="14" rx="2" fill="white" opacity="0.7"/>
      <line x1="24" y1="28" x2="24" y2="42" stroke="#92400e" strokeWidth="2.5" opacity="0.4"/>
      <line x1="10" y1="35" x2="38" y2="35" stroke="#92400e" strokeWidth="2.5" opacity="0.4"/>
      <path d="M38 8 L44 14 L42 16 L36 10Z" fill="#f59e0b"/>
      <rect x="35" y="9" width="3" height="8" rx="1" fill="#f59e0b" transform="rotate(45 36.5 13)"/>
    </svg>
  ),
};

// Fallback generic icon
const FALLBACK = (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#f97316"/>
    <path d="M30.5 8a8.5 8.5 0 0 0-8.08 11.17L10.3 31.3a3 3 0 1 0 4.24 4.24l12.13-12.12A8.5 8.5 0 0 0 38.5 13.5a8.4 8.4 0 0 0-.55-3l-4.17 4.17-2.83-.71-.71-2.83 4.17-4.17A8.4 8.4 0 0 0 30.5 8Z" fill="white"/>
    <circle cx="13" cy="35" r="2" fill="#fed7aa"/>
  </svg>
);

export function CategoryIcon({ name, size = 48, className = '' }: Props) {
  const key = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const match = Object.keys(ICONS).find(k => key.includes(k));
  const svg = match ? ICONS[match] : FALLBACK;

  return (
    <span
      className={`inline-block rounded-xl overflow-hidden ${className}`}
      style={{ width: size, height: size, flexShrink: 0 }}
      aria-label={name}
    >
      {svg}
    </span>
  );
}
