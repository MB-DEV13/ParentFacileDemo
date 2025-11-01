/**
 * Page : Contact
 * -------------------------------------------------
 * - Formulaire avec validations côté client (email / sujet / message + honeypot)
 * - Envoi à l'API (/api/contact, via VITE_API_URL si défini)
 */

import { useEffect, useState } from "react";
import family from "../assets/images/family_3.png";

const API = import.meta.env.VITE_API_URL || "";

export default function Contact() {
  // ------------------------- State formulaire + statut
  const [form, setForm] = useState({ email: "", subject: "", message: "", hp: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverMsg, setServerMsg] = useState("");

  // ------------------------- Animation "reveal" au scroll
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll(".js-reveal");
    if (!els.length) return;

    if (prefersReduced) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ------------------------- Validation minimale
  function validate(values) {
    const e = {};
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Email invalide";
    if (!values.subject || values.subject.trim().length < 2) e.subject = "Sujet requis (min. 2 caractères)";
    if (!values.message || values.message.trim().length < 10) e.message = "Message trop court (min. 10 caractères)";
    if (values.hp) e.hp = "bot";
    return e;
  }

  // ------------------------- Helpers
  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // ------------------------- Soumission
  async function onSubmit(e) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      setStatus("sending");
      setServerMsg("");
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Erreur lors de l'envoi");
      setStatus("success");
      setServerMsg("Merci ! Votre message a bien été envoyé.");
      setForm({ email: "", subject: "", message: "", hp: "" });
    } catch (err) {
      setStatus("error");
      setServerMsg(err.message || "Erreur inconnue");
    }
  }

  // ------------------------- Styles utilitaires
  const inputBase =
    "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pfBlue";
  const errTxt = "text-xs text-red-600 mt-1";

  // ------------------------- Données annexes
  const helpfulNumbers = [
    { name: "Samu", num: "15" },
    { name: "Pompiers", num: "18" },
    { name: "Numéro d’urgence européen", num: "112" },
    { name: "Violences femmes info", num: "3919" },
    { name: "Allo Service Public", num: "39 39" },
    { name: "CAF", num: "32 30" },
  ];

  const usefulSites = [
    { name: "CAF", url: "https://www.caf.fr/", desc: "Prestations familiales, démarches en ligne." },
    { name: "Service-Public.fr", url: "https://www.service-public.fr/", desc: "Démarches administratives et fiches pratiques." },
    { name: "Ameli (Assurance Maladie)", url: "https://www.ameli.fr/", desc: "Droits santé, rattachement de l’enfant, remboursements." },
    { name: "Pajemploi (Urssaf)", url: "https://www.pajemploi.urssaf.fr/", desc: "Garde d’enfants, assistante maternelle, CMG." },
    { name: "monenfant.gouv.fr", url: "https://monenfant.gouv.fr/", desc: "Modes de garde, lieux d’accueil, inscription." },
    { name: "MSA", url: "https://www.msa.fr/", desc: "Sécurité sociale agricole (si affilié MSA)." },
  ];

  return (
    <section className="py-16 min-h-screen bg-gradient-to-br from-pfBlueLight to-pfPink">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête de page */}
        <div className="text-center mb-12 reveal js-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">Contact</h2>
          <p className="text-slate-700 mt-1 max-w-2xl mx-auto mb-6">
            Une question, un document manquant, une correction ? Écris-nous.
          </p>
          <div className="mb-6 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={family}
              alt="Famille - documents utiles"
              className="w-full h-48 sm:h-56 lg:h-64 object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        {/* Grille 2 colonnes */}
        <div className="grid md:grid-cols-2 gap-10 items-stretch">
          {/* Colonne gauche : formulaire */}
          <form
            className="reveal js-reveal [--delay:60ms] bg-white rounded-2xl shadow p-6 flex flex-col h-full"
            onSubmit={onSubmit}
            noValidate
            aria-labelledby="contact-title"
          >
            <h3 id="contact-title" className="text-lg font-semibold text-slate-800 mb-4">
              Nous contacter
            </h3>

            {/* Zone champs */}
            <div className="flex flex-col gap-4 flex-1">
              {/* Email */}
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`${inputBase} ${errors.email ? "border-red-500" : ""}`}
                  placeholder="Votre email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  required
                />
                {errors.email && <p id="email-error" className={errTxt}>{errors.email}</p>}
              </div>

              {/* Sujet */}
              <div>
                <label htmlFor="subject" className="sr-only">Sujet</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className={`${inputBase} ${errors.subject ? "border-red-500" : ""}`}
                  placeholder="Sujet"
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  required
                />
                {errors.subject && <p id="subject-error" className={errTxt}>{errors.subject}</p>}
              </div>

              {/* Message */}
              <div className="flex-1 flex">
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className={`${inputBase} flex-1 min-h-[200px] resize-none ${errors.message ? "border-red-500" : ""}`}
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  required
                  minLength={10}
                />
              </div>
              {errors.message && <p id="message-error" className={errTxt}>{errors.message}</p>}
            </div>

            {/* Honeypot caché */}
            <div className="absolute left-[-5000px] top-0" aria-hidden="true">
              <label htmlFor="hp">Ne pas remplir</label>
              <input
                id="hp"
                name="hp"
                type="text"
                value={form.hp}
                onChange={(e) => setField("hp", e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Bouton + état */}
            <div className="pt-2 mt-auto">
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-xl bg-pfBlue text-white px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md hover:bg-pfBlue/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                aria-busy={status === "sending"}
              >
                {status === "sending" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Envoi…
                  </>
                ) : ("Envoyer")}
              </button>

              <div className="mt-2 text-sm text-center" role="status" aria-live="polite" aria-atomic="true">
                {status === "success" && <span className="text-green-700">{serverMsg}</span>}
                {status === "error" && <span className="text-red-700">{serverMsg}</span>}
              </div>
            </div>
          </form>

          {/* Colonne droite : numéros + sites utiles */}
          <div className="space-y-6">
            {/* Numéros utiles */}
            <div className="reveal js-reveal [--delay:80ms] bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-4 text-slate-800 text-lg">Numéros utiles</h3>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                {helpfulNumbers.map((n, i) => (
                  <li
                    key={n.name}
                    className={`card-hover p-3 flex items-center justify-between [--delay:${i * 50}ms]`}
                  >
                    <span>{n.name}</span>
                    <a
                      href={`tel:${n.num.replace(/\s/g, "")}`}
                      className="font-semibold text-pfBlue hover:opacity-80 transition"
                      title={`Composer ${n.num}`}
                    >
                      {n.num}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sites utiles */}
            <div className="reveal js-reveal [--delay:120ms] bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-4 text-slate-800 text-lg">Sites utiles</h3>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                {usefulSites.map((s, i) => (
                  <li
                    key={s.name}
                    className={`card-hover p-3 flex items-center justify-between [--delay:${i * 50}ms]`}
                  >
                    <div className="pr-3">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-slate-600">{s.desc}</p>
                    </div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 underline font-semibold text-pfBlue hover:opacity-80 transition"
                      title={`Ouvrir ${s.name}`}
                    >
                      Visiter
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}



