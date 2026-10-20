/**
 * How far down the page the user has scrolled, clamped to 0-1.
 * 0 at the top, 1 when the bottom of the page is in view. A document that fits in
 * the viewport has nothing to scroll, so it counts as fully scrolled (1).
 */
export function scrollProgress(scrollY: number, viewportHeight: number, documentHeight: number): number {
  const scrollable = documentHeight - viewportHeight;
  if (!Number.isFinite(scrollable) || scrollable <= 0) return 1;
  if (!Number.isFinite(scrollY)) return 0;
  return Math.min(1, Math.max(0, scrollY / scrollable));
}
