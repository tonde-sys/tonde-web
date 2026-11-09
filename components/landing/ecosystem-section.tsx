"use client";

import { ArrowRight } from "lucide-react";

import { Reveal } from "@/lib/motion";

type Interface = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefit: string;
  asset: string;
  alt: string;
};

const interfaces: Interface[] = [
  {
    id: "01",
    title: "App mobile",
    subtitle: "Prise de ticket en trois gestes",
    description:
      "L’usager prend son ticket, suit sa position et reçoit les mises à jour sans rester physiquement bloqué sur place.",
    benefit: "Réduit l’incertitude et fluidifie l’arrivée sur site.",
    asset: "/assets/mockups/mobile-app-concept.svg",
    alt: "Maquette conceptuelle de l’application mobile TONDE affichant un ticket et la position dans la file",
  },
  {
    id: "02",
    title: "Poste guichet",
    subtitle: "Interface pilotée au clavier",
    description:
      "Le poste agent privilégie la vitesse d’exécution : appel du ticket, priorisation et continuité de service, sans détour.",
    benefit: "Réduit la friction opérationnelle pour les équipes terrain.",
    asset: "/assets/mockups/desktop-guichet-concept.svg",
    alt: "Maquette conceptuelle du poste guichet TONDE avec file d’attente et appel du ticket suivant",
  },
  {
    id: "03",
    title: "Écran de salle",
    subtitle: "Lisibilité à dix mètres",
    description:
      "L’affichage de salle d’attente rend les appels visibles instantanément, dans un format pensé pour les espaces à forte affluence.",
    benefit: "Rend la salle d’attente plus calme et plus compréhensible.",
    asset: "/assets/mockups/tv-display-concept.svg",
    alt: "Maquette conceptuelle de l’écran d’affichage TONDE en salle d’attente",
  },
  {
    id: "04",
    title: "Dashboard admin",
    subtitle: "KPIs temps réel et exports",
    description:
      "La direction suit l’affluence, les temps moyens, les abandons et la performance multi-sites depuis une vue consolidée.",
    benefit: "Transforme l’accueil en sujet mesurable et pilotable.",
    asset: "/assets/mockups/admin-dashboard-concept.svg",
    alt: "Maquette conceptuelle du dashboard administrateur TONDE avec indicateurs et graphiques",
  },
];

function InterfaceCard({ item }: { item: Interface }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[26px] border border-brand-forest/12 bg-brand-cream">
      <div className="bg-brand-deep p-3">
        <img
          src={item.asset}
          alt={item.alt}
          loading="lazy"
          className="h-[190px] w-full rounded-[16px] object-contain sm:h-[210px]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="kicker-number text-brand-leaf">{item.id}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-soil/45">
            Interface
          </span>
        </div>

        <h3 className="mt-3 text-[1.4rem] font-semibold leading-snug text-brand-deep">{item.title}</h3>
        <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand-leaf">
          {item.subtitle}
        </p>
        <p className="mt-4 text-sm leading-7 text-brand-soil/70">{item.description}</p>

        <div className="mt-auto border-t border-brand-forest/12 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-soil/45">
            Impact décisionnel
          </p>
          <p className="mt-2 text-sm leading-6 text-brand-soil/85">{item.benefit}</p>
        </div>
      </div>
    </article>
  );
}

export function EcosystemSection() {
  return (
    <section id="ecosystem" className="relative bg-brand-canvas">
      <div className="section-shell pt-[clamp(5.5rem,9vw,9rem)] pb-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="kicker">
              <span className="kicker-number">03</span>
              L’écosystème
            </span>
            <h2 className="display-lg mt-6 text-brand-deep">
              Quatre interfaces,
              <span className="font-normal italic text-brand-leaf"> un seul moteur.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[15px] leading-8 text-brand-soil/75">
              TONDE relie l’expérience usager, l’exécution terrain, l’affichage public et le pilotage de
              direction dans une seule architecture. Aucune interface ne travaille sur une copie des données.
            </p>
            <a href="#pricing" className="link-underline mt-6 inline-flex text-[11px] font-bold uppercase tracking-[0.18em] text-brand-forest">
              Voir les cadres commerciaux
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="section-shell grid gap-6 pb-[clamp(5.5rem,9vw,9rem)] sm:grid-cols-2">
        {interfaces.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.06} className="h-full">
            <InterfaceCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
