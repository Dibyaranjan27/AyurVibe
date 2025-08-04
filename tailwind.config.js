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
        earthBrown: '#2C1810',
        warmBeige: '#F5E6DB',
        spiceBrown: '#8B4513',
        logoGreen: '#1A9E83',
        'leaf-1': '#A3C1AD', // Lightest green
        'leaf-2': '#5E8C6A', // Medium green
        'leaf-3': '#C4D7C9', // Very light green (alternative)
        'leaf-4': '#3E6259', // Darkest green
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
        openSans: ['Open Sans', 'sans-serif'],
        serif: ['Crimson Text', 'serif'],
      },
      keyframes: {
        'float-leaf': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(10deg)' },
        }
      },
      animation: {
        'float-leaf': 'float-leaf 3s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}