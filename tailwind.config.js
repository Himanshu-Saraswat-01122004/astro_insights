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
    },
  },
  plugins: [],
};
