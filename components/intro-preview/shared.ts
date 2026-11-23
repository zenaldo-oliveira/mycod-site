// Constantes compartilhadas pela prévia da abertura (/intro-preview). Isolada da
// home: nada aqui é importado por HomeContent nem por MycodIntro.

// "run" anima a sequência de 2 s; "final" mostra o quadro estável sem animação
// (pulo, movimento reduzido ou fim da sequência).
export type IntroStage = "run" | "final";

export const EASE = [0.16, 1, 0.3, 1] as const;

// Cores medidas em public/brand/MyCod-vinheta.mp4: o M verde (#90e838) na
// montagem, o wordmark branco (#f8f8f8) e lavanda (#d8d0e8) no quadro final,
// e o roxo radial do fundo (centro ~#403060, bordas ~#2c1f4c).
export const COLORS = {
  lime: "#90e838",
  white: "#f8f8f8",
  lavender: "#d8d0e8",
  deep: [28, 20, 52] as const,
  front: [144, 232, 56] as const,
};

export const BACKGROUND =
  "radial-gradient(ellipse at center, #403060 0%, #382858 45%, #2c1f4c 100%)";

// Estado inicial de cada elemento. Ao pular ou reduzir movimento, a árvore é
// remontada já no quadro final, sem depender de animações agendadas.
export function initialFor(stage: IntroStage): "hidden" | "final" {
  return stage === "final" ? "final" : "hidden";
}
