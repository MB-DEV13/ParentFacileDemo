import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

/**
 * Vite configuration pour ParentFacile
 * \n
 * Points clés :
 * - Lit les variables d'env via `loadEnv` (VITE_*) pour éviter le hard-coding.
 * - Proxy dev pour /api et /pdfs vers le backend Express.
 * - Options serveur pratiques (host, strictPort, open).
 * - Sourcemaps activés en dev et build pour faciliter le debug.
 * - Petits utilitaires : __APP_VERSION__ injectée depuis package.json.
 *
 * 🔒 En prod, ne pas utiliser le proxy Vite. Servez le front en statique
 * et exposez l'API sur son domaine/port, avec CORS configuré côté backend.
 */
export default defineConfig(({ mode }) => {
  // Charge toutes les variables d'env (préfixées ou non). Par convention, côté client : VITE_*
  const env = loadEnv(mode, process.cwd(), "");

  // ---- Variables d'environnement  ----
  const PORT = Number(env.VITE_PORT) || 5174; // port dev pour Vite
  const BACKEND_URL = env.VITE_API_URL || "http://localhost:4000"; // URL backend Express

  return {
    plugins: [react(), tailwind()],

    // ---- Dev server ----
    server: {
      host: true, // écoute sur 0.0.0.0 (utile pour tests sur réseau local / mobiles)
      port: PORT,
      open: false, // passez à true si vous voulez ouvrir le navigateur automatiquement
      strictPort: false, // mettez true pour échouer si le port est déjà pris

      /**
       * Proxy côté dev (uniquement). Permet d'appeler fetch('/api/...') depuis le front
       * sans souci de CORS ni d'origines différentes.
       */
      proxy: {
        "/api": {
          target: BACKEND_URL,
          changeOrigin: true,
          // Pas de rewrite: on garde le préfixe /api tel quel.
          // Désactivez secure si vous pointez vers un HTTPS auto-signé en dev.
          secure: false,
        },
        "/pdfs": {
          target: BACKEND_URL, // si les PDF sont aussi servis par l'API Express
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // ---- Prévisualisation du build local (vite preview) ----
    preview: {
      host: true,
      port: PORT,
    },

    // ---- Build ----
    build: {
      target: "es2020",
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
    },

    // ---- CSS ----
    css: {
      devSourcemap: true,
    },

    // ---- Définition de constantes globales injectées au bundle ----
    define: {
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version ?? "0.0.0"
      ),
    },
  };
});
