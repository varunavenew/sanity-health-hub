import { stripBehandlingerPrefix } from "@/lib/navigation/coerce-path";
import { assetSrc, type ImageRef } from "@/lib/media";
import gynekologiCategory from "@/assets/categories/gynekologi.jpg";
import flereFagomraderCategory from "@/assets/categories/flere-fagomrader.jpg";
import hudbehandlingerCard from "@/assets/services/flere-hudhelse-cards/hudbehandlinger.webp";
import behandlingsutstyrCard from "@/assets/services/flere-hudhelse-cards/behandlingsutstyr.webp";
import hudpleieprodukterCard from "@/assets/services/flere-hudhelse-cards/hudpleieprodukter.webp";
import gynekologiskRobotCard from "@/assets/services/flere-robotkirurgi-cards/gynekologisk-robotkirurgi.jpg";
import urologiskRobotCard from "@/assets/services/flere-robotkirurgi-cards/urologisk-robotkirurgi.jpg";
import gastroRobotCard from "@/assets/services/flere-robotkirurgi-cards/gastrokirurgisk-robotkirurgi.jpg";
import robotkirurgiHero from "@/assets/services/flere-robotkirurgi-cards/robotkirurgi-hero.jpg";
import overvektskirurgiCard from "@/assets/services/flere-gastrokirurgi-cards/overvektskirurgi.jpg";
import brokkoperasjonCard from "@/assets/services/flere-gastrokirurgi-cards/brokkoperasjon.jpg";
import hemorroiderCard from "@/assets/services/flere-gastrokirurgi-cards/hemorroider.jpg";
import pigmentSolskaderCard from "@/assets/services/flere-hudbehandlinger-cards/pigmentforandringer-og-solskader.png";
import rodhetBlodkarCard from "@/assets/services/flere-hudbehandlinger-cards/rodhet-og-synlige-blodkar.png";
import hudstrukturCard from "@/assets/services/flere-hudbehandlinger-cards/forbedring-av-hudstruktur.png";
import kosmetiskDermatologiCard from "@/assets/services/flere-hudbehandlinger-cards/kosmetisk-dermatologi.png";
import elastisitetVolumCard from "@/assets/services/flere-hudbehandlinger-cards/elastisitet-og-volum.png";
import foflekksjekkCard from "@/assets/services/flere-hudbehandlinger-cards/foflekksjekk.png";

const OVERVEKST_SLUG = ["overvek", "ts", "kirurgi"].join("");
/** Link typo (k-s-t-s-k) used on some cards before alias fix */
const OVERVEKST_LINK_TYPO = ["overvek", "st", "sk", "irurgi"].join("");
const FLERE_FLAT_CHILD_SLUGS = new Set([
  "hudbehandlinger",
  "behandlingsutstyr",
  "hudpleieprodukter",
  "pigmentforandringer-og-solskader",
  "rodhet-og-synlige-blodkar",
  "forbedring-av-hudstruktur",
  "kosmetisk-dermatologi",
  "elastisitet-og-volum",
  "foflekksjekk",
  "brokkoperasjon",
  "hemorroider",
  "overvektskirurgi",
]);

function lastSegment(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1]?.toLowerCase() ?? "";
}

function toAssetUrl(ref: ImageRef | undefined): string | undefined {
  if (!ref) return undefined;
  const url = assetSrc(ref);
  return url || undefined;
}

