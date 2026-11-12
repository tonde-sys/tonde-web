"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Clock, ShieldCheck, WifiOff } from "lucide-react";

import { EASE, Reveal, VIEWPORT_ONCE } from "@/lib/motion";

const steps = [
  {
    step: "01",
    title: "Prendre son ticket",
    body: "Depuis le mobile ou le bornier d’accueil, en trois gestes. Le service et la priorité sont choisis dès le départ.",
  },
  {
    step: "02",
    title: "Suivre sa position",
    body: "Le temps d’attente estimé se met à jour en continu. L’usager peut s’éloigner sans perdre sa place.",
  },
  {
    step: "03",
    title: "Être appelé",
    body: "Le guichet appelle, l’écran de salle confirme, le dossier arrive côté agent. Aucun relais manuel.",
  },
];

const guarantees = [
  {
    icon: Clock,
    title: "Temps réel",
    value: "< 100 ms",
    body: "Propagation quasi instantanée des mises à jour entre mobile, guichet, écran de salle et dashboard.",
  },
  {
    icon: WifiOff,
    title: "Offline-first",
    value: "Résilient",
    body: "Le service continue malgré les coupures réseau grâce au cache local, puis se resynchronise au retour du signal.",
  },
  {
    icon: ShieldCheck,
    title: "Cloisonnement",
    value: "RLS",
    body: "Chaque institution reste isolée : PostgreSQL et Row Level Security empêchent tout mélange de données.",
  },
];

export function ProofScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section className="bg-brand-canvas">
      <div ref={ref} className="relative overflow-hidden bg-brand-deep">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          <motion.img
            src="/assets/editorial/Gemini_Generated_Image_wgk2xwwgk2xwwgk2.jpg"
            alt="Un usager consulte son téléphone sur le trottoir devant une agence, dans une rue animée"
            style={{ y: reduceMotion ? 0 : imageY }}
            className="absolute inset-x-0 -inset-y-[10%] h-[120%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,26,.94)_0%,rgba(10,14,26,.62)_52%,rgba(10,14,26,.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,14,26,.9)_0%,transparent_58%)]" />
          <div className="grain absolute inset-0" aria-hidden="true" />

          <div className="section-shell relative z-10 flex h-full flex-col justify-end pb-14 pt-28">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.85, ease: EASE }}
              className="max-w-2xl"
            >
              <span className="kicker kicker-light">
                <span className="kicker-number">02</span>
                Le parcours
              </span>
              <h2 className="display-lg mt-6 text-white">
                De la porte d’entrée au guichet,
                <span className="font-normal italic text-brand-light"> un seul fil.</span>
              </h2>
              <p className="mt-6 max-w-xl text-[15px] leading-8 text-white/75">
                Un ticket pris sur mobile, un agent qui appelle, un écran qui confirme : la même information
                circule partout, à la même seconde. C’est ce fil continu qui transforme l’attente en file
                organisée.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="section-shell -mt-10 pb-4">
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-brand-forest/12 bg-brand-forest/12 md:grid-cols-3">
          {steps.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.08} className="bg-brand-cream p-7 lg:p-9">
              <span className="kicker-number text-brand-leaf">{item.step}</span>
              <h3 className="mt-4 text-[1.3rem] font-semibold leading-snug text-brand-deep">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-soil/70">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="section-shell pb-[clamp(5rem,8vw,8rem)] pt-16">
        <div className="grid gap-10 border-t border-brand-forest/15 pt-12 md:grid-cols-3 md:gap-8">
          {guarantees.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.07}>
                <div className="flex items-center gap-3 text-brand-leaf">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em]">{item.title}</span>
                </div>
                <p className="mt-4 font-serif text-[2.1rem] font-semibold leading-none text-brand-forest">
                  {item.value}
                </p>
                <p className="mt-4 max-w-xs text-sm leading-7 text-brand-soil/70">{item.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
