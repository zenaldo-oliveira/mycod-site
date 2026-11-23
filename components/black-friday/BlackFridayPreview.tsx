"use client";

import { useEffect } from "react";
import { MycodMark } from "@/components/brand/MycodMark";
import { DemoButton } from "./DemoButton";
import { GoldMarquee } from "./GoldMarquee";
import { RibbonBand } from "./RibbonBand";
import { ServiceCard } from "./ServiceCard";
import styles from "./black-friday.module.css";

// Partículas discretas com posição determinística (sem Math.random), para
// servidor e cliente renderizarem o mesmo HTML.
const PARTICLE_COUNT = 22;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 2 + (i % 3),
  delay: -((i * 0.7) % 6),
  duration: 3 + (i % 4),
}));

const SERVICES = [
  {
    title: "Sites Profissionais",
    description:
      "Sites institucionais, landing pages e páginas de captação, com contato pelo WhatsApp, formulários e boa leitura em celular.",
    featured: false,
  },
  {
    title: "Sistemas SaaS",
    description:
      "Plataformas web multiusuário com painel de gestão, controle de acesso e banco de dados próprio para o seu negócio.",
    featured: true,
  },
  {
    title: "Automações com IA",
    description:
      "Fluxos que conectam sistemas, mensagens e APIs, com recursos de inteligência artificial para reduzir tarefas manuais.",
    featured: false,
  },
];

export function BlackFridayPreview() {
  // Trava a rolagem da página de baixo; a prévia rola por dentro.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className={styles.page} data-bf-root="">
      <header className={styles.strip}>
        <p className={styles.stripText}>Black Friday</p>
      </header>

      <div>
        <section className={styles.hero} aria-labelledby="bf-title">
          <div className={styles.particles} aria-hidden="true">
            {PARTICLES.map((particle, index) => (
              <span
                key={index}
                className={styles.particle}
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: particle.size,
                  height: particle.size,
                  ["--dur" as string]: `${particle.duration}s`,
                  ["--delay" as string]: `${particle.delay}s`,
                }}
              />
            ))}
          </div>

          <div className={styles.heroInner}>
            <div className={styles.brand}>
              <span className={styles.brandMark} aria-hidden="true">
                <MycodMark className="h-4 w-auto" />
              </span>
              <span>MyCod</span>
            </div>

            <h1 id="bf-title" className={styles.title}>
              <span className={styles.titleGold}>Black Friday</span>
              <span className={styles.titleMain}>MyCod</span>
            </h1>

            <p className={styles.lead}>
              Sites profissionais, sistemas inteligentes e automações para empresas.
            </p>

            <DemoButton>Solicitar proposta especial</DemoButton>
          </div>

          <div className={styles.ribbonArea} aria-hidden="true">
            <RibbonBand
              text="Black Friday • MyCod • Ofertas especiais"
              tone="green"
              direction="left"
              angle="-9deg"
            />
            <RibbonBand
              text="Sites • Sistemas • Automações com IA"
              tone="dark"
              direction="right"
              angle="9deg"
            />
          </div>
        </section>

        <section id="servicos" className={styles.services} aria-labelledby="bf-services-title">
          <h2 id="bf-services-title" className={styles.sectionTitle}>
            Soluções para a sua empresa
          </h2>
          <div className={styles.cards}>
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
        </section>

        <GoldMarquee />
      </div>

      <footer className={styles.footer}>
        <p id="bf-demo-note">
          Prévia interna. Os botões são demonstrativos e não têm ação comercial.
        </p>
      </footer>
    </div>
  );
}
