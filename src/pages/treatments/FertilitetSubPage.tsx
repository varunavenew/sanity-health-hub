import { useParams } from "react-router-dom";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { fertilitetSubPages } from "@/data/fertilitetSubPages";
import { getServiceImage } from "@/data/serviceImages";
import { treatmentContent } from "@/data/treatmentContent";
import { treatmentToSubLayout } from "@/lib/treatmentToSubLayout";
import NotFound from "@/pages/NotFound";
import { computeSiblingServices } from "@/lib/siblingServices";
import clinicKorridor from "@/assets/clinics/majorstuen/korridor.asset.json";
import clinicSittegruppe from "@/assets/clinics/majorstuen/korridor-sittegruppe.asset.json";
import clinicVenterom from "@/assets/clinics/majorstuen/venterom-detalj.asset.json";
import clinicHvilerom from "@/assets/clinics/majorstuen/hvilerom-hero.asset.json";
import clinicVenteromTv from "@/assets/clinics/majorstuen/venterom-tv.asset.json";

const CLINIC_IMAGES = [
  clinicHvilerom.url,
  clinicVenterom.url,
  clinicSittegruppe.url,
  clinicKorridor.url,
  clinicVenteromTv.url,
];
// Always use the lounge/rest-room image so the flow split sits opposite the hero image.
const pickClinicImage = (_key: string): string => clinicHvilerom.url;
void CLINIC_IMAGES;

interface Props {
  isChatOpen: boolean;
}

// Slug aliases so multiple URLs map to the same SubTreatmentLayout entry.
const SUB_ID_ALIASES: Record<string, string> = {
  eggfrys: "nedfrysing",
  "nedfrysing-av-egg": "nedfrysing",
};

const FertilitetSubPage = ({ isChatOpen }: Props) => {
  const { subId } = useParams<{ subId: string }>();
  const rich = subId ? treatmentContent[`fertilitet/${subId}`] : undefined;

  // 1) Rich treatmentContent entry — source-of-truth fagtekst from the document.
  if (rich && subId) {
    const content = treatmentToSubLayout({
      data: rich,
      categoryId: "fertilitet",
      subId,
    });
    return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
  }

  const resolvedId = subId ? (SUB_ID_ALIASES[subId] ?? subId) : undefined;
  const base = resolvedId ? fertilitetSubPages[resolvedId] : undefined;

  // 2) Curated SubTreatmentContent entry for pages not yet in treatmentContent.
  if (base && resolvedId) {
    const heroImage = base.heroImage ?? getServiceImage("fertilitet", resolvedId);
    const flowImage = base.flowImage ?? pickClinicImage(`fertilitet/${resolvedId}`);

    const content = {
      specialistCategory: "fertilitet" as const,
      specialistCtaLabel: "Se alle fertilitetsspesialister",
      specialistCtaHref: "/spesialister?kategori=fertilitet",
      ...base,
      heroImage,
      heroImageAlt: base.heroImageAlt ?? base.title,
      flowImage,
      flowImageAlt: base.flowImageAlt ?? "CMedical klinikk",
      siblingServices: computeSiblingServices(`/behandlinger/fertilitet/${resolvedId}`),
    };

    return <SubTreatmentLayout isChatOpen={isChatOpen} content={content} />;
  }

  return <NotFound isChatOpen={isChatOpen} />;
};

export default FertilitetSubPage;

