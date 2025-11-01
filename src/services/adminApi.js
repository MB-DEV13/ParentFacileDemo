// -------------------------------------------------
// Admin API — ParentFacile (chemins /api/...)
// -------------------------------------------------
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const DEFAULT_TIMEOUT = 12000;

function withBase(path) {
  if (!path) return API_BASE || "";
  if (/^https?:\/\//i.test(path)) return path;
  if (API_BASE) return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  return path.startsWith("/") ? path : `/${path}`;
}

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

    const ct = res.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    const data = isJson ? await res.json().catch(() => ({})) : await res.text();

    if (!res.ok) {
      const message =
        (isJson && (data?.message || data?.error)) ||
        (typeof data === "string" && data) ||
        `HTTP ${res.status} – ${res.statusText}`;
      const err = new Error(message);
      err.status = res.status;
      err.payload = isJson ? data : { raw: data };
      throw err;
    }

    return isJson ? data : { raw: data };
  } finally {
    clearTimeout(id);
  }
}

/* =========================
 *        AUTH
 * =======================*/
export const adminLogin = (email, password) =>
  request(withBase("/api/admin/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

export const adminLogout = () =>
  request(withBase("/api/admin/auth/logout"), { method: "POST" });

export const adminMe = () =>
  request(withBase("/api/admin/auth/me"));

/* =========================
 *        DOCS
 * =======================*/
export const adminListDocs = () =>
  request(withBase("/api/admin/docs"));

export const adminUploadDoc = (payload) => {
  const fd = new FormData();
  fd.append("label", payload.label);
  fd.append("tag", payload.tag);
  fd.append("sort_order", String(payload.sort_order ?? 999));
  fd.append("doc_key", payload.doc_key);
  fd.append("file", payload.file);
  return request(withBase("/api/admin/docs"), { method: "POST", body: fd });
};

export const adminDeleteDoc = (id) =>
  request(withBase(`/api/admin/docs/${encodeURIComponent(id)}`), {
    method: "DELETE",
  });

export const adminUpdateDoc = (id, payload = {}) => {
  const fd = new FormData();
  if (payload.label != null) fd.append("label", payload.label);
  if (payload.tag != null) fd.append("tag", payload.tag);
  if (payload.sort_order != null) fd.append("sort_order", String(payload.sort_order));
  if (payload.doc_key != null) fd.append("doc_key", payload.doc_key);
  if (payload.file) fd.append("file", payload.file);
  return request(withBase(`/api/admin/docs/${encodeURIComponent(id)}`), {
    method: "PUT",
    body: fd,
  });
};

/* =========================
 *      MESSAGES
 * =======================*/
export const fetchAdminMessages = (limit = 3) =>
  request(withBase(`/api/admin/messages?limit=${encodeURIComponent(limit)}`));

export const fetchAllAdminMessages = () =>
  request(withBase("/api/admin/messages/all"));



