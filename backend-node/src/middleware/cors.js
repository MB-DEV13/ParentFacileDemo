// ------------------------------------------------------------
// ParentFacile — Middleware CORS configuré dynamiquement
// ------------------------------------------------------------
// Objectif : permettre un contrôle fin des origines autorisées
// (utile en dev, staging et prod) tout en gardant le support des cookies.
//
// Exemple d’utilisation :
// import buildCors from './src/utils/buildCors.js'
// app.use(buildCors(process.env.ALLOWED_ORIGINS))
//
// ALLOWED_ORIGINS peut contenir plusieurs URLs séparées par des virgules :
//   ALLOWED_ORIGINS=https://parentfacile.fr,https://admin.parentfacile.fr
// ------------------------------------------------------------

import cors from "cors";

export default function buildCors(allowedOrigins) {
  // Transforme la chaîne d’origines en tableau filtré (trim + ignore vide)
  const whitelist = (allowedOrigins || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return cors({
    origin(origin, cb) {
      // Cas 1 : Pas d’origine (ex: requêtes locales Postman, tests) → autorisé
      if (!origin) return cb(null, true);

      // Cas 2 : aucune whitelist (mode dev) → tout autorisé
      if (whitelist.length === 0) return cb(null, true);

      // Cas 3 : origine explicitement autorisée
      if (whitelist.includes(origin)) return cb(null, true);

      // Cas 4 : refusée
      console.warn(`[CORS] Origine refusée: ${origin}`);
      cb(new Error("Not allowed by CORS"));
    },

    // Autorise les cookies HTTP-only (session, JWT, etc.)
    credentials: true,
  });
}

