import { getServiceImageFromHref } from "@/data/serviceImages";

import audienceSingle from "@/assets/fertility/audience-single.jpg";
import toKvinnerAsset from "@/assets/fertility/to-kvinner.png.asset.json";
import mannligFertilitetAsset from "@/assets/fertility/mannlig-fertilitet.png.asset.json";
import heterofiltParAsset from "@/assets/fertility/heterofilt-par.png.asset.json";

/** Felles landingsside for alle målgruppekortene. */
export const AUDIENCE_LANDING =
  "/behandlinger/fertilitet/assistert-befruktning-for-par-og-single";

export interface FertilityAudience {
  title: string;
  desc: string;
  href: string;
  image: string;
}

/**
 * Én kilde til sannhet for "Alle er velkomne"-kortene på fertilitetssidene.
 * Teksten er ordrett fra kundens innhold.
 */
export const fertilityAudiences: FertilityAudience[] = [
  {
    title: "Mann og kvinne i parforhold",
    desc:
      "Har dere prøvd en stund – uten å lykkes? Mange av parene som kommer til oss har forsøkt å bli gravide over tid. Uansett hvor dere er i prosessen, møter vi dere med forståelse og respekt.",
    href: `${AUDIENCE_LANDING}#mann-og-kvinne-i-parforhold`,
    image: heterofiltParAsset.url,
  },
  {
    title: "To kvinner i parforhold",
    desc:
      "Flere og flere kvinner velger å få barn sammen som par. Hos oss møter dere et fagmiljø med erfaring, trygghet og forståelse for deres situasjon.",
    href: `${AUDIENCE_LANDING}#to-kvinner-i-parforhold`,
    image: toKvinnerAsset.url,
  },
  {
    title: "Singel kvinne",
    desc:
      "Ønsker du å få barn på egen hånd – eller bevare muligheten for senere? Mange kvinner kommer til oss for å utforske mulighetene – enten de er klare for behandling, ønsker mer kunnskap, eller vurderer å fryse ned egg for fremtiden.",
    href: `${AUDIENCE_LANDING}#singel-kvinne`,
    image: getServiceImageFromHref("/behandlinger/fertilitet/donorbehandling") ?? audienceSingle,
  },
  {
    title: "Singel mann",
    desc:
      "Ønsker du å få innsikt i din fertilitet? En sædanalyse gir viktig informasjon om sædkvaliteten din – og kunnskap gjør det lettere å ta gode valg, både nå og i fremtiden.",
    href: `${AUDIENCE_LANDING}#singel-mann`,
    image: mannligFertilitetAsset.url,
  },
];
