"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Mail } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export function CtaSection() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!isValid) {
      setState("error");
      setMessage("Vérifiez l’adresse e-mail saisie.");
      return;
    }
    if (!consent) {
      setState("error");
      setMessage("Merci de cocher le consentement pour continuer.");
      return;
    }

    setState("loading");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setState("success");
    setMessage("Merci. Votre adresse est prête à être enregistrée dès l’activation du service.");
  };

  return (
    <section id="contact" className="grain relative overflow-hidden bg-brand-deep text-white">
      <div className="hero-grid absolute inset-0 opacity-10" aria-hidden="true" />
      <div className="section-shell section-space relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="kicker kicker-light">
              <span className="kicker-number">07</span>
              Prochaine étape
            </span>

            <h2 className="display-xl mt-6 max-w-2xl text-white">
              Prêt à transformer l’accueil en une expérience
              <span className="font-normal italic text-brand-light"> digne et mesurable ?</span>
            </h2>

            <p className="mt-6 max-w-xl text-[15px] leading-8 text-white/70">
              TONDE aide les institutions à reprendre le contrôle de l’attente avec une approche moderne, fiable
              et pensée pour les réalités du terrain.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href="mailto:contact@tonde.app?subject=Demande%20de%20d%C3%A9mo%20TONDE"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-accent group"
              >
                Demander une démo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                href="#pricing"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-ghost-light"
              >
                Revoir les tarifs
              </motion.a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[26px] border border-white/14 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-3 text-brand-sprout">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
                  Rester informé
                </span>
              </div>

              <p className="mt-4 font-serif text-[1.4rem] font-semibold leading-snug text-white">
                Recevez l’ouverture du pilote et les notes produit.
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-6">
                <label htmlFor="newsletter-email" className="block text-[12px] font-semibold text-white/70">
                  Adresse e-mail professionnelle
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (state === "error") setState("idle");
                  }}
                  placeholder="vous@institution.bi"
                  aria-invalid={state === "error"}
                  aria-describedby="newsletter-status"
                  className="field mt-2 !border-white/20 !bg-white/95"
                  disabled={state === "loading"}
                />

                <label htmlFor="newsletter-consent" className="mt-4 flex cursor-pointer items-start gap-3">
                  <input
                    id="newsletter-consent"
                    name="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      if (state === "error") setState("idle");
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-brand-sprout"
                    disabled={state === "loading"}
                  />
                  <span className="text-[12px] leading-6 text-white/60">
                    J’accepte d’être contacté au sujet de TONDE. Aucune donnée n’est revendue.
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn btn-accent mt-5 w-full"
                  disabled={state === "loading"}
                  aria-busy={state === "loading"}
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Envoi en cours…
                    </>
                  ) : state === "success" ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Demande prête
                    </>
                  ) : (
                    <>
                      Recevoir les nouvelles
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>

                <p
                  id="newsletter-status"
                  role="status"
                  aria-live="polite"
                  className={`mt-4 min-h-[20px] text-[12px] leading-6 ${
                    state === "error" ? "text-[#fda4af]" : "text-brand-sprout"
                  }`}
                >
                  {message}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/35">
                  Démonstration : le formulaire valide la saisie mais n’envoie encore aucune donnée à un serveur.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
