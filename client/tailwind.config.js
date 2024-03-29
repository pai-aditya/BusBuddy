/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#7378c5',
        'custom-primary-purple':'#20234d',
        'custom-gold':'#e99e15',
        'custom-title':'#491cb4',
        'custom-pink':'#bf1fd0',
        'custom-grey':'#121212',
        'custom-hover':'#E667AB'
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}