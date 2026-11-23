import type { ReactNode } from "react";
import styles from "./black-friday.module.css";

// Botão visual da prévia. Não tem ação: não navega, não abre WhatsApp e não
// envia formulário. Continua acessível por teclado, e a nota de rodapé
// (#bf-demo-note) explica que é demonstrativo.
type DemoButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function DemoButton({ children, variant = "primary", className = "" }: DemoButtonProps) {
  const variantClass = variant === "primary" ? styles.buttonPrimary : styles.buttonGhost;
  return (
    <button
      type="button"
      data-demo="true"
      aria-describedby="bf-demo-note"
      className={`${styles.button} ${styles.animatedBorder} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
