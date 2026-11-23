import type { CSSProperties } from "react";
import styles from "./black-friday.module.css";

// Fita promocional com marquee infinito. O conteúdo é duplicado: o deslocamento
// de -50% fecha o ciclo sem salto. Decorativa: o texto não é lido por leitores
// de tela (o conteúdo principal já está no h1 e nas seções).
type RibbonBandProps = {
  text: string;
  tone: "green" | "dark";
  direction: "left" | "right";
  angle?: string;
  className?: string;
};

const REPEATS = 4;

export function RibbonBand({ text, tone, direction, angle = "0deg", className = "" }: RibbonBandProps) {
  const toneClass = tone === "green" ? styles.ribbonGreen : styles.ribbonDark;
  const trackClass = direction === "left" ? styles.trackLeft : styles.trackRight;
  const segment = (
    <div className={styles.segment}>
      {Array.from({ length: REPEATS }, (_, index) => (
        <span key={index} className={styles.item}>
          {text} •
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`${styles.ribbon} ${toneClass} ${className}`}
      style={{ "--angle": angle } as CSSProperties}
    >
      <div className={`${styles.track} ${trackClass}`}>
        {segment}
        {segment}
      </div>
    </div>
  );
}
