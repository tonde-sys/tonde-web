"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, MapPin, Pause, Play, Ticket } from "lucide-react";

import { HeroIllustration } from "@/components/landing/hero-illustration";
import { EASE } from "@/lib/motion";

const AUTOPLAY_DELAY = 7000;

type Slide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: [string, string];
  description: string;
  chapter: string;
  tag: string;
};

const slides: Slide[] = [
  {
    image: "/assets/editorial/hero-agence.webp",
    alt: "Salle d’attente bondée d’une institution de santé, des usagers assis sur des bancs en bois attendant leur tour devant un tableau d’affichage lumineux",
    eyebrow: "Chapitre 01 — L’attente",
    title: ["L’attente n’est pas", "une fatalité"],
    description:
      "Chaque jour, des institutions accueillent des milliers de personnes sans savoir combien attendent, ni combien renoncent. TONDE rend ce flux lisible, du premier ticket au dernier appel.",
    chapter: "22 % des usagers abandonnent la file avant d’être servis.",
    tag: "Salle d’attente",
  },
  {
    image: "/assets/editorial/hero-guichet.webp",
    alt: "Vue par-dessus l’épaule d’un agent de guichet travaillant au clavier, un usager présentant des documents sur le comptoir",
    eyebrow: "Chapitre 02 — Le guichet",
    title: ["Le guichet retrouve", "son rythme"],
    description:
      "Appel du ticket, priorisation, continuité de service : l’agent travaille au clavier, sans friction, même quand le réseau vacille. Le poste est pensé pour la vitesse d’exécution, pas pour la démonstration.",
    chapter: "Une file pilotée vaut mieux qu’une file subie.",
    tag: "Poste agent",
  },
  {
    image: "/assets/editorial/hero-hopital.webp",
    alt: "Patiente assise dans une salle d’attente d’hôpital, un ticket à la main, regardant l’écran mural qui affiche les appels",
    eyebrow: "Chapitre 03 — L’usager",
    title: ["Chacun sait", "quand vient son tour"],
    description:
      "Le ticket se prend depuis le mobile, la position se suit en direct, l’écran de salle confirme l’appel. L’incertitude disparaît, et avec elle une partie de la tension.",
    chapter: "Réduire l’incertitude, c’est déjà réduire l’attente.",
    tag: "Parcours usager",
  },
];

