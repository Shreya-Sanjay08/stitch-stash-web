'use client';

import { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
}

type Phase = 'visible' | 'hidden' | 'shown';

/**
 * Fade-and-rise on first scroll into view (once only).
 *
 * Content is visible by default, so it never disappears before hydration or without JS.
 * After mount, only elements that are below the fold get hidden, then revealed when they
 * scroll into view. Static under prefers-reduced-motion.
 */
export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('visible');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;

    // Already in view (or above it) on load: leave it alone, so it appears immediately.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setPhase('hidden');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPhase('shown');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stateClass =
    phase === 'hidden'
      ? 'opacity-0 translate-y-4'
      : phase === 'shown'
        ? 'opacity-100 translate-y-0 transition duration-700 ease-out'
        : '';

  return (
    <div
      ref={ref}
      className={`${className} ${stateClass}`}
      style={phase === 'shown' && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
