"use client";

import { useEffect } from "react";
import { DemoButton } from "@/components/black-friday/DemoButton";
import bf from "@/components/black-friday/black-friday.module.css";
import styles from "./promo.module.css";
import { PromoNav } from "./PromoNav";
import { PROMOTIONS } from "./data";

// Prévia da página de promoções. Sem promoções cadastradas, mostra um estado
// vazio e um exemplo de layout com campos entre colchetes, sem valores reais.
export function PromotionsPreview() {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const hasPromotions = PROMOTIONS.length > 0;

  return (
    <div className={bf.page} data-promo-root="">
      <header className={bf.strip}>
        <p className={bf.stripText}>Promoções</p>
      </header>

      <div className={bf.services}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Promoções MyCod</h1>
          <p className={styles.lead}>Ofertas especiais aparecem aqui quando forem publicadas.</p>
        </div>

        {hasPromotions ? (
          <div className={bf.cards}>
            {PROMOTIONS.map((promotion) => (
              <article key={promotion.title} className={`${bf.card} ${bf.cardFeatured}`}>
                <span className={bf.badge}>Promoção</span>
                <h2 className={bf.cardTitle}>{promotion.title}</h2>
                <p className={bf.cardText}>{promotion.description}</p>
                <div className={bf.value}>
                  <span className={bf.valueLabel}>Válida até</span>
                  <span className={bf.valueText}>{promotion.validUntil}</span>
                </div>
                <DemoButton variant="ghost" className={bf.cardButton}>Pedir orçamento</DemoButton>
              </article>
            ))}
          </div>
        ) : (
          <>
            <div className={styles.emptyCard} role="status">
              <h2 className={styles.emptyTitle}>Nenhuma promoção publicada</h2>
              <p className={styles.emptyText}>
                Esta página recebe as ofertas quando forem aprovadas. Até lá, nenhum valor ou condição é exibido.
              </p>
            </div>

            <p className={styles.emptyText} style={{ textAlign: "center", marginTop: "2.5rem" }}>
              Exemplo de layout, sem dados reais:
            </p>
            <div className={`${bf.cards} ${styles.placeholderGrid} ${styles.placeholder}`} inert>
              <article className={bf.card}>
                <span className={bf.badge}>[Selo]</span>
                <h2 className={bf.cardTitle}>[Nome da promoção]</h2>
                <p className={bf.cardText}>[Descrição curta da oferta]</p>
                <div className={bf.value}>
                  <span className={bf.valueLabel}>Válida até</span>
                  <span className={bf.valueText}>[Data a definir]</span>
                </div>
                <DemoButton variant="ghost" className={bf.cardButton}>Pedir orçamento</DemoButton>
              </article>
            </div>
          </>
        )}
      </div>

      <footer className={bf.footer}>
        <PromoNav />
        <p id="bf-demo-note" style={{ marginTop: "1rem" }}>
          Prévia interna. Os botões são demonstrativos e não têm ação comercial.
        </p>
      </footer>
    </div>
  );
}
