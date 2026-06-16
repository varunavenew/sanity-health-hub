import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { treatmentContent } from "@/data/treatmentContent";
import { treatmentToSubLayout, type CategoryId } from "@/lib/treatmentToSubLayout";
import NotFound from "@/pages/NotFound";

interface Props {
  categoryId: CategoryId;
  isChatOpen: boolean;
}

/**
 * Generic sub-treatment wrapper for kategoriene utenom Gynekologi og
 * Fertilitet. Konverterer treatmentContent → SubTreatmentLayout slik at
 * ALLE undersider deler samme layout som /behandlinger/gynekologi/undersokelse.
 *
 * Hvis det ikke finnes data for kombinasjonen kategori/subId, viser vi 404
 * i stedet for å falle tilbake til gammel layout.
 */
const GenericSubTreatmentPage = ({ categoryId, isChatOpen }: Props) => {
  const { subId } = useParams<{ subId: string }>();
  const data = subId ? treatmentContent[`${categoryId}/${subId}`] : undefined;

  if (!data || !subId) {
    return <NotFound isChatOpen={isChatOpen} />;
  }

  const content = treatmentToSubLayout({ data, categoryId, subId });
  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default GenericSubTreatmentPage;
