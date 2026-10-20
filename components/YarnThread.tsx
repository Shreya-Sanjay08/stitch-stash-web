'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollProgress } from '../lib/scrollProgress';

type Point = [number, number];

const CONTENT_MAX = 1152; // max-w-6xl
const CONTENT_PADDING = 24;
const LANE_WAVE = 9; // how far the thread sways inside its lane
const WAVE_STEP = 240;
const CROSS_HALF = 28; // half the vertical space a crossing needs

/** A smooth curve through the points (Catmull-Rom converted to cubic Béziers). */
function smoothPath(points: Point[]): string {
  const f = (n: number) => n.toFixed(1);
  let d = `M ${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f(c1[0])} ${f(c1[1])}, ${f(c2[0])} ${f(c2[1])}, ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/**
 * The thread's route: down the left and right side gutters, outside the content column,
 * crossing the middle only in the empty space between sections (never behind text).
 */
function buildRoute(wrapper: HTMLElement): { d: string; w: number; h: number } {
  const wrapperRect = wrapper.getBoundingClientRect();
  const w = Math.round(wrapperRect.width);
  const h = Math.round(wrapperRect.height);
  const yOf = (selector: string, edge: 'top' | 'bottom'): number | null => {
    const el = document.querySelector(selector);
    return el ? el.getBoundingClientRect()[edge] - wrapperRect.top : null;
  };

  const laneLeft = Math.min(60, Math.max(16, (w - CONTENT_MAX) / 2 + CONTENT_PADDING - 28));
  const laneRight = w - laneLeft;

  // Gaps between sections where the thread may cross the middle.
  const aboutTop = yOf('#about', 'top');
  const aboutBottom = yOf('#about', 'bottom');
  const testimonialsTop = yOf('#testimonials', 'top');
  const crossings = [
    aboutTop === null ? null : aboutTop - 50, // empty space under the hero
    aboutBottom === null ? null : aboutBottom - 56, // bottom padding of the welcome band
    testimonialsTop === null ? null : testimonialsTop - 40, // gap above the carousel heading
  ].filter((y): y is number => y !== null);

  const footerTop = yOf('footer', 'top');
  const yEnd = (footerTop ?? h) - 28; // end before the footer
  const yStart = 100;

  let onLeft = true;
  let cursor = yStart;
  const points: Point[] = [[laneLeft, yStart]];

  const wave = (until: number) => {
    let flip = 1;
    for (let y = cursor + WAVE_STEP; y < until - 90; y += WAVE_STEP) {
      const lane = onLeft ? laneLeft : laneRight;
      // Sway towards the page edge and back, never towards the content.
      const sway = flip > 0 ? 0 : LANE_WAVE * (onLeft ? -1 : 1);
      points.push([lane + sway, y]);
      flip *= -1;
    }
  };

  for (const c of crossings) {
    if (c - CROSS_HALF < cursor + 120 || c + CROSS_HALF > yEnd - 120) continue;
    wave(c - CROSS_HALF);
    const from = onLeft ? laneLeft : laneRight;
    const to = onLeft ? laneRight : laneLeft;
    points.push([from, c - CROSS_HALF], [w / 2, c], [to, c + CROSS_HALF]);
    onLeft = !onLeft;
    cursor = c + CROSS_HALF;
  }

  wave(yEnd);
  points.push([onLeft ? laneLeft : laneRight, yEnd]);

  return { d: smoothPath(points), w, h };
}

/**
 * One long yarn thread winding down the side gutters of the page. It draws itself as you
 * scroll. Decorative: aria-hidden, click-through, behind the content, hidden on small screens.
 * Place inside a `relative` wrapper that has `overflow-x: clip`.
 */
export default function YarnThread() {
  const [enabled, setEnabled] = useState(false);
  const [route, setRoute] = useState({ d: '', w: 0, h: 0 });
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

  // Work out the route from the real section positions, and again whenever the page resizes
  // (the page height changes when products load).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !enabled) return;
    const measure = () => setRoute(buildRoute(wrapper));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [enabled]);

  // Draw the thread as the page scrolls: read, then write, once per frame.
  useEffect(() => {
    const path = pathRef.current;
    const clip = clipRef.current;
    if (!enabled || !path || !clip || route.h === 0) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    const apply = (drawn: number) => {
      path.style.strokeDashoffset = `${length * (1 - drawn)}`;
      clip.setAttribute('height', `${(drawn * route.h).toFixed(0)}`);
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
  }, [enabled, route, reducedMotion]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="absolute inset-0 z-[1] overflow-hidden pointer-events-none"
    >
      {enabled && route.d && (
        <svg width={route.w} height={route.h} viewBox={`0 0 ${route.w} ${route.h}`} className="block opacity-70" focusable="false">
          <defs>
            <clipPath id="thread-clip">
              <rect ref={clipRef} x="0" y="0" width={route.w} height="0" />
            </clipPath>
          </defs>
          <path
            ref={pathRef}
            d={route.d}
            fill="none"
            stroke="#E8690B"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ strokeDasharray: 1e6, strokeDashoffset: 1e6 }}
          />
          {/* stitch overlay, revealed down to the same height as the thread */}
          <g clipPath="url(#thread-clip)">
            <path d={route.d} fill="none" stroke="#FBF7F1" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
          </g>
        </svg>
      )}
    </div>
  );
}
