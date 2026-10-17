'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../lib/types';
import TestimonialCarousel from '../components/TestimonialCarousel';
import ProductCard from '../components/ProductCard';
import { INSTAGRAM_DM_URL, INSTAGRAM_PROFILE_URL, CONTACT_EMAIL } from '../lib/inquiry';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // For now, we match all if 'all' is selected, or you can expand categories later
    const matchesCategory = selectedCategory === 'all' || product.status === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 flex flex-col justify-between font-sans">
      
      {/* Main Content Container */}
      <main className="p-6 md:p-12 max-w-6xl mx-auto w-full flex-grow">
        
        {/* Hero Section */}
        <header className="text-center py-16">
          <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            Handmade in UAE 🇦🇪
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-800 mb-4">
            Stitch Stash
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-2">
            Handcrafted with love. 🧶
          </p>
          <p className="text-md text-stone-500 max-w-2xl mx-auto mb-8 font-medium">
            Over 10 years of artisan experience & 1,000+ custom crochet pieces sold.
          </p>
          
          <div className="flex justify-center gap-4">
            <a
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rose-100 text-rose-800 px-6 py-3 rounded-full font-semibold hover:bg-rose-200 transition shadow-sm"
            >
              DM on Instagram
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="bg-stone-200 text-stone-800 px-6 py-3 rounded-full font-semibold hover:bg-stone-300 transition shadow-sm"
            >
              Email Us
            </a>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <section className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <input 
              type="text"
              placeholder="Search handmade creations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 text-stone-800 shadow-sm text-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${selectedCategory === 'all' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}
            >
              All Creations
            </button>
            <button 
              onClick={() => setSelectedCategory('available')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${selectedCategory === 'available' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}
            >
              Available Now
            </button>
          </div>
        </section>

       {/* Product Grid Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-stone-800">Latest Creations</h2>
            <span className="text-sm text-stone-500">{filteredProducts.length} pieces found</span>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 h-80 animate-pulse border border-stone-100" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            
            // ===== REPLACE FROM HERE ... =====
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="col-span-full bg-white p-12 rounded-2xl shadow-sm border border-stone-100 text-center text-stone-400">
              <span className="text-3xl mb-2 block">🧶</span>
              <p className="text-stone-600 font-medium">No creations match your search.</p>
              <p className="text-sm text-stone-400 mt-1">Try searching for something else or check back soon!</p>
            </div>
          )}
        </section>

        {/* Testimonial Carousel */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-stone-800 text-center mb-6">
            Loved by our customers
          </h2>
          <TestimonialCarousel />
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 px-6 mt-20 text-center text-stone-500 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Stitch Stash. All rights reserved. Crafted with patience and yarn.</p>
          <div className="flex gap-6">
            <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 transition">
              Instagram
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}