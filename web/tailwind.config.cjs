/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#F7F2E8",        // marfil cálido
        ink: "#1B2A24",         // tinta
        muted: "#5A6B63",       // texto suave
        forest: "#1F5D4C",      // verde bosque (acción principal)
        emerald: "#2E8B6F",     // esmeralda
        sage: "#E6EFE7",        // verde salvia (superficies)
        coral: "#E07A5F",       // acento moderado
        amber: "#E8A33D",       // ámbar
        danger: "#B3452F",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(27,42,36,0.06)",
        lift: "0 8px 28px rgba(27,42,36,0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
