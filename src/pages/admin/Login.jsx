/**
 * Page : Connexion administrateur
 * -------------------------------------------------
 * - Utilise adminLogin() depuis services/adminApi.js
 * - Feedback clair : loading, erreurs, focus visibles
 * - Redirection vers /admin en cas de succès
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/adminApi";

export default function AdminLogin() {
  // États locaux du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Animation reveal au scroll (cohérente avec le reste du site)
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

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate("/admin", { replace: true });
    } catch (e) {
      setErr(e.message || "Échec de la connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      role="main"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pfBlueLight to-pfPink px-4"
    >
      <div className="w-full max-w-md">
        {/* Carte de connexion */}
        <div className="reveal js-reveal [--delay:80ms] bg-white rounded-2xl shadow-md p-6 transition-shadow hover:shadow-lg">
          <h1 className="text-xl font-semibold mb-5 text-center text-slate-800">
            Connexion administrateur
          </h1>

          {/* Formulaire d’authentification */}
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="text-sm font-medium text-slate-700">
                Adresse email
              </label>
              <input
                id="admin-email"
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pfBlue focus:border-pfBlue transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                aria-invalid={!!err}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="admin-password" className="text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <input
                id="admin-password"
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pfBlue focus:border-pfBlue transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {/* Message d'erreur global */}
            {err && (
              <p
                className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg py-2"
                role="alert"
              >
                {err}
              </p>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pfBlue text-white px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md hover:bg-pfBlue/90 transition-all disabled:opacity-60"
              aria-busy={loading}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}


