import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { gynekologiSubPages } from "@/data/gynekologiSubPages";
import TreatmentPage from "./TreatmentPage";

interface Props {
  isChatOpen: boolean;
}

const GynekologiSubPage = ({ isChatOpen }: Props) => {
  const { subId } = useParams<{ subId: string }>();
  const content = subId ? gynekologiSubPages[subId] : undefined;

  if (!content) {
    // Falls back to legacy TreatmentPage for sub-routes we haven't ported yet
    return <TreatmentPage categoryId="gynekologi" isChatOpen={isChatOpen} />;
  }

  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default GynekologiSubPage;
