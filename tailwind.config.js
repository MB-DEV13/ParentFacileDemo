/** @type {import('tailwindcss').Config} */
/**
 * Tailwind config — ParentFacile
 *
 * Objectifs du refactor :
 * - Ajouter les chemins `content` pour la purge JIT.
 * - Activer le mode sombre par classe (cohérent avec React et préférences utilisateur).
 * - Centraliser des tokens (couleurs + typo) sous `theme.extend`.
 * - Préparer des options utiles (container) sans casser l'existant.
 * - Laisser des hooks pour des plugins officiels, sans ajouter de dépendances implicites.
 */
const config = {
  // Chemins scannés pour générer les classes utilisées
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  // Mode sombre piloté par la classe `dark` sur <html> ou <body>
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        pfBlueLight: "#9AC8EB",
        pfBlue: "#5784BA",
        pfPink: "#F4CFDF",
        pfBlueSoft: "#B6D8F2",
        pfYellow: "#F7F6CF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      // Optionnel : base utile pour des layouts responsives
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          md: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
        },
      },
    },
  },
};

export default config;
