/**
 * Breadcrumbs (fil d’Ariane)
 * ----------------------------------------
 */

import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Fil d’Ariane"
      className="text-sm mb-4 text-slate-600 flex flex-wrap items-center gap-1"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const separator = !isLast ? (
          <span className="text-slate-400 mx-1">/</span>
        ) : null;

        return (
          <span key={index} className="flex items-center">
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:underline hover:text-slate-800 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-slate-800 font-medium"
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {separator}
          </span>
        );
      })}
    </nav>
  );
}


