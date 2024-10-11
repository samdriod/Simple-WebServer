const plugin = require("@tailwindcss/typography");
const { default: daisyui } = require("daisyui");
const themes = require("daisyui/src/theming/themes");

module.exports = {
  content: [`./public/views/**/*.html`],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        myTheme: {
          primary: "#1eb854",
          "color-scheme": "light",
          "neutral-content": "#e9e7e7",
          "base-content": "#100f0f",
          "--rounded-btn": "1.9rem",

          // "primary-content": "#000000",
          "primary-content": "#fff",

          //   secondary: "#8E4162",
          //   accent: "#5c7f67",
          secondary: "#1DB88E",
          accent: "#1DB8AB",

          //   neutral: "#19362D",
          //   "base-100": "#171212",
          neutral: "#291E00",
          "base-100": "#e9e7e7",
        },
      },
    ],
  },
};