/** Card image by linked-service path tail (demo parity). */
const IMAGE_BY_SLUG: Record<string, string | undefined> = {
  hudbehandlinger: toAssetUrl(hudbehandlingerCard),
  behandlingsutstyr: toAssetUrl(behandlingsutstyrCard),
  hudpleieprodukter: toAssetUrl(hudpleieprodukterCard),
  "pigmentforandringer-og-solskader": toAssetUrl(pigmentSolskaderCard),
  "rodhet-og-synlige-blodkar": toAssetUrl(rodhetBlodkarCard),
  "forbedring-av-hudstruktur": toAssetUrl(hudstrukturCard),
  "kosmetisk-dermatologi": toAssetUrl(kosmetiskDermatologiCard),
  "elastisitet-og-volum": toAssetUrl(elastisitetVolumCard),
  foflekksjekk: toAssetUrl(foflekksjekkCard),
  "ovrige/pigmentforandringer-og-solskader": toAssetUrl(pigmentSolskaderCard),
  "ovrige/rodhet-og-synlige-blodkar": toAssetUrl(rodhetBlodkarCard),
  "ovrige/forbedring-av-hudstruktur": toAssetUrl(hudstrukturCard),
  "ovrige/kosmetisk-dermatologi": toAssetUrl(kosmetiskDermatologiCard),
  "ovrige/elastisitet-og-volum": toAssetUrl(elastisitetVolumCard),
  "ovrige/foflekksjekk": toAssetUrl(foflekksjekkCard),
  "hudbehandlinger/pigmentforandringer-og-solskader": toAssetUrl(pigmentSolskaderCard),
  "hudbehandlinger/rodhet-og-synlige-blodkar": toAssetUrl(rodhetBlodkarCard),
  "hudbehandlinger/forbedring-av-hudstruktur": toAssetUrl(hudstrukturCard),
  "hudbehandlinger/kosmetisk-dermatologi": toAssetUrl(kosmetiskDermatologiCard),
  "hudbehandlinger/elastisitet-og-volum": toAssetUrl(elastisitetVolumCard),
  "hudbehandlinger/foflekksjekk": toAssetUrl(foflekksjekkCard),
  hudhelse: toAssetUrl(flereFagomraderCategory),
  robotkirurgi: toAssetUrl(robotkirurgiHero),
  gastrokirurgi: toAssetUrl(gastroRobotCard),
  "flere-fagomrader/gastrokirurgi": toAssetUrl(gastroRobotCard),
  "ovrige/gastrokirurgi": toAssetUrl(gastroRobotCard),
  overvektskirurgi: toAssetUrl(overvektskirurgiCard),
  /** Legacy typo in some CMS paths */
  overvekstkirurgi: toAssetUrl(overvektskirurgiCard),
  [OVERVEKST_LINK_TYPO]: toAssetUrl(overvektskirurgiCard),
  [`ovrige/${OVERVEKST_LINK_TYPO}`]: toAssetUrl(overvektskirurgiCard),
  brokkoperasjon: toAssetUrl(brokkoperasjonCard),
  hemorroider: toAssetUrl(hemorroiderCard),
  "ovrige/hemorroider": toAssetUrl(hemorroiderCard),
  "ovrige/overvektskirurgi": toAssetUrl(overvektskirurgiCard),
  "ovrige/brokkoperasjon": toAssetUrl(brokkoperasjonCard),
  "gastrokirurgi/overvektskirurgi": toAssetUrl(overvektskirurgiCard),
  "gastrokirurgi/brokkoperasjon": toAssetUrl(brokkoperasjonCard),
  "gastrokirurgi/hemorroider-og-endetarmsplager": toAssetUrl(hemorroiderCard),
  "flere-fagomrader/gastrokirurgi/overvektskirurgi": toAssetUrl(overvektskirurgiCard),
  "flere-fagomrader/gastrokirurgi/brokkoperasjon": toAssetUrl(brokkoperasjonCard),
  "gynekologi/robotkirurgi": toAssetUrl(gynekologiskRobotCard),
  "urologi/robotkirurgi": toAssetUrl(urologiskRobotCard),
};

function imageKeyFromPath(path: string): string {
  const stripped = stripBehandlingerPrefix(path);
  const parts = stripped.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`.toLowerCase();
  }
  return lastSegment(stripped);
}

export function resolveFlereLinkedServiceImage(
  path: string,
  explicit?: string,
): string | undefined {
  const key = imageKeyFromPath(path);
  const slug = lastSegment(path);
  const mapped = IMAGE_BY_SLUG[key] ?? IMAGE_BY_SLUG[slug];
  if (mapped) return mapped;

  if (explicit?.trim()) {
    return toAssetUrl(explicit) ?? explicit.trim();
  }
  return undefined;
}

/**
 * Canonical public paths use category slugs (e.g. /ovrige/…, /gynekologi/…).
 * Legacy /behandlinger/… values are normalized at runtime via stripBehandlingerPrefix.
 */
export function resolveFlereLinkedServicePath(
  path: string,
  lang: "no" | "en" = "no",
): string {
  let href = stripBehandlingerPrefix(path);
  const categorySegment = lang === "en" ? "other" : "ovrige";

  href = href.replace(/^\/flere-fagomrader\//, `/${categorySegment}/`);

  const match = href.match(/^\/(ovrige|other)\/([^/]+)\/([^/]+)$/);
  if (match && FLERE_FLAT_CHILD_SLUGS.has(match[3]!.toLowerCase())) {
    href = `/${match[1]}/${match[3]}`;
  }

  return href;
}

export const FLERE_EXPERT_SEE_ALL: Record<
  string,
  { no: { href: string; label: string }; en: { href: string; label: string } }
> = {
  hudhelse: {
    no: { href: "/ovrige/hudbehandlinger", label: "Se alle behandlinger" },
    en: { href: "/other/hudbehandlinger", label: "See all treatments" },
  },
  hudbehandlinger: {
    no: { href: "/ovrige/hudbehandlinger", label: "Se alle hudbehandlinger" },
    en: { href: "/other/hudbehandlinger", label: "See all skin treatments" },
  },
  robotkirurgi: {
    no: { href: "/ovrige", label: "Se alle behandlinger" },
    en: { href: "/other", label: "See all treatments" },
  },
  gastrokirurgi: {
    no: { href: "/ovrige/gastrokirurgi", label: "Se alle gastrokirurgi-tjenester" },
    en: { href: "/other/gastrokirurgi", label: "See all gastrointestinal surgery services" },
  },
};
