/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['Roboto\\ Mono', 'sans-serif']
    },
    extend: {
      width: {
        "3/10": "30%",
      },
      colors: {
        "primary": "#36393F",
        "secondary": "#202225",
        "btn": "#5865F2",
        "btn-hover": "#4752C4",
        "text": "#96989D",
      },
    },
  },
  plugins: [require("daisyui")],
};
