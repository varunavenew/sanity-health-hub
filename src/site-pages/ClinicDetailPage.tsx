"use client";

import { useMemo } from "react";
import { BackLink } from "@/components/ui/BackLink";
import { useParams, Link, useRouteSlug } from "@/lib/router";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  MapPin,
  Phone,
  Clock,
  Car,
  Train,
  Accessibility,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useClinic, useTreatmentCategories } from "@/hooks/useSanity";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { SpecialistCarousel } from "@/components/SpecialistCarousel";
import { PageSEO } from "@/components/seo/PageSEO";
import { ClinicBookingBlock } from "@/components/clinic/ClinicBookingBlock";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { resolveCmsMedia } from "@/lib/sanity/media-dual-read";
import { buildClinicServiceLinks, resolveClinicServiceRows } from "@/lib/sanity/clinic-service-links";
import { plainMetaString } from "@/lib/seo/seo-fields";
import { formatOpeningHoursLines } from "@/lib/format-opening-hours";
import { useTranslation } from "react-i18next";

type ClinicServiceItem = {
  serviceId: string;
  label: string;
  href?: string;
};

type ClinicServicesSection = {
  title?: string;
  description?: string;
  items: ClinicServiceItem[];
};

type MergedClinic = {
  id: string;
  slug: string;
  label: string;
  address: string;
  phone?: string;
  hours?: string;
  description?: string;
  detail?: {
    parking?: string;
    publicTransport?: string;
    accessibility?: string;
  };
  mapsUrl?: string;
  faqs?: { question: string; answer: string }[];
  services?: string[];
  servicesSection?: ClinicServicesSection;
  booking?: Record<string, unknown>;
  seo?: { metaTitle?: string; metaDescription?: string };
  heroImage?: string;
  primaryImage?: string;
  email?: string;
  treatments?: Array<{ slug: string; title?: string; categorySlug?: string }>;
};

interface ClinicDetailPageProps {
  isChatOpen: boolean;
}

function resolveSanityGalleryImages(
  raw: Record<string, unknown> | null | undefined,
  fallbackAlt: string,
): { src: string; alt: string }[] {
  if (!raw) return [];
  const galleryRaw = Array.isArray(raw.gallery) ? raw.gallery : [];
  return galleryRaw
    .map((item) => {
      const row = item as { url?: string; src?: string; alt?: string };
      const src = (row.url || row.src || "").trim();
      if (!src) return null;
      return { src, alt: (row.alt || fallbackAlt).trim() || fallbackAlt };
    })
    .filter((item): item is { src: string; alt: string } => item != null);
}

function normalizeServicesSection(
  raw: unknown,
  lang: "no" | "en",
): ClinicServicesSection | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const section = raw as Record<string, unknown>;
  const itemsRaw = Array.isArray(section.items) ? section.items : [];
  const items = itemsRaw
    .map((item) => {
      const row = item as { serviceId?: unknown; label?: unknown; href?: unknown };
      const serviceId =
        typeof row.serviceId === "string" ? row.serviceId.trim() : "";
      const label = plainMetaString(row.label, "", lang).trim();
      const href = typeof row.href === "string" ? row.href.trim() : "";
      if (!serviceId && !label) return null;
      return {
        serviceId: serviceId || label,
        label: label || serviceId,
        ...(href ? { href } : {}),
      };
    })
    .filter((item): item is ClinicServiceItem => item != null);

  const title = plainMetaString(section.title, "", lang).trim();
  const description = plainMetaString(section.description, "", lang).trim();
  if (!items.length && !title && !description) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    items,
  };
}

