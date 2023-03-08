/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./content-script/index.html",
    "./content-script/src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  important: true,
};
