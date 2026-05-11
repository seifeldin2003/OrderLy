/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fff8f6",
        surface: "#fff8f6",
        "surface-low": "#fff1ed",
        "surface-container": "#ffe9e3",
        "surface-high": "#fce3dc",
        "surface-card": "#ffffff",
        primary: "#ac3509",
        "primary-soft": "#ffdbd0",
        "primary-bright": "#ff7043",
        secondary: "#b7131a",
        tertiary: "#006972",
        ink: "#251915",
        muted: "#59413a",
        outline: "#e0bfb6",
        danger: "#ba1a1a"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(172, 53, 9, 0.08)",
        lift: "0 18px 45px rgba(172, 53, 9, 0.12)"
      }
    }
  },
  plugins: []
};
