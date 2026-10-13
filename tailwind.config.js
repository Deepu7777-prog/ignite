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
          50: '#F1F8F1',
          100: '#DDEEDF',
          200: '#CDEEDC',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#079669',
          700: '#075C45',
          800: '#064e3b',
          900: '#123F35',
          950: '#022c22',
        },
        garden: {
          ivory: '#FFFDF7',
          cream: '#F8F4E8',
          pale: '#F1F8F1',
          sage: '#DDEEDF',
          mint: '#CDEEDC',
          emerald: '#079669',
          forest: '#075C45',
          text: '#123F35',
          gold: '#E8D99A',
        },
        cream: {
          50: '#FFFDF7',
          100: '#F8F4E8',
          200: '#f2ead9',
          300: '#ebdcc7',
          400: '#dec6a7',
          500: '#caa881',
        },
        sage: {
          50: '#F1F8F1',
          100: '#DDEEDF',
          200: '#CDEEDC',
          300: '#a8ccb2',
          400: '#78ae87',
          500: '#529164',
        },
        apna: {
          dark: '#123F35',
          forest: '#075C45',
          grass: '#079669',
          light: '#F1F8F1',
          cream: '#F8F4E8',
          ivory: '#FFFDF7',
          gold: '#E8D99A',
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
        handwriting: ['Caveat', 'cursive'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(7, 92, 69, 0.06), 0 2px 6px -1px rgba(7, 92, 69, 0.03)',
        'garden': '0 6px 24px -4px rgba(7, 92, 69, 0.07), 0 2px 8px -2px rgba(18, 63, 53, 0.04)',
        'garden-lg': '0 14px 32px -4px rgba(7, 92, 69, 0.12), 0 4px 12px -2px rgba(18, 63, 53, 0.06)',
        'card': '0 2px 12px -2px rgba(7, 92, 69, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 14px 30px -4px rgba(7, 92, 69, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'nav': '0 2px 12px -2px rgba(7, 92, 69, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
