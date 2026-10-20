'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage('Incorrect email or password');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cream text-cocoa flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl font-medium text-center text-cocoa mb-8">Stitch Stash</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-sm border border-line space-y-4"
        >
          <h2 className="font-display text-2xl font-medium text-cocoa pb-2 border-b border-line">
            Admin Login
          </h2>

          {errorMessage && (
            <div className="bg-cream text-brand-orange-dark p-3 rounded-full text-xs font-medium border border-brand-orange">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-taupe-dark mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-sm border border-line text-sm bg-white text-cocoa focus:outline-none focus:border-brand-olive focus:ring-1 focus:ring-brand-olive"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-taupe-dark mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-sm border border-line text-sm bg-white text-cocoa focus:outline-none focus:border-brand-olive focus:ring-1 focus:ring-brand-olive"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cocoa text-cream min-h-[44px] rounded-full text-sm tracking-wide hover:bg-cocoa/90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-taupe-dark hover:text-brand-olive-dark transition">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
