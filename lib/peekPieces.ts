export type PeekKind = 'granny' | 'flower' | 'yarnball' | 'heart' | 'leaf' | 'pompom';

export type PeekPiece = {
  id: string;
  side: 'left' | 'right';
  /** Vertical position as a percent of the page height (0-100). */
  top: number;
  /** Width and height in px on desktop. */
  size: number;
  /** Rotation in degrees. */
  rotate: number;
  /** Fraction of the piece hidden off-screen (0.3-0.5). */
  hidden: number;
  /** Parallax factor: how far the piece slides in and out as the page scrolls. */
  speed: number;
  kind: PeekKind;
  /** Public path to a transparent PNG/WebP cut-out. When set, it replaces the SVG. */
  src?: string;
};

// To swap an SVG for a real photo of one of your pieces:
//   1. Cut the piece out of its photo so the background is transparent (PNG or WebP).
//   2. Put the file in public/crochet/, e.g. public/crochet/tulip.webp
//   3. Set `src: '/crochet/tulip.webp'` on the piece below. `kind` is then only a fallback.
// Keep `size`, `hidden` and `rotate` as they are, or tweak them to taste.
export const PEEK_PIECES: PeekPiece[] = [
  { id: 'granny-left-top', side: 'left', top: 24, size: 150, rotate: -14, hidden: 0.45, speed: 0.12, kind: 'granny' },
  { id: 'flower-right-top', side: 'right', top: 17, size: 120, rotate: 18, hidden: 0.4, speed: 0.18, kind: 'flower' },
  { id: 'yarnball-left-mid', side: 'left', top: 33, size: 110, rotate: 10, hidden: 0.35, speed: 0.1, kind: 'yarnball' },
  { id: 'heart-right-mid', side: 'right', top: 46, size: 90, rotate: -12, hidden: 0.4, speed: 0.15, kind: 'heart' },
  { id: 'leaf-left-mid', side: 'left', top: 58, size: 100, rotate: 28, hidden: 0.5, speed: 0.2, kind: 'leaf' },
  { id: 'pompom-right-low', side: 'right', top: 68, size: 130, rotate: 6, hidden: 0.45, speed: 0.12, kind: 'pompom' },
  { id: 'granny-right-low', side: 'right', top: 82, size: 100, rotate: 22, hidden: 0.35, speed: 0.16, kind: 'granny' },
  { id: 'flower-left-low', side: 'left', top: 90, size: 110, rotate: -20, hidden: 0.4, speed: 0.14, kind: 'flower' },
];
