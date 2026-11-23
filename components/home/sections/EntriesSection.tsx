"use client";

import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { RibbonBand } from "@/components/black-friday/RibbonBand";
import styles from "@/components/black-friday/black-friday.module.css";
import { Container } from "@/components/ui/Container";
import { RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import type { HomeEntryId } from "@/lib/catalog/home";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Ordem de leitura e de teclado: o plano por assinatura vem primeiro, e assim
// aparece no celular. No desktop, a classe `order` coloca sistemas à esquerda,
// o plano no centro e automações à direita.
const READING_ORDER: HomeEntryId[] = ["site", "systems", "automation"];
const FEATURED: HomeEntryId = "site";

const DESKTOP_ORDER: Record<HomeEntryId, string> = {
  site: "order-1 lg:order-2",
  systems: "order-2 lg:order-1",
  automation: "order-3 lg:order-3",
};

function OfferCard({ id }: { id: HomeEntryId }) {
  const copy = useTranslations().commercial.home.entries.items[id];
  const featured = id === FEATURED;

  return (
    <div className={`${styles.card} ${featured ? styles.cardFeatured : ""} h-full`}>
      <h3 className="text-xl font-semibold tracking-tight text-text-primary">{copy.name}</h3>

      {copy.headline && (
        <p className="text-lg font-semibold leading-snug text-text-primary">{copy.headline}</p>
      )}

      <p className="text-pretty text-sm leading-relaxed text-text-secondary">{copy.benefit}</p>

      {copy.condition && (
        <p className="rounded-lg border border-[#f0c75e]/60 px-3 py-2 text-sm font-medium text-[#f0c75e]">
          {copy.condition}
        </p>
      )}

      <div className="mt-auto pt-2">
        <WhatsAppCta
          label={copy.cta}
          message={copy.message}
          ariaLabel={`${copy.name}: ${copy.cta}`}
          variant={featured ? "gold" : "secondary"}
          size="md"
          className={`${styles.animatedBorder} h-11 w-full whitespace-nowrap`}
        />
      </div>
    </div>
  );
}

// Vitrine de três ofertas: Sistemas sob medida, Site por Assinatura (em
// destaque) e Automações com IA. Fitas verdes em movimento e molduras animadas
// seguem a identidade da prévia Black Friday. Cada botão abre o WhatsApp com a
// mensagem da própria oferta.
export function EntriesSection() {
  const e = useTranslations().commercial.home.entries;

  return (
    <Section id="entradas">
      <Container>
        <SectionHeader eyebrow={e.eyebrow} title={e.title} description={e.description} />
        <div className={`${styles.ribbonArea} overflow-x-clip`} aria-hidden="true">
          <RibbonBand text="Sites • Sistemas • Automações com IA" tone="green" direction="left" angle="-6deg" />
          <RibbonBand text="Sistemas sob medida • Site por assinatura" tone="dark" direction="right" angle="6deg" />
        </div>
        <RevealStagger as="ul" className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {READING_ORDER.map((id) => (
            <RevealItem as="li" key={id} className={DESKTOP_ORDER[id]}>
              <OfferCard id={id} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
