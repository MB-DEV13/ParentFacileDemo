// server/routes/adminAuth.js
// -----------------------------------------------------------------------------
// Auth Admin par JWT (compte unique)
// Endpoints :
//   POST /admin/auth/login   -> vérifie email/mot de passe, signe un JWT, set cookie httpOnly
//   GET  /admin/auth/me      -> lit le JWT (cookie ou Authorization) et renvoie l’admin
//   POST /admin/auth/logout  -> efface le cookie
//
// Variables d’env à définir :
//   ADMIN_EMAIL              (obligatoire)          ex: admin@parentfacile.fr
//   ADMIN_PASSWORD_HASH      (recommandé)           hash bcrypt du mot de passe
//   ADMIN_PASSWORD           (optionnel, dev only)  mot de passe en clair si pas de hash (à éviter en prod)
//   JWT_SECRET               (obligatoire)          secret pour signer le JWT
//   JWT_EXPIRES              (optionnel)            ex: "7d" (défaut "2d")
//   MOCK_AUTH_LATENCY_MS     (optionnel)            ex: 200
//
// Remarque : privilégier ADMIN_PASSWORD_HASH (bcrypt). Pour obtenir un hash :
//   node -e "console.log(require('bcryptjs').hashSync('votreMotDePasse', 10))"
// -----------------------------------------------------------------------------

import { Router } from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

// -------------------- Config / helpers --------------------
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ""; // fallback dev-only
const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "2d";
const MOCK_LATENCY_MS = Number(process.env.MOCK_AUTH_LATENCY_MS || 0);

if (!ADMIN_EMAIL) console.warn("[adminAuth] ADMIN_EMAIL manquant.");
if (!JWT_SECRET) console.warn("[adminAuth] JWT_SECRET manquant.");
if (!ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD) {
  console.warn("[adminAuth] Aucun ADMIN_PASSWORD_HASH ni ADMIN_PASSWORD — impossible de vérifier le login.");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 });

function sendValidation(res, req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ ok: false, errors: errors.array() });
    return true;
  }
  return false;
}

function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function readJwtFromReq(req) {
  const cookieToken = req.cookies?.token;
  if (cookieToken) return cookieToken;

  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);

  return null;
}

function sendAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
    path: "/",
  });
}

// -------------------- Validations --------------------
const validateLogin = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").isLength({ min: 1 }).withMessage("Mot de passe requis"),
];

// -------------------- Routes --------------------

// POST /admin/auth/login
router.post(
  "/login",
  authLimiter,
  validateLogin,
  asyncHandler(async (req, res) => {
    if (sendValidation(res, req)) return;
    if (MOCK_LATENCY_MS) await sleep(MOCK_LATENCY_MS);

    const { email, password } = req.body;

    // Vérification email
    if (String(email).toLowerCase() !== String(ADMIN_EMAIL).toLowerCase()) {
      return res.status(401).json({ ok: false, message: "Identifiants invalides" });
    }

    // Vérification mot de passe (hash prioritaire)
    let isValid = false;
    if (ADMIN_PASSWORD_HASH) {
      isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } else if (ADMIN_PASSWORD) {
      isValid = password === ADMIN_PASSWORD; // ⚠️ seulement pour le dev
    }
    if (!isValid) {
      return res.status(401).json({ ok: false, message: "Identifiants invalides" });
    }

    const token = signJwt({ sub: "admin", email: ADMIN_EMAIL, role: "admin" });
    sendAuthCookie(res, token);

    return res.json({
      ok: true,
      message: "Connexion réussie",
      user: { id: "admin", email: ADMIN_EMAIL, role: "admin" },
      token, // facultatif si vous utilisez uniquement le cookie
    });
  })
);

// GET /admin/auth/me
router.get(
  "/me",
  authLimiter,
  asyncHandler(async (req, res) => {
    if (MOCK_LATENCY_MS) await sleep(MOCK_LATENCY_MS);

    const raw = readJwtFromReq(req);
    if (!raw) return res.json({ ok: true, user: null });

    try {
      const decoded = jwt.verify(raw, JWT_SECRET);
      // Comme on n’a qu’un seul admin, on renvoie ses infos si le JWT est valide
      return res.json({
        ok: true,
        user: { id: "admin", email: ADMIN_EMAIL, role: "admin" },
      });
    } catch {
      return res.json({ ok: true, user: null });
    }
  })
);

// POST /admin/auth/logout
router.post(
  "/logout",
  authLimiter,
  asyncHandler(async (_req, res) => {
    if (MOCK_LATENCY_MS) await sleep(MOCK_LATENCY_MS);
    res.clearCookie("token", { path: "/" });
    return res.json({ ok: true, message: "Déconnecté" });
  })
);

export default router;
