export type ProductInput = {
  title: string;
  description?: string | null;
  price: number | string;
};

export type ProductValidation =
  | { ok: true; value: { title: string; description: string; price_aed: number }; error?: undefined }
  | { ok: false; error: string; value?: undefined };

const MAX_TITLE = 120;
const MAX_DESCRIPTION = 1000;

export function validateProductInput({ title, description, price }: ProductInput): ProductValidation {
  const cleanTitle = (title ?? '').trim();
  if (!cleanTitle) {
    return { ok: false, error: 'Please give this creation a title.' };
  }
  if (cleanTitle.length > MAX_TITLE) {
    return { ok: false, error: `The title is too long. Please keep it under ${MAX_TITLE} characters.` };
  }

  const cleanDescription = (description ?? '').trim();
  if (cleanDescription.length > MAX_DESCRIPTION) {
    return {
      ok: false,
      error: `The description is too long. Please keep it under ${MAX_DESCRIPTION} characters.`,
    };
  }

  const priceText = typeof price === 'string' ? price.trim() : price;
  const numericPrice = typeof priceText === 'string' && priceText === '' ? NaN : Number(priceText);
  if (!Number.isFinite(numericPrice)) {
    return { ok: false, error: 'Please enter the price as a number, for example 120.' };
  }
  if (numericPrice <= 0) {
    return { ok: false, error: 'The price must be greater than 0 AED.' };
  }

  return {
    ok: true,
    value: { title: cleanTitle, description: cleanDescription, price_aed: numericPrice },
  };
}
