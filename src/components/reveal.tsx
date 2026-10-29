"use client";

// Adapted from motion-primitives "In View" (MIT, github.com/ibelick/motion-primitives).
// Children with data-reveal rise in one after another the first time the block enters the viewport.
import { LazyMotion, MotionConfig, domAnimation, m, type Variants } from "motion/react";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] } },
};

export function MotionRoot({ children }: { children: ReactNode }) {
  // reducedMotion="user" drops the travel and keeps the fade for people who ask for less motion.
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

type RevealProps = { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" | "dl" };

export function Reveal({ children, className, as = "div" }: RevealProps) {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Tag>
  );
}

type ItemProps = { children: ReactNode; className?: string; as?: "div" | "li" | "p" | "h2" | "figure" };

export function RevealItem({ children, className, as = "div" }: ItemProps) {
  const Tag = m[as];
  return (
    <Tag className={className} variants={item} data-reveal>
      {children}
    </Tag>
  );
}
