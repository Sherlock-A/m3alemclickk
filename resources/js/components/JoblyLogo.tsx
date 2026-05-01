// Jobly Logo — implémentation exacte du design officiel
// Pin bleu #1B3A6B · cercle orange #F26B2A · j blanc · wordmark Plus Jakarta Sans 800

type LogoProps = {
  size?    : 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant? : 'full' | 'icon' | 'stacked' | 'appicon';
  theme?   : 'light' | 'dark';
  className?: string;
};

// Tailles icon (px) et wordmark (px)
const ICON_W = { xs: 22,  sm: 30,  md: 42,  lg: 56,  xl: 80  } as const;
const TEXT_S = { xs: 13,  sm: 17,  md: 24,  lg: 32,  xl: 46  } as const;
const GAP_S  = { xs: 7,   sm: 9,   md: 12,  lg: 16,  xl: 22  } as const;

// Couleurs de la charte
const BLUE   = '#1B3A6B';
const ORANGE = '#F26B2A';

// ── SVG Pin officiel (viewBox 0 0 56 68) ────────────────────────────────────
function PinSvg({ w, theme }: { w: number; theme: 'light' | 'dark' }) {
  const h = Math.round(w * 68 / 56);
  const pinFill  = theme === 'dark' ? 'white' : BLUE;
  const pinOpacity = theme === 'dark' ? 0.15 : 1;
  return (
    <svg
      width={w} height={h}
      viewBox="0 0 56 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* Corps du pin */}
      <path
        d="M28 2C15.85 2 6 11.85 6 24C6 39.5 28 66 28 66C28 66 50 39.5 50 24C50 11.85 40.15 2 28 2Z"
        fill={pinFill}
        fillOpacity={pinOpacity}
      />
      {/* Cercle orange */}
      <circle cx="28" cy="24" r="13" fill={ORANGE} />
      {/* Lettre j blanche */}
      <text
        x="28" y="30"
        textAnchor="middle"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="17"
        fontWeight="800"
        fill="white"
        letterSpacing="-0.5"
      >
        j
      </text>
    </svg>
  );
}

// ── App icon carré arrondi (usage favicon / PWA / 96-32px) ──────────────────
function AppIconSvg({ size }: { size: number }) {
  const r = Math.round(size * 0.22);
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="96" height="96" rx={r * 96 / size} fill={BLUE} />
      {/* Pin centré, légèrement agrandi */}
      <g transform="translate(20, 8) scale(1.01)">
        <path
          d="M28 2C15.85 2 6 11.85 6 24C6 39.5 28 66 28 66C28 66 50 39.5 50 24C50 11.85 40.15 2 28 2Z"
          fill="white" fillOpacity="0.15"
        />
        <circle cx="28" cy="24" r="13" fill={ORANGE} />
        <text
          x="28" y="30"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="17"
          fontWeight="800"
          fill="white"
          letterSpacing="-0.5"
        >
          j
        </text>
      </g>
    </svg>
  );
}

// ── Wordmark "jobly" ─────────────────────────────────────────────────────────
function Wordmark({ px, color }: { px: number; color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily   : "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight   : 800,
        fontSize     : px,
        color,
        letterSpacing: '-0.03em',
        lineHeight   : 1,
        userSelect   : 'none',
      }}
    >
      jobly
    </span>
  );
}

// ── Composant principal ──────────────────────────────────────────────────────
export function JoblyLogo({
  size      = 'md',
  variant   = 'full',
  theme     = 'light',
  className = '',
}: LogoProps) {
  const iconW  = ICON_W[size];
  const textSz = TEXT_S[size];
  const gap    = GAP_S[size];
  const wordColor = theme === 'dark' ? '#ffffff' : BLUE;

  // ── App icon (carré arrondi bleu) ──
  if (variant === 'appicon') {
    return (
      <span className={`inline-block ${className}`} aria-label="Jobly">
        <AppIconSvg size={iconW} />
      </span>
    );
  }

  // ── Icône seule ──
  if (variant === 'icon') {
    return (
      <span className={`inline-block ${className}`} aria-label="Jobly" style={{ lineHeight: 0 }}>
        <PinSvg w={iconW} theme={theme} />
      </span>
    );
  }

  // ── Empilé : pin + wordmark en colonne ──
  if (variant === 'stacked') {
    return (
      <span
        className={`inline-flex flex-col items-center ${className}`}
        style={{ gap: Math.round(gap * 0.6) }}
        aria-label="Jobly"
      >
        <PinSvg w={Math.round(iconW * 1.15)} theme={theme} />
        <Wordmark px={textSz} color={wordColor} />
      </span>
    );
  }

  // ── Full horizontal (défaut) ──
  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap }}
      aria-label="Jobly"
    >
      <PinSvg w={iconW} theme={theme} />
      <Wordmark px={textSz} color={wordColor} />
    </span>
  );
}
