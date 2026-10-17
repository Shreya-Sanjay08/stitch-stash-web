import './globals.css';

export const metadata = {
  title: 'Stitch Stash',
  description: 'Handcrafted crochet with love.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}