"use client";

import TreatmentPage from "./TreatmentPage";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";

/** Gynekologi treatments use Sanity CMS + TreatmentPage (same as urologi, ortopedi, etc.). */
const GynekologiSubPage = ({
  isChatOpen,
  initialTreatment,
  sanityLang = "no",
}: BehandlingerTreatmentPageProps) => (
  <TreatmentPage
    categoryId="gynekologi"
    isChatOpen={isChatOpen}
    initialTreatment={initialTreatment}
    sanityLang={sanityLang}
  />
);

export default GynekologiSubPage;
