/**
 * Utils - tags
 * -------------------------------------------------
 * Ensemble d’outils pour gérer les libellés et couleurs
 * associés aux catégories principales du site ParentFacile.
 *
 * Fonctions :
 * - normalizeTag(tag) : harmonise les libellés (1–3 ans, etc.)
 * - tagColor(tag) : retourne un objet { background, color }
 *   cohérent avec la charte pastel (bleu, jaune, rose).
 */

/**
 * Normalise les libellés de tags afin d'unifier leur affichage.
 */
export function normalizeTag(tag) {
  if (!tag) return "";

  const t = String(tag).trim().toLowerCase();

  if (/^(0\s*[-–]?\s*3\s*ans|3\s*ans|1\s*(à|-|–)\s*3\s*ans)$/i.test(tag))
    return "1–3 ans";
  if (t.includes("grossesse")) return "Grossesse";
  if (t.includes("naissance")) return "Naissance";

  return tag.trim();
}

/**
 * Retourne une paire de couleurs adaptée au tag.
 * Utilise la palette pastel du projet.
 */
export function tagColor(tag) {
  const normalized = normalizeTag(tag);

  switch (normalized) {
    case "Grossesse":
      return { background: "#9AC8EB", color: "#1f2a44" }; // pfBlueLight
    case "Naissance":
      return { background: "#F7F6CF", color: "#1f2a44" }; // pfYellow
    case "1–3 ans":
      return { background: "#F4CFDF", color: "#1f2a44" }; // pfPink
    default:
      return { background: "#B6D8F2", color: "#1f2a44" }; // pfBlueSoft
  }
}

/**
 * Permet de générer une classe Tailwind correspondant au tag,
 */
export function tagClass(tag) {
  const normalized = normalizeTag(tag);
  switch (normalized) {
    case "Grossesse":
      return "bg-pfBlueLight text-slate-800";
    case "Naissance":
      return "bg-pfYellow text-slate-800";
    case "1–3 ans":
      return "bg-pfPink text-slate-800";
    default:
      return "bg-pfBlueSoft text-slate-800";
  }
}
