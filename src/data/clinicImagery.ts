import imgVenteromTv from "@/assets/clinics/majorstuen/venterom-tv.asset.json";
import imgKorridor from "@/assets/clinics/majorstuen/korridor.asset.json";
import imgKorridorSittegruppe from "@/assets/clinics/majorstuen/korridor-sittegruppe.asset.json";
import imgHvilerom from "@/assets/clinics/majorstuen/hvilerom.asset.json";
import imgHvileromHero from "@/assets/clinics/majorstuen/hvilerom-hero.asset.json";
import imgVenteromDetalj from "@/assets/clinics/majorstuen/venterom-detalj.asset.json";
import imgKorridorLys from "@/assets/clinics/majorstuen/korridor.asset.json";

/** Fallback hero image per clinic slug when CMS has no hero/primary image. */
export const clinicHeroImages: Record<string, string> = {
  majorstuen: imgVenteromTv.url,
  bekkestua: imgKorridor.url,
  moss: imgKorridorSittegruppe.url,
  moelv: imgHvilerom.url,
};

/** Local interior gallery — Majorstuen only until other clinics have assets. */
export const clinicGalleries: Record<string, { src: string; alt: string }[]> = {
  majorstuen: [
    {
      src: imgVenteromTv.url,
      alt: "Venterom med lounge-stoler, planter og skjerm på CMedical Majorstuen",
    },
    {
      src: imgKorridorLys.url,
      alt: "Lys korridor med trepanel og planter på CMedical Majorstuen",
    },
    {
      src: imgHvilerom.url,
      alt: "Hvilerom med gardiner og dempet lys på CMedical Majorstuen",
    },
    {
      src: imgVenteromDetalj.url,
      alt: "Detalj fra venterommet på CMedical Majorstuen",
    },
  ],
};

/** Split-hero image on the clinics listing page. */
export const clinicsListingHeroImage = imgHvileromHero.url;
