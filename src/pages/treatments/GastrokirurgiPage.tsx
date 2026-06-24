import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { treatmentContent } from "@/data/treatmentContent";
import { treatmentToSubLayout } from "@/lib/treatmentToSubLayout";
import NotFound from "@/pages/NotFound";

interface Props {
  isChatOpen: boolean;
}

/**
 * Dedicated landing page for Mage- og tarmlidelser (Gastrokirurgi).
 *
 * Removes the separate prose reasons/editorial section ("Hva vi behandler hos oss")
 * so the page flows directly from hero → "Dette hjelper vi deg med" cards →
 * "Slik foregår det" without redundant duplicate intro text between hero and cards.
 *
 * No shared components are modified — the override is applied locally by
 * passing empty reasons to SubTreatmentLayout.
 */
const GastrokirurgiPage = ({ isChatOpen }: Props) => {
  const data = treatmentContent["flere-fagomrader/gastrokirurgi"];
  if (!data) return <NotFound isChatOpen={isChatOpen} />;

  const content = treatmentToSubLayout({
    data,
    categoryId: "flere-fagomrader",
    subId: "gastrokirurgi",
  });

  return (
    <SubTreatmentLayout
      isChatOpen={isChatOpen}
      content={{ ...content, reasons: [] }}
    />
  );
};

export default GastrokirurgiPage;
