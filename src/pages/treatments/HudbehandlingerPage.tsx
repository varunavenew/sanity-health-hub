import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { treatmentContent } from "@/data/treatmentContent";
import { treatmentToSubLayout } from "@/lib/treatmentToSubLayout";
import NotFound from "@/pages/NotFound";

interface Props {
  isChatOpen: boolean;
}

const PARENT = { name: "Hudhelse", path: "/behandlinger/flere-fagomrader/hudhelse" };
const GRANDPARENT = { name: "Flere tjenester", path: "/behandlinger/flere-fagomrader" };

/**
 * Landing page for Hudbehandlinger under Hudhelse. Acts as a samleområde with
 * short intro + full intro text + cards/links to the six sub-behandlinger.
 *
 * URL: /behandlinger/flere-fagomrader/hudhelse/hudbehandlinger
 */
const HudbehandlingerPage = ({ isChatOpen }: Props) => {
  const data = treatmentContent["flere-fagomrader/hudbehandlinger"];
  if (!data) return <NotFound isChatOpen={isChatOpen} />;

  const content = treatmentToSubLayout({
    data,
    categoryId: "flere-fagomrader",
    subId: "hudbehandlinger",
    parentOverride: PARENT,
    grandparent: GRANDPARENT,
    canonicalOverride: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger",
  });

  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default HudbehandlingerPage;
