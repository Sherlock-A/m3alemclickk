// Jobly Logo — fidèle au design officiel
// Icône : cercle orange + 2 pièces géométriques formant un J
// Light mode : texte #0D1B2E  |  Dark mode : texte blanc

type LogoProps = {
  size?     : 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?  : 'full' | 'icon';
  theme?    : 'light' | 'dark';
  className?: string;
};

const ICON_H = { xs: 28, sm: 36, md: 50, lg: 66, xl: 90 } as const;
const TEXT_S = { xs: 14, sm: 18, md: 26, lg: 34, xl: 46 } as const;
const GAP_S  = { xs: 7,  sm: 9,  md: 13, lg: 17, xl: 23 } as const;

// ── SVG icône J (viewBox 62 × 74) ────────────────────────────────────────────
// Cercle en haut, pièce gauche (haute, légèrement inclinée), pièce droite (courte)
function IconSvg({ h }: { h: number }) {
  const w = Math.round(h * 62 / 74);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 62 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        {/* Gradient partagé sur l'espace utilisateur pour que les 2 pièces aient la même couleur au même y */}
        <linearGradient id="jbly_g" x1="0" y1="20" x2="0" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FFA726" />
          <stop offset="55%"  stopColor="#FB8C00" />
          <stop offset="100%" stopColor="#E64A19" />
        </linearGradient>
      </defs>

      {/* ── Cercle (tête / point du J) ── */}
      <circle cx="28" cy="9" r="8" fill="#FFA726" />

      {/* ── Pièce gauche — parallelogramme tall, légèrement incliné gauche ── */}
      {/* top: (7,22)→(27,22)  bottom: (1,66)→(21,66) */}
      <path d="M7,22 L27,22 L21,66 L1,66 Z" fill="url(#jbly_g)" />

      {/* ── Pièce droite — rectangle court ── */}
      {/* top: (29,22)→(49,22)  bottom: (29,48)→(49,48) */}
      <path d="M29,22 L49,22 L49,48 L29,48 Z" fill="url(#jbly_g)" />

      {/* ── Ombre de pli entre les deux pièces (profondeur) ── */}
      <path d="M25,22 L27,22 L21,66 L19,66 Z" fill="rgba(100,20,0,0.18)" />
      <path d="M29,22 L31,22 L31,48 L29,48 Z" fill="rgba(100,20,0,0.14)" />
    </svg>
  );
}

// ── Wordmark "Jobly" ──────────────────────────────────────────────────────────
function Wordmark({ px, color }: { px: number; color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily   : "'Plus Jakarta Sans', 'Nunito', system-ui, sans-serif",
        fontWeight   : 800,
        fontSize     : px,
        color,
        letterSpacing: '-0.02em',
        lineHeight   : 1,
        userSelect   : 'none',
      }}
    >
      Jobly
    </span>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export function JoblyLogo({
  size      = 'md',
  variant   = 'full',
  theme     = 'light',
  className = '',
}: LogoProps) {
  const iconH     = ICON_H[size];
  const textSz    = TEXT_S[size];
  const gap       = GAP_S[size];
  const textColor = theme === 'dark' ? '#ffffff' : '#0D1B2E';

  if (variant === 'icon') {
    return (
      <span className={`inline-block ${className}`} aria-label="Jobly" style={{ lineHeight: 0 }}>
        <IconSvg h={iconH} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap }}
      aria-label="Jobly"
    >
      <IconSvg h={iconH} />
      <Wordmark px={textSz} color={textColor} />
    </span>
  );
}
