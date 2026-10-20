'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../lib/types';
import TestimonialCarousel from '../components/TestimonialCarousel';
import ProductCard from '../components/ProductCard';
import LoadError from '../components/LoadError';
import Reveal from '../components/Reveal';
import PeekingPieces from '../components/PeekingPieces';
import YarnThread from '../components/YarnThread';
import { INSTAGRAM_DM_URL, INSTAGRAM_PROFILE_URL, CONTACT_EMAIL } from '../lib/inquiry';
import { INTRO_PARAGRAPHS } from '../lib/content';
import { HERO_IMAGE } from '../lib/siteImages';
import { GrannySquare, Flower, YarnBall, Heart, Pompom } from '../components/crochet';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
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
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoadError(false);
    setLoading(true);
    fetchProducts();
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
    <div className="relative overflow-x-clip min-h-screen bg-cream text-cocoa flex flex-col justify-between font-sans">
      {/* Decorations sit between the page background and the content (z-[2]) */}
      <YarnThread />
      <PeekingPieces />

      
      {/* Top bar */}
      <div className="relative z-[2] border-b border-line">
        <nav className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <span className="font-display text-2xl font-medium tracking-wide text-cocoa">Stitch Stash</span>
          <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
            <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] text-cocoa hover:text-clay-dark transition">
              Instagram
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center min-h-[44px] text-cocoa hover:text-clay-dark transition">
              Email
            </a>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <header className="relative z-[2] px-6 py-16 md:py-28 max-w-6xl mx-auto w-full grid md:grid-cols-12 gap-12 md:gap-8 items-center">
        <div className="md:col-span-7 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-clay-dark mb-6">Handmade in the UAE</p>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tight leading-[0.95] text-cocoa mb-6">
            Stitch Stash
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-cocoa mb-3">
            Handcrafted crochet &amp; fabric pieces
          </p>
          <p className="text-sm text-taupe-dark tracking-wide mb-8">
            10+ years of artisan experience · 1,000+ custom pieces
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-3 mb-8">
            <a
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] bg-cocoa text-cream px-8 rounded-full text-sm tracking-wide hover:bg-cocoa/90 transition"
            >
              Message on Instagram
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center justify-center min-h-[44px] border border-cocoa text-cocoa px-8 rounded-full text-sm tracking-wide hover:bg-sand transition"
            >
              Email Us
            </a>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-6 flex-wrap">
            <a href="#collection" className="inline-block text-xs uppercase tracking-widest text-cocoa underline underline-offset-8 decoration-line hover:decoration-clay transition">
              Explore the collection
            </a>
            {/* Handwritten note with a hand-drawn arrow */}
            <span aria-hidden="true" className="hidden sm:flex items-center gap-2 font-hand text-2xl text-plum -rotate-3">
              made by hand, in the UAE
              <svg width="54" height="30" viewBox="0 0 54 30" fill="none" className="shrink-0">
                <path d="M2 20 C14 4 30 4 46 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M36 14 L47 17 L42 27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <p aria-hidden="true" className="sm:hidden mt-6 font-hand text-2xl text-plum -rotate-2">
            made by hand, in the UAE
          </p>
        </div>

        {/* Framed hero image */}
        <div className="md:col-span-5 flex justify-center">
          <div className="stitched relative w-full max-w-sm rotate-2 bg-sand p-4 rounded-sm border border-line">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-cream">
              {HERO_IMAGE ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={HERO_IMAGE}
                  alt="Handmade crochet pieces by Stitch Stash"
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div aria-hidden="true" className="absolute inset-0">
                  <GrannySquare className="absolute w-3/5 left-[20%] top-[22%] rotate-6" fuzzy />
                  <Flower className="absolute w-[34%] left-[4%] top-[4%] -rotate-12" />
                  <YarnBall className="absolute w-[36%] right-[2%] bottom-[4%] rotate-12" />
                  <Heart className="absolute w-[24%] right-[8%] top-[6%] rotate-12" />
                  <Pompom className="absolute w-[24%] left-[6%] bottom-[8%]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Welcome */}
      <section id="about" className="relative bg-sand px-6 py-20 md:py-28">
        <Reveal className="relative z-[2] max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-clay-dark mb-8">Welcome</p>
          {INTRO_PARAGRAPHS.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? 'font-display text-2xl md:text-3xl leading-relaxed text-cocoa mb-8'
                  : 'text-base leading-loose text-cocoa mb-6 last:mb-0'
              }
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>

      {/* Main Content Container */}
      <main className="relative z-[2] px-6 py-16 md:px-12 max-w-6xl mx-auto w-full flex-grow">

        {/* Collection */}
        <section id="collection" className="scroll-mt-8">
          <Reveal className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-medium text-cocoa mb-3">The Collection</h2>
            <p className="text-sm text-taupe-dark">
              Every piece is handmade. Message us on Instagram or email to enquire.
            </p>
          </Reveal>

          {/* Search & Filter Bar */}
          <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <input 
                type="text"
                placeholder="Search handmade creations..."
                aria-label="Search handmade creations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-[44px] px-4 rounded-full border border-line bg-white text-cocoa placeholder:text-taupe-dark text-sm focus:outline-none focus:border-clay"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`min-h-[44px] px-5 rounded-full text-xs uppercase tracking-widest transition whitespace-nowrap ${selectedCategory === 'all' ? 'bg-cocoa text-cream border border-cocoa' : 'bg-transparent text-cocoa border border-line hover:border-cocoa'}`}
              >
                All Creations
              </button>
              <button 
                onClick={() => setSelectedCategory('available')}
                className={`min-h-[44px] px-5 rounded-full text-xs uppercase tracking-widest transition whitespace-nowrap ${selectedCategory === 'available' ? 'bg-cocoa text-cream border border-cocoa' : 'bg-transparent text-cocoa border border-line hover:border-cocoa'}`}
              >
                Available Now
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex justify-end items-center mb-6">
            <span className="text-sm text-taupe-dark">{filteredProducts.length} pieces found</span>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-sm h-96 animate-pulse border border-line" />
              ))}
            </div>
          ) : loadError ? (
            <LoadError onRetry={handleRetry} />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Reveal key={product.id} delay={(index % 3) * 100} className="h-full">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="col-span-full bg-white p-12 rounded-sm border border-line text-center">
              <span className="text-3xl mb-2 block">🧶</span>
              <p className="font-display text-2xl text-cocoa">No creations match your search.</p>
              <p className="text-sm text-taupe-dark mt-1">Try searching for something else or check back soon!</p>
            </div>
          )}
        </section>

        {/* Testimonial Carousel */}
        <section className="mt-20">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-cocoa text-center mb-8">
            Loved by our customers
          </h2>
          <TestimonialCarousel />
        </section>

      </main>

      {/* Footer */}
      <footer className="relative bg-sand border-t border-line py-12 px-6 mt-20 text-center">
        <div className="relative z-[2] max-w-6xl mx-auto flex flex-col items-center gap-6">
          <span className="font-display text-2xl font-medium text-cocoa">Stitch Stash</span>
          <div className="flex gap-8 text-xs uppercase tracking-widest">
            <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] text-cocoa hover:text-clay-dark transition">
              Instagram
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center min-h-[44px] text-cocoa hover:text-clay-dark transition">
              Email
            </a>
          </div>
          <p className="text-xs text-taupe-dark">© {new Date().getFullYear()} Stitch Stash. All rights reserved. Crafted with patience and yarn.</p>
        </div>
      </footer>

    </div>
  );
}