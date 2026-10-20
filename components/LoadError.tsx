import { INSTAGRAM_DM_URL } from '../lib/inquiry';

interface LoadErrorProps {
  onRetry: () => void;
}

export default function LoadError({ onRetry }: LoadErrorProps) {
  return (
    <div className="bg-white p-12 rounded-sm border border-line text-center">
      <span className="text-3xl mb-2 block">🧶</span>
      <p className="font-display text-2xl text-cocoa max-w-md mx-auto">
        We couldn&apos;t load our creations just now. Please try again, or message us on Instagram.
      </p>
      <div className="flex justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center min-h-[44px] bg-cocoa text-cream px-6 rounded-full text-sm hover:bg-cocoa/90 transition"
        >
          Try again
        </button>
        <a
          href={INSTAGRAM_DM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-[44px] border border-cocoa text-cocoa px-6 rounded-full text-sm hover:bg-sand transition"
        >
          Message on Instagram
        </a>
      </div>
    </div>
  );
}
