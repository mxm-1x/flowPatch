/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      colors: {
        background: "#0A0A0A",
        foreground: "#EDEDED",
        accent: "#00FF41",
        surface: "#1A1A1A",
      },
    },
  },
  plugins: [],
};
