import type { Metadata } from "next";
import { PromotionsPreview } from "@/components/promo/PromotionsPreview";

// Prévia de desenvolvimento: fora de buscas, do sitemap e do menu.
export const metadata: Metadata = {
  title: "Prévia Promoções MyCod",
  robots: { index: false, follow: false },
};

export default function PromotionsPreviewPage() {
  return <PromotionsPreview />;
}
