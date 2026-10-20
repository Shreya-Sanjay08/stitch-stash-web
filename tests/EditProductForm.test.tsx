import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Product } from '../lib/types';

const calls: string[] = [];
const eq = vi.fn();
const update = vi.fn();
const upload = vi.fn();
const remove = vi.fn();
const getPublicUrl = vi.fn();

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({ update })),
    storage: { from: vi.fn(() => ({ upload, remove, getPublicUrl })) },
  },
}));

import EditProductForm from '../components/admin/EditProductForm';

const product: Product = {
  id: 'p1',
  title: 'Tulip Bouquet',
  description: 'Soft yarn',
  price_aed: 120,
  image_url: 'https://example.com/old.jpg',
  status: 'available',
  created_at: '2024-01-01T00:00:00.000Z',
};

function setup() {
  const onSaved = vi.fn();
  const onCancel = vi.fn();
  const user = userEvent.setup();
  render(<EditProductForm product={product} onSaved={onSaved} onCancel={onCancel} />);
  return { onSaved, onCancel, user };
}

describe('EditProductForm', () => {
  beforeEach(() => {
    calls.length = 0;
    vi.clearAllMocks();
    eq.mockImplementation(async () => {
      calls.push('update');
      return { error: null };
    });
    update.mockImplementation(() => ({ eq }));
    upload.mockImplementation(async () => {
      calls.push('upload');
      return { error: null };
    });
    remove.mockResolvedValue({ error: null });
    getPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/new.jpg' } });
  });

  it('renders prefilled values', () => {
    setup();
    expect(screen.getByLabelText('Product Title')).toHaveValue('Tulip Bouquet');
    expect(screen.getByLabelText('Description')).toHaveValue('Soft yarn');
    expect(screen.getByLabelText('Price (AED)')).toHaveValue(120);
    expect(screen.getByAltText('Current image of Tulip Bouquet')).toHaveAttribute('src', product.image_url);
  });

  it('shows an error and makes no update call for an invalid price', async () => {
    const { user, onSaved } = setup();
    await user.clear(screen.getByLabelText('Price (AED)'));
    await user.type(screen.getByLabelText('Price (AED)'), '0');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/price/i);
    expect(update).not.toHaveBeenCalled();
    expect(upload).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it('updates with trimmed values and does not upload when no new file is chosen', async () => {
    const { user, onSaved } = setup();
    await user.clear(screen.getByLabelText('Product Title'));
    await user.type(screen.getByLabelText('Product Title'), '  Rose Bouquet  ');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(update).toHaveBeenCalledWith({ title: 'Rose Bouquet', description: 'Soft yarn', price_aed: 120 });
    expect(eq).toHaveBeenCalledWith('id', 'p1');
    expect(upload).not.toHaveBeenCalled();
  });

  it('uploads the new file before updating and saves its URL', async () => {
    const { user, onSaved } = setup();
    const file = new File(['x'], 'new.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Replace image (optional)'), file);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(calls).toEqual(['upload', 'update']);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ image_url: 'https://example.com/new.jpg' })
    );
  });

  it('removes the new upload and shows an error if the update fails', async () => {
    eq.mockResolvedValue({ error: { message: 'boom' } });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { user, onSaved } = setup();
    await user.upload(
      screen.getByLabelText('Replace image (optional)'),
      new File(['x'], 'new.png', { type: 'image/png' })
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't save/i);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(onSaved).not.toHaveBeenCalled();
  });
});
