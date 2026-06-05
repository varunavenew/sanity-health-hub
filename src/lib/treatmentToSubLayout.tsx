import type { ReactNode } from "react";
import type { SubTreatmentContent } from "@/components/layout/SubTreatmentLayout";
import type { TreatmentData } from "@/data/treatmentContent";

/**
 * Adapter that converts the legacy TreatmentData (used by the old
 * TreatmentPage layout — "prostata"-stilen) into the structured
 * SubTreatmentContent shape that powers SubTreatmentLayout
 * ("undersøkelse"-stilen). Brukes for å samkjøre alle undersider
 * i samme layout, uten å måtte skrive om alt innhold for hånd.
 */

type CategoryId = "gynekologi" | "fertilitet" | "urologi" | "ortopedi" | "graviditet" | "flere-fagomrader";

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
    eyebrow: "Trygghet",
    title: "Du bestemmer hva du er komfortabel med",
    desc: "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
  },
  {
    eyebrow: "Kompetanse",
    title: "Spesialister med dybde",
    desc: "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
  },
  {
    eyebrow: "Helhet",
    title: "Alt under samme tak",
    desc: "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.",
  },
];

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
}

export const treatmentToSubLayout = ({
  data,
  categoryId,
  subId,
  heroImage,
}: AdapterOptions): SubTreatmentContent => {
  const parent = CATEGORY_LABEL[categoryId];
  const specialistLabel = SPECIALIST_LABEL[categoryId];
  const canonical = `/behandlinger/${categoryId}/${subId}`;
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

  // ── Reasons: prefer sections (rich), fall back to benefits not used above.
  let reasons: { n: string; title: string; desc: ReactNode }[] = [];
  if (data.sections && data.sections.length > 0) {
    reasons = data.sections.slice(0, 5).map((s, i) => ({
      n: String(i + 1).padStart(2, "0"),
      title: s.heading,
      desc: renderRichContent(s.content),
    }));
  } else if (data.benefits && data.benefits.length > heroPoints.length) {
    reasons = data.benefits.slice(heroPoints.length, heroPoints.length + 5).map((b, i) => {
      const { title, desc } = splitTitleDesc(b);
      return {
        n: String(i + 1).padStart(2, "0"),
        title,
        desc: desc || "",
      };
    });
  }
  if (reasons.length === 0) {
    reasons = [
      { n: "01", title: "Tydelige plager", desc: "Du har symptomer som påvirker hverdagen og ønsker en forklaring." },
      { n: "02", title: "Trygghet og rutine", desc: "Du vil ha en rutinekontroll og bekreftelse på at alt er som det skal." },
      { n: "03", title: "Andre meningen", desc: "Du har vært til vurdering tidligere og ønsker en grundig second opinion." },
    ];
  }

  // ── Related: from linkedServices.
  const related =
    data.linkedServices && data.linkedServices.length > 0
      ? data.linkedServices.slice(0, 6).map((ls) => ({
          eyebrow: "Tjeneste",
          title: ls.label,
          desc: ls.description,
          href: ls.path,
        }))
      : [];

  const heroTitle: ReactNode = data.title;

  return {
    seoTitle: `${data.title} | CMedical`,
    seoDescription: summarize(data.description, 160),
    canonical,
    parent,
    title: data.title,
    eyebrow: `${parent.name} — CMedical`,
    heroTitle,
    heroDescription: summarize(firstParagraph, 320),
    heroPoints,
    heroBadges: [
      { label: "Ingen ventetid", icon: "clock" },
      { label: "Ingen henvisning", icon: "fileX" },
    ],
    booking: { kategori: categoryId, tjeneste: subId },
    primaryCtaLabel: "Se ledige tider",
    flowEyebrow: "Konsultasjonen",
    flowTitle: "Slik foregår det",
    flow,
    reasonsEyebrow: "Hvem passer det for",
    reasonsTitle: "Når bør du ta kontakt",
    reasonsLead: undefined,
    reasons,
    promises: STANDARD_PROMISES,
    relatedEyebrow: related.length > 0 ? "Relaterte tjenester" : undefined,
    relatedTitle: related.length > 0 ? "Andre ting vi hjelper med" : undefined,
    related,
    ctaTitle: `Bestill time for ${data.title.toLowerCase()}`,
    ctaDescription: `Møt en erfaren ${specialistLabel} hos CMedical — ingen henvisning nødvendig, og kort ventetid.`,
    specialistCategory: (categoryId === "graviditet" || categoryId === "flere-fagomrader"
      ? undefined
      : (categoryId as "gynekologi" | "fertilitet" | "urologi" | "ortopedi")),
    specialistSlugs: data.relatedSpecialists,
    specialistCtaLabel: `Se alle ${specialistLabel}er`,
    specialistCtaHref: `/spesialister?kategori=${categoryId}`,
  };
};
