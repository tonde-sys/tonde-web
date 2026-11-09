"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

import { AnimatedNumber, EASE, Reveal, VIEWPORT_ONCE } from "@/lib/motion";

const impacts = [
  {
    title: "Pertes de revenus",
    body: "Chaque abandon de file ou délai excessif réduit la conversion commerciale et détériore la valeur de chaque visite en agence.",
  },
  {
    title: "Stress cognitif",
    body: "Quand l’usager ne sait ni quand il passera ni où aller, l’attente devient une source d’anxiété et de tensions.",
  },
  {
    title: "Surcharge opérationnelle",
    body: "Sans priorisation claire ni visibilité temps réel, les équipes subissent les pics d’affluence au lieu de les orchestrer.",
  },
  {
    title: "Image institutionnelle",
    body: "Une expérience d’accueil confuse affaiblit la confiance accordée à la banque, à l’hôpital ou à l’administration.",
  },
];

export function ManifestoSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="product" className="section-space relative bg-brand-canvas">
      <div className="section-shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <span className="kicker">
                <span className="kicker-number">01</span>
                Le problème
              </span>

              <h2 className="display-lg mt-6 text-brand-deep">
                La réalité de l’attente ne coûte pas seulement
                <span className="font-normal italic text-brand-leaf"> du temps.</span>
              </h2>

              <p className="mt-6 max-w-md text-[15px] leading-8 text-brand-soil/75">
                Elle détruit de la clarté, fait monter la pression sur les équipes, pousse des usagers à
                abandonner la file et affaiblit la performance des institutions. TONDE part de cette réalité
                africaine concrète, pas d’un modèle importé.
              </p>

              <div className="mt-10 border-t border-brand-forest/15 pt-8">
                <div className="flex items-end gap-3">
                  <AnimatedNumber
                    value={22}
                    suffix=" %"
                    className="font-serif text-[clamp(3.5rem,7vw,5.5rem)] font-semibold leading-none tracking-tight text-brand-forest"
                  />
                  <ArrowDownRight className="mb-3 h-6 w-6 text-brand-leaf" aria-hidden="true" />
                </div>
                <p className="mt-4 max-w-sm text-sm leading-7 text-brand-soil/70">
                  des usagers abandonnent la file avant d’être servis en Afrique subsaharienne.
                </p>
                <p className="mt-5 max-w-sm border-l-2 border-brand-sprout pl-4 text-sm leading-7 text-brand-soil/80">
                  Une file mal pilotée n’est pas un simple irritant : c’est une perte de revenus, une source de
                  surcharge terrain et un signal négatif envoyé à chaque visiteur.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul className="flex flex-col">
              {impacts.map((item, index) => (
                <motion.li
                  key={item.title}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.7, delay: index * 0.07, ease: EASE }}
                  className="group border-t border-brand-forest/15 py-8 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-start gap-5">
                    <span className="kicker-number mt-1 shrink-0 text-brand-leaf">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-[1.35rem] font-semibold leading-snug text-brand-deep">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-brand-soil/70">{item.body}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>

            <Reveal className="mt-4">
              <p className="text-[15px] leading-8 text-brand-soil/80">
                Ces quatre pertes se cumulent dans la même salle d’attente. Les traiter séparément ne règle
                rien ; c’est le flux entier qu’il faut rendre lisible.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
