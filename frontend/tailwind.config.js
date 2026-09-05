/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parotta: {
          50: '#FCFAF6',
          100: '#FAF5ED',
          200: '#F4EBDA',
          300: '#EBDABE',
          400: '#DEC29B',
          500: '#C9A371',
          600: '#B0844F',
          700: '#8F6335',
          800: '#6E4924',
          900: '#4A2F15',
          950: '#2A1708',
        },
        gold: {
          DEFAULT: '#E5A93C',
          light: '#F8CE75',
          dark: '#B87B1D',
          crisp: '#D97706'
        },
        crust: {
          light: '#9A5B2D',
          DEFAULT: '#7C3F1B',
          dark: '#4A210C'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -1px rgba(74, 47, 21, 0.06)',
        'warm-md': '0 8px 24px -4px rgba(74, 47, 21, 0.08), 0 2px 6px -2px rgba(74, 47, 21, 0.04)',
        'warm-lg': '0 16px 36px -6px rgba(74, 47, 21, 0.12), 0 4px 12px -2px rgba(74, 47, 21, 0.06)',
        'warm-xl': '0 24px 50px -10px rgba(74, 47, 21, 0.16)',
        'golden-glow': '0 0 25px rgba(229, 169, 60, 0.35)',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.04)' }
        }
      },
      animation: {
        'scan-laser': 'scan 2.4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
