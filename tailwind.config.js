/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F1',
        sand: '#F1E9DD',
        line: '#E7DDCF',
        taupe: '#8B7B6B',
        cocoa: '#3F342C',
        blush: '#FBDDC4', // very soft orange tint
        // Brand colours, from the client's logo. Use the -dark variants for small text:
        // brand-orange-dark 5.4:1 and brand-olive-dark 5.5:1 on cream, both above 4.5:1.
        'brand-orange': '#E8690B',
        'brand-olive': '#7F8A25',
        'brand-thread': '#8E8E8E',
        'brand-orange-dark': '#A64B00',
        'brand-olive-dark': '#5F6A1A',
        // Darker taupe for small text
        'taupe-dark': '#6F5F50',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'Times New Roman', 'serif'],
        hand: ['var(--font-hand)', 'cursive'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
