/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ghibli-green': '#8FBC8F',
        'ghibli-blue': '#87CEEB',
        'ghibli-cream': '#F5F5DC',
        'ghibli-brown': '#8B4513',
        'wedding-white': '#FFFDF0',
        'wedding-gold': '#FFD700',
        'wedding-rose': '#8B0000',
      },
      fontFamily: {
        'ghibli': ['serif'],
      },
    },
  },
  plugins: [],
}