import type { Metadata } from "next";
import FertilitetSubPage from "@/site-pages/treatments/FertilitetSubPage";
import { createBehandlingerTreatmentMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerTreatmentMetadata("fertilitet");

export default function Page() {
  return <FertilitetSubPage isChatOpen={false} />;
}
