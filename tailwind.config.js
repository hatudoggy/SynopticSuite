/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{jsx,css}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        red: colors.red,
        yellow: colors.amber,
        green: colors.emerald,
        blue: colors.blue,
        indigo: colors.indigo,
        purple: colors.violet,
        pink: colors.pink,
        cyan: colors.cyan,
        orange: colors.orange,
        neutral: colors.gray,
        'primary': {
          light: '#362F2F',
          DEFAULT: '#362F2F',
          dark: '#404C4C'
        },
        'primary-logo': '#447BCD',
        'hover-color' : '#909090',
      },
      boxShadow: {
        '1l' : '0 0 5px 0px rgba(0,0,0,0.25)',
        '2l' : '0 0 10px 0px rgba(0,0,0,0.25)',
        '3l' : '0 0 15px 0px rgba(0,0,0,0.25)',
        '4l' : '0 0 20px 0px rgba(0,0,0,0.25)',
        '5l' : '0 0 25px 2px rgba(0,0,0,0.25)',
        '6l' : '0 0 30px 2px rgba(0,0,0,0.25)',
      },
    },

    /**** JUST USE FOR REFERENCE ****/

    /**** WIDTH ****/

    // xsm: "450px",
    // // => @media (min-width: 450px) { ... }

    // sm: "640px",
    // // => @media (min-width: 640px) { ... }

    // md: "768px",
    // // => @media (min-width: 768px) { ... }

    // ml: "900px",
    // // => @media (min-width: 900px) { ... }

    // lg: "1024px",
    // // => @media (min-width: 1024px) { ... }

    // xl: "1280px",
    // // => @media (min-width: 1280px) { ... }

    // "2xl": "1536px",
    // // => @media (min-width: 1536px) { ... }

    /**** HEIGHT ****/
    // tall: { raw: "(min-height: 652px)" },
  },
  plugins: [require("@tailwindcss/forms")({
    strategy: 'class'
  }),],
}

