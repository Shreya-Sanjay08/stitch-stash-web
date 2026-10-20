import { Product } from '../lib/types';
import { INSTAGRAM_DM_URL, buildInquiryMailto } from '../lib/inquiry';
import { cardRotation } from '../lib/cardRotation';

export default function ProductCard({ product }: { product: Product }) {
  const isAvailable = product.status === 'available';
  const rotation = cardRotation(product.id);

  return (
    <div
      className="stitched h-full bg-white border border-line overflow-hidden flex flex-col group transition-transform duration-300 ease-out [transform:rotate(var(--card-rot))] hover:[transform:rotate(0deg)_translateY(-6px)] motion-reduce:transition-none motion-reduce:hover:[transform:rotate(var(--card-rot))]"
      style={{ ['--card-rot' as string]: `${rotation}deg` }}
    >
      {/* Product Image */}
      <div className="aspect-[4/5] w-full bg-sand relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className={`object-cover w-full h-full transition duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${!isAvailable ? 'opacity-60 grayscale' : ''}`}
        />

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span aria-hidden="true" className="w-[140%] -rotate-12 bg-cocoa text-cream text-xs uppercase tracking-[0.3em] text-center py-2">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display text-xl font-medium text-cocoa mb-1">{product.title}</h3>
        <p className="text-sm text-taupe-dark mb-5 flex-grow line-clamp-2">{product.description}</p>

        <div className="mt-auto">
          <div className="border-t border-line pt-4 mb-4">
            {/* Hang-tag price: pointed end with a hole, and a bit of string */}
            <span className="relative inline-block ml-3">
              <svg aria-hidden="true" width="22" height="14" viewBox="0 0 22 14" fill="none" className="absolute -left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M1 12 C6 12 6 3 14 7" stroke="#B5806B" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span className="inline-flex items-center gap-1 bg-mustard text-cocoa text-lg pl-6 pr-4 py-1 [clip-path:polygon(14px_0,100%_0,100%_100%,14px_100%,0_50%)]">
                <span aria-hidden="true" className="absolute left-[9px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                <span>
                  {product.price_aed}
                  <span className="text-xs tracking-widest ml-1">AED</span>
                </span>
              </span>
            </span>
          </div>

          {isAvailable ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center min-h-[44px] text-center text-sm bg-cocoa text-cream px-4 rounded-full hover:bg-cocoa/90 transition"
              >
                Message on Instagram
              </a>
              <a
                href={buildInquiryMailto(product.title, product.price_aed)}
                className="flex-1 inline-flex items-center justify-center min-h-[44px] text-center text-sm border border-cocoa text-cocoa px-4 rounded-full hover:bg-sand transition"
              >
                Email
              </a>
            </div>
          ) : (
            <button
              disabled
              className="w-full min-h-[44px] text-sm bg-sand text-taupe-dark px-4 rounded-full cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
