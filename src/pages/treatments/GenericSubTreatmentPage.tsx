import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import TreatmentPage from "./TreatmentPage";
import { treatmentContent } from "@/data/treatmentContent";
import { treatmentToSubLayout } from "@/lib/treatmentToSubLayout";

interface Props {
  categoryId: "urologi" | "ortopedi" | "graviditet" | "flere-fagomrader";
  isChatOpen: boolean;
}

/**
 * Generic sub-treatment wrapper for kategoriene utenom Gynekologi og
 * Fertilitet. Konverterer treatmentContent → SubTreatmentLayout slik at
 * ALLE undersider deler samme layout som /behandlinger/gynekologi/undersokelse.
 *
 * Hvis det ikke finnes data for kombinasjonen kategori/subId, faller den
 * tilbake til legacy TreatmentPage så ingenting går i stykker.
 */
const GenericSubTreatmentPage = ({ categoryId, isChatOpen }: Props) => {
  const { subId } = useParams<{ subId: string }>();
  const data = subId ? treatmentContent[`${categoryId}/${subId}`] : undefined;

  if (!data || !subId) {
    return <TreatmentPage categoryId={categoryId} isChatOpen={isChatOpen} />;
  }

  const content = treatmentToSubLayout({ data, categoryId, subId });
  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default GenericSubTreatmentPage;
