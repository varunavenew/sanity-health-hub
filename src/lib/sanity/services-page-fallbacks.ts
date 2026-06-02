import { categoryLandingPath } from "@/lib/sanity/category-keys";
import { serviceCategories as staticServiceCategories } from "@/data/serviceCategories";
import type { ServicesPageListItem } from "@/lib/sanity/services-page-data";

const FEATURED_CATEGORY_IDS = new Set(["gynekologi", "urologi", "fertilitet"]);

type CategoryRow = {
  categoryId?: string;
  slug?: string;
  title?: string;
  treatments?: Array<{ title?: string; slug?: string }>;
};

function treatmentPath(categoryId: string, slug: string): string {
  const segment =
    categoryId === "annet" || categoryId === "flere" ? "flere-fagomrader" : categoryId;
  return `/behandlinger/${segment}/${slug}`;
}

/** Same rules as the pre-Sanity Services page: non-featured categories + flere-fagområder treatments. */
export function buildMoreServicesFromCategories(
  categories: CategoryRow[],
  lang: "no" | "en",
): ServicesPageListItem[] {
  const items: ServicesPageListItem[] = [];

  for (const cat of categories) {
    const id = (cat.categoryId || cat.slug || "").trim();
    if (!id || FEATURED_CATEGORY_IDS.has(id)) continue;

    const isFlere =
      id === "flere-fagomrader" || id === "flere" || id === "annet";

    if (isFlere) {
      for (const t of cat.treatments || []) {
        const slug = (t.slug || "").trim();
        const title = (t.title || "").trim();
        if (!title || !slug) continue;
        items.push({ title, path: treatmentPath(id, slug) });
      }
      continue;
    }

    items.push({
      title: (cat.title || id).trim(),
      path: categoryLandingPath(id, lang),
    });
  }

  items.sort((a, b) =>
    a.title.localeCompare(b.title, lang === "en" ? "en" : "nb"),
  );
  return items.filter((item) => item.path);
}

/** Offline fallback when Sanity categories are unavailable. */
export function buildMoreServicesFromStaticCategories(
  lang: "no" | "en",
): ServicesPageListItem[] {
  const rows: CategoryRow[] = staticServiceCategories.map((cat) => ({
    categoryId: cat.id,
    title: cat.label,
    treatments: cat.subcategories.map((sub) => ({
      title: sub.label,
      slug: sub.path?.split("/").pop() || "",
    })),
  }));
  return buildMoreServicesFromCategories(rows, lang);
}

export type ServicesFaqItem = { id: string; question: string; answer: string };

export function getServicesPageFaqs(lang: "no" | "en"): ServicesFaqItem[] {
  if (lang === "en") {
    return [
      {
        id: "referral",
        question: "Do I need a referral?",
        answer:
          "You do not need a referral to book with us. Book online or call us. Bring a GP referral to your appointment if you have one.",
      },
      {
        id: "wait",
        question: "What is the waiting time?",
        answer:
          "We offer short waiting times. Most patients get an appointment within 1–3 days, depending on the type of care and availability.",
      },
      {
        id: "sick-leave",
        question: "Can I get a sick note?",
        answer:
          "Our specialists can issue a sick note when there is a medical basis. This is assessed individually during your consultation.",
      },
      {
        id: "assessment",
        question: "How does assessment work?",
        answer:
          "We offer thorough assessment across our services. It is tailored to your situation and may include consultation, examination, blood tests and imaging.",
      },
    ];
  }

  return [
    {
      id: "henvisning",
      question: "Trenger jeg henvisning?",
      answer:
        "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen.",
    },
    {
      id: "ventetid",
      question: "Hva er ventetiden?",
      answer:
        "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet.",
    },
    {
      id: "sykemelding",
      question: "Kan jeg få sykemelding?",
      answer:
        "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen.",
    },
    {
      id: "utredning",
      question: "Hvordan foregår utredning?",
      answer:
        "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk.",
    },
  ];
}
