/**
 * API utils — ParentFacile
 * -------------------------------------------------
 * - API_BASE : provient de VITE_API_URL ou reste vide pour profiter du proxy Vite en dev.
 * - request() : helper fetch avec timeout + erreurs JSON lisibles.
 * - Fonctions exportées : identiques à ta signature + options utiles.
 */

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const DEFAULT_TIMEOUT = 12000; // 12s

/**
 * Helper fetch avec timeout, gestion JSON et erreurs explicites.
 * @param {string} url
 * @param {RequestInit & { timeout?: number }} [options]
 */
async function request(url, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      credentials: "include",
      headers: { Accept: "application/json", ...(rest.headers || {}) },
      signal: controller.signal,
      ...rest,
    });

    // 204 No Content
    if (res.status === 204) return null;

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await res.json().catch(() => ({})) : await res.text();

    if (!res.ok) {
      const message =
        (isJson && (payload?.error || payload?.message)) ||
        `HTTP ${res.status} – ${res.statusText}`;
      const err = new Error(message);
      err.status = res.status;
      err.payload = payload;
      throw err;
    }

    return payload;
  } finally {
    clearTimeout(id);
  }
}

/** Construit une URL absolue à partir de API_BASE + path */
function buildUrl(path) {
  if (!path) return API_BASE || "";
  if (/^https?:\/\//i.test(path)) return path; 
  if (API_BASE && path.startsWith("/")) return `${API_BASE}${path}`;
  return path; 
}

/**
 * Récupère la liste des documents.
 * @param {Object} [params]
 * @param {string} [params.q] 
 * @param {string} [params.tag]  
 * @returns {Promise<{documents: any[]}>}
 */
export async function fetchDocuments(params = {}) {
  const usp = new URLSearchParams();
  if (params.q) usp.set("q", params.q);
  if (params.tag) usp.set("tag", params.tag);

  const qs = usp.toString();
  const url = buildUrl(`/api/docs${qs ? `?${qs}` : ""}`);
  return request(url);
}

/**
 * Déclenche le téléchargement d’un document par redirection.
 * @param {string|number} id
 */
export function downloadDocument(id) {
  const url = buildUrl(`/api/docs/${id}/download`);
  // Utilise assign() pour éviter d’ouvrir un nouvel onglet
  window.location.assign(url);
}

/**
 * Télécharge tous les documents dans un ZIP.
 */
export function downloadAllZip() {
  const url = buildUrl(`/api/docs/zip`);
  window.location.assign(url);
}

/**
 * Ouvre un aperçu de document.
 * @param {string} publicUrlOrId
 * @param {string|number} [fallbackId]
 */
export function previewDocument(publicUrlOrId, fallbackId) {
  let url = "";

  if (publicUrlOrId) {
    // URL absolue (http/https)
    if (/^https?:\/\//i.test(publicUrlOrId)) {
      url = publicUrlOrId;
    }
    // Fichiers servis par le backend (/pdfs/...) — proxy en dev, API_BASE en prod
    else if (publicUrlOrId.startsWith("/")) {
      url = buildUrl(publicUrlOrId);
    }
    // sinon, on considérera que c'est un id
    else {
      url = buildUrl(`/api/docs/${publicUrlOrId}/preview`);
    }
  } else if (fallbackId) {
    url = buildUrl(`/api/docs/${fallbackId}/preview`);
  }

  if (!url) {
    alert("Ce document n’a pas d’URL valide");
    return;
  }

  // Essaye d’ouvrir dans un nouvel onglet, sinon fallback
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) window.location.assign(url);
}

