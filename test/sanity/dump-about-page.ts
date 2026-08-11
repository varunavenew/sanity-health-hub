/**
 * Read-only dump of aboutPage from developer Sanity.
 * Run: npx tsx test/sanity/dump-about-page.ts
 */
import { sanityClient as client, DATASET, PROJECT_ID } from "./config";

async function main() {
  console.log("project", PROJECT_ID, "dataset", DATASET);
  if (DATASET !== "developer") {
    throw new Error(`Refusing: dataset is ${DATASET}, expected developer`);
  }

  const doc = await client.fetch(`*[_id == "aboutPage" || _type == "aboutPage"][0]{
    _id,
    _type,
    title,
    subtitle,
    heroEyebrow,
    "slug": slug,
    heroImage{
      asset->{_id, url, originalFilename, metadata{dimensions}},
      crop,
      hotspot
    },
    heroImageAlt,
    body,
    clinicsSection{
      showSection,
      title,
      "clinicCount": count(clinics),
      clinics[]->{_id, "title": title, "slug": slug.current}
    },
    pageSections[]{
      _key,
      _type,
      title,
      description,
      displayMode,
      limit,
      variant,
      "specialistCount": count(specialists),
      specialists[]->{_id, name, title, "slug": slug.current},
      ctaCollection->{_id, title, primaryLabel, secondaryLabel, heading, description},
      primaryLabel,
      heading,
      description
    },
    seo
  }`);

  const bodyNo = Array.isArray(doc?.body)
    ? doc.body.find((b: any) => b._key === "no" || b.language === "no")?.value ||
      (doc.body[0]?._type === "block" ? doc.body : null)
    : null;

  const summarizeBlocks = (blocks: any[]) =>
    (blocks || [])
      .filter((b) => b?._type === "block")
      .map((b) => ({
        style: b.style,
        text: (b.children || []).map((c: any) => c.text).join(""),
      }));

  console.log(JSON.stringify({
    id: doc?._id,
    title: doc?.title,
    subtitle: doc?.subtitle,
    heroEyebrow: doc?.heroEyebrow,
    slug: doc?.slug,
    heroImage: doc?.heroImage,
    heroImageAlt: doc?.heroImageAlt,
    bodyNo: summarizeBlocks(
      Array.isArray(doc?.body) && doc.body[0]?._type === "block"
        ? doc.body
        : Array.isArray(doc?.body)
          ? (doc.body.find((x: any) => x._key === "no" || x.language === "no")?.value || [])
          : [],
    ),
    bodyEn: summarizeBlocks(
      Array.isArray(doc?.body)
        ? (doc.body.find((x: any) => x._key === "en" || x.language === "en")?.value || [])
        : [],
    ),
    clinicsSection: doc?.clinicsSection,
    pageSections: doc?.pageSections,
    seo: doc?.seo,
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
