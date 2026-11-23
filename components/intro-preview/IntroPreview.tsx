"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { DepthMonogram } from "./DepthMonogram";
import { AmbientGlow, ParticleField } from "./ParticleField";
import { Wordmark } from "./Wordmark";
import { BACKGROUND, type IntroStage } from "./shared";

// Prévia isolada da abertura MyCod, em /intro-preview. Sequência de 2 s sem
// áudio. Com movimento reduzido, pulo ou Esc, mostra o quadro final direto.
export function IntroPreview() {
  const reduced = useReducedMotion();
  const [round, setRound] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const stage: IntroStage = reduced || skipped ? "final" : "run";

  // Trava a rolagem enquanto a prévia cobre a página.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSkipped(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function replay() {
    setSkipped(false);
    // Muda a chave: a árvore remonta e a sequência recomeça do estado oculto.
    setRound((value) => value + 1);
  }

  return (
    <section
      aria-label="Prévia da abertura MyCod"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden overscroll-none"
      style={{ background: BACKGROUND }}
    >
      <div key={`${round}-${stage}`} className="flex flex-col items-center">
        <div
          className="relative"
          style={{ width: "min(28vw, 26vh, 280px)", aspectRatio: "111 / 100" }}
        >
          <AmbientGlow stage={stage} />
          <ParticleField stage={stage} />
          <DepthMonogram stage={stage} />
        </div>
        <Wordmark stage={stage} />
      </div>

      <nav
        aria-label="Controles da prévia"
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 px-4"
      >
        <button type="button" onClick={replay} className={CONTROL}>
          Assistir de novo
        </button>
        <button
          type="button"
          onClick={() => setSkipped(true)}
          disabled={stage === "final"}
          className={`${CONTROL} disabled:opacity-40`}
        >
          Pular animação
        </button>
        <Link href="/" className={CONTROL}>
          Voltar ao site
        </Link>
      </nav>
    </section>
  );
}

const CONTROL =
  "inline-flex h-11 items-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2c1f4c]";
