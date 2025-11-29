
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
      //  customeColor
      },
      fontSize: {
        base: '17px', // small text size
      },
      fontFamily: {
        p_thin: ['Poppins-Thin'],
        p_elight: ['Poppins-ExtraLight'],
        p_light: ['Poppins-Light'],
        p_reg: ['Poppins-Regular'],
        p_med: ['Poppins-Medium'],
        p_semi: ['Poppins-SemiBold'],
        p_bold: ['Poppins-Bold'],
        p_ebold: ['Poppins-ExtraBold'],
      },
    },
  },
  plugins: [],
}