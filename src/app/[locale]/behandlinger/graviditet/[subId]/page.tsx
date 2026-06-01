import TreatmentPage from "@/site-pages/treatments/TreatmentPage";
import {
  createBehandlingerTreatmentMetadataExport,
  createBehandlingerTreatmentPage,
} from "@/lib/behandlinger/create-treatment-page";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";

function GraviditetTreatmentPage(props: BehandlingerTreatmentPageProps) {
  return <TreatmentPage categoryId="graviditet" {...props} />;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const generateMetadata = createBehandlingerTreatmentMetadataExport("graviditet");

export default createBehandlingerTreatmentPage("graviditet", GraviditetTreatmentPage);
