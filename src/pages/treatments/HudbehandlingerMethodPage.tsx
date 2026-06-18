import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { treatmentContent } from "@/data/treatmentContent";
import { treatmentToSubLayout } from "@/lib/treatmentToSubLayout";
import NotFound from "@/pages/NotFound";

interface Props {
  isChatOpen: boolean;
}

const PARENT = {
  name: "Hudbehandlinger",
  path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger",
};
const GRANDPARENT = { name: "Hudhelse", path: "/behandlinger/flere-fagomrader/hudhelse" };

/**
 * Under-behandling pages nested under Hudhelse › Hudbehandlinger.
 *
 * URL: /behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/<methodId>
 * Breadcrumb: Hjem › Hudhelse › Hudbehandlinger › <Under-behandling>
 */
const HudbehandlingerMethodPage = ({ isChatOpen }: Props) => {
  const { methodId } = useParams<{ methodId: string }>();
  if (!methodId) return <NotFound isChatOpen={isChatOpen} />;

  const dataKey = `flere-fagomrader/hudbehandlinger/${methodId}`;
  const data = treatmentContent[dataKey];
  if (!data) return <NotFound isChatOpen={isChatOpen} />;

  const content = treatmentToSubLayout({
    data,
    categoryId: "flere-fagomrader",
    subId: methodId,
    parentOverride: PARENT,
    grandparent: GRANDPARENT,
    canonicalOverride: `/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/${methodId}`,
  });

  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default HudbehandlingerMethodPage;
