import type { Metadata } from "next";
import TreatmentPage from "@/site-pages/treatments/TreatmentPage";
import { createBehandlingerTreatmentMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerTreatmentMetadata("urologi");

export default function Page() {
  return <TreatmentPage categoryId="urologi" isChatOpen={false} />;
}
