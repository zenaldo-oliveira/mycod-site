import type { Metadata } from "next";
import { BlackFridayPreview } from "@/components/black-friday/BlackFridayPreview";

// Prévia de desenvolvimento: fora de buscas (noindex, nofollow), fora do sitemap
// e sem link no menu ou na home.
export const metadata: Metadata = {
  title: "Prévia Black Friday MyCod",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlackFridayPreviewPage() {
  return <BlackFridayPreview />;
}
