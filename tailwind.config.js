/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-green': '0 15px 35px rgba(0, 255, 0, 0.5)',
        'custom-green-hover': '0 15px 35px rgba(0, 255, 0, 0.7)',
      },
      transform: {
        'perspective-1500': 'perspective(1500px)',
      },
    },
  },
  plugins: [],
};
