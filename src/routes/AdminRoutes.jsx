/**
 * AdminGuard (protection des routes Admin)
 * -------------------------------------------------
 * Vérifie l'authentification administrateur via `adminMe()`.
 * - Affiche un loader doux pendant la vérification.
 * - Redirige vers /admin/login si non connecté.
 */

import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { adminMe } from "../services/adminApi";

export default function AdminGuard({ children }) {
  const [state, setState] = useState({ loading: true, ok: false });
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await adminMe();
        if (mounted) setState({ loading: false, ok: true });
      } catch {
        if (mounted) setState({ loading: false, ok: false });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) {
    // petit écran de chargement cohérent avec ton design pastel
    return (
      <div className="min-h-[60vh] grid place-items-center text-slate-600 animate-fade-in">
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-pfBlue"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          <span>Vérification des droits...</span>
        </div>
      </div>
    );
  }

  if (!state.ok) {
    // redirection avec mémoire de la page demandée
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // accès accordé
  return children;
}