export function HeroSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isPaused = paused || focusPaused;

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > active ? 1 : -1);
      setActive((index + slides.length) % slides.length);
    },
    [active]
  );

  const next = useCallback(() => {
    setDirection(1);
    setActive((current) => (current + 1) % slides.length);
  }, []);

  const previous = useCallback(() => {
    setDirection(-1);
    setActive((current) => (current - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion) return;
    const timer = window.setTimeout(next, AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [active, next, isPaused, reduceMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    const node = heroRef.current;
    node?.addEventListener("keydown", onKeyDown);
    return () => node?.removeEventListener("keydown", onKeyDown);
  }, [next, previous]);

  const slide = slides[active];

  return (
    <section
      id="top"
      ref={heroRef}
      className="grain relative min-h-[100svh] overflow-hidden bg-brand-deep text-white"
      aria-roledescription="carousel"
      aria-label="Scènes de l’attente dans les institutions"
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={() => setFocusPaused(false)}
    >
      <motion.div className="absolute inset-0" style={{ scale: reduceMotion ? 1 : backgroundScale }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            initial={{ clipPath: direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0%)" }}
            exit={{ opacity: 0.7 }}
            transition={{
              clipPath: { duration: reduceMotion ? 0 : 1.15, ease: EASE },
              opacity: { duration: 0.8 },
            }}
            className="absolute inset-0"
          >
            <motion.img
              src={slide.image}
              alt={slide.alt}
              width={1920}
              height={1180}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 7, ease: "linear" }}
              className="h-full w-full object-cover"
              fetchPriority={active === 0 ? "high" : "auto"}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,26,.95)_0%,rgba(10,14,26,.78)_44%,rgba(10,14,26,.2)_80%,rgba(10,14,26,.36)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,14,26,.96)_0%,transparent_46%,rgba(10,14,26,.38)_100%)]" />
      {/* Sous lg, le texte occupe toute la largeur : le dégradé horizontal ne protège plus
          la fin des lignes longues. On ajoute un voile uniforme pour garantir le contraste. */}
      <div className="absolute inset-0 bg-[rgba(10,14,26,0.42)] lg:hidden" aria-hidden="true" />
      <div className="hero-grid absolute inset-0 opacity-25" aria-hidden="true" />

      <motion.div
        style={{ y: reduceMotion ? 0 : contentY, opacity: reduceMotion ? 1 : contentOpacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1440px] flex-col px-5 pb-44 pt-28 sm:px-8 sm:pb-40 sm:pt-32 lg:px-12 lg:pb-36 lg:pt-36"
      >
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="mb-auto flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/65"
        >
          <span className="inline-flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-sprout opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-sprout" />
            </span>
            Infrastructure en cours de déploiement
          </span>
          <span className="hidden items-center gap-2 sm:inline-flex">
            <MapPin className="h-3.5 w-3.5 text-brand-sprout" />
            Burundi · RDC · Afrique de l’Est
          </span>
        </motion.div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-12 lg:py-8">
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                aria-live="polite"
              >
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-sprout sm:text-[11px]"
                >
                  <Ticket className="h-4 w-4" />
                  {slide.eyebrow}
                </motion.div>

                <h1 className="hero-title max-w-[1050px] text-white">
                  {slide.title.map((line, index) => (
                    <span key={line} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
                      <motion.span
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: reduceMotion ? 0 : 0.85, delay: index * 0.1, ease: EASE }}
                        className={`block ${index === 1 ? "font-normal italic text-brand-light" : ""}`}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                  className="mt-6 max-w-xl text-sm font-light leading-7 text-white/85 sm:text-base sm:leading-8"
                >
                  {slide.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <motion.a
                href="#contact"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-accent group"
              >
                Demander une démo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                href="#ecosystem"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-ghost-light"
              >
                Voir l’écosystème
              </motion.a>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
            className="mx-auto w-full max-w-[420px] lg:col-span-5 lg:col-start-8 lg:mx-0 lg:max-w-none xl:col-span-4 xl:col-start-9"
          >
            <HeroIllustration />

            <div className="mt-5 border-l border-brand-sprout/70 bg-[rgba(10,14,26,0.55)] py-3 pl-5 pr-4 backdrop-blur-[3px]">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-sprout">
                {slide.tag}
              </span>
              <AnimatePresence mode="wait">
                <motion.p
                  key={slide.chapter}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-2 text-base italic leading-snug text-white/85"
                >
                  {slide.chapter}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.aside>
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/18 bg-brand-deep/25 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 sm:px-8 sm:py-5 lg:grid-cols-[1fr_auto_1fr] lg:px-12">
          <div className="flex items-center gap-4 sm:gap-7">
            <div className="flex items-baseline gap-2 font-serif">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  className="text-2xl text-brand-light"
                >
                  0{active + 1}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm text-white/40">/ 0{slides.length}</span>
            </div>

            <div className="hidden gap-2 sm:flex" role="tablist" aria-label="Choisir une scène">
              {slides.map((item, index) => (
                <button
                  key={item.tag}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  aria-label={`Scène ${index + 1} : ${item.tag}`}
                  onClick={() => goTo(index)}
                  className="group relative h-8 w-12 overflow-hidden"
                >
                  <span
                    className={`absolute inset-x-0 top-1/2 h-px transition-colors ${
                      active === index ? "bg-white/30" : "bg-white/20 group-hover:bg-white/50"
                    }`}
                  />
                  {active === index && (
                    <span
                      key={`${active}-${isPaused}`}
                      className="carousel-progress absolute inset-x-0 top-1/2 h-[2px] origin-left bg-brand-sprout"
                      style={{
                        animationDuration: `${AUTOPLAY_DELAY}ms`,
                        animationPlayState: isPaused || reduceMotion ? "paused" : "running",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <a
            href="#product"
            className="group hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white lg:flex"
          >
            Comprendre le problème
            <motion.span
              animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="h-4 w-4 text-brand-sprout" />
            </motion.span>
          </a>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white sm:flex"
              aria-label={paused ? "Relancer le carousel" : "Mettre le carousel en pause"}
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
            <button type="button" onClick={previous} className="hero-control" aria-label="Scène précédente">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={next} className="hero-control" aria-label="Scène suivante">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
