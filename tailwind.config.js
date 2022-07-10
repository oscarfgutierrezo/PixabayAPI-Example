/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './public/js/app.js'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        "sans": "Roboto"
      },
      colors: {
        'blue': '#5290A9',
        'light-blue': '#C5F9FF',
        'orange': '#F39530',
        'dark-orange': '#f78102',
        'red': '#C35354'
      }
    },
  },
  plugins: [],
}
