"use client";

import { motion } from "framer-motion";
import { DemoButton } from "./DemoButton";
import styles from "./black-friday.module.css";

// Card de serviço: entrada suave ao rolar (uma vez), borda e brilho no hover
// e no foco por CSS. Valor sempre "Preço a definir": nada de preço inventado.
type ServiceCardProps = {
  title: string;
  description: string;
  featured?: boolean;
  index: number;
};

export function ServiceCard({ title, description, featured = false, index }: ServiceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}
    >
      {featured ? <span className={styles.badge}>Destaque</span> : null}
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardText}>{description}</p>
      <div className={styles.value}>
        <span className={styles.valueLabel}>Investimento</span>
        <span className={styles.valueText}>Preço a definir</span>
      </div>
      <DemoButton variant="ghost" className={styles.cardButton}>
        Pedir orçamento
      </DemoButton>
    </motion.article>
  );
}
