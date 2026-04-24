import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  width?: number;
  height?: number;
  /** Show a shimmer skeleton while loading */
  skeleton?: boolean;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  width,
  height,
  skeleton = true,
}: Props) {
  const ref        = useRef<HTMLImageElement>(null);
  const [loaded,   setLoaded]   = useState(false);
  const [error,    setError]    = useState(false);
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use native lazy loading when available; fall back to IntersectionObserver
    if ('loading' in HTMLImageElement.prototype) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showSkeleton = skeleton && !loaded && !error;

  return (
    <span className="relative inline-block" style={{ width, height }}>
      {showSkeleton && (
        <span
          className={`absolute inset-0 animate-pulse rounded bg-gray-200 ${placeholderClassName}`}
          aria-hidden="true"
        />
      )}
      <img
        ref={ref}
        src={visible ? src : undefined}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
      {error && (
        <span
          className={`absolute inset-0 flex items-center justify-center rounded bg-gray-100 text-xs text-gray-400 ${placeholderClassName}`}
        >
          Image indisponible
        </span>
      )}
    </span>
  );
}
