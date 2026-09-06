/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#5d0012",
        "primary-container": "#801323",
        "on-primary": "#ffffff",
        "secondary": "#7b5817",
        "secondary-fixed": "#ffdead",
        "surface": "#fff8f8",
        "surface-container": "#f5eced",
        "surface-container-low": "#fbf1f2",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#1e1b1c",
        "on-surface-variant": "#574141",
        "outline-variant": "#debfbf",
        "error": "#ba1a1a",
        "error-container": "#ffdad6"
      },
      fontFamily: {
        "headline-sm": ["Playfair Display", "serif"],
        "headline-lg": ["Playfair Display", "serif"],
        "body-md": ["Plus Jakarta Sans", "sans-serif"],
        "label-editorial": ["Playfair Display", "serif"]
      }
    },
  },
  plugins: [],
}