function mergeSanityClinic(raw: Record<string, unknown>, slug: string, lang: "no" | "en"): MergedClinic {
  const label = plainMetaString(raw.label ?? raw.title, "Klinikk", lang);
  const description = plainMetaString(raw.description, "", lang);
  const hours = plainMetaString(raw.hours, "", lang);
  const detailRaw = (raw.detail || {}) as Record<string, unknown>;
  const primaryImage = typeof raw.primaryImage === "string" ? raw.primaryImage : undefined;
  const resolvedHero = resolveCmsMedia(raw.heroMedia, {
    mediaType: "image",
    imageUrl: primaryImage,
  });
  const heroImage =
    (resolvedHero?.kind === "image" ? resolvedHero.src : resolvedHero?.poster) ||
    primaryImage;

  return {
    id: String(raw.id || raw.slug || slug),
    slug: String(raw.slug || slug),
    label,
    address: String(raw.address || ""),
    phone: typeof raw.phone === "string" ? raw.phone : undefined,
    hours,
    description,
    detail: {
      parking: plainMetaString(detailRaw.parking, "", lang),
      publicTransport: plainMetaString(detailRaw.publicTransport, "", lang),
      accessibility: plainMetaString(detailRaw.accessibility, "", lang),
    },
    mapsUrl: typeof raw.mapsUrl === "string" ? raw.mapsUrl : undefined,
    faqs: Array.isArray(raw.faqs)
      ? (raw.faqs as { question?: unknown; answer?: unknown }[])
          .map((faq) => ({
            question: plainMetaString(faq.question, "", lang),
            answer: plainMetaString(faq.answer, "", lang),
          }))
          .filter((faq) => faq.question && faq.answer)
      : [],
    services: Array.isArray(raw.services) ? (raw.services as string[]) : [],
    servicesSection: normalizeServicesSection(raw.servicesSection, lang),
    booking: (raw.booking as Record<string, unknown>) || undefined,
    seo: raw.seo as MergedClinic["seo"],
    heroImage,
    primaryImage,
    email: typeof raw.email === "string" ? raw.email : undefined,
    treatments: Array.isArray(raw.treatments)
      ? (raw.treatments as MergedClinic["treatments"])
      : undefined,
  };
}

