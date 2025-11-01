/**
 * Footer (pied de page)
 * -------------------------------------------------
 * - Présentation du projet
 * - Navigation interne (hover pastel jaune + gras)
 * - Thèmes principaux
 * - Numéros utiles (cliquables, hover doux, infobulle via title)
 */

import numeros from "../data/numerosUtiles";

export default function Footer() {
  // On conserve uniquement certains numéros pour le footer
  const numerosFiltres = numeros.filter((n) =>
    ["allo service public", "caf"].some((term) =>
      n.name.toLowerCase().includes(term)
    )
  );

  return (
    <footer
      className="border-t py-10 bg-pfBlueSoft text-sm text-slate-700"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Présentation */}
        <div>
          <h2 className="font-semibold text-slate-800">ParentFacile</h2>
          <p className="mt-2">
            Le guide simple des démarches de la grossesse aux 3 ans.
          </p>
          <p className="text-xs mt-3 text-slate-600">
            © {new Date().getFullYear()} parentfacile.fr
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Liens de navigation du site">
          <h3 className="font-semibold mb-2 text-slate-800">Navigation</h3>
          <ul className="space-y-1">
            {[
              { to: "/informations", label: "Informations" },
              { to: "/documents", label: "Documents" },
              { to: "/contact", label: "Contact" },
              { to: "/cgu", label: "Conditions générales" },
              { to: "/mentions-legales", label: "Mentions légales" },
              { to: "/confidentialite", label: "Confidentialité" },
            ].map((link) => (
              <li key={link.to}>
                <a
                  href={link.to}
                  className="relative inline-block rounded-md px-1 text-slate-700 transition-all duration-300 hover:bg-pfYellow/60 hover:font-semibold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Thèmes */}
        <div>
          <h3 className="font-semibold mb-2 text-slate-800">Thèmes</h3>
          <ul className="space-y-1">
            <li>Grossesse</li>
            <li>Naissance</li>
            <li>1 à 3 ans</li>
          </ul>
        </div>

        {/* Numéros utiles (cliquables + hover cohérent + infobulle) */}
        <div>
          <h3 className="font-semibold mb-2 text-slate-800">Numéros utiles</h3>
          <ul className="grid gap-2">
            {numerosFiltres.map((n) => {
              const telHref = `tel:${n.num.replace(/\s/g, "")}`;
              return (
                <li
                  key={n.name}
                  className="relative rounded-xl border p-3 bg-white shadow-sm transition-transform duration-200 hover:shadow-md hover:scale-[1.02] will-change-transform"
                  title={n.description}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{n.name}</span>
                    <a
                      href={telHref}
                      className="font-semibold text-pfBlue underline-offset-2 hover:underline"
                      aria-label={`Appeler ${n.name} au ${n.num}`}
                    >
                      {n.num}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
