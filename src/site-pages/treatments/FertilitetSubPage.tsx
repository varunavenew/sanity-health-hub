"use client";

import TreatmentPage from "./TreatmentPage";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";

/** Fertilitet treatments use Sanity CMS + TreatmentPage (same as urologi, ortopedi, etc.). */
const FertilitetSubPage = ({
  isChatOpen,
  initialTreatment,
  sanityLang = "no",
}: BehandlingerTreatmentPageProps) => (
  <TreatmentPage
    categoryId="fertilitet"
    isChatOpen={isChatOpen}
    initialTreatment={initialTreatment}
    sanityLang={sanityLang}
  />
);

export default FertilitetSubPage;
