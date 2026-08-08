/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0B0D',
        charcoal: '#181512',
        ember: {
          DEFAULT: '#A31621',
          light: '#C4293A',
          dark: '#7A1019',
        },
        gilt: {
          DEFAULT: '#C9A227',
          soft: '#E4C766',
          dim: '#8A7328',
        },
        bone: '#F5F1E8',
        stone: '#9C9488',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        ringPulse: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s ease-out forwards',
        ringPulse: 'ringPulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
