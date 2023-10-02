/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  fontFamily: {
    sans: ["Montserrat", "sans-serif"],
  },
  theme: {
    extend: {
      colors: {
        "red-yoube": "#c41331",
        "pink-yoube": "#fcf1ef",
      },
    },
  },
  plugins: [],
}
