/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body:    ["'Cabinet Grotesk'", "sans-serif"],
      },
      colors: {
        ink:    "#0f0e0c",
        paper:  "#f5f0e8",
        cream:  "#ede7d9",
        accent: "#e8622a",
        gold:   "#d4a843",
        muted:  "#6b6560",
      },
    },
  },
  plugins: [],
};
