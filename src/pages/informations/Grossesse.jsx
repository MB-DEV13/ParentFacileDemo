/**
 * Page : Parcours — Grossesse
 * -------------------------------------------------
 * - Liste d'étapes (titre, détails, pro à contacter, action)
 * - Liens officiels + redirection vers Documents quand pertinent
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Grossesse() {
  // ------------------------- Données des étapes
  const steps = [
    {
      title: "Test et confirmation de grossesse",
      detail:
        "Prendre rendez-vous pour confirmer la grossesse et lancer le suivi. Conseils initiaux (alimentation, activité, prévention).",
      pro: "Médecin généraliste, sage-femme ou gynécologue",
      doc: null,
    },
    {
      title: "Déclaration de grossesse",
      detail:
        "À réaliser avant la fin de la 14ᵉ semaine d’aménorrhée. Elle déclenche vos droits (prise en charge, prestations CAF). Souvent télétransmise par le praticien.",
      pro: "Médecin ou sage-femme (établit/valide la déclaration)",
      doc: {
        type: "link",
        href: "https://www.service-public.fr/particuliers/vosdroits/F737",
        label: "Déclarer / infos officielles",
        extraDownloadQuery: "Déclaration de grossesse",
      },
    },
    {
      title: "Suivi médical obligatoire",
      detail:
        "7 consultations prénatales obligatoires, prises en charge à 100% à partir du 6ᵉ mois. Surveillance de la maman et du bébé + conseils prévention.",
      pro: "Sage-femme, gynécologue ou médecin",
      doc: null,
    },
    {
      title: "Échographies (1er, 2e, 3e trimestre)",
      detail:
        "Échos de référence : autour de 12 SA, 22 SA et 32 SA. Vérification de la croissance et de la vitalité fœtale, dépistage d’anomalies.",
      pro: "Sage-femme échographiste, gynécologue, radiologue",
      doc: null,
    },
    {
      title: "Examens biologiques et dépistages",
      detail:
        "Bilans sanguins (groupe, sérologies), analyse d’urines, dépistage diabète gestationnel (HGPO) si indiqué, suivi tensionnel.",
      pro: "Laboratoire de biologie médicale (sur prescription)",
      doc: null,
    },
    {
      title: "Suivi spécifique si grossesse à risque",
      detail:
        "Contrôles additionnels (monitoring, échos supplémentaires) en cas de facteurs de risque ou pathologie.",
      pro: "Sage-femme / obstétricien en maternité ou cabinet",
      doc: null,
    },
    {
      title: "Choix et inscription à la maternité",
      detail:
        "Réserver une place tôt (niveau adapté à votre situation). Se renseigner sur la liste d’affaires et le projet de naissance.",
      pro: "Secrétariat de la maternité / clinique choisie",
      doc: { type: "local", note: "Dossier d’inscription propre à l’établissement" },
    },
    {
      title: "Reconnaissance anticipée (si non mariés)",
      detail:
        "Permet d’établir la filiation avant la naissance ; évite les démarches urgentes après l’accouchement.",
      pro: "Mairie (officier d’état civil)",
      doc: {
        type: "link",
        href: "https://www.service-public.fr/particuliers/vosdroits/F887",
        label: "Reconnaissance anticipée / démarche",
      },
    },
    {
      title: "Aides financières (PAJE, prime de naissance…)",
      detail:
        "Vérifier l’éligibilité et déclarer la grossesse à la CAF. La prime de naissance est versée avant la fin du 2ᵉ mois suivant la naissance (sous conditions).",
      pro: "CAF (en ligne) — accompagnement possible par PMI",
      doc: {
        type: "link",
        href: "https://www.service-public.fr/particuliers/vosdroits/R49959",
        label: "Demande de prime à la naissance (CAF)",
      },
    },
    {
      title: "Congé maternité",
      detail:
        "Informer votre employeur pour le congé maternité (attestations de salaire transmises par l’employeur à la CPAM ; les indemnités journalières sont gérées par la CPAM).",
      pro: "Employeur / RH ; CPAM (indemnités journalières)",
      doc: null,
    },
    {
      title: "Séances de préparation à la naissance",
      detail:
        "Jusqu’à 8 séances prises en charge : respiration, postures, gestion de la douleur, allaitement, projet de naissance.",
      pro: "Sage-femme (ville, maternité ou PMI)",
      doc: null,
    },
    {
      title: "Projet de naissance",
      detail:
        "Noter vos souhaits (positions, accompagnement, peau-à-peau…). À échanger avec l’équipe pour vérifier ce qui est possible.",
      pro: "Sage-femme / équipe de la maternité",
      doc: {
        type: "local",
        note: "Modèle de projet parfois fourni par la maternité",
        href: "https://monprojetdenaissance.fr/",
        linkLabel: "Modèle en ligne",
      },
    },
    {
      title: "Préparation administrative & valise de maternité",
      detail:
        "Rassembler : carte Vitale, pièce d’identité, livret de famille, justificatif de domicile, RIB, examens, échos, ordonnance, valise de maternité.",
      pro: "Vous-même (checklist de la maternité)",
      doc: null,
    },
    {
      title: "Anticiper le retour à domicile et le mode de garde",
      detail:
        "Contacter les modes de garde (crèche, assistante maternelle) et préparer les démarches (inscriptions, contrats, attestations).",
      pro: "Crèche/Relais Petite Enfance, assistante maternelle, mairie",
      doc: {
        type: "link",
        href: "https://monenfant.fr/",
        label: "Trouver un mode de garde (CAF)",
      },
    },
  ];

  // ------------------------- Animation reveal (comme Contact/Docs)
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
          Parcours — Grossesse (0 à 9 mois)
        </h1>

        <ul className="space-y-4">
          {steps.map((s, i) => (
            <li
              key={i}
              className="reveal js-reveal rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-[1.02] will-change-transform"
              style={{ ["--delay"]: `${120 + i * 70}ms` }}
            >
              <div className="md:flex md:items-start md:justify-between gap-6">
                {/* Titre + détails */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-pfBlueLight">
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

                {/* Action */}
                <div className="mt-3 md:mt-0 md:w-56 shrink-0">
                  {s.doc?.type === "link" ? (
                    <div className="space-y-2">
                      <a
                        href={s.doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition bg-pfBlue text-white"
                      >
                        {s.doc.label || "Accéder au document"}
                      </a>

                      {s.doc.extraDownloadQuery && (
                        <Link
                          to={`/documents?q=${encodeURIComponent(s.doc.extraDownloadQuery)}`}
                          className="w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium border border-pfBlue text-pfBlue hover:bg-white transition"
                        >
                          Télécharger le document
                        </Link>
                      )}
                    </div>
                  ) : s.doc?.type === "local" ? (
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3 bg-slate-50 text-sm">
                        <div className="font-medium mb-1">Document remis sur place</div>
                        <p className="text-slate-600">
                          {s.doc.note || "Document spécifique à votre mairie/établissement."}
                        </p>
                      </div>
                      {s.doc.href && (
                        <a
                          href={s.doc.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition bg-pfBlue text-white"
                        >
                          {s.doc.linkLabel || "Modèle en ligne"}
                        </a>
                      )}
                    </div>
                  ) : s.doc?.type === "official" ? (
                    <Link
                      to={`/documents?q=${encodeURIComponent(s.doc.query)}`}
                      className="w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition bg-pfBlue text-white"
                      title={`Télécharger : ${s.doc.query}`}
                    >
                      Télécharger le document
                    </Link>
                  ) : (
                    <div className="text-xs text-slate-500 text-center">Aucun document à télécharger</div>
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
            <h4 className="font-semibold text-slate-900">Besoin d’un modèle ou d’une attestation ?</h4>
            <p className="text-sm text-slate-700">
              Retrouvez tous les PDF téléchargeables et classés par étape.
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
