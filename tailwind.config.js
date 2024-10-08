const plugin = require("@tailwindcss/typography");
const { default: daisyui } = require("daisyui");

module.exports = {
    content: [`./public/views/**/*.html`],
    plugin: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        themes: ["business"]
    }
};
