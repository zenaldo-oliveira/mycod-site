import type { Metadata } from "next";
import { ServicesPreview } from "@/components/promo/ServicesPreview";

// Prévia de desenvolvimento: fora de buscas, do sitemap e do menu.
export const metadata: Metadata = {
  title: "Prévia Serviços MyCod",
  robots: { index: false, follow: false },
};

export default function ServicesPreviewPage() {
  return <ServicesPreview />;
}
