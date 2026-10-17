import { Product } from '../lib/types';
import { INSTAGRAM_DM_URL, buildInquiryMailto } from '../lib/inquiry';

export default function ProductCard({ product }: { product: Product }) {
  const isAvailable = product.status === 'available';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col hover:shadow-md transition group">
      {/* Product Image */}
      <div className="h-64 w-full bg-stone-100 relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className={`object-cover w-full h-full group-hover:scale-105 transition duration-300 ${!isAvailable ? 'opacity-60 grayscale-[30%]' : ''}`}
        />

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/30 backdrop-blur-[2px]">
            <span className="bg-stone-900 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-stone-800 mb-1">{product.title}</h3>
        <p className="text-sm text-stone-500 mb-4 flex-grow line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-2 border-t border-stone-50">
          <div className="mb-3">
            <span className="font-bold text-lg text-stone-800">{product.price_aed} AED</span>
          </div>

          {isAvailable ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-sm bg-stone-800 text-white px-4 py-2 rounded-xl font-medium hover:bg-stone-700 transition"
              >
                Message on Instagram
              </a>
              <a
                href={buildInquiryMailto(product.title, product.price_aed)}
                className="flex-1 text-center text-sm bg-white border border-stone-200 text-stone-800 px-4 py-2 rounded-xl font-medium hover:bg-stone-50 transition"
              >
                Email
              </a>
            </div>
          ) : (
            <button
              disabled
              className="text-sm bg-stone-200 text-stone-400 px-4 py-2 rounded-xl font-medium cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
