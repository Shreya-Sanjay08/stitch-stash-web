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
        clay: '#B5806B',
        // Darker variants of taupe and clay for small text, to meet WCAG AA contrast
        'taupe-dark': '#6F5F50',
        'clay-dark': '#8F5A47',
        // Yarn colours (decorative fills). Use the -dark variants for any text.
        mustard: '#E0A93B',
        terracotta: '#C8634A',
        sage: '#9DAE8F',
        blush: '#EBC4BB',
        plum: '#7A4B5E',
        'mustard-dark': '#7E5A0E',
        'terracotta-dark': '#A04A33',
        'sage-dark': '#5A6B4C',
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
