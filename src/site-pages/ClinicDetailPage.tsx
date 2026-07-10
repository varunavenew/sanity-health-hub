"use client";

import { useEffect, useMemo } from "react";
import { useParams, Link, useRouteSlug } from "@/lib/router";
import { PageLayout } from "@/components/layout/PageLayout";
import { MapPin, Phone, Clock, Car, Train, Accessibility, ArrowLeft, ExternalLink, Stethoscope, ArrowRight, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useClinic, useTreatmentCategories } from "@/hooks/useSanity";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { PageSEO } from "@/components/seo/PageSEO";
import { combineGeoJsonLd, faqPageJsonLd, medicalWebPageJsonLd } from "@/lib/seo/geo-jsonld";
import { ClinicMap } from "@/components/clinic/ClinicMap";
import { clinicMapsEmbedUrl } from "@/lib/maps/clinic-location";
import { buildClinicServiceLinks } from "@/lib/sanity/clinic-service-links";
import type { PageSection } from "@/lib/sanity/page-sections";
import { plainMetaString } from "@/lib/seo/seo-fields";
import { useTranslation } from "react-i18next";

interface ClinicDetailPageProps {
  isChatOpen: boolean;
}

const ClinicDetailPage = ({ isChatOpen }: ClinicDetailPageProps) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = useRouteSlug() || paramSlug || "";
  const { i18n } = useTranslation();
  const sanityLang = (i18n.language || "nb").startsWith("en") ? "en" : "no";
  const clinicsPath = useNavCmsPath("clinics");
  const specialistsPath = useNavCmsPath("specialists");
  const aboutPath = useNavCmsPath("about");
  const { data: treatmentCategories } = useTreatmentCategories();
  const serviceLinks = useMemo(
    () => buildClinicServiceLinks(treatmentCategories, sanityLang),
    [treatmentCategories, sanityLang],
  );
  const { data: clinic, isLoading } = useClinic(slug || "");

  useEffect(() => {
    if (clinic) {
      const name = plainMetaString(clinic.label ?? clinic.title, "Klinikk", sanityLang);
      document.title = `CMedical ${name} | Klinikk`;
    }
  }, [clinic, sanityLang]);

  // Only show skeleton if Sanity is still loading AND we have no static fallback
  if (isLoading) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="bg-brand-warm pt-24 pb-16">
          <div className="container mx-auto px-6 md:px-16 text-center">
            <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
              <div className="h-8 bg-brand-mid/20 rounded w-1/3" />
              <div className="h-4 bg-brand-mid/20 rounded w-2/3" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!clinic) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="bg-brand-warm pt-24 pb-16">
          <div className="container mx-auto px-6 md:px-16 text-center">
            <h1 className="text-2xl font-light text-brand-dark mb-4">Klinikken ble ikke funnet</h1>
            <Button asChild variant="outline" className="rounded-sm">
              <Link to={aboutPath}>Tilbake til Om oss</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const rawDetail = clinic.detail || {};
  const label = plainMetaString(clinic.label ?? clinic.title, "Klinikk", sanityLang);
  const description = plainMetaString(clinic.description, "", sanityLang);
  const hours = plainMetaString(clinic.hours, "", sanityLang);
  const email =
    typeof (clinic as { email?: unknown }).email === "string"
      ? (clinic as { email: string }).email.trim()
      : "";
  const contactDescription = plainMetaString(
    (clinic as { contactDescription?: unknown }).contactDescription,
    "",
    sanityLang,
  );
  const rawValueProposition = (clinic as { valueProposition?: Record<string, unknown> })
    .valueProposition;
  const valueProposition1 = plainMetaString(rawValueProposition?.valueProposition1, "", sanityLang);
  const socialProof = plainMetaString(rawValueProposition?.socialProof, "", sanityLang);
  const detail = {
    parking: plainMetaString(rawDetail.parking, "", sanityLang),
    publicTransport: plainMetaString(rawDetail.publicTransport, "", sanityLang),
    accessibility: plainMetaString(rawDetail.accessibility, "", sanityLang),
  };
  const faqs = (clinic.faqs || [])
    .map((faq: { question?: unknown; answer?: unknown }) => ({
      question: plainMetaString(faq.question, "", sanityLang),
      answer: plainMetaString(faq.answer, "", sanityLang),
    }))
    .filter((faq) => faq.question && faq.answer);
  const pageSections = (clinic.pageSections ?? []) as PageSection[];
  const bookingCtaSections = pageSections.filter((s) => s._type === "pageSectionBookingCta");
  const otherPageSections = pageSections.filter((s) => s._type !== "pageSectionBookingCta");
  const clinicBookingPath = clinic.id
    ? `/booking?klinikk=${encodeURIComponent(clinic.id)}`
    : "/booking";
  const mapsUrl = clinic.mapsUrl;
  const mapsEmbedUrl = clinicMapsEmbedUrl(clinic.locationSearch, clinic.address);
  const galleryImages = (
    (clinic as { gallery?: { url?: string; alt?: string }[] }).gallery ?? []
  ).filter(
    (img): img is { url: string; alt?: string } =>
      typeof img?.url === "string" && img.url.trim().length > 0,
  );
  const hasClinicImages = galleryImages.length > 0;
  const seoTitle = plainMetaString(
    clinic.seo?.metaTitle,
    `CMedical ${label} – Klinikk`,
    sanityLang,
  );
  const seoDescription = plainMetaString(
    clinic.seo?.metaDescription,
    `Besøk CMedical ${label}. ${clinic.address || ""}. Åpningstider, tjenester og kontaktinformasjon for vår klinikk.`,
    sanityLang,
  );
  const geoSummary = plainMetaString(
    (clinic as { geoSummary?: unknown }).geoSummary,
    "",
    sanityLang,
  );
  const clinicPath = `${clinicsPath}/${clinic.slug}`;
  const locale = sanityLang === "en" ? "en" : "nb";
  const summaryText = geoSummary || description.split("\n")[0].trim() || seoDescription;
  const geoJsonLd = combineGeoJsonLd(
    {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      name: `CMedical ${label}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: clinic.address,
        addressCountry: "NO",
      },
      telephone: clinic.phone ? `+47 ${clinic.phone}` : undefined,
      email: email || undefined,
      url: `https://cmedical.no${clinicPath}`,
    },
    medicalWebPageJsonLd({
      name: `CMedical ${label}`,
      description: summaryText.slice(0, 320),
      url: clinicPath,
      inLanguage: locale === "en" ? "en" : "nb-NO",
    }),
    faqPageJsonLd(faqs),
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        canonical={clinicPath}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Om oss", path: aboutPath },
          { name: `CMedical ${label}`, path: clinicPath },
        ]}
        jsonLd={geoJsonLd.length === 1 ? geoJsonLd[0] : geoJsonLd}
      />
      {/* Header */}
      <div className="bg-brand-warm pt-20">
        <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <Link to={clinicsPath} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Alle klinikker
            </Link>

            <header className="mb-8 pb-6 border-b border-brand-dark/10">
              <p className="text-muted-foreground text-xs mb-2">Klinikk</p>
              <h1 className="text-3xl md:text-4xl font-light text-brand-dark">
                CMedical {label}
              </h1>
            </header>

            {description ? (
              <p className="text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
                {description}
              </p>
            ) : null}

            {(valueProposition1 || socialProof) && (
              <div className="mt-6 space-y-2 pt-6 border-t border-brand-dark/10">
                {valueProposition1 ? (
                  <p className="text-base text-brand-dark font-normal leading-snug">
                    {valueProposition1}
                  </p>
                ) : null}
                {socialProof ? (
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {socialProof}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Practical info */}
      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-normal text-foreground mb-6">Praktisk informasjon</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-normal text-foreground">Adresse</p>
                    <p className="text-sm text-muted-foreground font-light">{clinic.address}</p>
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-dark/70 hover:underline inline-flex items-center gap-1 mt-1">
                        Vis i kart <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-normal text-foreground">Telefon</p>
                    <a href={`tel:+47${clinic.phone?.replace(/\s/g, '')}`} className="text-sm text-muted-foreground font-light hover:underline">
                      {clinic.phone}
                    </a>
                  </div>
                </div>
                {email ? (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">E-post</p>
                      <a href={`mailto:${email}`} className="text-sm text-muted-foreground font-light hover:underline">
                        {email}
                      </a>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                  <div>                  
                    <p className="text-sm font-normal text-foreground">Åpningstider</p>
                    {hours ? (
                      <p className="text-sm text-muted-foreground font-light">{hours}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {detail.publicTransport && (
                  <div className="flex items-start gap-3">
                    <Train className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Kollektivtransport</p>
                      <p className="text-sm text-muted-foreground font-light">{detail.publicTransport}</p>
                    </div>
                  </div>
                )}
                {detail.parking && (
                  <div className="flex items-start gap-3">
                    <Car className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Parkering</p>
                      <p className="text-sm text-muted-foreground font-light">{detail.parking}</p>
                    </div>
                  </div>
                )}
                {detail.accessibility && (
                  <div className="flex items-start gap-3">
                    <Accessibility className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Tilgjengelighet</p>
                      <p className="text-sm text-muted-foreground font-light">{detail.accessibility}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {contactDescription ? (
              <p className="mt-8 text-sm text-muted-foreground font-light leading-[1.8] border-t border-border/40 pt-6">
                {contactDescription}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Services at this clinic */}
      {clinic.services && clinic.services.length > 0 && (
        <section className="bg-brand-warm/40 py-10 md:py-14">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="w-4 h-4 text-brand-dark/50" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-xs text-muted-foreground font-light uppercase tracking-wide">Tilbud</p>
              </div>
              <h2 className="text-lg font-normal text-foreground mb-2">Tjenester ved denne klinikken</h2>
              <p className="text-sm text-muted-foreground font-light mb-6">
                CMedical {label} tilbyr {clinic.services.length} ulike fagområder. Klikk for å lese mer.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 border-t border-brand-dark/10">
                {clinic.services.map((id: string) => {
                  const svc = serviceLinks[id] || { label: id };
                  const content = (
                    <span className="flex items-center justify-between py-3 border-b border-brand-dark/10 text-sm text-foreground font-light group-hover:text-brand-dark transition-colors">
                      <span>{svc.label}</span>
                      {svc.path && (
                        <ArrowRight className="w-3.5 h-3.5 text-brand-dark/40 group-hover:text-brand-dark group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} aria-hidden="true" />
                      )}
                    </span>
                  );
                  return (
                    <li key={id} className="group">
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
      )}

      {/* Clinic images – full bleed, no gap (matches homepage tjenester pattern) */}
      {hasClinicImages ? (
        <section className="bg-background pt-10 md:pt-14" aria-label={`Fra CMedical ${label}`}>
          <div className="container mx-auto px-6 md:px-16 mb-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-normal text-foreground">Fra klinikken</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full">
            {galleryImages.map((img, i) => (
              <div key={`${img.url}-${i}`} className="aspect-[4/3] overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt?.trim() || `CMedical ${label}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {mapsEmbedUrl ? (
        <section className="bg-background py-10 md:py-14">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-normal text-foreground mb-6">Finn oss</h2>
              <ClinicMap
                location={clinic.locationSearch}
                address={clinic.address}
                title={label}
                className="h-[350px] md:h-[350px]"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-muted/50 py-10 md:py-14">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-normal text-foreground mb-6">Ofte stilte spørsmål</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq: { question: string; answer: string }, i: number) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border/40 rounded-sm px-5">
                    <AccordionTrigger className="text-sm font-normal text-foreground py-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-light pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* Specialists at this clinic (Sanity-only) */}
      {Array.isArray((clinic as any).specialists) && (clinic as any).specialists.length > 0 && (
        <section className="bg-background py-10 md:py-14">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-brand-dark/50" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-xs text-muted-foreground font-light uppercase tracking-wide">Spesialister</p>
              </div>
              <h2 className="text-lg font-normal text-foreground mb-6">Spesialister ved klinikken</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {(clinic as any).specialists.map((s: any) => (
                  <li key={s.slug}>
                    <Link to={`${specialistsPath}/${s.slug}`} className="group block">
                      <div className="aspect-[3/4] bg-brand-mid/20 overflow-hidden rounded-sm mb-2">
                        {s.image && (
                          <img
                            src={s.image}
                            alt={s.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <p className="text-sm font-normal text-foreground group-hover:text-brand-dark transition-colors">
                        {plainMetaString(s.name, "", sanityLang)}
                      </p>
                      {plainMetaString(s.role, "", sanityLang) ? (
                        <p className="text-xs text-muted-foreground font-light">
                          {plainMetaString(s.role, "", sanityLang)}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Treatments at this clinic (cross-links) */}
      {Array.isArray((clinic as any).treatments) && (clinic as any).treatments.length > 0 && (
        <section className="bg-brand-warm/40 py-10 md:py-14">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-normal text-foreground mb-6">Behandlinger ved klinikken</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 border-t border-brand-dark/10">
                {(clinic as any).treatments.map((t: any) => {
                  const href = t.categorySlug
                    ? `/behandlinger/${t.categorySlug}/${t.slug}`
                    : `/behandlinger/${t.slug}`;
                  return (
                    <li key={t.slug} className="group">
                      <Link to={href} className="flex items-center justify-between py-3 border-b border-brand-dark/10 text-sm text-foreground font-light group-hover:text-brand-dark transition-colors">
                        <span>{plainMetaString(t.title, "", sanityLang)}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-dark/40 group-hover:text-brand-dark group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      {bookingCtaSections.length > 0 ? (
        <PageSectionsRenderer sections={bookingCtaSections} />
      ) : (
        <BookingCTA primaryPath={clinicBookingPath} />
      )}
      {otherPageSections.length > 0 ? (
        <PageSectionsRenderer sections={otherPageSections} />
      ) : null}
    </PageLayout>
  );
};

export default ClinicDetailPage;
