import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";

const columns = [
  {
    title: "Produit",
    links: [
      { label: "Le problème", href: "#product" },
      { label: "Écosystème", href: "#ecosystem" },
      { label: "Signaux terrain", href: "#voices" },
      { label: "Tarifs", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Institutions",
    links: [
      { label: "Banques & microfinance", href: "#ecosystem" },
      { label: "Hôpitaux & cliniques", href: "#ecosystem" },
      { label: "Administrations", href: "#ecosystem" },
      { label: "Réseaux multi-agences", href: "#pricing" },
    ],
  },
];

export function FooterSection() {
  return (
    <footer className="border-t border-brand-forest/12 bg-brand-canvas">
      <div className="section-shell">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-5">
            <a href="#top" className="inline-flex items-center gap-3">
              <img
                src="/assets/logo/Glossy%20Blue%20Circuit%20Network%20Icon.png"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl object-cover"
                aria-hidden="true"
              />
              <span className="font-serif text-[2rem] font-semibold leading-none tracking-tight text-brand-deep">
                TONDE
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-brand-leaf">
                Queue intelligence
              </span>
            </a>

            <p className="mt-6 max-w-sm text-sm leading-7 text-brand-soil/70">
              TONDE transforme le chaos de l’attente en une expérience de dignité pour les institutions
              africaines modernes.
            </p>

            <a
              href="mailto:contact@tonde.app"
              className="link-underline mt-6 inline-flex text-sm font-semibold text-brand-forest"
            >
              contact@tonde.app
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-soil/45">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-brand-soil/75 transition-colors hover:text-brand-forest"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-soil/45">
              Contact
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="#contact"
                  className="text-sm text-brand-soil/75 transition-colors hover:text-brand-forest"
                >
                  Demander une démo
                </a>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-brand-soil/75 transition-colors hover:text-brand-forest"
                >
                  Espace administration
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@tonde.app?subject=Partenariat%20TONDE"
                  className="text-sm text-brand-soil/75 transition-colors hover:text-brand-forest"
                >
                  Partenariat
                </a>
              </li>
            </ul>

            <a
              href="#top"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-forest/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-forest transition-colors hover:border-brand-forest hover:bg-brand-forest hover:text-white"
            >
              Retour en haut
              <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-brand-forest/12 py-7 text-[12px] text-brand-soil/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} TONDE. Tous droits réservés.</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Burundi · RDC · Afrique de l’Est & Centrale
          </p>
          <p className="text-[11px]">Pages légales publiées avant mise en production.</p>
        </div>
      </div>
    </footer>
  );
}
