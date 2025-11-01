/**
 * Card (carte générique)
 * -------------------------------------------------
 * Props :
 * - title?: string
 * - badge?: string | ReactNode
 * - badgeAsTag?: boolean  // si true, applique tagClass/normalizeTag
 * - className?: string
 */

import { normalizeTag, tagClass } from "../utils/tags";

export default function Card({
  title,
  children,
  badge,
  badgeAsTag = false,
  className = "",
}) {
  const renderBadge =
    badge &&
    (badgeAsTag && typeof badge === "string" ? (
      <span
        className={`text-xs font-medium w-fit rounded-md px-2 py-1 mb-2 ${tagClass(
          badge
        )}`}
      >
        {normalizeTag(badge)}
      </span>
    ) : (
      <span className="text-xs font-medium w-fit rounded-md px-2 py-1 mb-2 bg-pfBlueSoft/80 text-slate-700">
        {badge}
      </span>
    ));

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {renderBadge}

      {title && (
        <h3 className="font-semibold mb-2 text-slate-800" aria-label="Titre de la carte">
          {title}
        </h3>
      )}

      <div className="text-slate-700">{children}</div>
    </article>
  );
}


