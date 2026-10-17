// Only add REAL, permitted customer quotes here. Do not invent or
// paraphrase reviews — each entry should be something a customer actually
// said and agreed to have shared publicly.

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail?: string; // e.g. "Dubai" or "Custom bouquet"
};

export const testimonials: Testimonial[] = [];
