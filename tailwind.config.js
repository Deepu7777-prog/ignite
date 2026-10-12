/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        cream: {
          50: '#fdfbf7',
          100: '#fbf8f1',
          200: '#f5eee2',
          300: '#ebdcc7',
          400: '#dec6a7',
          500: '#caa881',
        },
        sage: {
          50: '#f2f7f4',
          100: '#e4efe7',
          200: '#cde1d3',
          300: '#a8ccb2',
          400: '#78ae87',
          500: '#529164',
        },
        apna: {
          dark: '#133826',
          forest: '#1b4332',
          grass: '#2d6a4f',
          light: '#eaf4ed',
          cream: '#fbf8f1',
          gold: '#eab308',
        },
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 14px -2px rgba(27, 67, 50, 0.05), 0 1px 4px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 14px 30px -4px rgba(27, 67, 50, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'nav': '0 1px 4px 0 rgba(27, 67, 50, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
