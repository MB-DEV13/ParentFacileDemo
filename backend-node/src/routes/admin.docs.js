// -----------------------------------------------------------------------------
// ParentFacile – Administration des documents PDF
// -----------------------------------------------------------------------------
// Points clés :
// - Authentification requise (JWT en cookie via authMiddleware)
// - Upload PDF (multer) avec filtrage MIME + limite taille
// - CRUD documents (MySQL) avec validations et messages clairs
// - Nettoyage des fichiers lors des remplacements / suppressions
// - Gestion d’erreurs homogène + handler d’erreurs multer
// - Rate limiting dédié aux opérations d'écriture
// -----------------------------------------------------------------------------

import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { body, param, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { authMiddleware } from "./admin.auth.js";

const router = Router();

// -----------------------------------------------------------------------------
// DOSSIER DES PDF (aligné avec server.js)
// -----------------------------------------------------------------------------
const pdfDir = path.join(process.cwd(), "public", "pdfs");
fs.mkdirSync(pdfDir, { recursive: true });

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function safeUnlink(fullPath) {
  try {
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (_) {}
}

// -----------------------------------------------------------------------------
// MULTER (upload PDF uniquement)
// -----------------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, pdfDir),
  filename: (_req, file, cb) => {
    const base = path
      .parse(file.originalname)
      .name.replace(/[^\w\s.-]/g, "_")
      .replace(/\s+/g, "_")
      .slice(0, 120);
    const stamp = Date.now();
    cb(null, `${base}_${stamp}.pdf`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") return cb(new Error("Seuls les PDF"));
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

// Handler d'erreurs multer
function multerErrorHandler(err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    // Erreurs natives Multer (LIMIT_FILE_SIZE, etc.)
    return res.status(400).json({ ok: false, message: err.message });
  }
  if (err && err.message === "Seuls les PDF") {
    return res.status(400).json({ ok: false, message: "Seuls les PDF sont acceptés" });
  }
  return next(err);
}

// -----------------------------------------------------------------------------
// VALIDATIONS
// -----------------------------------------------------------------------------
const validateIdParam = [param("id").isInt({ min: 1 }).toInt()];

const validateCreate = [
  body("label").trim().isLength({ min: 2, max: 255 }).withMessage("label requis (2-255)"),
  body("tag").trim().isLength({ min: 1, max: 50 }).withMessage("tag requis (1-50)"),
  body("doc_key").trim().isLength({ min: 2, max: 191 }).withMessage("doc_key requis (2-191)"),
  body("sort_order").optional().isInt({ min: 0, max: 9999 }).toInt(),
];

const validateUpdate = [
  ...validateIdParam,
  body("label").optional().trim().isLength({ min: 2, max: 255 }),
  body("tag").optional().trim().isLength({ min: 1, max: 50 }),
  body("doc_key").optional().trim().isLength({ min: 2, max: 191 }),
  body("sort_order").optional().isInt({ min: 0, max: 9999 }).toInt(),
];

function sendValidation(res, req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });
}

// -----------------------------------------------------------------------------
// RATE LIMITS (plus stricts sur les écritures)
// -----------------------------------------------------------------------------
const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

// -----------------------------------------------------------------------------
// PROTECTION : toutes les routes suivantes nécessitent d'être connecté
// -----------------------------------------------------------------------------
router.use(authMiddleware);

/* =========================
   LISTE
========================= */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const pool = req.app.get("db");
    const [rows] = await pool.execute(
      `SELECT id, doc_key, label, tag, sort_order AS \`order\`,
              file_name, file_size, mime_type, public_url, created_at
       FROM documents
       ORDER BY tag, sort_order, label`
    );
    res.json({ ok: true, documents: rows });
  })
);

