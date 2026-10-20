'use client';

import { useEffect, useRef, useState } from 'react';
import { INSTAGRAM_DM_URL, buildInquiryMailto } from '../lib/inquiry';
import type { Product } from '../lib/types';

interface ImageLightboxProps {
  product: Product;
  /** The thumbnail shown inside the trigger button. */
  children: React.ReactNode;
  triggerClassName?: string;
}

/** A product image that opens a larger view in a native <dialog>. */
export default function ImageLightbox({ product, children, triggerClassName = '' }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isAvailable = product.status === 'available';

  // Open and close the native dialog to match state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock body scroll while open, and put focus back on the trigger when it closes.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${product.title} larger`}
        aria-haspopup="dialog"
        className={`block w-full h-full cursor-zoom-in ${triggerClassName}`}
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={product.title}
        onClose={close}
        onCancel={close}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            close();
          }
        }}
        // Clicks on the backdrop land on the dialog element itself.
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="p-0 bg-transparent backdrop:bg-cocoa/70 max-w-[min(92vw,56rem)] w-full overflow-visible"
      >
        {open && (
          <div className="stitched relative bg-cream border border-line rounded-sm p-5 md:p-8 grid md:grid-cols-2 gap-6 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-2 right-2 z-10 w-11 h-11 inline-flex items-center justify-center rounded-full bg-white border border-line text-cocoa hover:bg-sand transition"
            >
              <span aria-hidden="true" className="text-xl leading-none">×</span>
            </button>

            <img
              src={product.image_url}
              alt={product.title}
              className="w-full max-h-[70vh] object-contain bg-sand rounded-sm"
            />

            <div className="flex flex-col justify-center">
              <h3 className="font-display text-3xl font-medium text-cocoa mb-2">{product.title}</h3>
              {product.description && <p className="text-sm text-taupe-dark mb-5">{product.description}</p>}
              <p className="text-xl text-cocoa mb-6">
                {product.price_aed}
                <span className="text-xs tracking-widest ml-1">AED</span>
              </p>

              {isAvailable && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={INSTAGRAM_DM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center min-h-[44px] text-sm bg-cocoa text-cream px-4 rounded-full hover:bg-cocoa/90 transition"
                  >
                    Message on Instagram
                  </a>
                  <a
                    href={buildInquiryMailto(product.title, product.price_aed)}
                    className="flex-1 inline-flex items-center justify-center min-h-[44px] text-sm border border-cocoa text-cocoa px-4 rounded-full hover:bg-sand transition"
                  >
                    Email
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
