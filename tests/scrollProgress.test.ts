import { describe, expect, it } from 'vitest';
import { scrollProgress } from '../lib/scrollProgress';

describe('scrollProgress', () => {
  it('is 0 at zero scroll', () => {
    expect(scrollProgress(0, 800, 3000)).toBe(0);
  });

  it('is 1 at the bottom of the page', () => {
    expect(scrollProgress(2200, 800, 3000)).toBe(1);
  });

  it('is proportional in between', () => {
    expect(scrollProgress(1100, 800, 3000)).toBeCloseTo(0.5);
  });

  it('clamps overscroll and negative scroll', () => {
    expect(scrollProgress(5000, 800, 3000)).toBe(1);
    expect(scrollProgress(-50, 800, 3000)).toBe(0);
  });

  it('counts a document shorter than the viewport as fully scrolled', () => {
    expect(scrollProgress(0, 800, 500)).toBe(1);
    expect(scrollProgress(0, 800, 800)).toBe(1);
  });

  it('never returns NaN for bad input', () => {
    expect(scrollProgress(NaN, 800, 3000)).toBe(0);
    expect(scrollProgress(0, 800, NaN)).toBe(1);
  });
});
