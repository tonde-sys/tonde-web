"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import { EASE, Reveal, VIEWPORT_ONCE } from "@/lib/motion";

const signals = [
  {
    persona: "Direction banque",
    title: "Réduire l'attrition en agence",
    quote:
      "Nous voulons rendre l'accueil plus lisible, réduire les abandons et protéger la valeur de chaque visite client.",
    mockup: "/assets/mockups/admin-dashboard-concept.svg",
    mockupAlt: "Dashboard admin TONDE — vue multi-agences",
  },
  {
    persona: "Management hôpital",
    title: "Organiser les flux sans alourdir le terrain",
    quote:
      "Nous avons besoin d'un système qui fluidifie l'orientation et l'attente sans ajouter de complexité aux équipes.",
    mockup: "/assets/mockups/mobile-app-concept.svg",
    mockupAlt: "Application mobile TONDE — suivi de ticket",
  },
  {
    persona: "Direction de réseau",
    title: "Piloter plusieurs sites avec des indicateurs fiables",
    quote:
      "Le vrai besoin est d'obtenir une lecture temps réel du réseau, avec des rapports exploitables pour la direction.",
    mockup: "/assets/mockups/desktop-guichet-concept.svg",
    mockupAlt: "Terminal guichet TONDE — vue agent",
  },
];

export function VoicesSection() {
  return (
    <section id="voices" className="grain relative overflow-hidden bg-brand-deep text-white">
      <div className="section-shell section-space relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Colonne gauche */}
          <div className="lg:col-span-5">
            <span className="kicker kicker-light">
              <span className="kicker-number">04</span>
              Signaux terrain
            </span>

            <h2 className="display-lg mt-6 text-white">
              Les décideurs n'achètent pas un écran.
              <span className="font-normal italic text-brand-light"> Ils achètent de la clarté.</span>
            </h2>

            <p className="mt-6 max-w-md text-[15px] leading-8 text-white/70">
              Ce que les directions demandent d'abord n'est pas une fonctionnalité : c'est une lecture fiable de
              ce qui se passe dans leur salle d'attente, à l'instant où cela se passe.
            </p>

            <div className="relative mt-10 max-w-sm overflow-hidden rounded-[26px] border border-white/12">
              <img
                src="/assets/editorial/voix-agent.webp"
                alt="Portrait d'une agente d'accueil en blazer vert dans le hall lumineux d'une agence"
                width={1100}
                height={1290}
                loading="lazy"
                className="h-[320px] w-full object-cover object-top sm:h-[380px]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(10,14,26,.92),transparent)] p-5">
                <p className="font-serif text-lg italic leading-snug text-white/90">
                  &laquo; Votre temps a de la valeur. TONDE le respecte. &raquo;
                </p>
              </div>
            </div>
          </div>

          {/* Colonne droite — signals avec mockup en fond */}
          <div className="lg:col-span-7">
            <ul className="flex flex-col gap-4">
              {signals.map((item, index) => (
                <motion.li
                  key={item.persona}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
                  className="relative overflow-hidden rounded-2xl border border-white/10"
                >
                  {/* Mockup de fond */}
                  <img
                    src={item.mockup}
                    alt={item.mockupAlt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-left-top opacity-20"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,14,26,0.96)_0%,rgba(10,14,26,0.80)_100%)]" />

                  {/* Contenu */}
                  <div className="relative z-10 p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-sprout">
                        {item.persona}
                      </span>
                      <Quote className="h-4 w-4 text-white/25" aria-hidden="true" />
                    </div>

                    <h3 className="mt-4 text-[1.2rem] font-semibold leading-snug text-white">{item.title}</h3>

                    <p className="mt-3 max-w-xl font-serif text-[1.1rem] font-semibold leading-relaxed text-brand-light/85">
                      &laquo; {item.quote} &raquo;
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <Reveal className="mt-6 border-t border-white/12 pt-5">
              <p className="max-w-xl text-[13px] leading-7 text-white/45">
                Ces formulations représentent des attentes typiques du marché ciblé, pas des témoignages clients
                déjà signés.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
