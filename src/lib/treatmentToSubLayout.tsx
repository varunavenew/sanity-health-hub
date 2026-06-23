import type { ReactNode } from "react";
import type { SubTreatmentContent } from "@/components/layout/SubTreatmentLayout";
import type { TreatmentData } from "@/data/treatmentContent";
import { getServiceImage, getServiceImageFromHref, getCategoryHeroImage } from "@/data/serviceImages";
import { getFromPriceForPath, getFromPriceForTitle } from "@/data/priceList";
import clinicKorridor from "@/assets/clinics/majorstuen/korridor.asset.json";
import clinicSittegruppe from "@/assets/clinics/majorstuen/korridor-sittegruppe.asset.json";
import clinicVenterom from "@/assets/clinics/majorstuen/venterom-detalj.asset.json";
import clinicHvilerom from "@/assets/clinics/majorstuen/hvilerom-hero.asset.json";
import clinicVenteromTv from "@/assets/clinics/majorstuen/venterom-tv.asset.json";

const CLINIC_IMAGES = [clinicHvilerom.url, clinicVenterom.url, clinicSittegruppe.url, clinicKorridor.url, clinicVenteromTv.url];
// Always use the lounge/rest-room image so the flow split mirrors the
// fertilitet pattern (image on opposite side of hero, never the same clinic shot twice).
const pickClinicImage = (_key: string): string => clinicHvilerom.url;
void CLINIC_IMAGES;


/**
 * Adapter that converts the legacy TreatmentData (used by the old
 * TreatmentPage layout — "prostata"-stilen) into the structured
 * SubTreatmentContent shape that powers SubTreatmentLayout
 * ("undersøkelse"-stilen). Brukes for å samkjøre alle undersider
 * i samme layout, uten å måtte skrive om alt innhold for hånd.
 */

export type CategoryId = "gynekologi" | "fertilitet" | "urologi" | "ortopedi" | "graviditet" | "flere-fagomrader";

const CATEGORY_LABEL: Record<CategoryId, { name: string; path: string }> = {
  gynekologi: { name: "Gynekologi", path: "/gynekologi" },
  fertilitet: { name: "Fertilitet", path: "/fertilitet" },
  urologi: { name: "Urologi", path: "/urologi" },
  ortopedi: { name: "Ortopedi", path: "/behandlinger/ortopedi" },
  graviditet: { name: "Graviditet", path: "/behandlinger/graviditet" },
  "flere-fagomrader": { name: "Flere fagområder", path: "/behandlinger/flere-fagomrader" },
};

const SPECIALIST_LABEL: Record<CategoryId, string> = {
  gynekologi: "gynekolog",
  fertilitet: "fertilitetsspesialist",
  urologi: "urolog",
  ortopedi: "ortoped",
  graviditet: "spesialist",
  "flere-fagomrader": "spesialist",
};

const STANDARD_PROMISES = [
  {
    title: "Du bestemmer hva du er komfortabel med",
    desc: "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
  },
  {
    title: "Spesialister med dybde",
    desc: "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
  },
  {
    title: "Alt under samme tak",
    desc: "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.",
  },
];

// Pages where section 2 should be an accordion (distinct sub-topics the reader
// scans and picks between — different conditions, procedures or questions).
// Everything else defaults to FORM A (one continuous prose article with
// inline subheadings — no accordion).
const FORM_B_ACCORDION: ReadonlySet<string> = new Set([
  // Urologi — different conditions/procedures
  "urologi/blaere",
  "urologi/nyrer",
  "urologi/prostata",
  // Gynekologi — distinct conditions
  "gynekologi/overgangsalder",
  "gynekologi/celleforandringer",
  "gynekologi/cyster",
  "gynekologi/vulvalidelser",
  "gynekologi/graviditet",
  // Fertilitet — distinct treatments/diagnostics
  "fertilitet/infertilitet",
  "fertilitet/assistert-befruktning",
  "fertilitet/donorbehandling",
  "fertilitet/eggfrys",
  "fertilitet/saedanalyse",
  // Ortopedi — different body regions
  "ortopedi/fot-ankel",
  "ortopedi/hand-albue",
  "ortopedi/skulder",
  // Graviditet
  "graviditet/nipt",
  // Øvrige
  "flere-fagomrader/sexologi",
]);

