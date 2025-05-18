/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust according to your folder structure
  ],
  theme: {
    extend: {
      // You can customize fonts, colors, etc. here
      colors: {
        primary: '#6366f1',   // Indigo-500
        secondary: '#ec4899', // Pink-500
      },
    },
  },
  plugins: [],
}
