"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { EASE } from "@/lib/motion";

const plans = [
  {
    id: "starter",
    name: "Starter",
    description:
      "Pour les cliniques privées, centres médicaux, petites agences de services, centres de formation et universités avec 1 à 2 guichets.",
    price: "174 900",
    currency: "FBu",
    period: "/ mois",
    capacity: "1 site · jusqu'à 3 guichets",
    tickets: "Jusqu'à 3 000 tickets/mois",
    features: [
      "Queue Engine temps réel",
      "Terminal Guichet (Tauri/React)",
      "Afficheur TV salle d'attente",
      "Statistiques de base",
      "1 site / jusqu'à 3 guichets",
      "Jusqu'à 3 000 tickets/mois",
    ],
    cta: "Demander une démo",
    popular: false,
    badge: null,
  },
  {
    id: "business",
    name: "Business",
    description:
      "Pour les banques régionales, hôpitaux généraux, administrations publiques et réseaux multi-agences.",
    price: "399 000",
    currency: "FBu",
    period: "/ mois",
    capacity: "Jusqu'à 3 sites · 15 guichets inclus",
    tickets: "Jusqu'à 20 000 tickets/mois",
    features: [
      "Tout STARTER inclus",
      "Support multi-agences",
      "Dashboard Analytics avancé",
      "Temps moyen d'attente & perf agents",
      "Notifications SMS / WhatsApp",
      "Mode Offline-first avec sync local",
      "Jusqu'à 3 sites · 15 guichets inclus",
      "Jusqu'à 20 000 tickets/mois",
    ],
    cta: "Parler à l'équipe",
    popular: true,
    badge: "Recommandé",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "Pour les grandes banques commerciales, hôpitaux nationaux, opérateurs télécoms et ministères.",
    price: "699 000",
    currency: "FBu",
    period: "/ mois",
    capacity: "Multi-sites illimité · guichets illimités",
    tickets: "Tickets illimités",
    features: [
      "Tout BUSINESS inclus",
      "Déploiement On-Premise / Hybride dédié",
      "Intégration API & ERP / Core Banking / HIS",
      "SLA garanti 99,9 % + Support 24/7 dédié",
      "Formation et accompagnement sur site",
      "Multi-sites illimité / guichets illimités",
      "Volume de tickets illimité",
    ],
    cta: "Construire une offre",
    popular: false,
    badge: null,
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
              Des prix clairs,
              <span className="font-normal italic text-brand-leaf"> adaptés à votre structure.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[15px] leading-8 text-brand-soil/75">
              Trois plans pensés pour chaque niveau de maturité — de la clinique privée à la grande banque commerciale. Paiement mensuel en Francs Burundais, sans frais cachés.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[28px] border border-brand-forest/12 bg-brand-cream">
          {/* Tab bar */}
          <div
            role="tablist"
            aria-label="Plans tarifaires TONDE"
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
                      {plan.price} {plan.currency}{plan.period}
                    </span>
                  </span>
                  {plan.badge && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] ${
                        isActive ? "bg-brand-sprout text-brand-deep" : "bg-brand-sprout/60 text-brand-deep"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Plan panel */}
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
              {/* Price block */}
              <div className="lg:col-span-5">
                <div className="flex items-end gap-2 leading-none">
                  <span className="font-serif text-[2.6rem] font-bold tracking-tight text-brand-forest sm:text-[3.2rem]">
                    {active.price}
                  </span>
                  <span className="mb-1.5 text-lg font-semibold text-brand-forest/70">
                    {active.currency}
                  </span>
                  <span className="mb-1.5 text-sm text-brand-soil/50">{active.period}</span>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-leaf">
                    {active.capacity}
                  </p>
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-soil/50">
                    {active.tickets}
                  </p>
                </div>

                <p className="mt-6 text-[15px] leading-8 text-brand-soil/85">{active.description}</p>

                <a href="#contact" className="btn btn-primary mt-8 w-full sm:w-auto">
                  {active.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Features list */}
              <div className="lg:col-span-7 lg:border-l lg:border-brand-forest/12 lg:pl-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-soil/45">
                  Fonctionnalités incluses
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

        {/* Disclaimer */}
        <p className="mt-6 text-center text-[12px] text-brand-soil/45">
          Tous les prix sont exprimés en Francs Burundais (FBu) · TVA applicable selon la réglementation en vigueur ·{" "}
          <a href="#contact" className="underline hover:text-brand-forest transition-colors">
            Contactez-nous
          </a>{" "}
          pour un devis personnalisé
        </p>
      </div>
    </section>
  );
}
