/**
 * Page : Parcours — Naissance
 * -------------------------------------------------
 * - Étapes + actions (lien officiel / redirection vers Documents / local)
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Naissance() {
  const steps = [
    {
      title: "Congé paternité / 2e parent",
      detail:
        "À poser dans les 6 mois suivant la naissance (25 jours, 32 en cas de naissances multiples). L’employeur transmet les attestations de salaire à la CPAM pour les indemnités.",
      pro: "Employeur + CPAM",
      doc: { type: "official", query: "Modèle congé paternité", extraLabel: "Modèle du congé paternité" },
    },
    {
      title: "Déclaration de naissance",
      detail:
        "À faire dans les 5 jours ouvrables suivant la naissance à la mairie du lieu de naissance. Permet d’obtenir l’acte de naissance.",
      pro: "Officier d’état civil en mairie",
      doc: { type: "local", note: "Déclaration réalisée directement à la mairie du lieu de naissance." },
    },
    {
      title: "Reconnaissance anticipée / filiation",
      detail:
        "Si les parents ne sont pas mariés : la filiation paternelle peut être établie par reconnaissance (avant ou après la naissance).",
      pro: "Mairie (service état civil)",
      doc: { type: "local", note: "Formulaire fourni par votre mairie" },
    },
    {
      title: "Inscription sur le livret de famille",
      detail:
        "L’officier d’état civil complète le livret existant ou en délivre un nouveau. Géré automatiquement par la mairie.",
      pro: "Mairie du lieu de naissance",
      doc: null,
    },
    {
      title: "Sécurité sociale (rattachement de l’enfant)",
      detail:
        "Rattacher l’enfant à un ou aux deux parents. Démarche via votre compte ameli et/ou formulaire selon les cas.",
      pro: "CPAM (en ligne ou courrier)",
      doc: { type: "official", query: "Rattachement enfant CPAM" },
    },
    {
      title: "Mutuelle santé",
      detail:
        "Informer votre complémentaire santé pour ajouter l’enfant à votre contrat (copies d’acte de naissance/livret, selon mutuelle).",
      pro: "Mutuelle de santé (parent au choix)",
      doc: null,
    },
    {
      title: "CAF / prestations familiales",
      detail:
        "Déclarer la naissance pour déclencher la prime (si non déjà versée) et la PAJE (sous conditions). Démarches depuis votre espace caf.fr.",
      pro: "CAF (compte en ligne) ; accompagnement possible par PMI",
      doc: { type: "link", href: "/documents?q=CAF%20naissance", label: "Accéder aux démarches CAF" },
    },
    {
      title: "Protection sociale complémentaire (entreprise)",
      detail:
        "Informer votre employeur (mutuelle d’entreprise) et vérifier vos couvertures (prévoyance, etc.).",
      pro: "Service RH / employeur",
      doc: null,
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
          Parcours — Naissance
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
                    <span className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold bg-pfYellow text-slate-800">
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
                  {/* Interne vers /documents */}
                  {s.doc?.type === "link" && s.doc.href && (
                    <Link
                      to={s.doc.href}
                      className="w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition bg-pfBlue text-white"
                    >
                      {s.doc.label || "Accéder au document"}
                    </Link>
                  )}

                  {/* Redirection /documents?q=... */}
                  {s.doc?.type === "official" && s.doc.query && (
                    <Link
                      to={`/documents?q=${encodeURIComponent(s.doc.query)}`}
                      className="w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition bg-pfBlue text-white"
                      title={`Rechercher : ${s.doc.query}`}
                    >
                      {s.doc.extraLabel || "Télécharger le document"}
                    </Link>
                  )}

                  {/* Local / mairie */}
                  {s.doc?.type === "local" && (
                    <div className="rounded-lg border p-3 bg-slate-50 text-sm">
                      <div className="font-medium mb-1">Document remis sur place</div>
                      <p className="text-slate-600">
                        {s.doc.note || "Document fourni par votre mairie."}
                      </p>
                    </div>
                  )}

                  {!s.doc && (
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
          className="reveal js-reveal mt-8 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-pfYellow"
          style={{ ["--delay"]: `${120 + steps.length * 70}ms` }}
        >
          <div>
            <h4 className="font-semibold text-slate-900">
              Besoin d’un acte ou d’une attestation ?
            </h4>
            <p className="text-sm text-slate-700">
              Retrouvez tous les PDF utiles après la naissance.
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


