/**
 * DocumentCard
 * -------------------------------------------------
 * Affiche un document avec tag de catégorie + actions.
 */

import { normalizeTag, tagClass } from "../utils/tags";

export default function DocumentCard({ tag, label, onPreview, onDownload }) {
  return (
    <article
      className="rounded-2xl border bg-white p-4 flex flex-col shadow-sm transition-shadow hover:shadow-md"
      aria-label={`Document ${label}`}
    >
      {/* Tag de catégorie (optionnel) */}
      {tag && (
        <span
          className={`text-xs font-medium w-fit rounded-md px-2 py-1 mb-2 ${tagClass(
            tag
          )}`}
        >
          {normalizeTag(tag)}
        </span>
      )}

      {/* Titre */}
      <h3 className="font-semibold leading-snug flex-1 text-slate-800">
        {label}
      </h3>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        {onPreview && (
          <button
            onClick={onPreview}
            className="text-sm underline text-pfBlue hover:text-pfBlue/80 transition-colors"
            aria-label={`Aperçu de ${label}`}
          >
            Aperçu
          </button>
        )}

        {onDownload && (
          <button
            onClick={onDownload}
            className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-800 bg-pfBlueLight hover:bg-pfBlueLight/80 transition-colors"
            aria-label={`Télécharger ${label} (PDF)`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M19 12l-7 7-7-7" />
            </svg>
            PDF
          </button>
        )}
      </div>
    </article>
  );
}
