import { describe, expect, it } from 'vitest';
import { PEEK_PIECES } from '../lib/peekPieces';
import { CROCHET_COMPONENTS } from '../components/crochet';

describe('PEEK_PIECES', () => {
  it('has 8-10 pieces', () => {
    expect(PEEK_PIECES.length).toBeGreaterThanOrEqual(8);
    expect(PEEK_PIECES.length).toBeLessThanOrEqual(10);
  });

  it('has unique ids', () => {
    const ids = PEEK_PIECES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only uses valid sides, and uses both', () => {
    for (const piece of PEEK_PIECES) {
      expect(['left', 'right']).toContain(piece.side);
    }
    expect(new Set(PEEK_PIECES.map((p) => p.side)).size).toBe(2);
  });

  it('keeps top within 0-100', () => {
    for (const piece of PEEK_PIECES) {
      expect(piece.top).toBeGreaterThanOrEqual(0);
      expect(piece.top).toBeLessThanOrEqual(100);
    }
  });

  it('keeps hidden within 0.3-0.5', () => {
    for (const piece of PEEK_PIECES) {
      expect(piece.hidden).toBeGreaterThanOrEqual(0.3);
      expect(piece.hidden).toBeLessThanOrEqual(0.5);
    }
  });

  it('has a component for every kind used', () => {
    for (const piece of PEEK_PIECES) {
      expect(CROCHET_COMPONENTS[piece.kind]).toBeTypeOf('function');
    }
  });

  it('has a component for all six kinds', () => {
    expect(Object.keys(CROCHET_COMPONENTS).sort()).toEqual([
      'flower',
      'granny',
      'heart',
      'leaf',
      'pompom',
      'yarnball',
    ]);
  });
});
