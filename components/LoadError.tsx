import { INSTAGRAM_DM_URL } from '../lib/inquiry';

interface LoadErrorProps {
  onRetry: () => void;
}

export default function LoadError({ onRetry }: LoadErrorProps) {
  return (
    <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 text-center">
      <span className="text-3xl mb-2 block">🧶</span>
      <p className="text-stone-600 font-medium">
        We couldn&apos;t load our creations just now. Please try again, or message us on Instagram.
      </p>
      <div className="flex justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={onRetry}
          className="bg-stone-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition shadow-sm"
        >
          Try again
        </button>
        <a
          href={INSTAGRAM_DM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-rose-100 text-rose-800 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-200 transition shadow-sm"
        >
          Message on Instagram
        </a>
      </div>
    </div>
  );
}
