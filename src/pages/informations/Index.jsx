/**
 * Page : Informations (index des parcours)
 * -------------------------------------------------
 * - Bandeau visuel + intro
 * - 3 cartes vers : Grossesse / Naissance / 1–3 ans
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import family from "../../assets/images/family.png";

/** Petit badge titre de section */
const Badge = ({ children }) => (
  <span className="text-xs font-semibold tracking-wider uppercase text-pfBlue">
    {children}
  </span>
);

/** Carte de parcours (lien) */
const Card = ({ to, title, desc }) => (
  <Link
    to={to}
    aria-label={`Ouvrir le parcours ${title}`}
    className="card-hover p-5 block rounded-2xl bg-white"
  >
    {/* Tag “Parcours” en bleu doux */}
    <div className="text-xs font-medium w-fit rounded-md px-2 py-1 mb-2 bg-pfBlueSoft text-slate-800">
      Parcours
    </div>

    <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
    <p className="text-sm text-slate-600 mt-1">{desc}</p>
  </Link>
);

export default function InfosIndex() {
  // --- Animation "reveal" au scroll
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
    // Fond pastel rose cohérent avec la charte
    <section className="py-16 bg-pfPink">
      <div className="max-w-6xl mx-auto px-4">
        {/* ===== En-tête ===== */}
        <div className="mb-10 text-center reveal js-reveal [--delay:60ms]">
          <Badge>Notre parcours</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-slate-900">
            Informations essentielles, étape par étape
          </h2>
          <p className="text-slate-600 mt-1 max-w-2xl mx-auto mb-6">
            Une vue d’ensemble claire puis le détail de chaque démarche avec
            documents téléchargeables.
          </p>

          {/* Image bandeau sous le titre */}
          <div className="mb-6 rounded-2xl overflow-hidden shadow-sm reveal js-reveal [--delay:120ms]">
            <img
              src={family}
              alt="Famille - documents utiles"
              className="w-full h-48 sm:h-56 lg:h-64 object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        {/* ===== Grille des parcours ===== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="reveal js-reveal [--delay:80ms]">
            <Card
              to="/informations/grossesse"
              title="Grossesse"
              desc="Déclarations, suivi médical, échographies, congés, allocations…"
            />
          </div>

          <div className="reveal js-reveal [--delay:140ms]">
            <Card
              to="/informations/naissance"
              title="Naissance"
              desc="Reconnaissance, acte de naissance, sécu, mutuelle, prime…"
            />
          </div>

          <div className="reveal js-reveal [--delay:200ms]">
            <Card
              to="/informations/1-3-ans"
              title="1 à 3 ans"
              desc="Vaccins, PAJE/CAF, modes de garde, rentrée en maternelle…"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
