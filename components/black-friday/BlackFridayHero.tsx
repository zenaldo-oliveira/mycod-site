"use client";

import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { RibbonBand } from "@/components/black-friday/RibbonBand";
import styles from "@/components/black-friday/black-friday.module.css";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

// Fim da promoção: 27/11/2026 às 23:59 em Cuiabá (UTC-4). Depois dessa data o
// bloco deixa de aparecer, sem precisar mexer no código novamente.
const PROMO_ENDS_AT = Date.UTC(2026, 10, 28, 2, 59, 59);
// Avaliado uma vez ao carregar o módulo; a página é gerada estaticamente.
const PROMO_ACTIVE = Date.now() <= PROMO_ENDS_AT;

// Faixa de abertura da home durante a Black Friday: fitas em movimento, título
// e as duas ações. As ofertas e os preços ficam na seção logo abaixo.
export function BlackFridayHero() {
  if (!PROMO_ACTIVE) return null;

  return (
    <section id="promocao" aria-labelledby="promo-title" className="relative overflow-hidden pt-28 pb-12 sm:pb-16">
      <div className={`${styles.ribbonArea} overflow-x-clip`} aria-hidden="true">
        <RibbonBand text="Black Friday • Sites • Sistemas • Automações com IA" tone="green" direction="left" angle="-6deg" />
        <RibbonBand text="Condições válidas até 27/11 • Site por assinatura" tone="dark" direction="right" angle="6deg" />
      </div>

      <Container>
        <div className="relative z-10 mx-auto mt-10 max-w-3xl px-5 text-center sm:mt-14 sm:px-0">
          <h2 id="promo-title" className="text-balance text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Black Friday na MyCod
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            Condições especiais em sites, sistemas e automações para quem decidir até 27/11. Os valores são confirmados na proposta.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button href="#entradas" variant="primary" className="h-12 w-full whitespace-nowrap sm:w-auto">
              Ver as ofertas
            </Button>
            <WhatsAppCta
              label="Pedir orçamento pelo WhatsApp"
              message="Olá! Vim pela promoção de Black Friday da MyCod e quero saber as condições."
              ariaLabel="Pedir orçamento pelo WhatsApp na promoção de Black Friday"
              variant="secondary"
              size="md"
              className="h-12 w-full whitespace-nowrap sm:w-auto"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
