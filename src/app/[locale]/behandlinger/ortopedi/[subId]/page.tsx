import type { Metadata } from "next";
import TreatmentPage from "@/site-pages/treatments/TreatmentPage";
import { createBehandlingerTreatmentMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerTreatmentMetadata("ortopedi");

export default function Page() {
  return <TreatmentPage categoryId="ortopedi" isChatOpen={false} />;
}
