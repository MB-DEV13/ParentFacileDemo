/**
 * RequireAdmin (protection des routes Admin)
 * -------------------------------------------------
 * Vérifie si l'utilisateur est authentifié comme administrateur :
 * - Si la vérification est en cours → affiche un petit loader texte.
 * - Si non authentifié → redirige vers /admin/login.
 * - Si OK → rend les pages enfants via <Outlet />.
 */

import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { adminMe } from "../services/adminApi";

export default function RequireAdmin() {
  const [authorized, setAuthorized] = useState(null); // null = en cours
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        await adminMe();
        if (isMounted) setAuthorized(true);
      } catch {
        if (isMounted) setAuthorized(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- ÉTATS D'AFFICHAGE ---
  if (authorized === null) {
    // État de chargement
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-600">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 border-2 border-pfBlue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Vérification de l’accès admin…</p>
        </div>
      </div>
    );
  }

  if (authorized === false) {
    // Redirection si non admin
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // Accès autorisé : rend les sous-routes
  return <Outlet />;
}

