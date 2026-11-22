"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  Zap,
  LayoutDashboard,
  Smartphone,
  Monitor,
  Tv2,
  Building2,
  HeartPulse,
  Landmark,
  GraduationCap,
  BookOpen,
  Users,
} from "lucide-react";

import { EASE } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface SubItem {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  sub?: SubItem[];
}

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  {
    id: "solutions",
    label: "Solutions",
    href: "#product",
    sub: [
      {
        label: "Queue Engine",
        description: "Moteur de files d'attente temps réel",
        href: "#product",
        icon: Zap,
      },
      {
        label: "Dashboard Web",
        description: "Supervision et analytiques pour les managers",
        href: "#product",
        icon: LayoutDashboard,
      },
      {
        label: "Application Mobile",
        description: "Ticket dématérialisé pour les clients",
        href: "#product",
        icon: Smartphone,
      },
      {
        label: "Terminal Guichet",
        description: "Interface desktop pour les agents",
        href: "#product",
        icon: Monitor,
      },
    ],
  },
  {
    id: "produits",
    label: "Produits",
    href: "#ecosystem",
    sub: [
      {
        label: "Web Admin",
        description: "Pilotage multi-agences en temps réel",
        href: "#ecosystem",
        icon: LayoutDashboard,
      },
      {
        label: "App Mobile Client",
        description: "Ticket et suivi de file depuis son téléphone",
        href: "#ecosystem",
        icon: Smartphone,
      },
      {
        label: "Guichet Desktop",
        description: "Outil de combat pour les agents de guichet",
        href: "#ecosystem",
        icon: Monitor,
      },
      {
        label: "Afficheur TV",
        description: "Écran salle d'attente, plug & play",
        href: "#ecosystem",
        icon: Tv2,
      },
    ],
  },
  {
    id: "secteurs",
    label: "Secteurs",
    href: "#voices",
    sub: [
      {
        label: "Banques & Finances",
        description: "Réduction du temps d'attente aux guichets",
        href: "#voices",
        icon: Landmark,
      },
      {
        label: "Hôpitaux & Santé",
        description: "Fluidifier l'accueil des patients",
        href: "#voices",
        icon: HeartPulse,
      },
      {
        label: "Administrations",
        description: "Services publics plus dignes",
        href: "#voices",
        icon: Building2,
      },
      {
        label: "Universités",
        description: "Inscriptions et guichets académiques",
        href: "#voices",
        icon: GraduationCap,
      },
    ],
  },
  {
    id: "pricing",
    label: "Tarification",
    href: "#pricing",
  },
  {
    id: "histoire",
    label: "Notre histoire",
    href: "#contact",
    sub: [
      {
        label: "Notre mission",
        description: "Transformer l'attente en dignité",
        href: "#product",
        icon: BookOpen,
      },
      {
        label: "L'équipe",
        description: "Ceux qui construisent TONDE",
        href: "#contact",
        icon: Users,
      },
    ],
  },
  {
    id: "about",
    label: "À propos",
    href: "#faq",
    sub: [
      {
        label: "Ressources & FAQ",
        description: "Questions fréquentes et documentation",
        href: "#faq",
        icon: BookOpen,
      },
      {
        label: "Nous contacter",
        description: "Réserver une démo ou poser une question",
        href: "#contact",
        icon: ArrowUpRight,
      },
    ],
  },
];

// IDs des sections observées pour le highlight actif
const observedIds = ["product", "ecosystem", "voices", "pricing", "faq", "contact"];

// Map sub-menu href → parent nav id pour le highlight actif
const hrefToNavId: Record<string, string> = {
  "#product": "solutions",
  "#ecosystem": "produits",
  "#voices": "secteurs",
  "#pricing": "pricing",
  "#faq": "about",
  "#contact": "histoire",
};

// ─────────────────────────────────────────────────────────────────
// DROPDOWN
// ─────────────────────────────────────────────────────────────────

