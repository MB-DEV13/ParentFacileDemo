/**
 * Timeline (chronologie verticale)
 * -------------------------------------------------
 */

export default function Timeline({ steps = [] }) {
  return (
    <div className="relative pl-6">
      {/* Ligne verticale continue */}
      <div
        className="absolute left-3 top-0 bottom-0 w-px bg-slate-200"
        aria-hidden="true"
      />

      {/* Boucle sur chaque étape */}
      {steps.map((step, idx) => (
        <div
          key={idx}
          className="relative mb-8 last:mb-0 group transition-transform duration-300"
        >
          {/* Pastille */}
          <div
            className="absolute -left-[11px] top-1 h-5 w-5 rounded-full ring-4 ring-slate-200 bg-pfBlueLight 
                       group-hover:bg-pfYellow transition-colors duration-300"
            aria-hidden="true"
          />

          {/* Contenu texte */}
          <h4 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
            {step.title}
          </h4>

          {step.desc && (
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {step.desc}
            </p>
          )}

          {/* Actions (facultatives, ex: bouton, lien) */}
          {step.actions && <div className="mt-2">{step.actions}</div>}
        </div>
      ))}
    </div>
  );
}

