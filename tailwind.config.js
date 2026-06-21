/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0F1419',
        'bg-card': '#1A1F26',
        'gold': '#C9A84C',
        'gold-light': '#E8C97A',
        'gold-dark': '#A07830',
        'islamic-green': '#1A6B3C',
        'islamic-green-light': '#228B4E',
        'text-primary': '#F0EDE6',
        'text-secondary': '#9CA3AF',
        'border-dark': '#2A3140',
      },
      fontFamily: {
        'amiri': ['Amiri', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'arabic-sm': ['1.25rem', { lineHeight: '2rem' }],
        'arabic-base': ['1.5rem', { lineHeight: '2.5rem' }],
        'arabic-lg': ['1.875rem', { lineHeight: '3rem' }],
        'arabic-xl': ['2.25rem', { lineHeight: '3.5rem' }],
        'arabic-2xl': ['3rem', { lineHeight: '4.5rem' }],
      },
    },
  },
  plugins: [],
}
