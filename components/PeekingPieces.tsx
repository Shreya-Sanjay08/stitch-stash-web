'use client';

import { useEffect, useRef, useState } from 'react';
import { PEEK_PIECES, type PeekPiece } from '../lib/peekPieces';
import { CROCHET_COMPONENTS } from './crochet';

const MOBILE_QUERY = '(max-width: 639px)';
const MOBILE_SCALE = 0.6;
// On small screens the pieces hide further off-screen so they stay clear of the text.
const MOBILE_MIN_HIDDEN = 0.55;
const FUZZY_MIN_SIZE = 120;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Crochet pieces peeking in from the page edges. Purely decorative: aria-hidden,
 * never blocks clicks on content (they sit below it), and animates transform only.
 * Must be placed inside a `relative` wrapper that has `overflow-x: clip`.
 */
export default function PeekingPieces() {
  const [mobile, setMobile] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Decide the layout after mount, so the server and first client render agree (nothing).
  useEffect(() => {
    const mobileMq = window.matchMedia(MOBILE_QUERY);
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setMobile(mobileMq.matches);
      setReducedMotion(motionMq.matches);
    };
    sync();
    mobileMq.addEventListener('change', sync);
    motionMq.addEventListener('change', sync);
    return () => {
      mobileMq.removeEventListener('change', sync);
      motionMq.removeEventListener('change', sync);
    };
  }, []);

  const pieces: PeekPiece[] =
    mobile === null ? [] : mobile ? PEEK_PIECES.filter((_, i) => i % 2 === 0) : PEEK_PIECES;
  const scale = mobile ? MOBILE_SCALE : 1;

  // One rAF-throttled scroll listener: reads first, then writes CSS variables only.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || reducedMotion || pieces.length === 0) return;

    const nodes = Array.from(wrapper.querySelectorAll<HTMLElement>('[data-peek]'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const docHeight = wrapper.offsetHeight;

      const slides = nodes.map((node) => {
        const top = Number(node.dataset.top);
        const size = Number(node.dataset.size);
        const speed = Number(node.dataset.speed);
        // Where the piece sits in the viewport: 0 = top edge, 1 = bottom edge.
        const v = ((top / 100) * docHeight - scrollY) / viewport;
        const nearCentre = clamp01(1 - Math.abs(v - 0.5) * 2);
        return nearCentre * speed * size * 1.5;
      });

      nodes.forEach((node, i) => node.style.setProperty('--slide', `${slides[i].toFixed(1)}px`));
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
  }, [pieces.length, reducedMotion]);

  // Touch: a tap gives the piece a short wiggle.
  const wiggle = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' || reducedMotion) return;
    const el = e.currentTarget;
    el.classList.remove('peek-wiggle');
    void el.offsetWidth; // restart the animation
    el.classList.add('peek-wiggle');
    window.setTimeout(() => el.classList.remove('peek-wiggle'), 700);
  };

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="absolute inset-0 z-[1] overflow-hidden pointer-events-none"
    >
      {pieces.map((piece, i) => {
        const size = piece.size * scale;
        const hidden = mobile ? Math.max(piece.hidden, MOBILE_MIN_HIDDEN) : piece.hidden;
        const dir = piece.side === 'left' ? 1 : -1; // inward direction
        const Motif = CROCHET_COMPONENTS[piece.kind];

        return (
          <div
            key={piece.id}
            data-peek
            data-top={piece.top}
            data-size={size}
            data-speed={piece.speed}
            className="absolute"
            style={{
              top: `${piece.top}%`,
              [piece.side]: `${-hidden * size}px`,
              width: size,
              height: size,
              // Parallax slide, set from the scroll listener.
              transform: `translate3d(calc(var(--slide, 0px) * ${dir}), 0, 0)`,
              willChange: reducedMotion ? undefined : 'transform',
            }}
          >
            <div
              className="peek-sway w-full h-full"
              style={{
                ['--rot' as string]: `${piece.rotate}deg`,
                animationDuration: `${6 + (i % 4) * 1.5}s`,
                animationDelay: `${-(i * 1.3)}s`,
              }}
            >
              <div
                className="peek-hover w-full h-full"
                style={{ ['--peek-dir' as string]: dir, ['--peek-size' as string]: `${size}px` }}
                onPointerDown={wiggle}
              >
                {piece.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={piece.src}
                    alt=""
                    width={size}
                    height={size}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                  />
                ) : (
                  <Motif className="w-full h-full" fuzzy={size >= FUZZY_MIN_SIZE} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
