// Schema: Services Page (Tjenester)
import { TreatmentIcon } from "./icons";
import {
  i18nFaqItemPreview,
  i18nSlugFieldFromTitle,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from "./i18n";
import { geoSummaryField } from "./geoSummary";
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
      validation: requiredNoEnI18n("Brødsmule — hjem"),
    },
    {
      name: "title",
      title: "Sidetittel (H1)",
      group: "content",
      ...i18nString,
      validation: requiredNoEnI18n("Sidetittel"),
    },
    { ...i18nSlugFieldFromTitle("title", { group: "content" }) },
    {
      name: "eyebrow",
      title: "Eyebrow over tittel",
      description: "Liten etikett over hovedoverskriften",
      ...i18nString,
      validation: requiredNoEnI18n("Eyebrow"),
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
      validation: requiredNoEnI18n("Introduksjonstekst"),
    },
    {
      name: "badges",
      title: "Hero-badges",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Tekst",
              ...i18nString,
              validation: requiredNoEnI18n("Badge-tekst"),
            },
          ],
          preview: {
            select: { label: "label" },
            prepare({ label }: { label?: unknown }) {
              return { title: pickNo(label) || "Badge" };
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "searchPlaceholder",
      title: "Søkefelt placeholder",
      ...i18nString,
      validation: requiredNoEnI18n("Søkefelt placeholder"),
    },
    {
      name: "featuredSectionTitle",
      title: "Overskrift — utvalgte tjenester",
      ...i18nString,
      validation: requiredNoEnI18n("Overskrift — utvalgte tjenester"),
    },
    {
      name: "featuredCategories",
      title: "Utvalgte kategorier (bildekort)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "treatmentCategory" }] }],
      validation: (Rule: any) => Rule.required().min(1).unique(),
    },
    {
      name: "moreServicesSection",
      title: "Flere tjenester-seksjon",
      type: "object",
      fields: [
        {
          name: "eyebrow",
          title: "Eyebrow",
          ...i18nString,
          validation: requiredNoEnI18n("Flere tjenester — eyebrow"),
        },
        {
          name: "title",
          title: "Tittel",
          ...i18nString,
          validation: requiredNoEnI18n("Flere tjenester — tittel"),
        },
        {
          name: "description",
          title: "Beskrivelse",
          ...i18nText,
          validation: requiredNoEnI18n("Flere tjenester — beskrivelse"),
        },
      ],
      validation: (Rule: any) => Rule.required(),
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
              validation: (Rule: any) => Rule.required(),
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
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "faqSectionTitle",
      title: "FAQ — seksjonstittel",
      group: "faq",
      ...i18nString,
      validation: requiredNoEnI18n("FAQ — seksjonstittel"),
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
          type: "reference",
          to: [{ type: "faq" }],
        },
        {
          type: "object",
          name: "servicesFaq",
          title: "FAQ",
          fields: [
            {
              name: "question",
              title: "Spørsmål",
              type: "internationalizedArrayString",
              validation: requiredNoEnI18n("FAQ-spørsmål"),
            },
            {
              name: "answer",
              title: "Svar",
              type: "internationalizedArrayText",
              validation: requiredNoEnI18n("FAQ-svar"),
            },
          ],
          preview: i18nFaqItemPreview,
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "loadingLabel",
      title: "Laster-tekst",
      group: "content",
      ...i18nString,
      validation: requiredNoEnI18n("Laster-tekst"),
    },
    {
      name: "pageErrorMessage",
      title: "Feilmelding for siden",
      group: "content",
      ...i18nText,
      validation: requiredNoEnI18n("Feilmelding for siden"),
    },
    {
      name: "emptyCategoriesMessage",
      title: "Melding når kategorier mangler",
      group: "content",
      ...i18nText,
      validation: requiredNoEnI18n("Melding når kategorier mangler"),
    },
    pageSectionsField,
    {
      name: "seo",
      title: "SEO",
      type: "seo",
      validation: requiredNoEnSeo,
    },
    geoSummaryField,
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
