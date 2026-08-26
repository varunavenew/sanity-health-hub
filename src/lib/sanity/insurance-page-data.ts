import { normalizePageSections } from "@/lib/sanity/page-sections";

/** Maps a normalized insurancePage document to the shape `useInsurancePage` returns. */
export function mapInsurancePageData(data: Record<string, unknown> | null) {
  if (!data) return null;
  const localizedPartners = ((data.partnersLocalized as { name?: string }[]) || [])
    .map((p) => p?.name)
    .filter(Boolean) as string[];
  const partnerNames =
    localizedPartners.length > 0
      ? localizedPartners
      : ((data.partners as string[]) || []);
  return {
    ...data,
    subtitle: (data.introText as string) || "",
    companies: partnerNames.map((p) => ({ name: p })),
    steps: ((data.steps as { title?: string; description?: string }[]) || []).map(
      (s, i) => ({
        num: String(i + 1),
        title: s.title,
        desc: s.description,
      }),
    ),
    benefits: ((data.benefits as { title?: string; description?: string }[]) || []).map(
      (b) => ({
        title: b.title,
        desc: b.description,
      }),
    ),
    pageSections: normalizePageSections(data.pageSections),
  };
}
