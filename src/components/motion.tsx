"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ duration: .65, ease }}>{children}</MotionConfig>;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduced ? .15 : .8, delay, ease }}>{children}</motion.div>;
}

export function PageEntrance({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? .12 : .5, ease }}>{children}</motion.div>;
}
