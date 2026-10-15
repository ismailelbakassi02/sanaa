/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#070707',
          900: '#0d0d0d',
          850: '#131313',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
          gold: '#d4af37',
          goldHover: '#c59f27',
          teal: '#1b6b66',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Reem Kufi', 'Amiri', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
