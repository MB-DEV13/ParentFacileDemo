/**
 * Header (en-tête principal)
 * -------------------------------------------------
 * Version harmonisée avec la charte ParentFacile :
 * - Fond jaune pastel (pfYellow) au hover et sur page active
 * - Texte en gras au survol et sur page active
 * - Transitions douces cohérentes avec le footer
 */

import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  // Ferme le menu et réinitialise la recherche à chaque navigation
  useEffect(() => {
    setQ("");
    setOpen(false);
  }, [location.pathname]);

  function onSubmit(e) {
    e.preventDefault();
    const term = q.trim();
    navigate(`/documents${term ? `?q=${encodeURIComponent(term)}` : ""}`);
    setOpen(false);
  }

  // Liens de navigation — réutilisables pour desktop & mobile
  const NavLinks = ({ onClick }) => (
    <>
      {[
        { to: "/", label: "Accueil" },
        { to: "/informations", label: "Informations" },
        { to: "/documents", label: "Documents" },
        { to: "/contact", label: "Contact" },
      ].map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onClick}
          className={({ isActive }) =>
            `text-base px-3 py-2 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-pfYellow font-semibold text-slate-900"
                : "text-slate-700 hover:bg-pfYellow hover:font-semibold hover:text-slate-900"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo + marque */}
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="Accueil ParentFacile"
        >
          <img
            src={logo}
            alt="ParentFacile"
            className="h-9 w-auto select-none"
            draggable="false"
            loading="eager"
            decoding="async"
          />
          <span className="font-semibold tracking-wide text-lg">
            ParentFacile
          </span>
        </Link>

        {/* Menu desktop */}
        <nav className="ml-auto hidden md:flex items-center gap-2">
          <NavLinks />
        </nav>

        {/* Recherche desktop */}
        <form
          onSubmit={onSubmit}
          className="ml-auto md:ml-6 w-40 sm:w-56 hidden sm:block"
        >
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher…"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pfBlue"
              aria-label="Rechercher"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Lancer la recherche"
              title="Lancer la recherche"
            >
              <svg
                className="h-4 w-4 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </form>

        {/* Burger menu (mobile) */}
        <button
          type="button"
          className="ml-auto inline-flex md:hidden items-center justify-center h-10 w-10 rounded-lg border border-slate-300 hover:bg-white/70 transition-colors"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {!open ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]" aria-hidden={!open}>
          {/* overlay */}
          <div className="absolute inset-0 bg-black/10" onClick={() => setOpen(false)} />

          {/* panneau */}
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-xs bg-white shadow-xl border-l border-slate-200">
            <div className="p-3.5 border-b flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button
                className="h-9 w-9 grid place-items-center rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            {/* Recherche mobile */}
            <form onSubmit={onSubmit} className="bg-white border-b">
              <div className="relative px-4 py-3">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pfBlue"
                  aria-label="Rechercher"
                />
                <button
                  type="submit"
                  className="absolute right-6 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100 transition-colors"
                  aria-label="Lancer la recherche"
                  title="Lancer la recherche"
                >
                  <svg
                    className="h-4 w-4 opacity-70"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Liens mobiles */}
            <nav className="p-3 flex flex-col gap-1 bg-white">
              {[
                { to: "/", label: "Accueil" },
                { to: "/informations", label: "Informations" },
                { to: "/documents", label: "Documents" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-base transition-all duration-200 ${
                      isActive
                        ? "bg-pfYellow text-slate-900 font-semibold"
                        : "text-slate-700 hover:bg-pfYellow hover:text-slate-900 hover:font-semibold"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}


