/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ayurGreen: '#2E7D32',
        ayurBeige: '#F5F5DC',
        ayurSaffron: '#FF8C00',
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
        openSans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}