/* =========================
   AJOUT
========================= */
router.post(
  "/",
  writeLimiter,
  upload.single("file"),
  validateCreate,
  asyncHandler(async (req, res) => {
    const v = sendValidation(res, req); if (v) return;

    const pool = req.app.get("db");
    try {
      if (!req.file) {
        return res.status(400).json({ ok: false, message: "PDF manquant" });
      }

      const { label, tag, sort_order, doc_key } = req.body || {};

      // Vérifie l'unicité du doc_key (la table a une contrainte UNIQUE mais on anticipe)
      const [[exists]] = await pool.query("SELECT id FROM documents WHERE doc_key = ? LIMIT 1", [doc_key]);
      if (exists) {
        // Nettoie le fichier uploadé car on ne va pas l'enregistrer
        safeUnlink(req.file.path);
        return res.status(409).json({ ok: false, message: "doc_key déjà utilisé" });
      }

      const file_name = req.file.filename;
      const file_size = req.file.size || 0;
      const mime_type = "application/pdf";
      const public_url = `/pdfs/${file_name}`;
      const order = Number(sort_order || 999);

      const [result] = await pool.execute(
        `INSERT INTO documents (doc_key, label, tag, sort_order, file_name, file_size, mime_type, public_url)
         VALUES (?,?,?,?,?,?,?,?)`,
        [doc_key, label, tag, order, file_name, file_size, mime_type, public_url]
      );

      res.json({ ok: true, id: result.insertId, public_url, file_name });
    } catch (e) {
      console.error("Upload error:", e);
      // Nettoie le fichier si inséré sur le disque mais DB KO
      if (req.file?.path) safeUnlink(req.file.path);
      res.status(500).json({ ok: false, message: "Erreur serveur" });
    }
  }),
  multerErrorHandler
);

/* =========================
   MISE À JOUR (PUT)
   - Champs modifiables: label, tag, sort_order, doc_key
   - Fichier PDF optionnel (remplacement)
========================= */
router.put(
  "/:id",
  writeLimiter,
  upload.single("file"),
  validateUpdate,
  asyncHandler(async (req, res) => {
    const v = sendValidation(res, req); if (v) return;

    const pool = req.app.get("db");
    const id = Number(req.params.id || 0);

    // Document existant
    const [[doc]] = await pool.query(`SELECT id, file_name FROM documents WHERE id = ? LIMIT 1`, [id]);
    if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });

    const { label, tag, sort_order, doc_key } = req.body || {};

    const fields = [];
    const values = [];

    if (label != null) { fields.push("label = ?"); values.push(label); }
    if (tag != null) { fields.push("tag = ?"); values.push(tag); }
    if (sort_order != null) { fields.push("sort_order = ?"); values.push(Number(sort_order)); }
    if (doc_key != null) {
      // vérifie unicité si changement de doc_key
      const [[exists]] = await pool.query("SELECT id FROM documents WHERE doc_key = ? AND id <> ? LIMIT 1", [doc_key, id]);
      if (exists) {
        if (req.file?.path) safeUnlink(req.file.path);
        return res.status(409).json({ ok: false, message: "doc_key déjà utilisé" });
      }
      fields.push("doc_key = ?");
      values.push(doc_key);
    }

    // Nouveau fichier ? Remplace et supprime l'ancien
    if (req.file) {
      if (doc.file_name) {
        const oldPath = path.join(pdfDir, doc.file_name);
        safeUnlink(oldPath);
      }
      const file_name = req.file.filename;
      const file_size = req.file.size || 0;
      const mime_type = "application/pdf";
      const public_url = `/pdfs/${file_name}`;

      fields.push("file_name = ?", "file_size = ?", "mime_type = ?", "public_url = ?");
      values.push(file_name, file_size, mime_type, public_url);
    }

    if (!fields.length) return res.json({ ok: true, message: "Aucune modification" });

    values.push(id);
    await pool.execute(`UPDATE documents SET ${fields.join(", ")} WHERE id = ?`, values);

    res.json({ ok: true, message: "Document mis à jour" });
  }),
  multerErrorHandler
);

/* =========================
   SUPPRESSION
========================= */
router.delete(
  "/:id",
  writeLimiter,
  validateIdParam,
  asyncHandler(async (req, res) => {
    const v = sendValidation(res, req); if (v) return;

    const pool = req.app.get("db");
    const id = Number(req.params.id);

    const [[doc]] = await pool.query("SELECT file_name FROM documents WHERE id = ?", [id]);
    if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });

    await pool.execute("DELETE FROM documents WHERE id = ?", [id]);

    const full = path.join(pdfDir, doc.file_name);
    safeUnlink(full);

    res.json({ ok: true });
  })
);

export default router;

