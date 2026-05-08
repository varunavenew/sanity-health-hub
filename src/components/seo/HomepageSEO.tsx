import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "@/lib/sanityClient";

// Static fallback values per language
const DEFAULTS = {
  nb: {
    title: "CMedical – Skandinavias ledende helhetskonsept",
    description:
      "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
  },
  en: {
    title: "CMedical – Scandinavia's leading healthcare concept",
    description:
      "The Nordics' most complete private offering within gynecology, fertility and urology. Leading specialists, short waiting times, no referral needed.",
  },
};
const URL = "https://cmedical.no/";

const buildJsonLd = (lang: "nb" | "en") => ({
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "CMedical",
  url: "https://cmedical.no",
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/qmg4FOZcsPVySaA19fmuxrFmWZJ3/uploads/1762763982098-cmedical.png",
  description: DEFAULTS[lang].description,
  inLanguage: lang === "en" ? "en" : "nb-NO",
  telephone: "+47 22 95 75 00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bogstadveien 51",
    addressLocality: "Oslo",
    postalCode: "0366",
    addressCountry: "NO",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 59.9271,
    longitude: 10.7195,
  },
  medicalSpecialty: [
    "Gynecology",
    "Urology",
    "Reproductive Medicine",
    "Orthopedics",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "1000",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/cmedical",
    "https://www.instagram.com/cmedical",
  ],
});

const buildBreadcrumb = (lang: "nb" | "en") => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: lang === "en" ? "Home" : "Hjem",
      item: "https://cmedical.no",
    },
  ],
});

interface HomepageSEOProps {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: any;
    noIndex?: boolean;
  } | null;
}

export const HomepageSEO = ({ seo }: HomepageSEOProps) => {
  const { i18n } = useTranslation();
  const lang: "nb" | "en" = (i18n.language || "nb").startsWith("en") ? "en" : "nb";
  const ogLocale = lang === "en" ? "en_US" : "nb_NO";
  const htmlLang = lang === "en" ? "en" : "nb-NO";

  const title = seo?.metaTitle || DEFAULTS[lang].title;
  const description = seo?.metaDescription || DEFAULTS[lang].description;
  const ogImage = seo?.ogImage ? getImageUrl(seo.ogImage) : undefined;

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={URL} />
      <link rel="alternate" hrefLang="nb-NO" href={URL} />
      <link rel="alternate" hrefLang="en" href={URL} />
      <link rel="alternate" hrefLang="x-default" href={URL} />
      {seo?.noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={URL} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={lang === "en" ? "nb_NO" : "en_US"} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <script type="application/ld+json">{JSON.stringify(buildJsonLd(lang))}</script>
      <script type="application/ld+json">
        {JSON.stringify(buildBreadcrumb(lang))}
      </script>
    </Helmet>
  );
};
