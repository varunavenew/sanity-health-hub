import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { normalizePageTitle } from "@/lib/seo/metadata-builders";
import { plainMetaString } from "@/lib/seo/seo-fields";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface PageSEOProps {
  title: string;
  description: string;
  canonical: string;
  breadcrumbs?: BreadcrumbItem[];
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
  ogImage?: string;
  publishedAt?: string;
}

const BASE_URL = "https://cmedical.no";

export const PageSEO = ({
  title,
  description,
  canonical,
  breadcrumbs = [],
  type = "website",
  noIndex = false,
  jsonLd,
  ogImage,
  publishedAt,
}: PageSEOProps) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "nb").startsWith("en") ? "en" : "nb";
  const ogLocale = lang === "en" ? "en_US" : "nb_NO";
  const htmlLang = lang === "en" ? "en" : "nb-NO";

  const cleanPath = canonical.startsWith("http")
    ? canonical.replace(BASE_URL, "")
    : canonical;
  const fullCanonical = `${BASE_URL}${cleanPath}`;
  const sanityLang = lang === "en" ? "en" : "no";
  const safeTitle = plainMetaString(title, "", sanityLang);
  const safeDescription = plainMetaString(description, "", sanityLang);
  const fullTitle = normalizePageTitle(safeTitle);

  const breadcrumbJsonLd = breadcrumbs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${BASE_URL}${item.path}`,
        })),
      }
    : null;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />
      <link rel="canonical" href={fullCanonical} />
      <link rel="alternate" hrefLang="nb-NO" href={fullCanonical} />
      <link rel="alternate" hrefLang="en" href={fullCanonical} />
      <link rel="alternate" hrefLang="x-default" href={fullCanonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={lang === "en" ? "nb_NO" : "en_US"} />
      <meta property="og:site_name" content="CMedical" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDescription} />

      {/* JSON-LD */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      )}
      {jsonLdArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};
