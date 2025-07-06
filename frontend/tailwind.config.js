/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <--- ADD THIS LINE
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}