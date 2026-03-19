import { Helmet } from "react-helmet-async";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "CMedical",
  url: "https://cmedical.no",
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/qmg4FOZcsPVySaA19fmuxrFmWZJ3/uploads/1762763982098-cmedical.png",
  description:
    "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
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

export const HomepageSEO = () => (
  <Helmet>
    <title>CMedical – Skandinavias ledende helhetskonsept</title>
    <meta
      name="description"
      content="Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig."
    />
    <link rel="canonical" href="https://cmedical.no/" />
    <meta
      property="og:title"
      content="CMedical – Skandinavias ledende helhetskonsept"
    />
    <meta
      property="og:description"
      content="Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi."
    />
    <meta property="og:url" content="https://cmedical.no/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nb_NO" />
    <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    <script type="application/ld+json">
      {JSON.stringify(breadcrumbJsonLd)}
    </script>
  </Helmet>
);
