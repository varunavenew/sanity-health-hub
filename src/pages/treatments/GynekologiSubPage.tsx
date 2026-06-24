import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { gynekologiSubPages } from "@/data/gynekologiSubPages";
import { treatmentContent } from "@/data/treatmentContent";
import { treatmentToSubLayout } from "@/lib/treatmentToSubLayout";
import { computeSiblingServices } from "@/lib/siblingServices";
import { getConversationCtaTitle } from "@/lib/conversationCtaTitle";
import NotFound from "@/pages/NotFound";

interface Props {
  isChatOpen: boolean;
}

const GynekologiSubPage = ({ isChatOpen }: Props) => {
  const { subId } = useParams<{ subId: string }>();
  const rich = subId ? treatmentContent[`gynekologi/${subId}`] : undefined;

  // 1) Rich treatmentContent entry — source-of-truth fagtekst from the document.
  if (rich && subId) {
    const content = treatmentToSubLayout({
      data: rich,
      categoryId: "gynekologi",
      subId,
    });
    return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
  }

  const base = subId ? gynekologiSubPages[subId] : undefined;

  // 2) Curated SubTreatmentContent entry for pages not yet in treatmentContent.
  if (base) {
    const content = {
      specialistCategory: "gynekologi" as const,
      specialistCtaLabel: "Se alle gynekologer",
      specialistCtaHref: "/spesialister?kategori=gynekologi",
      ...base,
      conversationCtaTitle: base.conversationCtaTitle ?? getConversationCtaTitle(`/behandlinger/gynekologi/${subId}`),
      siblingServices: computeSiblingServices(`/behandlinger/gynekologi/${subId}`),
    };
    return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
  }

  return <NotFound isChatOpen={isChatOpen} />;
};

export default GynekologiSubPage;

