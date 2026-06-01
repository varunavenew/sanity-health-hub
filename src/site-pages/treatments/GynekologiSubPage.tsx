"use client";

import { useParams } from "@/lib/router";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { gynekologiSubPages } from "@/data/gynekologiSubPages";
import TreatmentPage from "./TreatmentPage";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";

const GynekologiSubPage = ({
  isChatOpen,
  initialTreatment,
  sanityLang,
}: BehandlingerTreatmentPageProps) => {
  const { subId } = useParams<{ subId: string }>();
  const base = subId ? gynekologiSubPages[subId] : undefined;

  if (!base) {
    return (
      <TreatmentPage
        categoryId="gynekologi"
        isChatOpen={isChatOpen}
        initialTreatment={initialTreatment}
        sanityLang={sanityLang}
      />
    );
  }

  // Inject defaults so every gynekologi sub-page gets the standard
  // "specialists who do this" section before the booking footer.
  const content = {
    specialistCategory: "gynekologi" as const,
    specialistCtaLabel: "Se alle gynekologer",
    specialistCtaHref: "/spesialister?kategori=gynekologi",
    ...base,
  };

  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default GynekologiSubPage;
