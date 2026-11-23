"use client";

import { motion, type Variants } from "framer-motion";
import { COLORS, EASE, initialFor, type IntroStage } from "./shared";

// Gradiente branco com bordas lavanda, varrido por um brilho (sheen) de
// 1,0 s a 1,6 s. Usa a fonte do site (Geist), que já está carregada no layout.
const GRADIENT = `linear-gradient(105deg, ${COLORS.lavender} 0%, ${COLORS.white} 42%, #ffffff 50%, ${COLORS.white} 58%, ${COLORS.lavender} 100%)`;
const GLOW = "drop-shadow(0 0 18px rgba(216,208,232,0.35))";

// 1,0–1,6 s: surge com desfoque, abre o espaçamento e acende o brilho.
const wordmarkVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px) drop-shadow(0 0 0px rgba(216,208,232,0))",
    letterSpacing: "0.3em",
    backgroundPosition: "100% 0%",
  },
  run: {
    opacity: 1,
    filter: `blur(0px) ${GLOW}`,
    letterSpacing: "0.02em",
    backgroundPosition: "50% 0%",
    transition: { delay: 1, duration: 0.6, ease: EASE },
  },
  final: {
    opacity: 1,
    filter: `blur(0px) ${GLOW}`,
    letterSpacing: "0.02em",
    backgroundPosition: "50% 0%",
    transition: { duration: 0 },
  },
};

type WordmarkProps = {
  stage: IntroStage;
};

export function Wordmark({ stage }: WordmarkProps) {
  return (
    <motion.h1
      variants={wordmarkVariants}
      initial={initialFor(stage)}
      animate={stage}
      className="mt-[clamp(1rem,3vh,2rem)] select-none font-semibold leading-none text-transparent text-[clamp(2.5rem,9vw,7rem)] [background-clip:text] [-webkit-background-clip:text] [font-family:var(--font-geist-sans)]"
      style={{
        backgroundImage: GRADIENT,
        backgroundSize: "250% 100%",
      }}
    >
      MyCod
    </motion.h1>
  );
}
