'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { Product } from '../../lib/types';
import Link from 'next/link';
import { buildImageFileName } from '../../lib/storage';
import EditProductForm from '../../components/admin/EditProductForm';

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inventory:', error);
    } else if (data) {
      setProducts(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !price) {
      alert('Please fill in all required fields and select an image.');
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      // 1. Upload image to Supabase Storage bucket 'product-images'
      const fileName = buildImageFileName(file);
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Insert product record into the 'products' table
      const { error: dbError } = await supabase.from('products').insert([
        {
          title,
          description,
          price_aed: parseFloat(price),
          image_url: imageUrl,
          status: 'available',
        },
      ]);

      if (dbError) throw dbError;

      setSuccessMessage('✨ Product added successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setFile(null);
      fetchInventory();
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this creation?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      fetchInventory();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      fetchInventory();
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto bg-[#fafaf9] text-stone-800 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Stitch Stash Admin</h1>
          <p className="text-sm text-stone-500 mt-1">Manage your catalog and add new handmade creations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-900 font-medium text-sm bg-white border border-stone-200 px-4 py-2 rounded-xl shadow-sm transition"
          >
            ← Back to Store
          </Link>
          <button
            onClick={handleSignOut}
            className="text-stone-600 hover:text-stone-900 font-medium text-sm bg-white border border-stone-200 px-4 py-2 rounded-xl shadow-sm transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Add Product Form */}
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4 sticky top-6">
            <h2 className="text-lg font-semibold text-stone-800 pb-2 border-b border-stone-100">Add New Creation</h2>
            
            {successMessage && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-medium border border-emerald-100">
                {successMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Product Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
                placeholder="e.g., Tulip Bouquet"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={2}
                placeholder="Yarn details..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Price (AED)</label>
              <input 
                type="number" 
                step="0.01"
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required
                placeholder="120"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-stone-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Uploading...' : 'Publish Creation'}
            </button>
          </form>
        </div>

        {/* Inventory List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Current Inventory ({products.length})</h2>
          
          {products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id}>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image_url} 
                      alt={product.title} 
                      className="w-16 h-16 object-cover rounded-xl border border-stone-100"
                    />
                    <div>
                      <h3 className="font-semibold text-stone-800 text-sm">{product.title}</h3>
                      <p className="text-xs text-stone-500 font-medium mb-1.5">{product.price_aed} AED</p>
                      
                      {/* Status Dropdown */}
                      <select
                        value={product.status}
                        onChange={(e) => handleStatusChange(product.id, e.target.value)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer ${
                          product.status === 'available' 
                            ? 'bg-emerald-50 text-emerald-800' 
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="sold_out">Sold Out</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(editingId === product.id ? null : product.id)}
                      className="text-xs bg-stone-100 text-stone-700 px-3 py-2 rounded-xl hover:bg-stone-200 font-medium transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-xs bg-rose-50 text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-100 font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {editingId === product.id && (
                  <EditProductForm
                    key={product.id}
                    product={product}
                    onSaved={() => {
                      setEditingId(null);
                      setSuccessMessage('Changes saved');
                      fetchInventory();
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center text-stone-400">
              <p className="text-sm">No items in your inventory yet. Add one using the form!</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}