/**
 * Page : 404 — Not Found
 * -------------------------------------------------
 * - Carte centrale avec CTA (Accueil / Contact)
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
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
    <main
      role="main"
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-pfBlueSoft to-pfPink"
    >
      <div className="reveal js-reveal [--delay:60ms] bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Code d'état (h1 pour les lecteurs d’écran) */}
        <h1 className="text-6xl font-bold text-pfBlue mb-3">404</h1>

        {/* Titre lisible (h2), message et CTA */}
        <h2 className="reveal js-reveal [--delay:120ms] text-2xl font-semibold text-slate-800 mb-4">
          Page non trouvée
        </h2>

        <p className="reveal js-reveal [--delay:180ms] text-slate-600 mb-8">
          Oups ! La page que vous recherchez n’existe pas ou a été déplacée.
        </p>

        <div className="reveal js-reveal [--delay:220ms] flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl px-4 py-2 text-sm font-medium shadow hover:shadow-md hover:brightness-110 active:brightness-95 transition bg-pfBlue text-white"
            aria-label="Retour à la page d’accueil"
          >
            Retour à l’accueil
          </Link>

          <Link
            to="/contact"
            className="rounded-xl px-4 py-2 text-sm font-medium border hover:bg-white transition border-pfBlue text-pfBlue"
            aria-label="Contacter le support"
          >
            Contacter le support
          </Link>
        </div>
      </div>
    </main>
  );
}
