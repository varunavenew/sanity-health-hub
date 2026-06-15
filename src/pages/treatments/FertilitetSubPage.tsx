import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { fertilitetSubPages } from "@/data/fertilitetSubPages";
import { getServiceImage } from "@/data/serviceImages";
import TreatmentPage from "./TreatmentPage";
import clinicKorridor from "@/assets/clinics/majorstuen/korridor.asset.json";
import clinicSittegruppe from "@/assets/clinics/majorstuen/korridor-sittegruppe.asset.json";
import clinicVenterom from "@/assets/clinics/majorstuen/venterom-detalj.asset.json";
import clinicHvilerom from "@/assets/clinics/majorstuen/hvilerom.asset.json";
import clinicVenteromTv from "@/assets/clinics/majorstuen/venterom-tv.asset.json";

const CLINIC_IMAGES = [
  clinicKorridor.url,
  clinicSittegruppe.url,
  clinicVenterom.url,
  clinicHvilerom.url,
  clinicVenteromTv.url,
];
const pickClinicImage = (key: string): string => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return CLINIC_IMAGES[hash % CLINIC_IMAGES.length];
};

interface Props {
  isChatOpen: boolean;
}

const FertilitetSubPage = ({ isChatOpen }: Props) => {
  const { subId } = useParams<{ subId: string }>();
  const base = subId ? fertilitetSubPages[subId] : undefined;

  if (!base || !subId) {
    return <TreatmentPage categoryId="fertilitet" isChatOpen={isChatOpen} />;
  }

  const heroImage = base.heroImage ?? getServiceImage("fertilitet", subId);
  const flowImage = base.flowImage ?? pickClinicImage(`fertilitet/${subId}`);

  const content = {
    specialistCategory: "fertilitet" as const,
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
    ...base,
    heroImage,
    heroImageAlt: base.heroImageAlt ?? base.title,
    flowImage,
    flowImageAlt: base.flowImageAlt ?? "CMedical klinikk",
  };

  return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
};

export default FertilitetSubPage;
