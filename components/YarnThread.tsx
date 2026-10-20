'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollProgress } from '../lib/scrollProgress';

// Control points as fractions of the page width and height. The thread swings from side
// to side, looping down past each section.
const POINTS: [number, number][] = [
  [0.5, 0.01],
  [0.2, 0.04], [0.1, 0.1], [0.3, 0.14],
  [0.6, 0.18], [0.85, 0.14], [0.72, 0.22],
  [0.55, 0.3], [0.15, 0.26], [0.22, 0.36],
  [0.3, 0.46], [0.8, 0.4], [0.82, 0.5],
  [0.84, 0.6], [0.3, 0.56], [0.18, 0.64],
  [0.08, 0.72], [0.6, 0.74], [0.8, 0.8],
  [0.95, 0.86], [0.4, 0.9], [0.5, 0.99],
];

function buildPath(w: number, h: number): string {
  const p = POINTS.map(([x, y]) => [x * w, y * h].map((n) => n.toFixed(1)).join(' '));
  let d = `M ${p[0]}`;
  for (let i = 1; i + 2 < p.length; i += 3) {
    d += ` C ${p[i]}, ${p[i + 1]}, ${p[i + 2]}`;
  }
  return d;
}

/**
 * One long yarn thread winding down behind the page. It draws itself as you scroll.
 * Decorative: aria-hidden, click-through, behind the content, hidden on small screens.
 * Place inside a `relative` wrapper that has `overflow-x: clip`.
 */
export default function YarnThread() {
  const [enabled, setEnabled] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 640px)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setEnabled(wide.matches);
      setReducedMotion(motion.matches);
    };
    sync();
    wide.addEventListener('change', sync);
    motion.addEventListener('change', sync);
    return () => {
      wide.removeEventListener('change', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  // Track the page size so the SVG's coordinates match real pixels (no stretched stroke).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !enabled) return;
    const measure = () => setSize({ w: Math.round(wrapper.offsetWidth), h: Math.round(wrapper.offsetHeight) });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [enabled]);

  // Draw the thread as the page scrolls: read, then write, once per frame.
  useEffect(() => {
    const path = pathRef.current;
    const clip = clipRef.current;
    if (!enabled || !path || !clip || size.h === 0) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    const apply = (drawn: number) => {
      path.style.strokeDashoffset = `${length * (1 - drawn)}`;
      clip.setAttribute('height', `${(drawn * size.h).toFixed(0)}`);
    };

    if (reducedMotion) {
      apply(1);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = scrollProgress(window.scrollY, window.innerHeight, document.documentElement.scrollHeight);
      // Always show a little thread at the top, so the page never starts bare.
      apply(0.06 + progress * 0.94);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, size.h, size.w, reducedMotion]);

  const d = size.w > 0 ? buildPath(size.w, size.h) : '';

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="absolute inset-0 z-[1] overflow-hidden pointer-events-none"
      style={{
        // Fade the thread out behind the central text column.
        WebkitMaskImage:
          'linear-gradient(to right, #000 0%, rgba(0,0,0,0.3) 22%, rgba(0,0,0,0.3) 78%, #000 100%)',
        maskImage: 'linear-gradient(to right, #000 0%, rgba(0,0,0,0.3) 22%, rgba(0,0,0,0.3) 78%, #000 100%)',
      }}
    >
      {enabled && d && (
        <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} className="block opacity-60" focusable="false">
          <defs>
            <clipPath id="thread-clip">
              <rect ref={clipRef} x="0" y="0" width={size.w} height="0" />
            </clipPath>
          </defs>
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="#C8634A"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ strokeDasharray: 1e6, strokeDashoffset: 1e6 }}
          />
          {/* stitch overlay, revealed down to the same height as the thread */}
          <g clipPath="url(#thread-clip)">
            <path d={d} fill="none" stroke="#FBF7F1" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
          </g>
        </svg>
      )}
    </div>
  );
}
