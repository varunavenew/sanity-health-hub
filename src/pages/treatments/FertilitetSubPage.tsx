import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { fertilitetSubPages } from "@/data/fertilitetSubPages";
import TreatmentPage from "./TreatmentPage";

interface Props {
  isChatOpen: boolean;
}

const FertilitetSubPage = ({ isChatOpen }: Props) => {
  const { subId } = useParams<{ subId: string }>();
  const base = subId ? fertilitetSubPages[subId] : undefined;

  if (!base) {
    return <TreatmentPage categoryId="fertilitet" isChatOpen={isChatOpen} />;
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
