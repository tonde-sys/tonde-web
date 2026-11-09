"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { EASE } from "@/lib/motion";

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Pour les agences individuelles qui veulent structurer rapidement l’accueil.",
    commercialModel: "Pilote cadré",
    features: [
      "Déploiement site unique",
      "Mise en file standard",
      "Suivi des tickets en temps réel",
      "Accompagnement de démarrage",
    ],
    cta: "Demander une démo",
    popular: false,
  },
  {
    id: "business",
    name: "Business",
    description:
      "Pour les institutions qui veulent réconciliation Mobile Money et rapports avancés.",
    commercialModel: "Sur étude",
    features: [
      "Réconciliation Mobile Money",
      "Rapports avancés",
      "Supervision multi-services",
      "KPIs temps réel pour le management",
    ],
    cta: "Parler à l’équipe",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "Pour les réseaux multi-agences avec exigences fortes de pilotage et d’intégration.",
    commercialModel: "Sur mesure",
    features: [
      "Déploiement multi-agences",
      "Analytics prédictifs à terme",
      "Support dédié",
      "Cadrage et accompagnement sur mesure",
    ],
    cta: "Construire une offre",
    popular: false,
  },
];

export function PricingSection() {
  const [activeId, setActiveId] = useState(plans[1].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = plans.find((plan) => plan.id === activeId) ?? plans[0];
  const activeIndex = plans.findIndex((plan) => plan.id === activeId);

  const move = (direction: number) => {
    const nextIndex = (activeIndex + direction + plans.length) % plans.length;
    setActiveId(plans[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section id="pricing" className="section-space bg-brand-canvas">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="kicker">
              <span className="kicker-number">05</span>
              Tarification
            </span>
            <h2 className="display-lg mt-6 text-brand-deep">
              Trois cadres commerciaux,
              <span className="font-normal italic text-brand-leaf"> aucun prix inventé.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[15px] leading-8 text-brand-soil/75">
              Les montants finaux dépendent du périmètre, du nombre de sites, du niveau d’accompagnement et des
              intégrations attendues. Choisissez le cadre qui correspond à votre maturité.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[28px] border border-brand-forest/12 bg-brand-cream">
          <div
            role="tablist"
            aria-label="Cadres commerciaux TONDE"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                move(1);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                move(-1);
              }
            }}
            className="flex flex-col border-b border-brand-forest/12 sm:flex-row"
          >
            {plans.map((plan, index) => {
              const isActive = plan.id === activeId;
              return (
                <button
                  key={plan.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`plan-tab-${plan.id}`}
                  aria-selected={isActive}
                  aria-controls={`plan-panel-${plan.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(plan.id)}
                  className={`relative flex flex-1 items-center justify-between gap-3 px-6 py-5 text-left transition-colors duration-300 sm:px-8 ${
                    isActive ? "bg-brand-forest text-white" : "text-brand-soil/70 hover:bg-brand-forest/5"
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="font-serif text-xl font-semibold leading-none">{plan.name}</span>
                    <span
                      className={`mt-2 text-[10px] font-bold uppercase tracking-[0.2em] ${
                        isActive ? "text-brand-sprout" : "text-brand-soil/45"
                      }`}
                    >
                      {plan.commercialModel}
                    </span>
                  </span>
                  {plan.popular && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] ${
                        isActive ? "bg-brand-sprout text-brand-deep" : "bg-brand-sprout/60 text-brand-deep"
                      }`}
                    >
                      Recommandé
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              id={`plan-panel-${active.id}`}
              role="tabpanel"
              aria-labelledby={`plan-tab-${active.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid gap-10 p-6 sm:p-9 lg:grid-cols-12 lg:gap-12 lg:p-12"
            >
              <div className="lg:col-span-5">
                <p className="font-serif text-[2.4rem] font-semibold leading-none tracking-tight text-brand-forest sm:text-[3rem]">
                  {active.commercialModel}
                </p>
                <p className="mt-4 text-sm leading-7 text-brand-soil/70">
                  Modèle commercial adapté au niveau de maturité du projet.
                </p>
                <p className="mt-8 text-[15px] leading-8 text-brand-soil/85">{active.description}</p>

                <a href="#contact" className="btn btn-primary mt-8 w-full sm:w-auto">
                  {active.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="lg:col-span-7 lg:border-l lg:border-brand-forest/12 lg:pl-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-soil/45">
                  Ce que couvre ce cadre
                </p>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {active.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-sprout text-brand-deep">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <span className="text-sm leading-7 text-brand-soil/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
