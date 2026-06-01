import TreatmentPage from "@/site-pages/treatments/TreatmentPage";
import {
  createBehandlingerTreatmentMetadataExport,
  createBehandlingerTreatmentPage,
} from "@/lib/behandlinger/create-treatment-page";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";

function FlereFagomraderTreatmentPage(props: BehandlingerTreatmentPageProps) {
  return <TreatmentPage categoryId="flere-fagomrader" {...props} />;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const generateMetadata =
  createBehandlingerTreatmentMetadataExport("flere-fagomrader");

export default createBehandlingerTreatmentPage(
  "flere-fagomrader",
  FlereFagomraderTreatmentPage,
);
