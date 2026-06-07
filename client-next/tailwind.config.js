/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ff7043',
          DEFAULT: '#d32f2f', // Matrimony Red
          dark: '#b71c1c',
        },
        secondary: {
          light: '#42a5f5',
          DEFAULT: '#1976d2',
          dark: '#0d47a1',
        }
      }
    },
  },
  plugins: [],
}