const ClinicDetailPage = ({ isChatOpen }: ClinicDetailPageProps) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = useRouteSlug() || paramSlug || "";
  const { i18n } = useTranslation();
  const sanityLang = (i18n.language || "nb").startsWith("en") ? "en" : "no";
  const clinicsPath = useNavCmsPath("clinics");
  const specialistsPath = useNavCmsPath("specialists");
  const aboutPath = useNavCmsPath("about");
  const { data: sanityClinic, isLoading } = useClinic(slug || "");
  const { data: treatmentCategories } = useTreatmentCategories();

  const serviceLinks = useMemo(
    () => buildClinicServiceLinks(treatmentCategories, sanityLang),
    [treatmentCategories, sanityLang],
  );

  const clinic = useMemo((): MergedClinic | undefined => {
    if (!sanityClinic) return undefined;
    return mergeSanityClinic(sanityClinic as Record<string, unknown>, slug, sanityLang);
  }, [sanityClinic, slug, sanityLang]);

  const sanityGalleryImages = useMemo(() => {
    const raw = sanityClinic as Record<string, unknown> | null | undefined;
    const label = raw
      ? plainMetaString(raw.label ?? raw.title, "Klinikk", sanityLang)
      : "klinikk";
    return resolveSanityGalleryImages(raw, `CMedical ${label}`);
  }, [sanityClinic, sanityLang]);

  if (isLoading) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="centered-hero bg-brand-warm">
          <div className="container mx-auto px-6 md:px-16 text-center">
            <div className="mx-auto max-w-3xl animate-pulse space-y-4">
              <div className="h-8 w-1/3 rounded bg-brand-mid/20" />
              <div className="h-4 w-2/3 rounded bg-brand-mid/20" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!clinic) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="centered-hero bg-brand-warm">
          <div className="container mx-auto px-6 md:px-16 text-center">
            <h1 className="mb-4 text-2xl font-light text-brand-dark">Klinikken ble ikke funnet</h1>
            <BackLink to={clinicsPath}>Tilbake til klinikker</BackLink>
          </div>
        </div>
      </PageLayout>
    );
  }

  const heroImage = clinic.heroImage;
  const faqs = clinic.faqs || [];
  const detail = clinic.detail || {};
  const mapsUrl =
    clinic.mapsUrl ||
    (clinic.address ? `https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}` : undefined);
  const clinicPath = `${clinicsPath}/${clinic.slug}`;
  const serviceRows = resolveClinicServiceRows(
    clinic.servicesSection,
    clinic.services,
    serviceLinks,
  );
  const allServicesLinked =
    serviceRows.length > 0 && serviceRows.every((row) => Boolean(row.path));
  const servicesTitle =
    clinic.servicesSection?.title || "Tjenester ved denne klinikken";
  const servicesDescription =
    clinic.servicesSection?.description ||
    (serviceRows.length > 0
      ? `CMedical ${clinic.label} tilbyr ${serviceRows.length} ulike tjenester. ${
          allServicesLinked
            ? "Klikk for å lese mer."
            : "Klikk på tjenestene med pil for å lese mer."
        }`
      : "");
  const openingHoursLines = formatOpeningHoursLines(clinic.hours);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={clinic.seo?.metaTitle || `CMedical ${clinic.label} – Klinikk`}
        description={
          clinic.seo?.metaDescription ||
          `Besøk CMedical ${clinic.label}. ${clinic.address}. Åpningstider, tjenester og kontaktinformasjon for vår klinikk.`
        }
        canonical={clinicPath}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Om oss", path: aboutPath },
          { name: `CMedical ${clinic.label}`, path: clinicPath },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          name: `CMedical ${clinic.label}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: clinic.address,
            addressCountry: "NO",
          },
          telephone: clinic.phone ? `+47 ${clinic.phone}` : undefined,
          url: `https://cmedical.no${clinicPath}`,
        }}
      />

      {heroImage ? (
        <>
          <ParallaxImage
            src={heroImage}
            alt={`CMedical ${clinic.label}`}
            loading="eager"
            speed={0.16}
            objectPosition="50% 45%"
            className="h-[58svh] w-full md:hidden"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(24,4,4,0.92) 0%, rgba(66,51,42,0.82) 24%, rgba(66,51,42,0.6) 46%, rgba(66,51,42,0.32) 70%, rgba(66,51,42,0.12) 100%)",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-dark/65 via-brand-dark/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-8">
              <BackLink to={clinicsPath} tone="onImage" className="mb-4">
                Alle klinikker
              </BackLink>
              <p aria-hidden="true" className="text-2xl font-light leading-tight text-brand-warm">
                CMedical {clinic.label}
              </p>
            </div>
          </ParallaxImage>

          <ParallaxImage
            src={heroImage}
            alt={`CMedical ${clinic.label}`}
            loading="eager"
            speed={0.14}
            className="hidden h-[46vh] w-full md:block"
          >
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-dark/60 via-brand-dark/20 to-transparent" />
          </ParallaxImage>
        </>
      ) : null}

      <div className={`bg-brand-warm ${heroImage ? "md:pt-0" : "pt-[4.5rem]"}`}>
        <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
          <div className="mx-auto max-w-3xl">
            {!heroImage ? (
              <BackLink to={clinicsPath} className="mb-6">
                Alle klinikker
              </BackLink>
            ) : null}

            <h1 className="sr-only">CMedical {clinic.label}</h1>
            <header
              className={`mb-8 border-b border-brand-dark/10 pb-6 ${heroImage ? "hidden md:block" : ""}`}
            >
              <p
                aria-hidden="true"
                className="text-3xl font-light text-brand-dark md:text-4xl"
              >
                CMedical {clinic.label}
              </p>
            </header>

            {clinic.description ? (
              <p className="text-[15px] font-light leading-[1.8] text-brand-dark/80 md:text-base">
                {clinic.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-lg font-normal text-foreground">Praktisk informasjon</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-dark/75" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-normal text-foreground">Adresse</p>
                    <p className="text-sm font-light text-muted-foreground">{clinic.address}</p>
                    {mapsUrl ? (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-brand-dark/70 hover:underline"
                      >
                        Vis i kart <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-dark/75" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-normal text-foreground">Telefon</p>
                    {clinic.phone ? (
                      <a
                        href={`tel:+47${clinic.phone.replace(/\s/g, "")}`}
                        className="text-sm font-light text-muted-foreground hover:underline"
                      >
                        {clinic.phone}
                      </a>
                    ) : (
                      <span className="text-sm font-light text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-dark/75" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-normal text-foreground">Åpningstider</p>
                    {openingHoursLines.length > 0 ? (
                      <div className="space-y-0.5">
                        {openingHoursLines.map((line) => (
                          <p key={line} className="text-sm font-light text-muted-foreground">
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-light text-muted-foreground">—</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {detail.publicTransport ? (
                  <div className="flex items-start gap-3">
                    <Train className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-dark/75" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Kollektivtransport</p>
                      <p className="text-sm font-light text-muted-foreground">{detail.publicTransport}</p>
                    </div>
                  </div>
                ) : null}
                {detail.parking ? (
                  <div className="flex items-start gap-3">
                    <Car className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-dark/75" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Parkering</p>
                      <p className="text-sm font-light text-muted-foreground">{detail.parking}</p>
                    </div>
                  </div>
                ) : null}
                {detail.accessibility ? (
                  <div className="flex items-start gap-3">
                    <Accessibility
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-dark/75"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-normal text-foreground">Tilgjengelighet</p>
                      <p className="text-sm font-light text-muted-foreground">{detail.accessibility}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {serviceRows.length > 0 ? (
        <section className="bg-brand-warm/40 py-10 md:py-14">
          <div className="container mx-auto px-6 md:px-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-2 text-lg font-normal text-foreground">{servicesTitle}</h2>
              {servicesDescription ? (
                <p className="mb-6 text-sm font-light text-muted-foreground">
                  {servicesDescription}
                </p>
              ) : null}

              <ul className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-brand-dark/10 sm:grid-cols-2">
                {serviceRows.map((svc) => {
                  const content = (
                    <span
                      className={`flex items-center justify-between border-b border-brand-dark/10 py-3 text-sm font-light text-foreground transition-colors${svc.path ? " group-hover:text-brand-dark" : ""}`}
                    >
                      <span>{svc.label}</span>
                      {svc.path ? (
                        <ArrowRight
                          className="h-3.5 w-3.5 text-brand-dark/40 transition-all group-hover:translate-x-0.5 group-hover:text-brand-dark"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  );
                  return (
                    <li key={svc.id} className={svc.path ? "group" : ""}>
                      {svc.path ? (
                        <Link to={svc.path} aria-label={`Les mer om ${svc.label}`}>
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {sanityGalleryImages.length > 0 ? (
        <section className="bg-background pt-10 md:pt-14" aria-label={`Fra CMedical ${clinic.label}`}>
          <div className="container mx-auto mb-6 px-6 md:px-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-lg font-normal text-foreground">Fra klinikken</h2>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
            {sanityGalleryImages.map((img, index) => (
              <ParallaxImage
                key={`${img.src}-${index}`}
                src={img.src}
                alt={img.alt}
                speed={0.1}
                className="aspect-[4/5] bg-brand-mid/10"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-lg font-normal text-foreground">Finn oss</h2>
            <div className="overflow-hidden rounded-sm border border-border/40">
              <iframe
                title={`Kart over CMedical ${clinic.label}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {faqs.length > 0 ? (
        <section className="bg-muted/50 py-10 md:py-14">
          <div className="container mx-auto px-6 md:px-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-lg font-normal text-foreground">Ofte stilte spørsmål</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-sm border border-border/40 bg-background px-5"
                  >
                    <AccordionTrigger className="py-4 text-sm font-normal text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm font-light leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      ) : null}

      <SpecialistCarousel
        filter={(s) => {
          if (!Array.isArray(s.clinics)) return false;
          const label = String(clinic.label).toLowerCase();
          return s.clinics.some((c) => {
            const name = String(c).toLowerCase();
            return name === label || label.includes(name) || name.includes(label);
          });
        }}
        title="Spesialister ved klinikken"
        description={`Møt spesialistene som jobber ved CMedical ${clinic.label}.`}
        seeAllHref={`${specialistsPath}?klinikk=${encodeURIComponent(clinic.label)}`}
        seeAllLabel="Se alle spesialister"
      />

      <ClinicBookingBlock
        booking={clinic.booking as Parameters<typeof ClinicBookingBlock>[0]["booking"]}
        clinicLabel={clinic.label}
        clinicSlug={clinic.slug}
        phone={clinic.phone}
        email={clinic.email}
      />
    </PageLayout>
  );
};

export default ClinicDetailPage;
