import { Product } from '../lib/types';
import { INSTAGRAM_DM_URL, buildInquiryMailto } from '../lib/inquiry';

export default function ProductCard({ product }: { product: Product }) {
  const isAvailable = product.status === 'available';

  return (
    <div className="bg-white border border-line overflow-hidden flex flex-col group">
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
            <span className="text-lg text-cocoa">
              {product.price_aed}
              <span className="text-xs tracking-widest ml-1">AED</span>
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
