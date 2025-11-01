/**
 * Page : Documents à télécharger
 * -------------------------------------------------
 * - Recherche tolérante (accents, ponctuation, 1 faute)
 * - Filtres par tags (Grossesse / Naissance / 1–3 ans)
 * - Tri : groupe > ordre > label
 * - Actions : Aperçu (nouvel onglet) / Téléchargement / ZIP global
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import {
  fetchDocuments,
  downloadDocument,
  downloadAllZip,
} from "../../services/api";
import { normalizeTag, tagClass } from "../../utils/tags";
import family from "../../assets/images/family_2.png";

const TAGS_UI = ["Grossesse", "Naissance", "1–3 ans"];
const GROUP_ORDER = { Grossesse: 0, Naissance: 1, "1–3 ans": 2 };

/* =========================================================================
 * Helpers recherche "tolérante"
 * ========================================================================= */
function normalizeStr(s = "") {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function withinOneEdit(a, b) {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  if (la > lb) return withinOneEdit(b, a);

  let i = 0, j = 0, edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) { i++; j++; continue; }
    edits++;
    if (edits > 1) return false;
    if (la === lb) { i++; j++; } else { j++; }
  }
  return true;
}

function fuzzyIncludes(hay, needle) {
  const H = normalizeStr(hay);
  const N = normalizeStr(needle);
  if (!N) return true;
  if (H.includes(N)) return true;
  const hTokens = H.split(" ");
  const nTokens = N.split(" ");
  return nTokens.every((nTok) =>
    hTokens.some((hTok) => hTok.includes(nTok) || withinOneEdit(hTok, nTok))
  );
}

export default function DocsIndex() {
  // --- Data via useApi
  const { data, loading, error } = useApi(fetchDocuments, []);
  const docs = useMemo(
    () => (data?.documents || []).map((d) => ({ ...d, tag: normalizeTag(d.tag) })),
    [data]
  );

  // --- UI <-> URL (q, tag)
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [activeTag, setActiveTag] = useState(searchParams.get("tag") || "");

  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setActiveTag(searchParams.get("tag") || "");
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      if (activeTag) p.set("tag", activeTag);
      setSearchParams(p, { replace: true });
    }, 150);
    return () => clearTimeout(t);
  }, [q, activeTag, setSearchParams]);

  // Filtrage + tri
  const filtered = useMemo(() => {
    let arr = docs;
    const term = q.trim();
    if (term) {
      arr = arr.filter(
        (d) =>
          fuzzyIncludes(String(d.label || ""), term) ||
          fuzzyIncludes(String(d.tag || ""), term)
      );
    }
    if (activeTag) arr = arr.filter((d) => d.tag === activeTag);

    return [...arr].sort((a, b) => {
      const ga = GROUP_ORDER[a.tag] ?? 99;
      const gb = GROUP_ORDER[b.tag] ?? 99;
      if (ga !== gb) return ga - gb;
      const oa = a.order ?? 999;
      const ob = b.order ?? 999;
      if (oa !== ob) return oa - ob;
      return String(a.label).localeCompare(String(b.label), "fr");
    });
  }, [docs, q, activeTag]);

  /* Révélation progressive au scroll */
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
  }, [filtered.length]);

  return (
    <section className="py-16 bg-pfYellow">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header + CTA ZIP */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Documents à télécharger
            </h2>
            <p className="text-slate-700 mt-1 text-base">
              Classés chronologiquement pour aller à l’essentiel.
            </p>
          </div>

          <button
            type="button"
            onClick={downloadAllZip}
            className="rounded-xl px-4 py-2 text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition w-full sm:w-auto bg-pfBlue text-white"
            title="Télécharger tous les PDF en ZIP"
          >
            Tout télécharger (ZIP)
          </button>
        </div>

        {/* Bandeau visuel */}
        <div className="mb-6 rounded-2xl overflow-hidden shadow-sm">
          <img
            src={family}
            alt="Illustration d’une famille — documents utiles"
            className="w-full h-48 sm:h-56 lg:h-64 object-cover"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Recherche + Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un document (titre, tag)…"
              className="w-full rounded-xl border bg-white border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pfBlue"
              aria-label="Rechercher dans les documents"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTag("")}
              className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${
                activeTag === "" ? "bg-white shadow font-medium" : "hover:bg-white"
              }`}
              aria-pressed={activeTag === ""}
            >
              Tous
            </button>

            {TAGS_UI.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTag(t === activeTag ? "" : t)}
                className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${
                  activeTag === t ? "bg-white shadow font-medium" : "hover:bg-white"
                }`}
                aria-pressed={activeTag === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* États */}
        {loading && <p>Chargement…</p>}
        {error && (
          <p className="text-red-600" role="alert">
            Erreur : {String(error.message || error)}
          </p>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-slate-600">Aucun document trouvé pour ces critères.</p>
        )}

        {/* Grille des documents */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc, i) => (
              <article
                key={doc.id}
                className={`reveal js-reveal [--delay:${i * 60}ms] rounded-2xl border bg-white p-4 flex flex-col shadow-sm transition-transform duration-200 hover:shadow-md hover:scale-[1.02] will-change-transform`}
                aria-label={`Document ${doc.label}`}
              >
                {/* Tag badge (via classes utilitaires) */}
                <div className={`text-xs font-medium w-fit rounded-md px-2 py-1 mb-2 ${tagClass(doc.tag)}`}>
                  {normalizeTag(doc.tag)}
                </div>

                {/* Titre */}
                <h3 className="font-semibold leading-snug flex-1 text-slate-800">
                  {doc.label}
                </h3>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={doc.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-pfBlue hover:text-pfBlue/80 transition-colors"
                    title="Ouvrir l’aperçu PDF"
                    aria-label={`Aperçu du document ${doc.label}`}
                  >
                    Aperçu
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadDocument(doc.id)}
                    className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-800 bg-pfBlueLight hover:bg-pfBlueLight/80 transition-colors"
                    title="Télécharger le PDF"
                    aria-label={`Télécharger le PDF ${doc.label}`}
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14" />
                      <path d="M19 12l-7 7-7-7" />
                    </svg>
                    PDF
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
