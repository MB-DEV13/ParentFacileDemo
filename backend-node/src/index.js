// ------------------------------------------------------------
// ParentFacile – Serveur Express léger (frontend/docs/auth API)
// ------------------------------------------------------------
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "node:path";
import cookieParser from "cookie-parser";

import buildCors from "./middleware/cors.js";
import docsRouter from "./routes/docs.js";
import adminAuthRouter from "./routes/adminAuth.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5174);

// Si tu es derrière un proxy (Heroku/Render/Nginx) et que tu poses un cookie "secure"
app.set("trust proxy", 1);

// Sécurité HTTP (en-têtes)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Parsers
app.use(express.json({ limit: "256kb" }));
app.use(cookieParser());

// Logs
app.use(morgan("dev"));

// CORS (avec credentials si ton front est sur un autre domaine)
app.use(buildCors(process.env.ALLOWED_ORIGINS));

// Fichiers statiques (PDF)
app.use(
  "/pdfs",
  express.static(path.join(process.cwd(), "public", "pdfs"), {
    immutable: true,
    maxAge: "7d",
  })
);

// Routes publiques
app.use("/api/docs", docsRouter);

// ✅ Auth admin (JWT) — MONTE SOUS /api/admin/auth
app.use("/api/admin/auth", adminAuthRouter);

// Santé
app.get("/", (_req, res) => res.json({ ok: true, name: "ParentFacile API" }));

app.listen(PORT, () => {
  console.log(`🚀 ParentFacile API en écoute sur http://localhost:${PORT}`);
});



