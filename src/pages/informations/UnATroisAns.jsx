/**
 * Page : Parcours — 1 à 3 ans
 * -------------------------------------------------
 * - Étapes de petite enfance (santé, modes de garde, aides, école)
 * - Actions : lien officiel / local / redirection vers Documents
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function UnATroisAns() {
  const steps = [
    {
      title: "Vaccinations obligatoires",
      detail:
        "Suivre le calendrier vaccinal (11 vaccins obligatoires avant 2 ans). Conserver les certificats pour la crèche/école.",
      pro: "Médecin traitant ou PMI",
      doc: { type: "local", note: "Certificat vaccinal dans le carnet de santé (délivré par le médecin)." },
    },
    {
      title: "Suivi de santé",
      detail:
        "Visites obligatoires à 9, 24 et 36 mois. Un certificat de santé est rempli et transmis à la PMI.",
      pro: "Médecin traitant ou PMI",
      doc: { type: "local", note: "Certificat de santé rempli par le médecin (PMI)." },
    },
    {
      title: "Modes de garde",
      detail:
        "Demander une place en crèche, trouver une assistante maternelle agréée, ou opter pour une garde partagée. Prévoir contrats/attestations.",
      pro: "Mairie / Relais Petite Enfance / CAF",
      doc: { type: "local", note: "Formulaire d’inscription crèche fourni par la mairie/structure." },
    },
    {
      title: "Aides financières (PAJE, CMG)",
      detail:
        "Demande de Complément de libre choix du Mode de Garde (CMG), aides PAJE et démarches Pajemploi.",
      pro: "CAF / URSSAF Pajemploi",
      doc: {
        type: "link",
        label: "Accéder à la démarche CAF",
        href: "https://www.caf.fr/allocataires/caf-de-la-reunion/offre-de-service/vie-personnelle/cmg-complement-de-libre-choix-du-mode-de-garde",
      },
    },
    {
      title: "Allocations familiales",
      detail:
        "Actualiser régulièrement sa situation dans l’espace CAF pour maintenir les droits.",
      pro: "CAF",
      doc: null,
    },
    {
      title: "Préparation à la rentrée scolaire",
      detail:
        "Inscrire l’enfant à l’école maternelle l’année de ses 3 ans : préinscription en mairie puis inscription à l’école.",
      pro: "Mairie + direction de l’école",
      doc: { type: "local", note: "Formulaire d’inscription scolaire fourni par la mairie/école." },
    },
  ];

  // Animation reveal
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
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-12 bg-gradient-to-br from-pfBlueLight to-pfPink">
      {/* Raccourcis (pills) */}
      <div className="reveal js-reveal [--delay:40ms] flex flex-wrap items-center justify-center gap-2 mb-6">
        <Link
          to="/informations/grossesse"
          className="rounded-full border px-3 py-1.5 text-sm hover:bg-white transition border-pfBlue text-pfBlue"
        >
          Grossesse
        </Link>
        <Link
          to="/informations/naissance"
          className="rounded-full border px-3 py-1.5 text-sm hover:bg-white transition border-pfBlue text-pfBlue"
        >
          Naissance
        </Link>
        <Link
          to="/informations/1-3-ans"
          className="rounded-full border px-3 py-1.5 text-sm hover:bg-white transition border-pfBlue text-pfBlue"
        >
          1 à 3 ans
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <h1 className="reveal js-reveal [--delay:80ms] text-2xl sm:text-3xl font-bold mb-6 text-slate-900">
          Parcours — 1 à 3 ans
        </h1>

        <ul className="space-y-4">
          {steps.map((s, i) => (
            <li
              key={i}
              className="reveal js-reveal rounded-xl border p-4 bg-white shadow-sm transition-transform duration-200 hover:shadow-md hover:scale-[1.02] will-change-transform"
              style={{ ["--delay"]: `${120 + i * 70}ms` }}
            >
              <div className="md:flex md:items-start md:justify-between gap-6">
                {/* Infos principales */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold bg-pfPink text-slate-800">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold text-slate-900">{s.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{s.detail}</p>
                  {s.pro && (
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Professionnel à contacter : </span>
                      <span className="text-slate-700">{s.pro}</span>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 md:mt-0 md:w-56 shrink-0 space-y-2">
                  {s.doc?.type === "link" ? (
                    <a
                      href={s.doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition bg-pfBlue text-white"
                    >
                      {s.doc.label || "Accéder à la démarche"}
                    </a>
                  ) : s.doc?.type === "local" ? (
                    <div className="rounded-lg border p-3 bg-slate-50 text-sm">
                      <div className="font-medium mb-1">Document remis sur place</div>
                      <p className="text-slate-600">{s.doc.note}</p>
                    </div>
                  ) : s.doc?.type === "official" ? (
                    <Link
                      to={`/documents?q=${encodeURIComponent(s.doc.query)}`}
                      className="w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition bg-pfBlue text-white"
                    >
                      Télécharger le document
                    </Link>
                  ) : (
                    <div className="text-xs text-slate-500 text-center">
                      Aucun document à télécharger
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Bande CTA */}
        <div
          className="reveal js-reveal [--delay:calc(120ms_+_70ms_*_var(--count,0))] mt-8 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-pfYellow"
        >
          <div>
            <h4 className="font-semibold text-slate-900">
              Besoin d’un certificat ou d’un formulaire ?
            </h4>
            <p className="text-sm text-slate-700">
              Retrouvez tous les documents utiles pour la petite enfance.
            </p>
          </div>
          <Link
            to="/documents"
            className="rounded-xl px-4 py-2 text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition bg-pfBlue text-white"
          >
            Voir tous les documents
          </Link>
        </div>
      </div>
    </section>
  );
}
