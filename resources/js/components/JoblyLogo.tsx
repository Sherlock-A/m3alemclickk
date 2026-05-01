// Jobly Logo — implémentation exacte du design Jobly Logo Minimal
// Pin orange #f97316 · J blanc · wordmark "jobly" Plus Jakarta Sans 900

type LogoProps = {
  size?     : 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?  : 'full' | 'icon' | 'stacked';
  theme?    : 'light' | 'dark';
  className?: string;
};

const ICON_PX  = { xs: 20, sm: 28, md: 40, lg: 56, xl: 80 } as const;
const NAME_PX  = { xs: 13, sm: 16, md: 22, lg: 30, xl: 42 } as const;

// ── Pin mark — viewBox 72×100, proportions exactes du design ─────────────────
function PinMark({ px }: { px: number }) {
  const h = Math.round(px * 100 / 72);
  return (
    <svg
      viewBox="0 0 72 100"
      width={px}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* Corps du pin — orange pur, pas de gradient */}
      <path
        d="M 36 3 A 28 28 0 1 1 8 52 Q 20 66 36 88 Q 52 66 64 52 A 28 28 0 0 1 36 3 Z"
        fill="#f97316"
      />
      {/* Lettre J — barre verticale */}
      <rect x="32" y="14" width="8" height="24" rx="3.5" fill="white" />
      {/* Lettre J — courbe inférieure */}
      <path
        d="M 40 32 Q 40 47 30 47 Q 21 47 20 38"
        fill="none"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Point au sommet */}
      <circle cx="36" cy="10" r="4.5" fill="white" />
    </svg>
  );
}

// ── Pin mark compact pour la version horizontale ──────────────────────────────
function PinMarkHorizontal({ px }: { px: number }) {
  // viewBox 40×52 — version compacte du design
  const h = Math.round(px * 52 / 40);
  return (
    <svg
      viewBox="0 0 40 52"
      width={px}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <path
        d="M 20 2 A 16 16 0 1 1 4 30 Q 10 38 20 50 Q 30 38 36 30 A 16 16 0 0 1 20 2 Z"
        fill="#f97316"
      />
      <rect x="17.5" y="8" width="5" height="15" rx="2" fill="white" />
      <path
        d="M 22.5 20 Q 22.5 28 17 28 Q 11.5 28 11 23"
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="5.5" r="3" fill="white" />
    </svg>
  );
}

// ── Wordmark "jobly" ──────────────────────────────────────────────────────────
function Wordmark({ px, color }: { px: number; color: string }) {
  return (
    <span
      style={{
        fontFamily  : "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight  : 900,
        fontSize    : px,
        color,
        letterSpacing: '-0.04em',
        lineHeight  : 1,
        userSelect  : 'none',
      }}
    >
      jobly
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
  const iconPx  = ICON_PX[size];
  const namePx  = NAME_PX[size];
  const textColor = theme === 'dark' ? '#ffffff' : '#0a0a0a';

  // ── Icône seule (pin sans texte) ──
  if (variant === 'icon') {
    return (
      <span className={`inline-block ${className}`} style={{ lineHeight: 0 }}>
        <PinMark px={iconPx} />
      </span>
    );
  }

  // ── Empilé : pin centré + texte dessous ──
  if (variant === 'stacked') {
    return (
      <span
        className={`inline-flex flex-col items-center ${className}`}
        style={{ gap: Math.round(iconPx * 0.2) }}
        aria-label="Jobly"
      >
        <PinMark px={Math.round(iconPx * 1.3)} />
        <Wordmark px={namePx} color={textColor} />
      </span>
    );
  }

  // ── Full horizontal (défaut) : pin compact + wordmark côte à côte ──
  const pinPx = Math.round(iconPx * 0.75);
  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: Math.round(iconPx * 0.3) }}
      aria-label="Jobly"
    >
      <PinMarkHorizontal px={pinPx} />
      <Wordmark px={namePx} color={textColor} />
    </span>
  );
}