function Dropdown({
  item,
  isActive,
  onLight,
}: {
  item: NavItem;
  isActive: boolean;
  onLight: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const hasMenu = !!item.sub?.length;

  // Fermer si clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const baseText = onLight
    ? isActive
      ? "text-brand-forest"
      : "text-brand-soil/60 hover:text-brand-deep"
    : isActive
      ? "text-white"
      : "text-white/55 hover:text-white";

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => hasMenu && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href={item.href}
        onClick={() => setOpen(false)}
        aria-current={isActive ? "true" : undefined}
        aria-haspopup={hasMenu ? "true" : undefined}
        aria-expanded={hasMenu ? open : undefined}
        className={`group flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] font-normal tracking-normal transition-colors duration-200 ${baseText}`}
      >
        {isActive && (
          <motion.span
            layoutId="nav-pill"
            transition={{ duration: 0.4, ease: EASE }}
            className={`absolute inset-0 rounded-md ${onLight ? "bg-brand-forest/8" : "bg-white/10"}`}
          />
        )}
        <span className="relative z-10">{item.label}</span>
        {hasMenu && (
          <ChevronDown
            className={`relative z-10 h-3 w-3 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </a>

      {hasMenu && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-brand-forest/10 bg-white shadow-[0_24px_60px_-16px_rgba(10,14,26,0.22)] backdrop-blur-xl"
            >
              <ul className="p-2">
                {item.sub!.map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <li key={sub.label}>
                      <a
                        href={sub.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-brand-forest/5"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-forest/8 text-brand-forest transition-colors group-hover:bg-brand-forest/15">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="flex flex-col">
                          <span className="text-[13px] font-medium text-brand-deep">{sub.label}</span>
                          <span className="mt-0.5 text-[11px] leading-snug text-brand-soil/55">{sub.description}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

// ─────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  // expanded item in mobile menu
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = observedIds
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const navId = hrefToNavId[`#${visible.target.id}`] ?? visible.target.id;
          setActiveSection(navId);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsMenuOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  const onLight = isScrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ${
          isScrolled ? "px-3 pt-3 sm:px-5 sm:pt-4" : "px-0 pt-0"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between gap-4 transition-all duration-500 ${
            isScrolled
              ? "max-w-[80rem] rounded-full border border-brand-forest/12 bg-brand-canvas/92 px-4 py-2 shadow-[0_18px_50px_-30px_rgba(10,14,26,0.45)] backdrop-blur-xl sm:px-6"
              : "max-w-[1440px] border-b border-white/12 px-5 py-3.5 sm:px-8 lg:px-12"
          }`}
        >
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5" aria-label="TONDE — retour en haut">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo/Glossy%20Blue%20Circuit%20Network%20Icon.png"
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] shrink-0 rounded-[10px] object-cover"
              aria-hidden="true"
            />
            <span className="flex flex-col leading-none">
              <span className={`font-serif text-[17px] font-semibold tracking-tight transition-colors duration-500 ${onLight ? "text-brand-forest" : "text-white"}`}>
                TONDE
              </span>
              <span className={`mt-0.5 whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.26em] transition-colors duration-500 ${onLight ? "text-brand-leaf" : "text-white/50"}`}>
                Queue intelligence
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <Dropdown
                  key={item.id}
                  item={item}
                  isActive={activeSection === item.id}
                  onLight={onLight}
                />
              ))}
            </ul>
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className={`btn hidden !min-h-[38px] !px-4 !text-[12px] sm:inline-flex ${onLight ? "btn-primary" : "btn-accent"}`}
            >
              Réserver une démo
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Ouvrir le menu"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden ${
                onLight
                  ? "border border-brand-forest/15 text-brand-forest"
                  : "border border-white/25 text-white"
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation mobile"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grain fixed inset-0 z-[60] flex flex-col bg-brand-deep text-white"
          >
            {/* Header mobile */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/logo/Glossy%20Blue%20Circuit%20Network%20Icon.png"
                  alt=""
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] shrink-0 rounded-[8px] object-cover"
                  aria-hidden="true"
                />
                <span className="font-serif text-[17px] font-semibold">TONDE</span>
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fermer le menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav mobile */}
            <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto px-5 pb-10">
              <ul className="flex flex-col divide-y divide-white/8">
                {navItems.map((item, index) => {
                  const hasMenu = !!item.sub?.length;
                  const expanded = mobileExpanded === item.id;
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.08 + index * 0.05, ease: EASE }}
                    >
                      {hasMenu ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setMobileExpanded(expanded ? null : item.id)}
                            className="flex w-full items-center justify-between py-4 text-left"
                          >
                            <span className="text-[1.35rem] font-light tracking-tight text-white">{item.label}</span>
                            <ChevronDown className={`h-4 w-4 text-white/40 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {expanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className="overflow-hidden pb-3"
                              >
                                {item.sub!.map((sub) => {
                                  const Icon = sub.icon;
                                  return (
                                    <li key={sub.label}>
                                      <a
                                        href={sub.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/6"
                                      >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-sprout">
                                          <Icon className="h-3.5 w-3.5" />
                                        </span>
                                        <span>
                                          <span className="block text-[13px] font-medium text-white">{sub.label}</span>
                                          <span className="text-[11px] text-white/40">{sub.description}</span>
                                        </span>
                                      </a>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a
                          data-mobile-nav-link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between py-4"
                        >
                          <span className="text-[1.35rem] font-light tracking-tight text-white">{item.label}</span>
                          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-sprout/70">
                            0{index + 1}
                          </span>
                        </a>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
                className="mt-8"
              >
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn btn-accent w-full"
                >
                  Réserver une démo
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
