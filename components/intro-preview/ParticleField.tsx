"use client";

import { motion, type Variants } from "framer-motion";
import { COLORS, EASE, initialFor, type IntroStage } from "./shared";

// Partículas e brilho discretos. Posições e atrasos são funções puras do índice
// (sem Math.random), para servidor e cliente renderizarem exatamente o mesmo HTML.
type Particle = { x: number; y: number; size: number; delay: number };

const PARTICLES: Particle[] = Array.from({ length: 28 }, (_, i) => {
  const angle = i * 2.39996; // ângulo áureo: espalhamento uniforme
  const radius = 110 + ((i * 47) % 90);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.6,
    size: 2 + (i % 3),
    delay: (i % 6) * 0.02,
  };
});

// 0–0.4 s: convergem para o centro. Brilho some ao longo de ~1.2 s.
const particleVariants: Variants = {
  hidden: (p: Particle) => ({ x: p.x, y: p.y, opacity: 0 }),
  run: (p: Particle) => ({
    x: 0,
    y: 0,
    opacity: [0, 0.9, 0.9, 0],
    transition: {
      x: { duration: 0.4, ease: EASE, delay: p.delay },
      y: { duration: 0.4, ease: EASE, delay: p.delay },
      opacity: { duration: 1.2, times: [0, 0.1, 0.5, 1], ease: "linear" },
    },
  }),
  final: { x: 0, y: 0, opacity: 0, transition: { duration: 0 } },
};

type ParticleFieldProps = {
  stage: IntroStage;
};

export function ParticleField({ stage }: ParticleFieldProps) {
  return (
    <>
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          custom={particle}
          variants={particleVariants}
          initial={initialFor(stage)}
          animate={stage}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: COLORS.lime,
            boxShadow: `0 0 ${particle.size * 3}px ${COLORS.lime}`,
          }}
        />
      ))}
    </>
  );
}

// Luz radial atrás do monograma: sobe com a montagem e escurece no fim (0,8–2 s).
const glowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  run: {
    opacity: [0, 0.7, 0.7, 0.4],
    scale: [0.8, 1, 1, 1],
    transition: { duration: 2, times: [0, 0.3, 0.8, 1], ease: "easeOut" },
  },
  final: { opacity: 0.4, scale: 1, transition: { duration: 0 } },
};

type AmbientGlowProps = {
  stage: IntroStage;
};

export function AmbientGlow({ stage }: AmbientGlowProps) {
  return (
    <motion.span
      aria-hidden="true"
      variants={glowVariants}
      initial={initialFor(stage)}
      animate={stage}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: `radial-gradient(circle, rgba(144,232,56,0.28) 0%, rgba(144,232,56,0) 60%)`,
      }}
    />
  );
}
