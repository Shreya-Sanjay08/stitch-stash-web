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
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-stone-800 mb-8">Stitch Stash</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4"
        >
          <h2 className="text-lg font-semibold text-stone-800 pb-2 border-b border-stone-100">
            Admin Login
          </h2>

          {errorMessage && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-medium border border-rose-100">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-800 transition">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
