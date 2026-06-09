// Schema: Services Page (Tjenester)
import { TreatmentIcon } from "./icons";
import { i18nFaqItemPreview, i18nSlugFieldFromTitle, pickNo } from "./i18n";
import { pageSectionsField } from "./pageSections";

const i18nString = {
  type: "internationalizedArrayString",
};

const i18nText = {
  type: "internationalizedArrayText",
};

export default {
  name: "servicesPage",
  title: "Tjenester",
  type: "document",
  icon: TreatmentIcon,
  groups: [
    { name: "content", title: "Innhold", default: true },
    { name: "faq", title: "FAQ" },
  ],
  fields: [
    {
      name: "breadcrumbHome",
      title: "Brødsmule — hjem",
      group: "content",
      ...i18nString,
    },
    {
      name: "title",
      title: "Sidetittel (H1)",
      group: "content",
      ...i18nString,
      validation: (Rule: any) => Rule.required(),
    },
    { ...i18nSlugFieldFromTitle("title", { group: "content" }) },
    {
      name: "eyebrow",
      title: "Eyebrow over tittel",
      description: "Liten etikett over hovedoverskriften",
      ...i18nString,
    },
    {
      name: "heroImage",
      title: "Hero-bilde",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "introText",
      title: "Introduksjonstekst",
      ...i18nText,
    },
    {
      name: "badges",
      title: "Hero-badges",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Tekst", ...i18nString },
          ],
          preview: {
            select: { label: "label" },
            prepare({ label }: { label?: { value?: string }[] }) {
              const no = label?.find((l) => l.language === "no" || l._key === "no");
              return { title: no?.value || label?.[0]?.value || "Badge" };
            },
          },
        },
      ],
    },
    {
      name: "searchPlaceholder",
      title: "Søkefelt placeholder",
      ...i18nString,
    },
    {
      name: "featuredSectionTitle",
      title: "Overskrift — utvalgte tjenester",
      ...i18nString,
    },
    {
      name: "featuredCategories",
      title: "Utvalgte kategorier (bildekort)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "treatmentCategory" }] }],
    },
    {
      name: "moreServicesSection",
      title: "Flere tjenester-seksjon",
      type: "object",
      fields: [
        { name: "eyebrow", title: "Eyebrow", ...i18nString },
        { name: "title", title: "Tittel", ...i18nString },
        { name: "description", title: "Beskrivelse", ...i18nText },
      ],
    },
    {
      name: "moreServicesCategories",
      title: "Flere tjenester — kategorier",
      description:
        "Velg kategorier som vises under «Flere tjenester». Sett visningsmodus til «Behandlingsliste» for å vise alle behandlinger i kategorien (f.eks. Flere fagområder).",
      type: "array",
      of: [
        {
          type: "object",
          name: "moreServicesCategory",
          title: "Kategori",
          fields: [
            {
              name: "category",
              title: "Kategori",
              type: "reference",
              to: [{ type: "treatmentCategory" }],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "displayMode",
              title: "Visningsmodus",
              type: "string",
              options: {
                list: [
                  { title: "Lenke til kategori", value: "categoryLink" },
                  { title: "Liste behandlinger", value: "treatmentsList" },
                ],
                layout: "radio",
              },
              initialValue: "categoryLink",
            },
          ],
          preview: {
            select: {
              categoryId: "category.categoryId",
              categoryTitle: "category.title",
              displayMode: "displayMode",
            },
            prepare({
              categoryId,
              categoryTitle,
              displayMode,
            }: {
              categoryId?: string;
              categoryTitle?: unknown;
              displayMode?: string;
            }) {
              const mode =
                displayMode === "treatmentsList" ? "Behandlingsliste" : "Kategorilenke";
              const label = pickNo(categoryTitle) || categoryId || "Velg kategori";
              return {
                title: label,
                subtitle: mode,
              };
            },
          },
        },
      ],
    },
    {
      name: "faqSectionTitle",
      title: "FAQ — seksjonstittel",
      group: "faq",
      ...i18nString,
      initialValue: [
        {
          _type: "internationalizedArrayStringValue",
          _key: "no",
          language: "no",
          value: "Ofte stilte spørsmål",
        },
        {
          _type: "internationalizedArrayStringValue",
          _key: "en",
          language: "en",
          value: "Frequently asked questions",
        },
      ],
    },
    {
      name: "faqs",
      title: "FAQ — spørsmål og svar",
      description:
        "Legg til, rediger og sorter FAQ-rader her. Vises på tjenester-siden.",
      type: "array",
      group: "faq",
      of: [
        {
          type: "object",
          name: "servicesFaq",
          title: "FAQ",
          fields: [
            {
              name: "question",
              title: "Spørsmål",
              type: "internationalizedArrayString",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "answer",
              title: "Svar",
              type: "internationalizedArrayText",
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: i18nFaqItemPreview,
        },
      ],
    },
    {
      name: "faqCategory",
      title: "FAQ — Sanity-kategori (fallback)",
      description:
        "Brukes bare hvis listen over er tom. Henter FAQ-dokumenter med samme kategori.",
      type: "string",
      group: "faq",
      hidden: ({ document }: { document?: { faqs?: unknown[] } }) =>
        Array.isArray(document?.faqs) && document.faqs.length > 0,
      initialValue: "tjenester",
      options: {
        list: [
          { title: "Tjenester (services page)", value: "tjenester" },
          { title: "Generelt (homepage)", value: "generelt" },
          { title: "Priser", value: "priser" },
          { title: "Urologi", value: "urologi" },
        ],
      },
    },
    /** @deprecated Use featuredCategories + moreServicesCategories */
    {
      name: "categories",
      title: "Tjenestekategorier (legacy)",
      type: "array",
      hidden: true,
      of: [{ type: "reference", to: [{ type: "treatmentCategory" }] }],
    },
    pageSectionsField,
    {
      name: "seo",
      title: "SEO",
      type: "seo",
    },
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }: { title?: { value?: string; language?: string; _key?: string }[] }) {
      const titleStr = Array.isArray(title)
        ? (title.find((t) => (t.language || t._key) === "no")?.value ||
            title[0]?.value ||
            "Tjenester")
        : (title || "Tjenester");
      return { title: titleStr };
    },
  },
};
