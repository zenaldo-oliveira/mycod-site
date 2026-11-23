"use client";

import { useEffect } from "react";
import { ServiceCard } from "@/components/black-friday/ServiceCard";
import bf from "@/components/black-friday/black-friday.module.css";
import styles from "./promo.module.css";
import { PromoNav } from "./PromoNav";
import { SERVICES } from "./data";

// Prévia da página de serviços: os mesmos cards da landing Black Friday.
export function ServicesPreview() {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className={bf.page} data-promo-root="">
      <header className={bf.strip}>
        <p className={bf.stripText}>Serviços</p>
      </header>

      <div className={bf.services}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Serviços da MyCod</h1>
          <p className={styles.lead}>Sites, sistemas e automações para empresas que querem crescer com tecnologia.</p>
        </div>
        <div className={bf.cards}>
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              featured={service.featured}
              index={index}
            />
          ))}
        </div>
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
