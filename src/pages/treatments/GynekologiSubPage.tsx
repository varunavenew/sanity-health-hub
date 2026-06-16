import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { gynekologiSubPages } from "@/data/gynekologiSubPages";
import TreatmentPage from "./TreatmentPage";
import { treatmentContent } from "@/data/treatmentContent";
import { treatmentToSubLayout } from "@/lib/treatmentToSubLayout";

interface Props {
  isChatOpen: boolean;
}

const GynekologiSubPage = ({ isChatOpen }: Props) => {
  const { subId } = useParams<{ subId: string }>();
  const base = subId ? gynekologiSubPages[subId] : undefined;

  // 1) Curated SubTreatmentContent entry.
  if (base) {
    const content = {
      specialistCategory: "gynekologi" as const,
      specialistCtaLabel: "Se alle gynekologer",
      specialistCtaHref: "/spesialister?kategori=gynekologi",
      ...base,
    };
    return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
  }

  // 2) Rich treatmentContent entry — adapt så fagteksten fra dokumentet
  //    vises ordrett i seksjon 2 (samme som NIPT).
  const rich = subId ? treatmentContent[`gynekologi/${subId}`] : undefined;
  if (rich && subId) {
    const content = treatmentToSubLayout({
      data: rich,
      categoryId: "gynekologi",
      subId,
    });
    return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
  }

  // 3) Legacy fallback.
  return <TreatmentPage categoryId="gynekologi" isChatOpen={isChatOpen} />;
};

export default GynekologiSubPage;

