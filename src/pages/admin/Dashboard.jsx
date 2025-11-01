// src/pages/admin/Dashboard.jsx
/**
 * Page : Admin — Dashboard
 * -------------------------------------------------
 * - Documents + 3 derniers messages via useApi
 * - Refresh après upload/delete/update en incrémentant un compteur
 * - Modale d’édition, toasts, tri inchangés
 */

import { useEffect, useMemo, useState } from "react";
import useApi from "../../hooks/useApi";
import {
  adminDeleteDoc,
  adminListDocs,
  adminLogout,
  adminUploadDoc,
  adminUpdateDoc,
  fetchAdminMessages,
} from "../../services/adminApi";
import { Link, useNavigate } from "react-router-dom";
import { normalizeTag, tagColor } from "../../utils/tags";

const TAGS = ["Grossesse", "Naissance", "1–3 ans"];

function slugify(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  // --- Form state
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [editingDoc, setEditingDoc] = useState(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    label: "",
    tag: "Grossesse",
    sort_order: 999,
    doc_key: "",
    file: null,
  });

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setMsg("");
    setErr("");
  }

  // --- Refresh flag pour recharger via useApi après mutations
  const [refresh, setRefresh] = useState(0);

  // --- Data via useApi
  const {
    data: docsData,
    loading: loadingDocs,
    error: errDocs,
  } = useApi(adminListDocs, [refresh]);

  const {
    data: msgsData,
    loading: loadingMsgs,
    error: errMsgs,
  } = useApi(() => fetchAdminMessages(3), [refresh]);

  const list = useMemo(() => docsData?.documents || [], [docsData]);
  const lastMsgs = useMemo(() => msgsData?.messages || [], [msgsData]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!form.label || !form.doc_key || !form.file) {
      setErr("Label, doc_key et PDF requis.");
      return;
    }
    try {
      setSending(true);
      await adminUploadDoc(form);
      setMsg("Document ajouté !");
      setForm({
        label: "",
        tag: "Grossesse",
        sort_order: 999,
        doc_key: "",
        file: null,
      });
      setRefresh((x) => x + 1);
    } catch (e) {
      setErr(e.message || "Erreur ajout document");
    } finally {
      setSending(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Supprimer ce document ?")) return;
    try {
      await adminDeleteDoc(id);
      setRefresh((x) => x + 1);
    } catch (e) {
      alert(e.message || "Erreur suppression");
    }
  }

  function onEdit(doc) {
    setEditingDoc({
      ...doc,
      sort_order: doc.order ?? doc.sort_order ?? 999,
    });
  }

  async function onLogout() {
    try {
      await adminLogout();
    } finally {
      navigate("/admin/login");
    }
  }

  // Tri : par order puis label
  const sortedDocs = useMemo(() => {
    return [...(list || [])].sort((a, b) => {
      const oa = a.order ?? a.sort_order ?? 999;
      const ob = b.order ?? b.sort_order ?? 999;
      if (oa !== ob) return oa - ob;
      return String(a.label).localeCompare(String(b.label), "fr");
    });
  }, [list]);

  // Animation reveal (gardée)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll(".js-reveal");
    if (!els.length) return;

    if (prefersReduced) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loadingDocs, loadingMsgs, sortedDocs.length, lastMsgs.length]);

  return (
    <main className="py-12 min-h-screen bg-gradient-to-br from-pfBlueLight to-pfPink">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="reveal js-reveal [--delay:60ms] flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Admin – Dashboard
          </h1>
          <button
            onClick={onLogout}
            className="rounded-xl px-3 py-1.5 text-sm border border-pfBlue text-pfBlue hover:bg-white transition"
          >
            Se déconnecter
          </button>
        </div>

        {!!toast && (
          <div className="reveal js-reveal [--delay:100ms] mb-4 rounded-lg px-3 py-2 text-sm bg-green-50 text-green-700 border border-green-200">
            {toast}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Formulaire (gauche) — RESTAURÉ */}
          <section className="reveal js-reveal [--delay:120ms] bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Ajouter un PDF</h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium">Titre (label)</label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
                  value={form.label}
                  placeholder="Ex: Déclaration de grossesse (CPAM/CAF)"
                  onChange={(e) => {
                    const v = e.target.value;
                    setField("label", v);
                    if (!form.doc_key) setField("doc_key", slugify(v));
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Tag</label>
                  <select
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
                    value={form.tag}
                    onChange={(e) => setField("tag", e.target.value)}
                  >
                    {TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Ordre</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
                    value={form.sort_order}
                    onChange={(e) => setField("sort_order", Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Clé doc (doc_key)</label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
                  value={form.doc_key}
                  onChange={(e) => setField("doc_key", slugify(e.target.value))}
                  placeholder="ex: declaration-grossesse"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Fichier PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
                  onChange={(e) => setField("file", e.target.files?.[0] || null)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60 shadow hover:brightness-110 transition"
                  style={{ background: "#5784BA", color: "#fff" }}
                >
                  {sending ? "Envoi…" : "Ajouter"}
                </button>
                {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
                {msg && <p className="text-green-700 text-sm mt-2">{msg}</p>}
              </div>
            </form>
          </section>

          {/* Liste (droite) */}
          <section className="reveal js-reveal [--delay:160ms] bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-3 text-slate-800">Documents</h2>
              {errDocs && (
                <span className="text-sm text-red-600">
                  {String(errDocs.message || errDocs)}
                </span>
              )}
            </div>

            <div className="max-h-[70vh] overflow-auto pr-1">
              {loadingDocs ? (
                <p className="text-slate-600">Chargement…</p>
              ) : sortedDocs.length === 0 ? (
                <p className="text-slate-600">Aucun document.</p>
              ) : (
                <ul className="space-y-3">
                  {sortedDocs.map((d, i) => (
                    <li
                      key={d.id}
                      className="reveal js-reveal rounded-2xl border p-4 bg-white shadow-sm"
                      style={{ ["--delay"]: `${200 + i * 50}ms` }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex flex-col items-center">
                            <span
                              className="text-xs font-medium rounded-md px-2 py-1 mb-1"
                              style={tagColor(d.tag)}
                            >
                              {normalizeTag(d.tag)}
                            </span>
                            <a
                              href={d.public_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs underline decoration-slate-400 underline-offset-2 hover:opacity-80"
                              title="Ouvrir le PDF dans un nouvel onglet"
                            >
                              Ouvrir
                            </a>
                          </div>

                          <div className="flex flex-col justify-center flex-1 min-w-0">
                            <h4 className="font-semibold leading-snug text-slate-800 truncate">
                              {d.label}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">
                              Ordre {d.order ?? d.sort_order ?? 999}
                            </p>
                          </div>

                          <button
                            onClick={() => onEdit(d)}
                            className="h-9 rounded-xl px-3 text-sm font-medium shrink-0 focus:outline-none focus:ring-2 focus:ring-pfBlue focus:ring-offset-1 shadow hover:brightness-110 transition"
                            style={{ background: "#5784BA", color: "#fff" }}
                          >
                            Modifier
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => onDelete(d.id)}
                          className="h-9 rounded-xl px-3 text-sm border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pfBlue focus:ring-offset-1"
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        {/* Derniers messages reçus — RESTAURÉ */}
        <section className="reveal js-reveal [--delay:200ms] mt-10 bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-800">Derniers messages reçus</h3>
            <Link to="/admin/messages" className="text-sm underline text-pfBlue hover:opacity-80">
              Voir tous
            </Link>
          </div>

          {loadingMsgs ? (
            <p className="text-sm text-slate-500 mt-3">Chargement…</p>
          ) : errMsgs ? (
            <p className="text-sm text-red-600 mt-3">
              {String(errMsgs.message || errMsgs)}
            </p>
          ) : (lastMsgs || []).length === 0 ? (
            <p className="text-sm text-slate-500 mt-3">Aucun message pour l’instant.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lastMsgs.map((m, i) => (
                <li key={m.id} className="reveal js-reveal rounded-xl border p-3 bg-slate-50" style={{ ["--delay"]: `${240 + i * 60}ms` }}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-900">{m.subject || "(Sans sujet)"}</div>
                    <div className="text-xs text-slate-500">{new Date(m.created_at).toLocaleString("fr-FR")}</div>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    De :{" "}
                    <a href={`mailto:${m.email}`} className="font-mono underline text-pfBlue hover:opacity-80 transition">
                      {m.email}
                    </a>
                  </div>
                  <p className="text-sm mt-2 line-clamp-3 text-slate-700">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {editingDoc && (
        <EditDocModal
          doc={editingDoc}
          onClose={() => setEditingDoc(null)}
          onSaved={async () => {
            setEditingDoc(null);
            setToast("Document modifié avec succès.");
            setRefresh((x) => x + 1);
            setTimeout(() => setToast(""), 3000);
          }}
        />
      )}
    </main>
  );
}

/* ---------- Modale d’édition ---------- */
function EditDocModal({ doc, onClose, onSaved }) {
  const [label, setLabel] = useState(doc.label || "");
  const [tag, setTag] = useState(doc.tag || "Grossesse");
  const [sortOrder, setSortOrder] = useState(doc.order ?? doc.sort_order ?? 999);
  const [docKey, setDocKey] = useState(doc.doc_key || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!docKey && label) setDocKey(slugify(label));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);
      await adminUpdateDoc(doc.id, {
        label,
        tag,
        sort_order: Number(sortOrder),
        doc_key: docKey,
        file,
      });
      onSaved?.();
    } catch (e) {
      setError(e.message || "Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Modifier le document</h3>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm border border-slate-300 hover:bg-slate-50">
            Fermer
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Titre (label)</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Tag</label>
              <select
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Ordre</label>
              <input
                type="number"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Clé doc (doc_key)</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
              value={docKey}
              onChange={(e) => setDocKey(slugify(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Remplacer le fichier (optionnel)</label>
            <input
              type="file"
              accept="application/pdf"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-slate-500 mt-1">
              Fichier actuel : <span className="underline">{doc.file_name}</span>
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="pt-2 flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="rounded-xl px-3 py-2 text-sm border border-slate-300 hover:bg-slate-50">
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60 shadow hover:brightness-110 transition"
              style={{ background: "#5784BA", color: "#fff" }}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



