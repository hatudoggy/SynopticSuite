/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  content: ["./index.html", "./src/**/*.{jsx,css}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        gray: colors.coolGray,
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
        primary: "#3C3E41",
        "primary-logo": "#447BCD",
        "hover-color": "#909090",
      },
    },
    screens: {
      /**** WIDTH ****/

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      ml: "900px",
      // => @media (min-width: 900px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      /**** HEIGHT ****/
      tall: { raw: "(min-height: 652px)" },
    },
  },
};
