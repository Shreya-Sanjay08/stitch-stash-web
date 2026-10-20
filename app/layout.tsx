import './globals.css';
import { Fraunces, Caveat, Jost } from 'next/font/google';

// Fraunces is a variable font: no weight list, just the optical-size and softness axes.
const display = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'opsz'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

// Handwriting, used only for short annotations.
const hand = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
});

const body = Jost({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Stitch Stash | Handmade Crochet & Fabric Pieces, UAE',
  description:
    'Beautifully hand crafted crochet and fabric pieces, made to order in the UAE.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${hand.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
