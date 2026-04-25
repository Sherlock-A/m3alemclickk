type LogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'vertical';
  theme?: 'light' | 'dark' | 'blue';
  className?: string;
};

// The icon mark — gradient blue bg + socket wrench (rotated -35°) + orange bolt dot
function LogoMark({ px, theme = 'light' }: { px: number; theme?: string }) {
  const id = `lg_${px}_${theme}`;
  const bgFill = theme === 'blue' ? 'rgba(255,255,255,0.15)' : `url(#${id})`;

  return (
    <svg
      viewBox="0 0 72 72"
      width={px}
      height={px}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect width="72" height="72" rx="16" fill={bgFill} />

      {/* Socket wrench rotated -35° — white, evenodd fill */}
      <g transform="rotate(-35,36,36)" fill="white">
        {/* Socket ring (donut shape) */}
        <path
          fillRule="evenodd"
          d="M 12,20 A 12,12 0 1,1 36,20 A 12,12 0 1,1 12,20 Z
             M 18.5,20 A 5.5,5.5 0 1,0 29.5,20 A 5.5,5.5 0 1,0 18.5,20 Z"
        />
        {/* Handle */}
        <rect x="33" y="16" width="30" height="8" rx="4" />
      </g>

      {/* Orange click dot */}
      <circle cx="54" cy="54" r="12" fill="#f59e0b" />
      {/* Lightning bolt inside dot */}
      <path d="M 56 44 L 49 55 L 53.5 55 L 51 63 L 59 52 L 54.5 52 Z" fill="white" />
    </svg>
  );
}

export function M3allemClickLogo({
  size = 'md',
  variant = 'full',
  theme = 'light',
  className = '',
}: LogoProps) {
  const iconPx = { sm: 32, md: 40, lg: 52, xl: 72 }[size];

  // ── Icon only ──
  if (variant === 'icon') {
    return (
      <span className={`inline-block ${className}`} style={{ lineHeight: 0 }}>
        <LogoMark px={iconPx} theme={theme} />
      </span>
    );
  }

  // ── Vertical ──
  if (variant === 'vertical') {
    const nameSize  = { sm: 18, md: 22, lg: 28, xl: 36 }[size];
    const clickSize = { sm: 15, md: 19, lg: 24, xl: 30 }[size];
    const tagSize   = { sm: 8,  md: 9,  lg: 10, xl: 11 }[size];
    const nameColor  = theme === 'light' ? '#0f172a' : 'white';
    const clickColor = theme === 'blue'  ? '#fcd34d' : theme === 'dark' ? '#60a5fa' : '#3b82f6';
    const tagColor   = theme === 'light' ? '#94a3b8' : 'rgba(255,255,255,0.4)';

    return (
      <span
        className={`inline-flex flex-col items-center gap-2 ${className}`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <LogoMark px={iconPx} theme={theme} />
        <span style={{ lineHeight: 1.1, textAlign: 'center' }}>
          <span style={{ display: 'block', fontWeight: 800, fontSize: nameSize, color: nameColor, letterSpacing: '-0.02em' }}>
            M3allem
          </span>
          <span style={{ display: 'block', fontWeight: 700, fontSize: clickSize, color: clickColor, letterSpacing: '0.04em' }}>
            Click
          </span>
          <span style={{ display: 'block', fontWeight: 400, fontSize: tagSize, color: tagColor, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>
            Plateforme Artisans
          </span>
        </span>
      </span>
    );
  }

  // ── Full horizontal (default) ──
  const nameSize  = { sm: 15, md: 19, lg: 24, xl: 32 }[size];
  const clickSize = { sm: 13, md: 16, lg: 20, xl: 26 }[size];
  const nameColor  = theme === 'light' ? '#0f172a' : 'white';
  const clickColor = theme === 'blue'  ? '#fcd34d' : theme === 'dark' ? '#60a5fa' : '#3b82f6';

  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <LogoMark px={iconPx} theme={theme} />
      <span style={{ lineHeight: 1.15 }}>
        <span style={{ display: 'block', fontWeight: 800, fontSize: nameSize, color: nameColor, letterSpacing: '-0.02em' }}>
          M3allem
        </span>
        <span style={{ display: 'block', fontWeight: 700, fontSize: clickSize, color: clickColor, letterSpacing: '0.04em' }}>
          Click
        </span>
      </span>
    </span>
  );
}
