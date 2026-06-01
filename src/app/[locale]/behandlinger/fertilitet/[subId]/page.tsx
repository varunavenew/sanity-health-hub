import FertilitetSubPage from "@/site-pages/treatments/FertilitetSubPage";
import {
  createBehandlingerTreatmentMetadataExport,
  createBehandlingerTreatmentPage,
} from "@/lib/behandlinger/create-treatment-page";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const generateMetadata = createBehandlingerTreatmentMetadataExport("fertilitet");

export default createBehandlingerTreatmentPage("fertilitet", FertilitetSubPage);
