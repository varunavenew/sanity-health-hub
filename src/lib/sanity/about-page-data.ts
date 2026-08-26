import { mapClinicListRows } from "@/lib/sanity/clinic-list-row";
import { normalizePageSections } from "@/lib/sanity/page-sections";

/** Maps a normalized aboutPage document to the shape `useAboutPage` returns. */
export function mapAboutPageData(data: Record<string, unknown> | null, lang: "no" | "en") {
  if (!data) return null;
  const title =
    typeof data.title === "string"
      ? data.title
      : ((data.title as { value?: string }[] | undefined)?.[0]?.value ?? "");
  const subtitle =
    typeof data.subtitle === "string"
      ? data.subtitle
      : ((data.subtitle as { value?: string }[] | undefined)?.[0]?.value ?? "");
  const rawBody = data.body;
  const body =
    Array.isArray(rawBody) && rawBody[0]?._type === "block"
      ? rawBody
      : ((rawBody as { value?: unknown }[] | undefined)?.[0]?.value ?? rawBody);
  const bodyBlocks = ((body as unknown[]) || [])
    .filter((block: unknown) => block && (block as { _type?: string })._type === "block")
    .map((block: unknown) => {
      const b = block as {
        _key?: string;
        style?: string;
        children?: { text?: string }[];
      };
      return {
        _key: b._key,
        style: typeof b.style === "string" ? b.style : "normal",
        text: (b.children || []).map((c) => c.text).join(""),
      };
    })
    .filter((block) => Boolean(block.text?.trim()));
  const sections = bodyBlocks.map((block) => ({
    title: "",
    content: block.text,
  }));
  const rawSection = data.clinicsSection as
    | {
        showSection?: boolean;
        title?: string;
        clinics?: unknown[];
      }
    | undefined;
  const curatedClinics = rawSection?.clinics?.length
    ? mapClinicListRows(rawSection.clinics, lang)
    : undefined;
  const clinicsSection = rawSection
    ? {
        showSection: rawSection.showSection !== false,
        title: typeof rawSection.title === "string" ? rawSection.title.trim() : "",
        clinics: curatedClinics,
      }
    : undefined;

  return {
    ...data,
    title,
    subtitle,
    body,
    bodyBlocks,
    sections,
    clinicsSection,
    pageSections: normalizePageSections(data.pageSections),
  };
}