/** Strip simple markdown (bold/italic/links) for derived descriptions. */
const stripMarkdown = (s: string): string =>
  s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .trim();

/** Take first sentence(s) up to ~maxChars. */
const summarize = (text: string, maxChars = 220): string => {
  const cleaned = stripMarkdown(text.split("\n").find((l) => l.trim().length > 0) ?? text);
  if (cleaned.length <= maxChars) return cleaned;
  const cut = cleaned.slice(0, maxChars);
  const lastDot = cut.lastIndexOf(". ");
  return (lastDot > 80 ? cut.slice(0, lastDot + 1) : cut.trim() + "…");
};

/**
 * Render simple markdown-lite content (paragraphs + "- " bullet lists) into
 * JSX. Used so reasons sections that include lists render properly instead of
 * being truncated to a one-liner ending on a colon.
 */
const renderRichContent = (text: string): ReactNode => {
  const blocks: ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.trim().startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(stripMarkdown(lines[i].trim().slice(2)));
        i++;
      }
      blocks.push(
        <ul key={`l-${key++}`}>
          {items.map((it, idx) => <li key={idx}>{it}</li>)}
        </ul>,
      );
    } else {
      const paragraph: string[] = [];
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith("- ")) {
        paragraph.push(lines[i].trim());
        i++;
      }
      blocks.push(<p key={`p-${key++}`}>{stripMarkdown(paragraph.join(" "))}</p>);
    }
  }
  return <>{blocks}</>;
};

const splitTitleDesc = (s: string): { title: string; desc: string } => {
  // "Tittel — beskrivelse" / "Tittel: beskrivelse" / "Tittel – beskrivelse"
  const m = s.match(/^(.{3,60}?)\s[—–:-]\s(.+)$/);
  if (m) return { title: m[1].trim(), desc: m[2].trim() };
  return { title: s.trim(), desc: "" };
};

interface AdapterOptions {
  data: TreatmentData;
  categoryId: CategoryId;
  subId: string;
  heroImage?: string;
  /** Override breadcrumb parent (e.g. nest a method under a samleområde-landing). */
  parentOverride?: { name: string; path: string };
  /** Optional grandparent shown between Hjem and parent. */
  grandparent?: { name: string; path: string };
  /** Override canonical URL for nested routes. */
  canonicalOverride?: string;
}

