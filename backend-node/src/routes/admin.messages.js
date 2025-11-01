// -----------------------------------------------------------------------------
// ParentFacile – Gestion des messages (back-office)
// -----------------------------------------------------------------------------
// Points clés :
// - Routes protégées par authMiddleware (cookie JWT)
// - Listing paginé + recherche full-text simple (q)
// - Variante /all conservée (cap 500)
// - Validations des query params (express-validator)
// - Rate limiting léger côté lecture
// - Gestion d'erreurs homogène
// -----------------------------------------------------------------------------

import { Router } from "express";
import { authMiddleware } from "./admin.auth.js";
import { query, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

/**
 * Routeur des messages admin.
 * - GET /api/admin/messages?limit=3
 * - GET /api/admin/messages?limit=20&page=2&q=foo
 * - GET /api/admin/messages/all
 */
export default function createAdminMessagesRouter(pool) {
  const router = Router();

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------
  const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

  function sendValidation(res, req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ ok: false, errors: errors.array() });
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // PROTECTION & RATE LIMITS
  // ---------------------------------------------------------------------------
  router.use(authMiddleware);

  // Limiteur "lecture" (évite le spam sur la liste)
  const readLimiter = rateLimit({ windowMs: 60 * 1000, max: 120 });

  // ---------------------------------------------------------------------------
  // LISTE PAGINÉE (+ recherche)
  // ---------------------------------------------------------------------------
  router.get(
    "/",
    readLimiter,
    [
      query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
      query("page").optional().isInt({ min: 1, max: 10_000 }).toInt(),
      query("q").optional().trim().isLength({ min: 1, max: 200 }),
    ],
    asyncHandler(async (req, res) => {
      if (sendValidation(res, req)) return;

      const limit = req.query.limit ?? 3;
      const page = req.query.page ?? 1;
      const q = req.query.q ?? "";
      const offset = (page - 1) * limit;

      // Recherche simple sur email, subject, message
      const where = [];
      const params = [];

      if (q) {
        where.push("(email LIKE ? OR subject LIKE ? OR message LIKE ?)");
        const like = `%${q}%`;
        params.push(like, like, like);
      }

      const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

      // 1) total pour la pagination
      const [[{ total }]] = await pool.query(
        `SELECT COUNT(*) AS total FROM messages ${whereSql}`,
        params
      );

      // 2) page courante
      const [rows] = await pool.execute(
        `SELECT id, email, subject, message, email_sent, created_at, sent_at
         FROM messages
         ${whereSql}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), Number(offset)]
      );

      res.json({ ok: true, total, page, limit, messages: rows });
    })
  );

  // ---------------------------------------------------------------------------
  // LISTE COMPLÈTE (cap 500)
  // ---------------------------------------------------------------------------
  router.get(
    "/all",
    readLimiter,
    asyncHandler(async (_req, res) => {
      try {
        const [rows] = await pool.execute(
          `SELECT id, email, subject, message, email_sent, created_at, sent_at
           FROM messages
           ORDER BY created_at DESC
           LIMIT 500`
        );
        res.json({ ok: true, messages: rows });
      } catch (e) {
        console.error("GET /api/admin/messages/all error:", e);
        res.status(500).json({ ok: false, message: "Erreur serveur (messages all)" });
      }
    })
  );

  return router;
}
