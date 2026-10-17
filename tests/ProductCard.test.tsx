import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import { INSTAGRAM_DM_URL, buildInquiryMailto } from '../lib/inquiry';
import type { Product } from '../lib/types';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: '1',
    title: 'Tulip Bouquet',
    description: 'A handmade crochet bouquet',
    price_aed: 120,
    image_url: 'https://example.com/tulip.jpg',
    status: 'available',
    created_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('ProductCard', () => {
  it('shows both inquiry links with correct hrefs when available', () => {
    const product = makeProduct({ status: 'available' });
    render(<ProductCard product={product} />);

    const instagramLink = screen.getByRole('link', { name: 'Message on Instagram' });
    expect(instagramLink).toHaveAttribute('href', INSTAGRAM_DM_URL);

    const emailLink = screen.getByRole('link', { name: 'Email' });
    expect(emailLink).toHaveAttribute('href', buildInquiryMailto(product.title, product.price_aed));

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows a disabled button and no inquiry links when sold_out', () => {
    const product = makeProduct({ status: 'sold_out' });
    render(<ProductCard product={product} />);

    const button = screen.getByRole('button', { name: 'Sold Out' });
    expect(button).toBeDisabled();

    expect(screen.queryByRole('link', { name: 'Message on Instagram' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Email' })).toBeNull();
  });

  // Current behavior: 'coming_soon' is treated identically to 'sold_out' by
  // ProductCard (isAvailable is only true for 'available'), so it also shows
  // a disabled "Sold Out" button with no inquiry links. This looks like a
  // pre-existing product gap (coming_soon products should probably read
  // differently from sold_out ones) but this test intentionally locks in
  // the current behavior rather than changing it.
  it('shows a disabled "Sold Out" button and no inquiry links when coming_soon (current behavior)', () => {
    const product = makeProduct({ status: 'coming_soon' });
    render(<ProductCard product={product} />);

    const button = screen.getByRole('button', { name: 'Sold Out' });
    expect(button).toBeDisabled();

    expect(screen.queryByRole('link', { name: 'Message on Instagram' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Email' })).toBeNull();
  });
});