export const treatmentToSubLayout = ({
  data,
  categoryId,
  subId,
  heroImage,
  parentOverride,
  grandparent,
  canonicalOverride,
}: AdapterOptions): SubTreatmentContent => {
  const parent = parentOverride ?? CATEGORY_LABEL[categoryId];
  const specialistLabel = SPECIALIST_LABEL[categoryId];
  const canonical = canonicalOverride ?? `/behandlinger/${categoryId}/${subId}`;
  const firstParagraph =
    data.description.split(/\n\n+/).find((p) => p.trim().length > 0)?.trim() ?? data.description;

  // ── Hero points: derive 3-4 items from benefits when present.
  const benefitItems = (data.benefits ?? []).slice(0, 4).map((b) => {
    const { title, desc } = splitTitleDesc(b);
    return { title, desc: desc || "" };
  });
  const heroPoints =
    benefitItems.length >= 2
      ? benefitItems
      : [
          { title: "Ingen ventetid", desc: "Du finner time hos oss innen få dager." },
          { title: "Ingen henvisning", desc: "Du kan bestille direkte uten henvisning fra fastlege." },
          { title: "Erfarne spesialister", desc: "Du møter leger som jobber med dette til daglig." },
        ];

  // ── Flow: from process when present, else generic 3-step.
  const flow =
    data.process && data.process.length > 0
      ? data.process.slice(0, 4).map((p, i) => ({
          n: `Trinn ${i + 1}`,
          title: p.title,
          desc: p.description,
        }))
      : [
          { n: "Trinn 1", title: "Samtale og kartlegging", desc: "Vi starter med en grundig samtale om dine plager og din historikk." },
          { n: "Trinn 2", title: "Undersøkelse og utredning", desc: "Spesialisten gjør de undersøkelsene som trengs for å forstå hva som ligger bak." },
          { n: "Trinn 3", title: "Plan for veien videre", desc: "Du får en tydelig plan — enten det er behandling, oppfølging eller trygghet i at alt er som det skal." },
        ];

  // ── Reasons: only build from rich `sections`. We intentionally do NOT fall
  // back to leftover benefits — those tend to be one-liners like "Tilbys på
  // CMedical Bekkestua" which don't deserve a full editorial section. When
  // sections are absent the whole block is hidden (ReasonsEditorial returns
  // null on empty items) and the page jumps straight to flow/related.
  let reasons: { n: string; title: string; desc: ReactNode }[] = [];
  if (data.sections && data.sections.length > 0) {
    reasons = data.sections.slice(0, 30).map((s, i) => ({
      n: String(i + 1).padStart(2, "0"),
      title: s.heading,
      desc: renderRichContent(s.content),
    }));
  }

  // ── Hero availability: lift any "Tilbys på …" benefit out so it surfaces in
  // the hero instead of becoming a thin reasons section.
  const heroAvailability = (data.benefits ?? []).find((b) => /^tilbys\s+(p[åa]|kun)/i.test(b.trim()));


  // ── Related: from linkedServices. Always attach a card image so every
  // service card matches the "Flere tjenester" image-top design.
  const related =
    data.linkedServices && data.linkedServices.length > 0
      ? data.linkedServices.slice(0, 6).map((ls) => ({
          title: ls.label,
          desc: ls.description,
          href: ls.path,
          image:
            getServiceImageFromHref(ls.path) ??
            getCategoryHeroImage(categoryId) ??
            heroImage,
        }))
      : [];

  // Detect whether the linked services represent treatments included in this
  // service (i.e. children of the canonical path). When they are children, the
  // section is part of the service story — not a generic "andre ting" footer.
  const relatedIsChildren =
    related.length > 0 && related.some((r) => r.href.startsWith(canonical + "/"));

  // Placement:
  // - No reasons + children → section 2 (intro/overview, right after hero).
  // - Has reasons + children → section 3 (after the text, before flow).
  // - Not children → keep as default "Andre ting vi hjelper med" after flow.
  const relatedAsIntro = relatedIsChildren && reasons.length === 0;
  const relatedAsServices = relatedIsChildren && reasons.length > 0;

  const heroTitle: ReactNode = data.title;

  return {
    seoTitle: `${data.title} | CMedical`,
    seoDescription: summarize(data.description, 160),
    canonical,
    parent,
    grandparent,
    title: data.title,
    heroTitle,
    heroDescription: summarize(firstParagraph, 320),
    heroThemes: data.themes,
    heroPoints,
    heroAvailability,
    booking: { kategori: categoryId, tjeneste: subId },
    primaryCtaLabel: "Se ledige tider",
    heroPrice: getFromPriceForTitle(categoryId, data.title) ?? getFromPriceForPath(canonical) ?? undefined,
    flowTitle: "Slik foregår det",
    flow,
    flowImage: pickClinicImage(`${categoryId}/${subId}`),
    flowImageAlt: `CMedical klinikk — ${data.title}`,
    heroImage: heroImage ?? getServiceImage(categoryId, subId),
    heroImageAlt: data.title,
    heroVideo: data.heroVideo,
    reasonsTitle: data.sections && data.sections.length > 0 ? `Om ${data.title}` : "Når bør du ta kontakt",
    reasonsLead: data.sections && data.sections.length > 0 ? summarize(firstParagraph, 240) : undefined,
    reasons,
    reasonsLayout: FORM_B_ACCORDION.has(`${categoryId}/${subId}`) ? "accordion" : "prose",
    promises: STANDARD_PROMISES,
    relatedTitle: related.length > 0
      ? (relatedIsChildren
          ? `Dette hjelper vi deg med innen ${data.title.toLowerCase()}`
          : "Andre ting vi hjelper med")
      : undefined,
    related,
    relatedAsIntro,
    relatedAsServices,
    ctaTitle: `Bestill time for ${data.title.toLowerCase()}`,
    ctaDescription: `Møt en erfaren ${specialistLabel} hos CMedical — ingen henvisning nødvendig, og kort ventetid.`,
    specialistCategory: (categoryId === "graviditet" || categoryId === "flere-fagomrader"
      ? "annet"
      : (categoryId as "gynekologi" | "fertilitet" | "urologi" | "ortopedi")),
    specialistSlugs: data.relatedSpecialists,
    specialistCtaLabel: `Se alle ${specialistLabel}er`,
    specialistCtaHref: `/spesialister?kategori=${categoryId}`,
  };
};
