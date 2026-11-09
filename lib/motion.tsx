"use client";

import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  type Variants,
  type Transition,
} from "framer-motion";
import React, { useEffect, useRef } from "react";

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const revealTransition: Transition = { duration: 0.8, ease: EASE };
export const VIEWPORT_ONCE = { once: true, margin: "-12% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export const lineReveal: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: "easeIn" } },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "span" | "li";
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  y = 32,
  as = "div",
}) => {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </Tag>
  );
};

export const MaskedTitle: React.FC<{
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}> = ({ lines, className, lineClassName = "", delay = 0 }) => (
  <motion.h1
    initial="hidden"
    animate="visible"
    variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: delay } } }}
    className={className}
  >
    {lines.map((line, index) => (
      <span key={index} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
        <motion.span variants={lineReveal} className={`block ${lineClassName}`}>
          {line}
        </motion.span>
      </span>
    ))}
  </motion.h1>
);

export const AnimatedNumber: React.FC<{
  value: number;
  className?: string;
  duration?: number;
  suffix?: string;
  prefix?: string;
}> = ({ value, className, duration = 1.6, suffix = "", prefix = "" }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (current) => Math.round(current).toString());
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          animate(count, value, { duration, ease: EASE });
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration, count]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

export { motion };
