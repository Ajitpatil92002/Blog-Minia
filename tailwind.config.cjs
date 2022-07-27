/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      "navy-blue": "#0a192f",
      "light-navy": "#112240",
      green: "#64ffda",
      "green-tint": "rgba(100,255,218,0.1)",
    },
    textColor: {
      textlightWhite: "#ccd6f6;",
      "navy-blue": "#0a192f",
      textgreen: "#64ffda",
    },
    extend: {},
  },
  plugins: [],
};
