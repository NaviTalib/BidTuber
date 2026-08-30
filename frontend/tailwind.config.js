/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        edge: "var(--color-edge)",
        ink: "var(--color-ink)",
        mute: "var(--color-mute)",
        brand: "var(--color-brand)",
        brandSoft: "var(--color-brand-soft)",
        price: "var(--color-price)",
        priceSoft: "var(--color-price-soft)",
        online: "var(--color-online)",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};