import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

/** Loader minimal pour les imports lazy */
const Loader = () => (
  <div className="min-h-[40vh] grid place-items-center text-slate-500">
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
      <span>Chargement…</span>
    </div>
  </div>
);

/** Layout principal (chargé directement car utilisé partout) */
import MainLayout from "./layouts/MainLayout.jsx";

/** Pages — importées en lazy pour un bundle initial plus léger */
const Home = lazy(() => import("./pages/Home.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));

// Documents
const DocsIndex = lazy(() => import("./pages/documents/Index.jsx"));

// Informations
const InfosIndex = lazy(() => import("./pages/informations/Index.jsx"));
const Grossesse = lazy(() => import("./pages/informations/Grossesse.jsx"));
const Naissance = lazy(() => import("./pages/informations/Naissance.jsx"));
const UnATroisAns = lazy(() => import("./pages/informations/UnATroisAns.jsx"));

// Légal
const CGU = lazy(() => import("./pages/legal/CGU.jsx"));
const Confidentialite = lazy(() => import("./pages/legal/Confidentialite.jsx"));
const MentionsLegales = lazy(() => import("./pages/legal/MentionsLegales.jsx"));

// Compte (futur)
const Login = lazy(() => import("./pages/account/Login.jsx"));
const Register = lazy(() => import("./pages/account/Register.jsx"));
const Dashboard = lazy(() => import("./pages/account/Dashboard.jsx"));

// Admin
const AdminLogin = lazy(() => import("./pages/admin/Login.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages.jsx"));
const RequireAdmin = lazy(() => import("./components/RequireAdmin.jsx"));

// 404
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

/**
 * Router configuration
 */
const router = createBrowserRouter(
  [
    {
      element: <MainLayout />,
      children: [
        // Public
        { path: "/", element: <Home /> },
        { path: "/contact", element: <Contact /> },
        { path: "/documents", element: <DocsIndex /> },

        // Informations
        {
          path: "/informations",
          children: [
            { index: true, element: <InfosIndex /> },
            { path: "grossesse", element: <Grossesse /> },
            { path: "naissance", element: <Naissance /> },
            { path: "1-3-ans", element: <UnATroisAns /> },
          ],
        },

        // Légal
        { path: "/cgu", element: <CGU /> },
        { path: "/confidentialite", element: <Confidentialite /> },
        { path: "/mentions-legales", element: <MentionsLegales /> },

        // Compte (futur)
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/dashboard", element: <Dashboard /> },

        // --- ADMIN ---
        { path: "/admin/login", element: <AdminLogin /> },
        {
          path: "/admin",
          element: <RequireAdmin />, // protège /admin et ses sous-pages
          children: [
            { index: true, element: <AdminDashboard /> }, // /admin
            { path: "messages", element: <AdminMessages /> }, // /admin/messages
          ],
        },

        // 404
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);


