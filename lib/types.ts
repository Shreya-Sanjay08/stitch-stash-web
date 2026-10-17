export interface Product {
  id: string;
  title: string;
  description: string;
  price_aed: number; // Changed to lowercase
  image_url: string;
  status: 'available' | 'sold_out' | 'coming_soon';
  created_at: string;
}