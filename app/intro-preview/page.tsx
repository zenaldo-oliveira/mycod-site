import type { Metadata } from "next";
import { IntroPreview } from "@/components/intro-preview/IntroPreview";

// Prévia de desenvolvimento: fora do índice de buscas e fora do sitemap.
export const metadata: Metadata = {
  title: "Prévia da abertura MyCod",
  robots: {
    index: false,
    follow: false,
  },
};

export default function IntroPreviewPage() {
  return <IntroPreview />;
}
