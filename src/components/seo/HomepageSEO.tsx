import { Helmet } from "react-helmet-async";
import { urlFor } from "@/lib/sanityClient";

// Static fallback values
const DEFAULTS = {
  title: "CMedical – Skandinavias ledende helhetskonsept",
  description:
    "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
  url: "https://cmedical.no/",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "CMedical",
  url: "https://cmedical.no",
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/qmg4FOZcsPVySaA19fmuxrFmWZJ3/uploads/1762763982098-cmedical.png",
  description: DEFAULTS.description,
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
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Hjem",
      item: "https://cmedical.no",
    },
  ],
};

interface HomepageSEOProps {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: any;
    noIndex?: boolean;
  } | null;
}

export const HomepageSEO = ({ seo }: HomepageSEOProps) => {
  const title = seo?.metaTitle || DEFAULTS.title;
  const description = seo?.metaDescription || DEFAULTS.description;
  const ogImage = seo?.ogImage
    ? typeof seo.ogImage === "string"
      ? seo.ogImage
      : urlFor(seo.ogImage).width(1200).height(630).url()
    : undefined;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={DEFAULTS.url} />
      {seo?.noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={DEFAULTS.url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="nb_NO" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd)}
      </script>
    </Helmet>
  );
};
