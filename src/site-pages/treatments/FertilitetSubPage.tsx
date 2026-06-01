"use client";

import { useParams } from "@/lib/router";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { fertilitetSubPages } from "@/data/fertilitetSubPages";
import TreatmentPage from "./TreatmentPage";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";

const FertilitetSubPage = ({
  isChatOpen,
  initialTreatment,
  sanityLang,
}: BehandlingerTreatmentPageProps) => {
  const { subId } = useParams<{ subId: string }>();
  const base = subId ? fertilitetSubPages[subId] : undefined;

  if (!base) {
    return (
      <TreatmentPage
        categoryId="fertilitet"
        isChatOpen={isChatOpen}
        initialTreatment={initialTreatment}
        sanityLang={sanityLang}
      />
    );
  }

  const content = {
    specialistCategory: "fertilitet" as const,
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
    ...base,
  };

  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default FertilitetSubPage;
