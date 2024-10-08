const plugin = require("@tailwindcss/typography");
const { default: daisyui } = require("daisyui");

module.exports = {
    content: [`./public/views/**/*.html`],
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        themes: ["garden", "forest"]
    }
};
