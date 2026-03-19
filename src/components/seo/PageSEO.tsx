import { Helmet } from "react-helmet-async";

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
  const fullCanonical = canonical.startsWith("http") ? canonical : `${BASE_URL}${canonical}`;
  const fullTitle = title.includes("CMedical") ? title : `${title} | CMedical`;

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
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="nb_NO" />
      <meta property="og:site_name" content="CMedical" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

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
