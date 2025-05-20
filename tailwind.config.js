/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          light: '#FFEDD5',
          DEFAULT: '#FB923C',
          dark: '#EA580C',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shrink': 'shrink 8s linear forwards'
      },
      keyframes: {
        shrink: {
          '0%': { width: '100%' },
          '100%': { width: '0%' }
        }
      },
      backgroundColor: {
        'celestial': '#121b3b', // Dark blue background from the celestial-themed favicon
      }
    },
  },
  plugins: [],
};
