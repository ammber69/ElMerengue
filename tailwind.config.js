/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        merengue: {
          main: '#D63384',
          pastel: '#FCE4EC',
          dark: '#AD1457',
          medium: '#F48FB1',
          snow: '#FAFAFA',
          gray: '#F5F5F5',
          text: '#2D2D2D',
          gold: '#F9A825'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sub: ['Lato', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['"Dancing Script"', 'cursive']
      }
    },
  },
  plugins: [],
}
