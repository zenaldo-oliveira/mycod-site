"use client";

import { motion, type Variants } from "framer-motion";
import { MycodMark } from "@/components/brand/MycodMark";
import { COLORS, EASE, initialFor, type IntroStage } from "./shared";

// Monograma em camadas: a mesma geometria de MycodMark (13 vértices), repetida
// em planos com translateZ. Sem WebGL: a profundidade vem do deslocamento
// entre camadas, com cor escurecendo para o fundo.
const LAYERS = 12;
const DEPTH_STEP = 2.5; // px entre camadas; profundidade total ~27 px
const LAYER_INDEXES = Array.from({ length: LAYERS }, (_, i) => i);

function layerColor(index: number) {
  const t = Math.pow(index / (LAYERS - 1), 0.8);
  const [fr, fg, fb] = COLORS.front;
  const [dr, dg, db] = COLORS.deep;
  const r = Math.round(fr + (dr - fr) * t);
  const g = Math.round(fg + (dg - fg) * t);
  const b = Math.round(fb + (db - fb) * t);
  return `rgb(${r} ${g} ${b})`;
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  run: { opacity: 1, transition: { delay: 0.4, duration: 0.3, ease: "easeOut" } },
  final: { opacity: 1, transition: { duration: 0 } },
};

// 0.4–1.0 s: rotação suave de perspectiva até o plano frontal.
const tiltVariants: Variants = {
  hidden: { rotateX: 16, rotateY: -32 },
  run: { rotateX: 0, rotateY: 0, transition: { delay: 0.4, duration: 0.6, ease: EASE } },
  final: { rotateX: 0, rotateY: 0, transition: { duration: 0 } },
};

// Camadas surgem da frente para o fundo, construindo a profundidade.
const layerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  run: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.4 + index * 0.012, duration: 0.45, ease: EASE },
  }),
  final: { opacity: 1, scale: 1, transition: { duration: 0 } },
};

type DepthMonogramProps = {
  stage: IntroStage;
};

export function DepthMonogram({ stage }: DepthMonogramProps) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ perspective: 800 }}
      variants={fadeVariants}
      initial={initialFor(stage)}
      animate={stage}
    >
      {/* preserve-3d precisa estar num elemento sem opacity; por isso o fade
          fica no pai e a rotação fica aqui. */}
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        variants={tiltVariants}
        initial={initialFor(stage)}
        animate={stage}
      >
        {LAYER_INDEXES.map((index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{ color: layerColor(index), z: -index * DEPTH_STEP }}
            custom={index}
            variants={layerVariants}
            initial={initialFor(stage)}
            animate={stage}
          >
            <MycodMark className="h-full w-full" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
