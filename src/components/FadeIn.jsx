import { useEffect, useRef } from "react";

/** Composant FadeIn
 * -------------------------------------------------
 * - Ajoute .reveal et .in-view au moment où l’élément entre dans le viewport.
 * - delay (ms) optionnel pour faire un léger stagger.
 */
export default function FadeIn({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respecte prefers-reduced-motion
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("in-view");
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("in-view");
        io.unobserve(el);
      }
    }, { threshold: 0.15 });

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
