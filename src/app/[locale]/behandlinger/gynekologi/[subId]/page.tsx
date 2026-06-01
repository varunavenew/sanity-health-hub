import GynekologiSubPage from "@/site-pages/treatments/GynekologiSubPage";
import {
  createBehandlingerTreatmentMetadataExport,
  createBehandlingerTreatmentPage,
} from "@/lib/behandlinger/create-treatment-page";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const generateMetadata = createBehandlingerTreatmentMetadataExport("gynekologi");

export default createBehandlingerTreatmentPage("gynekologi", GynekologiSubPage);
