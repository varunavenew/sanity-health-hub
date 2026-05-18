import type { Metadata } from "next";
import GynekologiSubPage from "@/site-pages/treatments/GynekologiSubPage";
import { createBehandlingerTreatmentMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerTreatmentMetadata("gynekologi");

export default function Page() {
  return <GynekologiSubPage isChatOpen={false} />;
}
