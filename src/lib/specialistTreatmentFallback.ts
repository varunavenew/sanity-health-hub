import { treatmentContent } from "@/data/treatmentContent";
import { gynekologiSubPages } from "@/data/gynekologiSubPages";
import { fertilitetSubPages } from "@/data/fertilitetSubPages";
import { getDedicatedServiceImage } from "@/data/serviceImages";

/**
 * Static fallback for specialist-profile treatment cards when a Sanity
 * treatment `_id` cannot be fetched. Parses `treatment-{category}-{slug}`.
 */
const CATEGORY_PREFIXES = ["flere-fagomrader", "gynekologi", "graviditet", "fertilitet", "urologi", "ortopedi"];

/** Legacy ids whose page moved (mirrors the redirects in App.tsx). */
const ALIASES: Record<string, string> = {
  "gynekologi/graviditet": "graviditet/svangerskapsoppfolging",
  "gynekologi/spontanabort": "graviditet/spontanabort",
  "flere-fagomrader/sleeve-gastrektomi": "flere-fagomrader/overvektskirurgi",
};

export interface ProfileTreatmentCard {
  id: string;
  title: string;
  text: string;
  image?: string;
  to: string;
}

export const parseTreatmentId = (id: string): { category: string; slug: string } | null => {
  const rest = id.replace(/^treatment-/, "");
  const category = CATEGORY_PREFIXES.find((c) => rest.startsWith(`${c}-`));
  if (!category) return null;
  return { category, slug: rest.slice(category.length + 1) };
};

export const staticTreatmentCard = (id: string): ProfileTreatmentCard | null => {
  const parsed = parseTreatmentId(id);
  if (!parsed) return null;
  const key = ALIASES[`${parsed.category}/${parsed.slug}`] ?? `${parsed.category}/${parsed.slug}`;
  const [cat, slug] = key.split("/");
  const sub = cat === "gynekologi" ? gynekologiSubPages[slug] : cat === "fertilitet" ? fertilitetSubPages[slug] : undefined;
  const tc = treatmentContent[key];
  if (!sub && !tc) return null;
  return {
    id,
    title: sub?.title || tc!.title,
    text: sub?.heroDescription || tc?.description || "",
    image: getDedicatedServiceImage(cat, slug) || sub?.heroImage || tc?.heroImage,
    to: `/behandlinger/${cat}/${slug}`,
  };
};
