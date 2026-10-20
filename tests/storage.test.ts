import { describe, expect, it } from 'vitest';
import { buildImageFileName } from '../lib/storage';

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

describe('buildImageFileName', () => {
  it('returns a different name on each call', () => {
    const file = { name: 'a.png' };
    expect(buildImageFileName(file)).not.toBe(buildImageFileName(file));
  });

  it('lowercases the extension and ignores spaces in the name', () => {
    expect(buildImageFileName({ name: 'my photo.JPG' })).toMatch(new RegExp(`^${UUID}\.jpg$`));
  });

  it('falls back to jpg when there is no extension', () => {
    expect(buildImageFileName({ name: 'noext' })).toMatch(new RegExp(`^${UUID}\.jpg$`));
  });

  it('uses the last extension of a multi-dot name', () => {
    expect(buildImageFileName({ name: 'a.b.c.png' })).toMatch(new RegExp(`^${UUID}\.png$`));
  });

  it('rejects weird extensions and falls back to jpg', () => {
    expect(buildImageFileName({ name: 'x.p/n g' })).toMatch(new RegExp(`^${UUID}\.jpg$`));
    expect(buildImageFileName({ name: 'x.toolongext' })).toMatch(new RegExp(`^${UUID}\.jpg$`));
    expect(buildImageFileName({ name: 'x.pñg' })).toMatch(new RegExp(`^${UUID}\.jpg$`));
  });

  it('derives the extension from the MIME type when the name has none', () => {
    expect(buildImageFileName({ name: 'photo', type: 'image/png' })).toMatch(/\.png$/);
    expect(buildImageFileName({ name: 'photo', type: 'image/jpeg' })).toMatch(/\.jpg$/);
    expect(buildImageFileName({ name: 'photo', type: 'image/webp' })).toMatch(/\.webp$/);
    expect(buildImageFileName({ name: 'photo', type: 'image/heic' })).toMatch(/\.heic$/);
  });

  it('falls back to jpg for an unknown MIME type', () => {
    expect(buildImageFileName({ name: 'photo', type: 'application/x-foo' })).toMatch(/\.jpg$/);
  });
});
