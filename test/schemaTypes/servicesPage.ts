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
  title: "Services",
  type: "document",
  icon: TreatmentIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "faq", title: "FAQ" },
  ],
  fields: [
    {
      name: "breadcrumbHome",
      title: "Breadcrumb — home",
      group: "content",
      ...i18nString,
      validation: requiredNoEnI18n("Breadcrumb — home"),
    },
    {
      name: "title",
      title: "Page title (H1)",
      group: "content",
      ...i18nString,
      validation: requiredNoEnI18n("Page Title"),
    },
    { ...i18nSlugFieldFromTitle("title", { group: "content" }) },
    {
      name: "eyebrow",
      title: "Eyebrow above title",
      description: "Small label above the main heading",
      ...i18nString,
      validation: requiredNoEnI18n("Eyebrow"),
    },
    {
      name: "heroImage",
      title: "Hero image",
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
              title: "Text",
              ...i18nString,
              validation: requiredNoEnI18n("Badge text"),
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
      title: "Search field placeholder",
      ...i18nString,
      validation: requiredNoEnI18n("Search field placeholder"),
    },
    {
      name: "featuredSectionTitle",
      title: "Selected services heading",
      ...i18nString,
      validation: requiredNoEnI18n("Selected services heading"),
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
      title: "More services section",
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
          title: "Title",
          ...i18nString,
          validation: requiredNoEnI18n("More services — title"),
        },
        {
          name: "description",
          title: "Description",
          ...i18nText,
          validation: requiredNoEnI18n("More services — description"),
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "moreServicesCategories",
      title: "Flere tjenester — kategorier",
      description:
        "Select categories displayed under 'More services'. Set display mode to 'Treatment list' to show all treatments in the category (e.g. Other specialties).",
      type: "array",
      of: [
        {
          type: "object",
          name: "moreServicesCategory",
          title: "Category",
          fields: [
            {
              name: "category",
              title: "Category",
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
                  { title: "Link to category", value: "categoryLink" },
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
              const label = pickNo(categoryTitle) || categoryId || "Select category";
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
      title: "FAQ — questions and answers",
      description:
        "Add, edit and sort FAQ rows here. Displayed on the services page.",
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
              title: "Question",
              type: "internationalizedArrayString",
              validation: requiredNoEnI18n("FAQ Question"),
            },
            {
              name: "answer",
              title: "Answer",
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
      title: "Loading Text",
      group: "content",
      ...i18nString,
      validation: requiredNoEnI18n("Loading Text"),
    },
    {
      name: "pageErrorMessage",
      title: "Error Message for the Page",
      group: "content",
      ...i18nText,
      validation: requiredNoEnI18n("Error Message for the Page"),
    },
    {
      name: "emptyCategoriesMessage",
      title: "Message when categories are missing",
      group: "content",
      ...i18nText,
      validation: requiredNoEnI18n("Message when categories are missing"),
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
            "Services")
        : (title || "Services");
      return { title: titleStr };
    },
  },
};
