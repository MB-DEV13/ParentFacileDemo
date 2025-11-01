/**
 * Page : Accueil
 * -------------------------------------------------
 * - Parcours (mobile = cartes / desktop = timeline)
 * - Bande CTA "Documents" avec bouton ZIP (mobile + desktop)
 * - Derniers documents ajoutés
 */

import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import {
  fetchDocuments,
  downloadDocument,
  downloadAllZip,
} from "../services/api";
import { normalizeTag, tagClass } from "../utils/tags";
import hero from "../assets/images/hero-placeholder.png";

export default function Home() {
  // --- charge les documents via le hook useApi
  const { data: docsData, loading: loadingDocs } = useApi(fetchDocuments, []);

  // Normalisation + index de fallback
  const docs = useMemo(() => {
    const raw = docsData?.documents || [];
    return raw.map((d, i) => ({
      ...d,
      tag: normalizeTag(d.tag),
      _idx: i,
    }));
  }, [docsData]);

  // --- tri "récents" (updatedAt > createdAt > fallback index)
  const recent = useMemo(() => {
    const getDate = (d) =>
      d.updatedAt
        ? Date.parse(d.updatedAt)
        : d.createdAt
        ? Date.parse(d.createdAt)
        : d._idx;
    return [...docs].sort((a, b) => getDate(b) - getDate(a)).slice(0, 3);
  }, [docs]);

  // --- reveal au scroll
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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
  }, [loadingDocs, recent.length]);

  // --- contenu "Parcours"
  const steps = [
    {
      num: "01",
      label: "Grossesse",
      title: "Grossesse",
      body:
        "Déclarations, suivi médical, congés, allocations : toutes les étapes avec liens officiels et pièces à fournir.",
      slug: "grossesse",
    },
    {
      num: "02",
      label: "Naissance",
      title: "Naissance",
      body:
        "Reconnaissance, acte de naissance, sécurité sociale, mutuelle, prime de naissance, modes de garde.",
      slug: "naissance",
    },
    {
      num: "03",
      label: "1 à 3 ans",
      title: "1 à 3 ans",
      body:
        "Vaccinations, PAJE/CAF, crèche/assistante maternelle, rentrée en maternelle, attestations utiles.",
      slug: "1-3-ans",
    },
  ];

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative bg-gradient-to-r from-pfBlueSoft to-pfPink">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center py-14">
          <div className="reveal js-reveal">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Toutes vos démarches parentales, réunies en un seul endroit.
            </h1>
            <p className="mt-3 text-slate-700">
              De la grossesse aux 3 ans, ParentFacile centralise les étapes,
              documents PDF et numéros utiles.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/informations"
                className="rounded-xl px-4 py-2 text-sm font-medium shadow hover:brightness-110 transition bg-pfBlue text-white"
              >
                Voir le parcours
              </Link>
              <Link
                to="/documents"
                className="rounded-xl px-4 py-2 text-sm font-medium border hover:bg-white/50 transition border-pfBlue text-pfBlue"
              >
                Télécharger des documents
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-lg reveal js-reveal">
            <img
              src={hero}
              alt="Famille / illustration"
              className="w-full h-64 sm:h-80 object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 rounded-xl px-3 py-1 text-xs font-semibold text-pfBlue">
              Démarches basées sur les normes FR
            </div>
          </div>
        </div>
      </section>

      {/* ========== INFORMATIONS / TIMELINE ========== */}
      <section id="infos" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 reveal js-reveal">
            <span className="text-xs font-semibold tracking-wider uppercase text-pfBlue">
              Notre parcours
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              Informations essentielles, étape par étape
            </h2>
            <p className="text-slate-600 mt-2">
              Une vue d’ensemble claire puis le détail de chaque démarche avec
              documents téléchargeables.
            </p>
          </div>

          {/* --- MOBILE : cartes (avec hover & reveal) --- */}
          <div className="md:hidden space-y-6">
            {steps.map((step, idx) => (
              <article
                key={idx}
                className="reveal js-reveal rounded-2xl border p-4 shadow-sm bg-white transition-transform duration-200 hover:shadow-md hover:scale-[1.02] will-change-transform"
              >
                <div className={`[--delay:${idx * 60}ms]`}>
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-pfBlueSoft">
                      {step.num}
                    </span>
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>

                  <p className="text-sm text-slate-600 mt-2">{step.body}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to="/documents"
                      className="text-xs rounded-lg px-3 py-1.5 border hover:bg-white transition border-pfBlue text-pfBlue"
                    >
                      Voir les documents
                    </Link>
                    <Link
                      to={`/informations/${step.slug}`}
                      className="text-xs rounded-lg px-3 py-1.5 bg-pfPink hover:brightness-105 transition"
                    >
                      Guide détaillé
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* --- DESKTOP : timeline --- */}
          <div className="relative hidden md:block">
            <div className="absolute left-[260px] top-0 bottom-0 w-px bg-slate-200" />

            <div className="grid md:grid-cols-[240px_40px_minmax(0,1fr)] gap-x-10 gap-y-16">
              {steps.map((step, idx) => (
                <div className="contents" key={idx}>
                  {/* Colonne 1 */}
                  <div className="flex items-start gap-3 pt-[2px] reveal js-reveal">
                    <div className={`[--delay:${idx * 60}ms] flex items-start gap-3`}>
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-pfBlueSoft">
                        {step.num}
                      </div>
                      <div className="font-medium">{step.label}</div>
                    </div>
                  </div>

                  {/* Colonne 2 : pastille */}
                  <div className="relative">
                    <div className="absolute -left-7.5 top-[0.45rem] h-5 w-5 rounded-full ring-4 ring-slate-200 bg-pfBlueLight" />
                  </div>

                  {/* Colonne 3 */}
                  <div className="reveal js-reveal">
                    <div className={`[--delay:${idx * 60 + 80}ms]`}>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{step.body}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          to="/documents"
                          className="text-xs rounded-lg px-3 py-1.5 border hover:bg-white transition border-pfBlue text-pfBlue"
                        >
                          Voir les documents
                        </Link>
                        <Link
                          to={`/informations/${step.slug}`}
                          className="text-xs rounded-lg px-3 py-1.5 bg-pfPink hover:brightness-105 transition"
                        >
                          Guide détaillé
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== BANDE DOCUMENTS CTA ========== */}
      <section className="py-10 bg-pfYellow">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="reveal js-reveal">
            <h3 className="text-xl font-semibold">Documents à télécharger</h3>
            <p className="text-slate-700 text-sm">
              Classés chronologiquement pour aller à l’essentiel.
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto reveal js-reveal [--delay:100ms]">
            <Link
              to="/documents"
              className="rounded-xl px-4 py-2 text-sm font-medium border hover:bg-white transition w-full sm:w-auto text-center border-pfBlue text-pfBlue"
            >
              Voir les documents
            </Link>
            <button
              onClick={downloadAllZip}
              className="rounded-xl px-4 py-2 text-sm font-medium shadow hover:brightness-110 transition w-full sm:w-auto bg-pfBlue text-white"
            >
              Tout télécharger (ZIP)
            </button>
          </div>
        </div>
      </section>

      {/* ========== DERNIERS DOCUMENTS ========== */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div className="reveal js-reveal">
              <h3 className="text-xl font-semibold">Derniers documents ajoutés</h3>
              <p className="text-slate-600 text-sm">
                Un aperçu des nouveautés, vous en trouverez plus dans la page Documents.
              </p>
            </div>
            <Link
              to="/documents?sort=recent"
              className="text-sm font-medium rounded-lg px-3 py-2 border hover:bg-white transition reveal js-reveal border-pfBlue text-pfBlue [--delay:80ms]"
            >
              Tout voir
            </Link>
          </div>

          {loadingDocs ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-slate-600">Aucun document pour le moment.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.map((doc, i) => (
                <article
                  key={doc.id || doc.label}
                  className="reveal js-reveal rounded-2xl border bg-white p-4 flex flex-col shadow-sm transition-transform duration-200 hover:shadow-md hover:scale-[1.02] will-change-transform"
                >
                  <div className={`[--delay:${i * 60}ms]`}>
                    <div
                      className={`text-xs font-medium w-fit rounded-md px-2 py-1 mb-2 ${tagClass(
                        doc.tag
                      )}`}
                    >
                      {doc.tag}
                    </div>

                    <h4 className="font-semibold leading-snug flex-1">
                      {doc.label}
                    </h4>

                    <div className="mt-3 flex items-center gap-2">
                      {/* Aperçu */}
                      <a
                        href={doc.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline text-pfBlue hover:text-pfBlue/80 transition-colors"
                        title="Ouvrir l’aperçu PDF"
                      >
                        Aperçu
                      </a>

                      <button
                        type="button"
                        onClick={() => downloadDocument(doc.id)}
                        className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium bg-pfBlueLight text-slate-800 hover:bg-pfBlueLight/80 transition-colors"
                        title="Télécharger le PDF"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 5v14" />
                          <path d="M19 12l-7 7-7-7" />
                        </svg>
                        PDF
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}



