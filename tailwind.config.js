/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      colors: {
        brand: {
          DEFAULT: "#0f2a4a",
          dark: "#0a1c32",
          light: "#1e3a8a"
        },
        accent: {
          DEFAULT: "#f97316",
          hover: "#ea580c"
        }
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(0, 0, 0, 0.05), 0 2px 6px -2px rgba(0, 0, 0, 0.02)",
        cardHover: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)"
      }
    }
  },
  plugins: [],
}