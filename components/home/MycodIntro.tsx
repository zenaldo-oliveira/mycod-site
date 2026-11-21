"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// Abertura da marca MyCod sobre a home: só a vinheta, sem textos nem controles.
// Aparece uma única vez por navegador (localStorage). Tenta tocar com som; se o
// navegador bloquear o áudio, toca no mudo, sem avisos. Esc fecha a abertura.
// Ao terminar, a falhar ou demorar para iniciar, libera a home com um fade
// curto. Com prefers-reduced-motion, a home aparece direto.

const SRC = "/brand/MyCod-vinheta.mp4";
const STORAGE_KEY = "mycod-intro-shown-v1";
// Cor das bordas do vídeo aprovado. A máscara de borda apaga o quadro sobre ela.
const BACKGROUND = "#442c6a";
const FADE_MS = 400;
const START_TIMEOUT_MS = 3000;
const MASK = "radial-gradient(ellipse 50% 50% at 50% 50%, #000 55%, transparent 100%)";

type Phase = "playing" | "leaving" | "done";

function subscribeNothing() {
  return () => {};
}

// Decide se a vinheta toca. No servidor e na hidratação responde "done", então
// nada aparece antes de o cliente decidir. A flag só é gravada quando o vídeo
// começa (ver onPlaying), e a fase fica em `override` a partir daí, para que
// essa gravação não desmonte a vinheta no meio da exibição.
function readInitialPhase(): Phase {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "done";
    if (window.localStorage.getItem(STORAGE_KEY) === "1") return "done";
  } catch {
    // Sem localStorage ou media query: a vinheta toca.
  }
  return "playing";
}

export function MycodIntro() {
  const initialPhase = useSyncExternalStore(subscribeNothing, readInitialPhase, () => "done" as Phase);
  const [override, setOverride] = useState<Phase | null>(null);
  const phase = override ?? initialPhase;
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);

  // Encerra: para o vídeo e começa o fade para a home.
  const finish = useCallback(() => {
    videoRef.current?.pause();
    setOverride((current) => (current === "leaving" || current === "done" ? current : "leaving"));
  }, []);

  // Começa com som; se o navegador bloquear, volta ao mudo. Sem aviso, sem botão.
  // Se tiver começado no mudo, o primeiro toque ou tecla do visitante durante
  // a abertura libera o áudio: navegadores só permitem som após um gesto.
  useEffect(() => {
    if (phase !== "playing") return;
    const video = videoRef.current;
    if (!video) return;
    let unlock: (() => void) | null = null;

    const removeUnlock = () => {
      if (!unlock) return;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
      unlock = null;
    };

    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play().then(
        () => {
          unlock = () => {
            removeUnlock();
            video.muted = false;
            video.play().catch(() => {
              video.muted = true;
            });
          };
          window.addEventListener("pointerdown", unlock);
          window.addEventListener("keydown", unlock);
          window.addEventListener("touchstart", unlock);
        },
        finish,
      );
    });

    return removeUnlock;
  }, [phase, finish]);

  // Demora para iniciar: libera a home.
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setTimeout(() => {
      if (!startedRef.current) finish();
    }, START_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [phase, finish]);

  // Trava a rolagem da home enquanto a vinheta toca.
  useEffect(() => {
    if (phase !== "playing") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  // Teclado: Esc fecha a abertura. Tab fica preso à camada, que não tem
  // controles, para o foco não cair na home escondida.
  useEffect(() => {
    if (phase !== "playing") return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") finish();
      else if (event.key === "Tab") event.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  // Fade concluído: a camada sai do DOM.
  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = window.setTimeout(() => setOverride("done"), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <section
      aria-label="Abertura da MyCod"
      className={`fixed inset-0 z-[70] flex items-center justify-center ease-out ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundColor: BACKGROUND,
        transitionProperty: "opacity",
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      <video
        ref={videoRef}
        src={SRC}
        playsInline
        preload="auto"
        onPlaying={() => {
          startedRef.current = true;
          setOverride((current) => current ?? "playing");
          try {
            window.localStorage.setItem(STORAGE_KEY, "1");
          } catch {
            // Sem armazenamento, a vinheta pode voltar. Não é fatal.
          }
        }}
        onEnded={finish}
        onError={finish}
        aria-hidden="true"
        className="block h-auto max-w-none"
        style={{
          width: "min(100vw, calc(100dvh * 16 / 9))",
          WebkitMaskImage: MASK,
          maskImage: MASK,
        }}
      />
    </section>
  );
}
