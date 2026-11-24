"use client";

import { useRef } from "react";
import styles from "./AutomationChat.module.css";

// Conversa simulada de atendimento no WhatsApp. Dados fictícios (clínica e
// cliente de exemplo): não é uma conversa real de cliente nem um depoimento.
// Mostra só o que a automação faz: coleta nome e serviço e oferece horários.
export function AutomationChat() {
  const phoneRef = useRef<HTMLDivElement>(null);

  function tilt(event: React.MouseEvent<HTMLDivElement>) {
    const stage = event.currentTarget;
    const phone = phoneRef.current;
    if (!phone || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    phone.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 16}deg)`;
  }

  function resetTilt() {
    if (phoneRef.current) phoneRef.current.style.transform = "";
  }

  return (
    <figure className="m-0">
      <div
        role="img"
        aria-label="Simulação de conversa no WhatsApp: a cliente pede horário às 20h, o assistente pergunta nome e serviço e oferece três horários livres."
        onMouseMove={tilt}
        onMouseLeave={resetTilt}
      >
        <div ref={phoneRef} className={styles.phone}>
          <div className={styles.head}>
            <span className={styles.avatar} aria-hidden="true">CE</span>
            <div>
              <strong>Clínica Exemplo</strong>
              <small>online</small>
            </div>
          </div>
          <div className={styles.chat}>
            <span className={styles.day}>Hoje</span>
            <div className={`${styles.bubble} ${styles.me} ${styles.b1}`}>
              Boa noite, tem horário para amanhã à tarde?
              <time className={styles.time}>20:04 ✓✓</time>
            </div>
            <div className={`${styles.bubble} ${styles.bot} ${styles.b2}`}>
              Boa noite! Qual é o seu nome e o serviço desejado?
              <time className={styles.time}>20:04</time>
            </div>
            <div className={`${styles.bubble} ${styles.me} ${styles.b3}`}>
              Marcos, retorno de consulta
              <time className={styles.time}>20:05 ✓✓</time>
            </div>
            <div className={`${styles.bubble} ${styles.bot} ${styles.b4}`}>
              Obrigado, Marcos. Tenho estes horários livres amanhã:
              <div className={styles.slots}>
                <span className={styles.slot}>14h</span>
                <span className={styles.slot}>15h30</span>
                <span className={styles.slot}>17h</span>
              </div>
              <time className={styles.time}>20:05</time>
            </div>
          </div>
        </div>
      </div>
      <figcaption className={`${styles.note} mt-3`}>
        Simulação com dados fictícios. Não é conversa de cliente real.
      </figcaption>
    </figure>
  );
}
