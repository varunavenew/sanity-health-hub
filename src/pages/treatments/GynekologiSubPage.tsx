import { useParams, Navigate } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { gynekologiSubPages } from "@/data/gynekologiSubPages";

interface Props {
  isChatOpen: boolean;
}

const GynekologiSubPage = ({ isChatOpen }: Props) => {
  const { subId } = useParams<{ subId: string }>();
  const content = subId ? gynekologiSubPages[subId] : undefined;

  if (!content) {
    return <Navigate to="/gynekologi" replace />;
  }

  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default GynekologiSubPage;
