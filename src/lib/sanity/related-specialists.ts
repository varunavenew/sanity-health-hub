import { normalizeCategoryFilterKey } from "@/lib/sanity/category-keys";
import type { Specialist } from "@/lib/sanity/specialist-types";

function clinicKeys(specialist: Specialist): Set<string> {
  const keys = new Set<string>();
  for (const ref of specialist.clinicRefs ?? []) {
    const slug = ref.slug?.trim().toLowerCase();
    const label = ref.label?.trim().toLowerCase();
    if (slug) keys.add(slug);
    if (label) keys.add(label);
  }
  for (const label of specialist.clinics ?? []) {
    const value = label?.trim().toLowerCase();
    if (value) keys.add(value);
  }
  return keys;
}

function sharesClinic(a: Specialist, b: Specialist): boolean {
  const other = clinicKeys(b);
  for (const key of clinicKeys(a)) {
    if (other.has(key)) return true;
  }
  return false;
}

function samePrimaryField(current: Specialist, peer: Specialist): boolean {
  const field = normalizeCategoryFilterKey(current.category || "");
  if (!field || field === "alle") return false;
  return normalizeCategoryFilterKey(peer.category || "") === field;
}

/**
 * «Andre spesialister samme fagområde»: all peers in the specialist’s main
 * category, keeping the listing sort of `all`. If nobody else is in that
 * field, fall back to same-clinic specialists so the band is never empty.
 */
export function resolveRelatedSpecialistsForProfile(
  current: Specialist,
  all: Specialist[],
): Specialist[] {
  const others = all.filter((s) => s.slug && s.slug !== current.slug);
  const inField = others.filter((s) => samePrimaryField(current, s));
  if (inField.length > 0) return inField;
  return others.filter((s) => sharesClinic(current, s));
}
