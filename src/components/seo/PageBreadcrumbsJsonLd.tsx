interface BreadcrumbItem {
  name: string;
  path: string;
}

const BASE_URL = "https://cmedical.no";

/** Breadcrumb JSON-LD only — page meta comes from Next.js `generateMetadata`. */
export function PageBreadcrumbsJsonLd({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbItem[];
}) {
  if (breadcrumbs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
