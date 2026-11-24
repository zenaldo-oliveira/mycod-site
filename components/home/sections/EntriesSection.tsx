"use client";

import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { AutomationChat } from "@/components/home/sections/AutomationChat";
import { RibbonBand } from "@/components/black-friday/RibbonBand";
import styles from "@/components/black-friday/black-friday.module.css";
import { Container } from "@/components/ui/Container";
import { RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import type { HomeEntryId } from "@/lib/catalog/home";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Duas listas com a mesma informação, uma por largura. Cada uma tem a ordem
// de leitura e de Tab da sua tela: no celular, o plano por assinatura primeiro;
// no desktop, sistemas à esquerda, o plano no centro e automações à direita.
// A lista que não aparece fica com display:none, então sai da árvore de
// acessibilidade e da ordem de Tab, sem tabindex positivo.
const MOBILE_ORDER: HomeEntryId[] = ["site", "systems", "automation"];
const DESKTOP_ORDER: HomeEntryId[] = ["systems", "site", "automation"];
const FEATURED: HomeEntryId = "site";

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

      {id === "automation" && <AutomationChat />}

      {copy.condition && (
        <p className="rounded-lg border border-[#b9a3f0]/60 px-3 py-2 text-sm font-medium text-[#b9a3f0]">
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

function OfferList({ order, className }: { order: HomeEntryId[]; className: string }) {
  return (
    <RevealStagger as="ul" className={className}>
      {order.map((id) => (
        <RevealItem as="li" key={id} className="flex">
          <OfferCard id={id} />
        </RevealItem>
      ))}
    </RevealStagger>
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
        <OfferList
          order={MOBILE_ORDER}
          className="relative z-10 grid gap-5 lg:hidden"
        />
        <OfferList
          order={DESKTOP_ORDER}
          className="relative z-10 hidden gap-5 lg:grid lg:grid-cols-3"
        />
      </Container>
    </Section>
  );
}
