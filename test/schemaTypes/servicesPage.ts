// Schema: Services Page (Tjenester)
import { TreatmentIcon } from "./icons";
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
  fields: [
    {
      name: "breadcrumbHome",
      title: "Brødsmule — hjem",
      ...i18nString,
    },
    {
      name: "title",
      title: "Sidetittel (H1)",
      ...i18nString,
      validation: (Rule: any) => Rule.required(),
    },
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
              title: "category.title",
              displayMode: "displayMode",
            },
            prepare({
              categoryId,
              title,
              displayMode,
            }: {
              categoryId?: string;
              title?: string;
              displayMode?: string;
            }) {
              const mode =
                displayMode === "treatmentsList" ? "Behandlingsliste" : "Kategorilenke";
              return {
                title: title || categoryId || "Kategori",
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
      ...i18nString,
    },
    {
      name: "faqCategory",
      title: "FAQ — Sanity-kategori",
      description: "Matcher `category`-feltet på FAQ-dokumenter (standard: generelt)",
      type: "string",
      initialValue: "generelt",
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
