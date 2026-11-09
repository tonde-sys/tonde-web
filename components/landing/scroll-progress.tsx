"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.25 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-brand-sprout"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
