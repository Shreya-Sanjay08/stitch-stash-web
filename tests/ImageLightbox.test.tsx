import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../components/ProductCard';
import { INSTAGRAM_DM_URL, buildInquiryMailto } from '../lib/inquiry';
import type { Product } from '../lib/types';

// jsdom does not implement the dialog methods, so provide minimal versions.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

afterEach(() => {
  document.body.style.overflow = '';
});

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

describe('ImageLightbox (via ProductCard)', () => {
  it('opens from the card image with title, price and inquiry links', async () => {
    const product = makeProduct();
    render(<ProductCard product={product} />);

    await userEvent.click(screen.getByRole('button', { name: 'View Tulip Bouquet larger' }));

    const dialog = screen.getByRole('dialog', { name: 'Tulip Bouquet' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog.querySelector('img')).toHaveAttribute('alt', 'Tulip Bouquet');
    expect(dialog).toHaveTextContent('120');
    expect(dialog).toHaveTextContent('AED');

    const instagram = screen.getAllByRole('link', { name: 'Message on Instagram' });
    const email = screen.getAllByRole('link', { name: 'Email' });
    // One set on the card, one in the dialog.
    expect(instagram).toHaveLength(2);
    expect(email).toHaveLength(2);
    expect(instagram[1]).toHaveAttribute('href', INSTAGRAM_DM_URL);
    expect(email[1]).toHaveAttribute('href', buildInquiryMailto(product.title, product.price_aed));
  });

  it('opens with the keyboard (Enter on the focused image button)', async () => {
    render(<ProductCard product={makeProduct()} />);
    const trigger = screen.getByRole('button', { name: 'View Tulip Bouquet larger' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: 'Tulip Bouquet' })).toHaveAttribute('open');
  });

  it('locks body scroll while open, and closes on Escape with focus back on the trigger', async () => {
    render(<ProductCard product={makeProduct()} />);
    const trigger = screen.getByRole('button', { name: 'View Tulip Bouquet larger' });
    await userEvent.click(trigger);
    expect(document.body.style.overflow).toBe('hidden');

    screen.getByRole('button', { name: 'Close' }).focus();
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();
  });

  it('closes when the backdrop is clicked', async () => {
    render(<ProductCard product={makeProduct()} />);
    await userEvent.click(screen.getByRole('button', { name: 'View Tulip Bouquet larger' }));
    const dialog = screen.getByRole('dialog', { name: 'Tulip Bouquet' });
    await userEvent.click(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('has no inquiry links in the dialog for a sold-out product', async () => {
    render(<ProductCard product={makeProduct({ status: 'sold_out' })} />);
    await userEvent.click(screen.getByRole('button', { name: 'View Tulip Bouquet larger' }));

    const dialog = screen.getByRole('dialog', { name: 'Tulip Bouquet' });
    expect(dialog.querySelectorAll('a')).toHaveLength(0);
    expect(screen.queryByRole('link', { name: 'Message on Instagram' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Email' })).toBeNull();
  });
});
