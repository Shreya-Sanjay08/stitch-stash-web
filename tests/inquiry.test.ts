import { describe, expect, it } from 'vitest';
import { CONTACT_EMAIL, buildInquiryMailto } from '../lib/inquiry';

function extractParam(mailto: string, name: string): string {
  const match = mailto.match(new RegExp(`${name}=([^&]*)`));
  if (!match) throw new Error(`missing param: ${name}`);
  return decodeURIComponent(match[1]);
}

describe('buildInquiryMailto', () => {
  it('starts with mailto: to the contact email', () => {
    expect(CONTACT_EMAIL).toBe('stitchstashsc@gmail.com');
    const result = buildInquiryMailto('Tulip Bouquet', 120);
    expect(result.startsWith(`mailto:${CONTACT_EMAIL}`)).toBe(true);
  });

  it('encodes a subject containing the product title', () => {
    const result = buildInquiryMailto('Tulip Bouquet', 120);
    expect(extractParam(result, 'subject')).toBe('Inquiry: Tulip Bouquet');
  });

  it('encodes a body containing the title and price', () => {
    const result = buildInquiryMailto('Tulip Bouquet', 120);
    expect(extractParam(result, 'body')).toBe(
      'Hi! I am writing to inquire about the Tulip Bouquet listed for 120 AED. Is this available for custom order or local pickup?'
    );
  });

  it('shows a numeric price exactly as given', () => {
    const result = buildInquiryMailto('Scarf', 85.5);
    expect(extractParam(result, 'body')).toContain('listed for 85.5 AED');
  });

  it('shows a string price exactly as given', () => {
    const result = buildInquiryMailto('Scarf', '85.50');
    expect(extractParam(result, 'body')).toContain('listed for 85.50 AED');
  });

  it('escapes a raw & in the title so it cannot create extra query params', () => {
    const result = buildInquiryMailto('Bows & Bobbles', 50);
    const ampersandCount = (result.match(/&/g) || []).length;
    // Only one literal & should remain: the subject/body separator.
    expect(ampersandCount).toBe(1);
  });

  const specialTitles: Array<[string, string]> = [
    ['ampersand', 'Bows & Bobbles'],
    ['double quote', 'Nana’s "Special" Set'],
    ['question mark', 'Is this real?'],
    ['hash', 'Set #3'],
    ['arabic text', 'مفرش كروشيه'],
    ['emoji', '🧶 Cozy Set 🧶'],
  ];

  it.each(specialTitles)('round-trips special characters via decodeURIComponent: %s', (_label, title) => {
    const result = buildInquiryMailto(title, 50);
    expect(extractParam(result, 'subject')).toBe(`Inquiry: ${title}`);
    expect(extractParam(result, 'body')).toContain(title);
  });
});
