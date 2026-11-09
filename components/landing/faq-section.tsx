"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { EASE } from "@/lib/motion";

const faqs = [
  {
    question: "Les applications TONDE sont-elles déjà disponibles ?",
    answer:
      "Pas encore. La landing présente des maquettes conceptuelles remplaçables pendant que les applications mobile, guichet, écran de salle et administration sont en développement.",
  },
  {
    question: "TONDE est-il adapté aux coupures internet fréquentes ?",
    answer:
      "Oui. L’architecture cible met en avant une logique offline-first avec cache local et resynchronisation à la reconnexion : le guichet continue de servir même quand le réseau tombe.",
  },
  {
    question: "Le système est-il pensé pour les banques et les hôpitaux ?",
    answer:
      "Oui. Le positionnement cible prioritairement les institutions à forte affluence, en particulier les banques, les hôpitaux et les services structurés accueillant du public.",
  },
  {
    question: "Comment les données sont-elles séparées entre institutions ?",
    answer:
      "TONDE met en avant un cloisonnement fort par institution avec PostgreSQL, Row Level Security et contrôle d’accès par rôles. Aucune requête ne traverse le périmètre d’une organisation.",
  },
  {
    question: "La direction peut-elle obtenir des rapports ?",
    answer:
      "Oui. Le dashboard admin est conçu pour fournir des KPIs temps réel ainsi que des exports Excel et PDF pour le pilotage et le reporting interne.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-space border-t border-brand-forest/12 bg-brand-cream">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="kicker">
              <span className="kicker-number">06</span>
              Questions
            </span>
            <h2 className="display-lg mt-6 text-brand-deep">
              Réponses rapides
              <span className="font-normal italic text-brand-leaf"> aux questions de direction.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-8 text-brand-soil/70">
              Ce qui revient le plus souvent en rendez-vous : disponibilité réelle du produit, résilience réseau
              et séparation des données.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-brand-forest/15">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <li key={item.question} className="border-b border-brand-forest/15">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-button-${index}`}
                        className="flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span className="font-serif text-[1.2rem] font-semibold leading-snug text-brand-deep sm:text-[1.35rem]">
                          {item.question}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-forest/20 text-brand-forest"
                          aria-hidden="true"
                        >
                          <Plus className="h-4 w-4" />
                        </motion.span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          id={`faq-panel-${index}`}
                          role="region"
                          aria-labelledby={`faq-button-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 pr-10 text-sm leading-8 text-brand-soil/75">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
