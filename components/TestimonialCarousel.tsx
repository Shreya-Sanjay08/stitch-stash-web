'use client';

import { useCallback, useRef, useState } from 'react';
import { testimonials, type Testimonial } from '../lib/testimonials';

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 'sample-1',
    quote: 'Absolutely loved the detail in my custom bouquet — it looked even better than the photos!',
    name: 'Sample Customer',
    detail: 'Dubai',
  },
  {
    id: 'sample-2',
    quote: 'Fast replies, beautiful craftsmanship, and such a thoughtful gift.',
    name: 'Sample Customer',
    detail: 'Custom bouquet',
  },
  {
    id: 'sample-3',
    quote: 'The quality is incredible for handmade work. Will definitely order again.',
    name: 'Sample Customer',
    detail: 'Abu Dhabi',
  },
];

type Slide =
  | { type: 'milestone' }
  | { type: 'testimonial'; testimonial: Testimonial; isSample: boolean };

const SWIPE_THRESHOLD = 50;

export default function TestimonialCarousel() {
  const showSamples = testimonials.length === 0 && process.env.NODE_ENV === 'development';
  const sourceTestimonials = testimonials.length > 0 ? testimonials : showSamples ? SAMPLE_TESTIMONIALS : [];

  const slides: Slide[] = [
    { type: 'milestone' },
    ...sourceTestimonials.map((testimonial) => ({
      type: 'testimonial' as const,
      testimonial,
      isSample: showSamples,
    })),
  ];

  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const showControls = slides.length > 1;

  const goTo = useCallback(
    (target: number) => {
      setIndex(((target % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (deltaX > SWIPE_THRESHOLD) {
      goPrev();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      goNext();
    }
    touchStartX.current = null;
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="bg-white rounded-sm border border-line overflow-hidden"
    >
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          aria-live="polite"
          className="flex transition-all duration-500 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              aria-hidden={i !== index}
              className="w-full flex-shrink-0 px-8 py-14 md:px-16 md:py-16 text-center"
            >
              {slide.type === 'milestone' ? (
                <>
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-olive-dark mb-6 inline-block">
                    Our Milestone
                  </span>
                  <p className="font-display text-6xl md:text-8xl font-medium text-cocoa tracking-tight mb-4">
                    1,000+
                  </p>
                  <p className="text-lg text-cocoa max-w-md mx-auto mb-2">
                    custom handcrafted pieces, made with patience and yarn
                  </p>
                  <p className="text-sm text-taupe-dark tracking-wide">
                    10+ years of artisan experience
                  </p>
                </>
              ) : (
                <>
                  {slide.isSample && (
                    <span className="bg-cream text-brand-orange-dark text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block border border-line">
                      SAMPLE – not a real review
                    </span>
                  )}
                  <p className="font-display italic text-2xl md:text-3xl text-cocoa leading-snug max-w-xl mx-auto mb-6">
                    &ldquo;{slide.testimonial.quote}&rdquo;
                  </p>
                  <p className="text-xs uppercase tracking-widest text-cocoa">{slide.testimonial.name}</p>
                  {slide.testimonial.detail && (
                    <p className="text-xs text-taupe-dark mt-1">{slide.testimonial.detail}</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {showControls && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-cream border border-line text-cocoa hover:bg-sand transition text-lg"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-cream border border-line text-cocoa hover:bg-sand transition text-lg"
            >
              ›
            </button>
          </>
        )}
      </div>

      {showControls && (
        <div className="flex justify-center gap-1 pb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className="w-11 h-11 flex items-center justify-center"
            >
              <span
                className={`block w-2.5 h-2.5 rounded-full transition ${
                  i === index ? 'bg-cocoa' : 'bg-line'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
