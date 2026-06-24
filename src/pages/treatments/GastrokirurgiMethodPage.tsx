import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { treatmentContent } from "@/data/treatmentContent";
import { treatmentToSubLayout } from "@/lib/treatmentToSubLayout";
import NotFound from "@/pages/NotFound";

interface Props {
  isChatOpen: boolean;
}

/**
 * Method-level under-pages for the Gastrokirurgi samleområde.
 *
 * URL: /behandlinger/flere-fagomrader/gastrokirurgi/<methodId>
 * Breadcrumb: Hjem › Flere fagområder › Gastrokirurgi › <Metode>
 *
 * Some methods (sleeve-gastrektomi, bariatrisk-kirurgi) re-use the existing
 * flat data keys; placeholders for nye metoder ligger på
 * "flere-fagomrader/gastrokirurgi/<slug>".
 */
const METHOD_DATA_KEY: Record<string, string> = {
  "overvektskirurgi": "flere-fagomrader/overvektskirurgi",
};

const GASTRO_PARENT = {
  name: "Gastrokirurgi",
  path: "/behandlinger/flere-fagomrader/gastrokirurgi",
};

const GastrokirurgiMethodPage = ({ isChatOpen }: Props) => {
  const { methodId } = useParams<{ methodId: string }>();
  if (!methodId) return <NotFound isChatOpen={isChatOpen} />;

  const dataKey =
    METHOD_DATA_KEY[methodId] ?? `flere-fagomrader/gastrokirurgi/${methodId}`;
  const data = treatmentContent[dataKey];
  if (!data) return <NotFound isChatOpen={isChatOpen} />;

  const content = treatmentToSubLayout({
    data,
    categoryId: "flere-fagomrader",
    subId: methodId,
    parentOverride: GASTRO_PARENT,
    grandparent: { name: "Flere fagområder", path: "/behandlinger/flere-fagomrader" },
    canonicalOverride: `/behandlinger/flere-fagomrader/gastrokirurgi/${methodId}`,
  });

  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default GastrokirurgiMethodPage;
