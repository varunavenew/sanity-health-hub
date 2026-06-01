import TreatmentPage from "@/site-pages/treatments/TreatmentPage";
import {
  createBehandlingerTreatmentMetadataExport,
  createBehandlingerTreatmentPage,
} from "@/lib/behandlinger/create-treatment-page";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";

function UrologiTreatmentPage(props: BehandlingerTreatmentPageProps) {
  return <TreatmentPage categoryId="urologi" {...props} />;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const generateMetadata = createBehandlingerTreatmentMetadataExport("urologi");

export default createBehandlingerTreatmentPage("urologi", UrologiTreatmentPage);
