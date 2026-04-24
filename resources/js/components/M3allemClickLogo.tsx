type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
};

const sizes = { sm: 24, md: 32, lg: 48 };

export function M3allemClickLogo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const px = sizes[size];

  const icon = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background rounded square */}
      <rect width="48" height="48" rx="12" fill="#f97316" />
      {/* Wrench body */}
      <path
        d="M30.5 8a8.5 8.5 0 0 0-8.08 11.17L10.3 31.3a3 3 0 1 0 4.24 4.24l12.13-12.12A8.5 8.5 0 0 0 38.5 13.5a8.4 8.4 0 0 0-.55-3l-4.17 4.17-2.83-.71-.71-2.83 4.17-4.17A8.4 8.4 0 0 0 30.5 8Z"
        fill="white"
      />
      {/* Sparkle accent */}
      <circle cx="13" cy="35" r="2" fill="#fed7aa" />
    </svg>
  );

  if (variant === 'icon') return <span className={className}>{icon}</span>;

  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {icon}
      <span className={`font-black tracking-tight ${textSize}`}>
        <span className="text-orange-500">M3allem</span>
        <span className="text-slate-800 dark:text-white">Click</span>
      </span>
    </span>
  );
}
