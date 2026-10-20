'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { buildImageFileName } from '../../lib/storage';
import { validateProductInput } from '../../lib/productForm';
import type { Product } from '../../lib/types';

interface EditProductFormProps {
  product: Product;
  onSaved: () => void;
  onCancel: () => void;
}

export default function EditProductForm({ product, onSaved, onCancel }: EditProductFormProps) {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description ?? '');
  const [price, setPrice] = useState(String(product.price_aed));
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = validateProductInput({ title, description, price });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSaving(true);
    let uploadedName: string | null = null;

    try {
      const changes: Record<string, string | number> = { ...result.value };

      if (file) {
        const fileName = buildImageFileName(file);
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        uploadedName = fileName;

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        changes.image_url = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update(changes)
        .eq('id', product.id);
      if (updateError) throw updateError;

      onSaved();
    } catch (err) {
      console.error('Error saving product:', err);
      if (uploadedName) {
        // Best effort: don't leave an orphaned upload behind. The old image is never deleted.
        try {
          await supabase.storage.from('product-images').remove([uploadedName]);
        } catch (cleanupError) {
          console.error('Error removing uploaded image:', cleanupError);
        }
      }
      setError("We couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-cream p-4 rounded-sm border border-line space-y-3 mt-2"
    >
      {error && (
        <div role="alert" className="bg-cream text-clay-dark p-3 rounded-full text-xs font-medium border border-clay">
          {error}
        </div>
      )}

      <div>
        <label htmlFor={`edit-title-${product.id}`} className="block text-[11px] uppercase tracking-widest text-taupe-dark mb-1.5">Product Title</label>
        <input
          id={`edit-title-${product.id}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          className="w-full px-3 py-2 rounded-sm border border-line text-sm bg-white text-cocoa focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
        />
      </div>

      <div>
        <label htmlFor={`edit-description-${product.id}`} className="block text-[11px] uppercase tracking-widest text-taupe-dark mb-1.5">Description</label>
        <textarea
          id={`edit-description-${product.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          disabled={saving}
          className="w-full px-3 py-2 rounded-sm border border-line text-sm bg-white text-cocoa focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
        />
      </div>

      <div>
        <label htmlFor={`edit-price-${product.id}`} className="block text-[11px] uppercase tracking-widest text-taupe-dark mb-1.5">Price (AED)</label>
        <input
          id={`edit-price-${product.id}`}
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={saving}
          className="w-full px-3 py-2 rounded-sm border border-line text-sm bg-white text-cocoa focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
        />
      </div>

      <div>
        <span className="block text-[11px] uppercase tracking-widest text-taupe-dark mb-1.5">Current image</span>
        <img
          src={product.image_url}
          alt={`Current image of ${product.title}`}
          className="w-16 h-16 object-cover rounded-full border border-line mb-2"
        />
        <label htmlFor={`edit-image-${product.id}`} className="block text-[11px] uppercase tracking-widest text-taupe-dark mb-1.5">Replace image (optional)</label>
        <input
          id={`edit-image-${product.id}`}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={saving}
          className="w-full text-xs text-taupe-dark file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sand file:text-cocoa hover:file:bg-stone-200 cursor-pointer"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 min-h-[44px] bg-cocoa text-cream rounded-full text-sm tracking-wide hover:bg-cocoa/90 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 min-h-[44px] bg-white text-cocoa border border-line rounded-full text-sm font-medium hover:bg-sand transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
