type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
};

const sizes = { sm: 28, md: 36, lg: 52 };

function LogoIcon({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background */}
      <rect width="48" height="48" rx="12" fill="#1e3a5f"/>

      {/* Socket wrench body */}
      <path
        d="M30 9a8 8 0 0 0-7.6 10.5L10.5 31.4a2.8 2.8 0 1 0 3.96 3.96l11.95-11.95A8 8 0 0 0 38 13.5c0-1.1-.22-2.15-.6-3.1l-3.9 3.9-2.65-.66-.66-2.65 3.9-3.9A8 8 0 0 0 30 9Z"
        fill="white"
        opacity="0.95"
      />

      {/* Lightning bolt accent (orange) */}
      <path
        d="M36 6 L29 19 L33 19 L27 34 L40 17 L35 17 Z"
        fill="#f97316"
        opacity="0.9"
      />

      {/* Dot accent on wrench end */}
      <circle cx="13" cy="34" r="2.2" fill="#fed7aa"/>
    </svg>
  );
}

export function M3allemClickLogo({ size = 'md', variant = 'icon', className = '' }: LogoProps) {
  const px = sizes[size];

  if (variant === 'icon') {
    return (
      <span className={`inline-block ${className}`} style={{ width: px, height: px }}>
        <LogoIcon px={px} />
      </span>
    );
  }

  const textSize =
    size === 'sm' ? 'text-base' :
    size === 'lg' ? 'text-2xl' :
    'text-xl';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoIcon px={px} />
      <span className={`font-black tracking-tight leading-none ${textSize}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
        <span className="text-orange-500">M3allem</span>
        <span className="text-slate-800 dark:text-white">Click</span>
      </span>
    </span>
  );
}
