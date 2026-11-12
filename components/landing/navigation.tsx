"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { EASE } from "@/lib/motion";

const navLinks = [
  { id: "product", label: "Le problème" },
  { id: "ecosystem", label: "Écosystème" },
  { id: "voices", label: "Terrain" },
  { id: "pricing", label: "Tarifs" },
  { id: "faq", label: "FAQ" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    const firstLink = document.querySelector<HTMLElement>("[data-mobile-nav-link]");
    firstLink?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
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
              ? "max-w-[80rem] rounded-full border border-brand-forest/12 bg-brand-canvas/88 px-4 py-2.5 shadow-[0_18px_50px_-30px_rgba(10,14,26,0.55)] backdrop-blur-xl sm:px-6"
              : "max-w-[1440px] border-b border-white/12 px-5 py-4 sm:px-8 lg:px-12"
          }`}
        >
          <a
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label="TONDE — retour en haut"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo/Glossy%20Blue%20Circuit%20Network%20Icon.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-[10px] object-cover"
              aria-hidden="true"
            />
            <span className="flex flex-col leading-none">
              <span
                className={`font-serif text-lg font-semibold tracking-tight transition-colors duration-500 ${
                  onLight ? "text-brand-forest" : "text-white"
                }`}
              >
                TONDE
              </span>
              <span
                className={`mt-0.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.28em] transition-colors duration-500 ${
                  onLight ? "text-brand-leaf" : "text-white/55"
                }`}
              >
                Queue intelligence
              </span>
            </span>
          </a>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id} className="relative">
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-300 xl:px-3.5 ${
                        onLight
                          ? isActive
                            ? "text-brand-deep"
                            : "text-brand-soil/65 hover:text-brand-deep"
                          : isActive
                            ? "text-brand-deep"
                            : "text-white/70 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          transition={{ duration: 0.5, ease: EASE }}
                          className="absolute inset-0 rounded-full bg-brand-sprout"
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={`hidden whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-300 sm:block ${
                onLight ? "text-brand-soil/65 hover:text-brand-deep" : "text-white/65 hover:text-white"
              }`}
            >
              Espace admin
            </Link>
            <a
              href="#contact"
              className={`btn hidden !min-h-[42px] !px-5 sm:inline-flex ${
                onLight ? "btn-primary" : "btn-accent"
              }`}
            >
              Demander une démo
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Ouvrir le menu"
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${
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
            transition={{ duration: 0.6, ease: EASE }}
            className="grain fixed inset-0 z-[60] flex flex-col bg-brand-deep text-white"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/logo/Glossy%20Blue%20Circuit%20Network%20Icon.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-[9px] object-cover"
                  aria-hidden="true"
                />
                <span className="font-serif text-lg font-semibold">TONDE</span>
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fermer le menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              aria-label="Navigation mobile principale"
              className="flex-1 overflow-y-auto px-5 pb-10"
            >
              <ul className="flex flex-col">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.12 + index * 0.06, ease: EASE }}
                    className="border-b border-white/12"
                  >
                    <a
                      data-mobile-nav-link
                      href={`#${link.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-baseline justify-between gap-4 py-5"
                    >
                      <span className="font-serif text-[2rem] leading-tight">{link.label}</span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-sprout">
                        0{index + 1}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
                className="mt-10 flex flex-col gap-3"
              >
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn btn-accent w-full"
                >
                  Demander une démo
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <Link href="/login" className="btn btn-ghost-light w-full">
                  Espace admin
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
