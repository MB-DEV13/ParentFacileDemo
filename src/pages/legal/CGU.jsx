/**
 * Page : CGU
 */

import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Conditions() {
  const siteName = "ParentFacile";
  const siteUrl = "https://parentfacile.fr";
  const lastUpdate = "septembre 2025";
  const contactPath = "/contact";

  // IO pour .js-reveal
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
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const Section = ({ id, title, children, delay = "0ms" }) => (
    <section
      id={id}
      className="reveal js-reveal bg-white rounded-2xl shadow p-6"
      style={{ ["--delay"]: delay }}
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-3">{title}</h3>
      <div className="prose prose-slate max-w-none text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );

  return (
    <main role="main" className="py-16 bg-gradient-to-br from-pfBlueLight to-pfPink">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <header className="reveal js-reveal text-center mb-10" style={{ ["--delay"]: "40ms" }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Conditions générales d’utilisation
          </h1>
          <p className="text-slate-700 mt-2">
            {siteName} — Dernière mise à jour : {lastUpdate}
          </p>
        </header>

        <div className="space-y-6">
          <Section id="objet" title="1. Objet" delay="60ms">
            <p>
              Le site <strong>{siteName}</strong> (accessible à l’adresse{" "}
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {siteUrl}
              </a>
              ) a pour vocation de fournir aux parents des informations
              pratiques, des documents administratifs utiles et des ressources
              pour les accompagner de la grossesse aux premières années de
              l’enfant.
            </p>
          </Section>

          <Section id="acces" title="2. Accès au site" delay="90ms">
            <p>
              Le site est accessible gratuitement à tout utilisateur disposant
              d’un accès à internet. Les frais liés à la connexion et au
              matériel sont à la charge de l’utilisateur.
            </p>
          </Section>

          <Section id="services" title="3. Services proposés" delay="120ms">
            <ul>
              <li>
                Des <strong>informations</strong> et guides pratiques liés à la
                grossesse et à la petite enfance.
              </li>
              <li>
                Des <strong>documents administratifs</strong> (PDF)
                téléchargeables.
              </li>
              <li>
                Un <strong>formulaire de contact</strong> pour poser des
                questions ou signaler une correction.
              </li>
            </ul>
            <p className="mt-3">
              <span className="font-semibold">Limitation : </span>
              les informations ont un rôle d’aide et de vulgarisation. Elles ne
              remplacent pas les conseils d’un professionnel de santé, d’un
              juriste ou d’une administration.
            </p>
          </Section>

          <Section id="utilisation" title="4. Utilisation du site" delay="150ms">
            <ul>
              <li>Respect des lois et règlements en vigueur.</li>
              <li>
                Interdiction de nuire au bon fonctionnement (spam, tentative
                d’intrusion, etc.).
              </li>
              <li>
                Respect des droits de propriété intellectuelle sur les contenus.
              </li>
            </ul>
          </Section>

          <Section id="propriete" title="5. Propriété intellectuelle" delay="180ms">
            <p>
              Les contenus (textes, visuels, logo {siteName}, mise en page) sont
              la propriété de {siteName} ou utilisés avec autorisation, sauf
              mention contraire. Toute reproduction ou réutilisation sans
              autorisation est interdite.
            </p>
          </Section>

          <Section id="responsabilite" title="6. Responsabilité" delay="210ms">
            <p>
              {siteName} met tout en œuvre pour fournir des informations
              fiables. Néanmoins, {siteName} ne saurait être tenu responsable :
            </p>
            <ul>
              <li>d’erreurs, omissions ou informations obsolètes ;</li>
              <li>
                de l’usage fait des informations ou documents par l’utilisateur ;
              </li>
              <li>
                de dommages indirects liés à l’utilisation ou l’impossibilité
                d’utiliser le site.
              </li>
            </ul>
          </Section>

          <Section id="liens" title="7. Liens externes" delay="240ms">
            <p>
              Le site peut contenir des liens vers des sites tiers (ex. : CAF,
              Service-Public.fr). {siteName} n’exerce aucun contrôle sur ces
              sites et n’assume aucune responsabilité quant à leurs contenus ou
              leur fonctionnement.
            </p>
          </Section>

          <Section id="donnees" title="8. Données personnelles" delay="270ms">
            <p>
              Les données transmises via le formulaire de contact (email, sujet,
              message) sont utilisées uniquement pour traiter la demande. Elles
              ne sont ni revendues, ni utilisées à d’autres fins.
            </p>
            <p className="mt-2">
              Conformément à la législation applicable, vous disposez d’un droit
              d’accès, de rectification et de suppression de vos données. Pour
              exercer ces droits, utilisez la page{" "}
              <Link className="underline" to={contactPath}>
                Contact
              </Link>
              .
            </p>
          </Section>

          <Section id="modifications" title="9. Modifications des CGU" delay="300ms">
            <p>
              {siteName} se réserve le droit de modifier les présentes
              conditions à tout moment. La version applicable est celle publiée
              sur le site à la date de consultation.
            </p>
          </Section>

          <Section id="contact" title="10. Contact" delay="330ms">
            <p>
              Pour toute question relative aux présentes CGU, vous pouvez nous
              écrire via la page{" "}
              <Link className="underline" to={contactPath}>
                Contact
              </Link>
              .
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
