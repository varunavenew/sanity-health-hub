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

  // Build sibling list from the parent samleområde so "Andre ting vi hjelper med"
  // shows the other hudbehandlinger — not a back-link to the parent.
  const selfPath = `/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/${methodId}`;
  const parentData = treatmentContent["flere-fagomrader/hudbehandlinger"];
  const siblings = (parentData?.linkedServices ?? []).filter((ls) => ls.path !== selfPath);

  const dataWithSiblings = {
    ...data,
    linkedServices: siblings.length > 0 ? siblings : data.linkedServices,
  };

  const content = treatmentToSubLayout({
    data: dataWithSiblings,
    categoryId: "flere-fagomrader",
    subId: methodId,
    parentOverride: PARENT,
    grandparent: GRANDPARENT,
    canonicalOverride: selfPath,
  });

  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default HudbehandlingerMethodPage;
