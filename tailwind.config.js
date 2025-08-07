// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: "hsl(var(--border))", // 👈 pulls from CSS variable
      },
      colors: {
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [],
};
