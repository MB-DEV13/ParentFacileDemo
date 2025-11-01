import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function MainLayout() {
  const location = useLocation();
  const [mountedKey, setMountedKey] = useState(0);
  const [ready, setReady] = useState(false);

  // relance une montée douce à chaque navigation
  useEffect(() => {
    setMountedKey((k) => k + 1);
    setReady(false);
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Header />

      <main
        key={mountedKey}
        role="main"
        // transition très légère : opacity .96 → 1 + translate 2px → 0
        className={[
          "flex-1",
          "transition-opacity transition-transform duration-250 ease-out",
          "will-change-[opacity,transform]",
          "motion-reduce:transition-none",
          ready
            ? "opacity-100 translate-y-0"
            : "opacity-[.96] translate-y-[2px]",
        ].join(" ")}
      >
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}



