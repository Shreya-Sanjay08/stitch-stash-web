export const INSTAGRAM_DM_URL = 'https://ig.me/m/stitchstashthw';
export const INSTAGRAM_PROFILE_URL = 'https://instagram.com/stitchstashthw';
export const CONTACT_EMAIL = 'stitchstashsc@gmail.com';

export function buildInquiryMailto(title: string, price: number | string): string {
  const subject = encodeURIComponent(`Inquiry: ${title}`);
  const body = encodeURIComponent(
    `Hi! I am writing to inquire about the ${title} listed for ${price} AED. Is this available for custom order or local pickup?`
  );

  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
