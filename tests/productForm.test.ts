import { describe, expect, it } from 'vitest';
import { validateProductInput } from '../lib/productForm';

describe('validateProductInput', () => {
  it('trims title and description and accepts a numeric price', () => {
    const result = validateProductInput({ title: '  Tulip  ', description: ' soft ', price: 120 });
    expect(result).toEqual({ ok: true, value: { title: 'Tulip', description: 'soft', price_aed: 120 } });
  });

  it('accepts a string price', () => {
    const result = validateProductInput({ title: 'Scarf', description: '', price: ' 85.5 ' });
    expect(result).toEqual({ ok: true, value: { title: 'Scarf', description: '', price_aed: 85.5 } });
  });

  it('treats a missing description as empty', () => {
    const result = validateProductInput({ title: 'Scarf', description: undefined, price: 10 });
    expect(result).toEqual({ ok: true, value: { title: 'Scarf', description: '', price_aed: 10 } });
  });

  it('rejects an empty or whitespace title', () => {
    for (const title of ['', '   ']) {
      const result = validateProductInput({ title, description: '', price: 10 });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toMatch(/title/i);
    }
  });

  it('rejects a title over 120 characters but accepts exactly 120', () => {
    expect(validateProductInput({ title: 'a'.repeat(121), description: '', price: 10 }).ok).toBe(false);
    expect(validateProductInput({ title: 'a'.repeat(120), description: '', price: 10 }).ok).toBe(true);
  });

  it('rejects a description over 1000 characters but accepts exactly 1000', () => {
    const tooLong = validateProductInput({ title: 'x', description: 'a'.repeat(1001), price: 10 });
    expect(tooLong.ok).toBe(false);
    if (!tooLong.ok) expect(tooLong.error).toMatch(/description/i);
    expect(validateProductInput({ title: 'x', description: 'a'.repeat(1000), price: 10 }).ok).toBe(true);
  });

  it('rejects zero, negative, empty, non-numeric and non-finite prices', () => {
    for (const price of [0, -5, '0', '-1', '', '  ', 'abc', NaN, Infinity, '1e999']) {
      const result = validateProductInput({ title: 'x', description: '', price });
      expect(result.ok, String(price)).toBe(false);
      if (!result.ok) expect(result.error).toMatch(/price/i);
    }
  });
});
