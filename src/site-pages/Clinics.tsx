"use client";

import { CmsMedia } from "@/components/media/CmsMedia";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { Link, useNavigate } from "@/lib/router";
import { MapPin, Phone, Clock, ArrowRight, Car, Train, Accessibility, Stethoscope } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { useClinics, useClinicsPage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";
import { SplitHero } from "@/components/layout/SplitHero";
import { Button } from "@/components/ui/button";
import { clinics as staticClinics } from "@/data/clinicServices";
import { assetSrc, type ImageRef } from "@/lib/media";
import { resolveCmsMedia, type ResolvedCmsMedia } from "@/lib/sanity/media-dual-read";

import majorstuenVenteromTv from "@/assets/clinics/majorstuen/venterom-tv.asset.json";
import imgBekkestua from "@/assets/clinics/bekkestua.jpg";
import imgMoss from "@/assets/clinics/moss.jpg";
import imgMoelv from "@/assets/clinics/moelv.jpg";

const clinicImages: Record<string, ImageRef> = {
  majorstuen: majorstuenVenteromTv.url,
  bekkestua: imgBekkestua,
  moss: imgMoss,
  moelv: imgMoelv,
};

/** Split listing photos fill ~50vw × 100vh — skip 480px CMS thumbs. */
const MIN_SPLIT_IMAGE_WIDTH = 960;

function sanityCdnWidth(url: string): number | null {
  try {
    const match = new URL(url).pathname.match(/-(\d+)x(\d+)\.[a-z0-9]+$/i);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
}

function isSharpEnoughListingImage(url: string): boolean {
  const width = sanityCdnWidth(url);
  return width == null || width >= MIN_SPLIT_IMAGE_WIDTH;
}

function clinicListingImageSrc(
  resolved: ResolvedCmsMedia | null,
  primaryImage: string | undefined,
  slug: string,
): string | undefined {
  const cms =
    (resolved?.kind === "image" ? resolved.src : undefined) ||
    (resolved?.kind === "video" ? resolved.poster : undefined) ||
    primaryImage;
  const local = clinicImages[slug] ? assetSrc(clinicImages[slug]) : undefined;
  if (cms && isSharpEnoughListingImage(cms)) return cms;
  return local || cms;
}

/** Closed Ski clinic must never appear even if stale cache / leftover docs exist. */
const EXCLUDED_CLINIC_SLUGS = new Set(["ski"]);

function formatEyebrow(template: string, count: number): string {
  return template.replace(/\{count\}/g, String(count));
}

const LEGACY_CLINICS_HERO_DESCRIPTIONS = new Set([
  "Våre klinikker i Norge tilbyr spesialisthjelp uten henvisning og med kort ventetid.",
  "Our clinics in Norway offer specialist care without referral and with short waiting times.",
]);

interface ClinicsProps {
  isChatOpen: boolean;
}

const Clinics = ({ isChatOpen }: ClinicsProps) => {
  const { t } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const navigate = useNavigate();
  const { data: page } = useClinicsPage();
  const { data: sanityClinics = [] } = useClinics();
  const sanityBySlug = new Map(
    sanityClinics
      .filter((clinic: { slug?: string }) => clinic.slug && !EXCLUDED_CLINIC_SLUGS.has(clinic.slug))
      .map((clinic: { slug: string }) => [clinic.slug, clinic]),
  );
  const usedSlugs = new Set<string>();
  const mergedStaticClinics = staticClinics
    .filter((staticClinic) => !EXCLUDED_CLINIC_SLUGS.has(staticClinic.slug))
    .map((staticClinic) => {
      const fromSanity = sanityBySlug.get(staticClinic.slug);
      usedSlugs.add(staticClinic.slug);
      if (!fromSanity) return staticClinic;

      const overrides: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(fromSanity)) {
        if (value !== null && value !== undefined && value !== "") overrides[key] = value;
      }

      const sanityDescription =
        typeof (fromSanity as { description?: string }).description === "string"
          ? (fromSanity as { description?: string }).description
          : undefined;

      return {
        ...staticClinic,
        ...overrides,
        detail: {
          ...staticClinic.detail,
          ...((fromSanity as { detail?: object }).detail || {}),
          ...(sanityDescription ? { description: sanityDescription } : {}),
        },
      };
    });
  const extraSanityClinics = sanityClinics
    .filter(
      (clinic: { slug?: string }) =>
        clinic.slug && !usedSlugs.has(clinic.slug) && !EXCLUDED_CLINIC_SLUGS.has(clinic.slug),
    )
    .map((clinic: { detail?: object; description?: string }) => ({
      ...clinic,
      detail: {
        ...(clinic.detail || {}),
        ...(clinic.description ? { description: clinic.description } : {}),
      },
    }));
  const list = ([...mergedStaticClinics, ...extraSanityClinics] as Array<Record<string, any>>).sort(
    (a, b) => {
      const ao = typeof a.sortOrder === "number" ? a.sortOrder : 999;
      const bo = typeof b.sortOrder === "number" ? b.sortOrder : 999;
      return ao - bo;
    },
  );

  const clinicCount = list.length;
  const heroEyebrow = page?.heroEyebrow?.trim()
    ? formatEyebrow(page.heroEyebrow, clinicCount)
    : "";
  const heroTitle = page?.heroTitle?.trim() || "";
  const cmsHeroDescription = page?.heroDescription?.trim() || "";
  const heroDescription =
    cmsHeroDescription && !LEGACY_CLINICS_HERO_DESCRIPTIONS.has(cmsHeroDescription)
      ? cmsHeroDescription
      : t("clinicsPage.heroDescription");
  const heroImage = page?.heroImage;
  const hasHeroContent = Boolean(heroEyebrow || heroTitle || heroDescription || heroImage);
  const primaryCta = {
    label: page?.primaryCtaLabel?.trim() || t("nav.bookAppointment"),
    to: page?.primaryCtaPath?.trim() || "/booking",
  };
  const secondaryCta =
    page?.secondaryCtaLabel?.trim() && page?.secondaryCtaPath?.trim()
      ? {
          label: page.secondaryCtaLabel.trim(),
          to: page.secondaryCtaPath.trim(),
        }
      : undefined;

  const hasSeo = Boolean(page?.seo?.metaTitle || page?.seo?.metaDescription);
  const clinicsPath = "/klinikker";
  const geoName = heroTitle || page?.seo?.metaTitle || t("nav.clinics");
  const geoFallback = heroDescription || page?.seo?.metaDescription;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: list.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalClinic",
        name: `CMedical ${c.label}`,
        address: { "@type": "PostalAddress", streetAddress: c.address, addressCountry: "NO" },
        telephone: c.phone ? `+47 ${c.phone}` : undefined,
        url: `https://cmedical.no/klinikker/${c.slug}`,
      },
    })),
  };
  const geoJsonLd = buildMedicalWebPageGeoJsonLd({
    name: geoName,
    geoSummary: page?.geoSummary,
    fallbackDescription: geoFallback,
    url: clinicsPath,
    locale,
    extra: [itemListJsonLd],
  });

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {hasSeo ? (
        <PageSEO
          title={page?.seo?.metaTitle || ""}
          description={page?.seo?.metaDescription || ""}
          canonical={clinicsPath}
          breadcrumbs={[
            { name: t("pricing.breadcrumbHome"), path: "/" },
            { name: t("nav.clinics"), path: clinicsPath },
          ]}
          jsonLd={geoJsonLd}
        />
      ) : (
        <JsonLd data={geoJsonLd} />
      )}

      {hasHeroContent ? (
        <SplitHero
          eyebrow={heroEyebrow || undefined}
          title={heroTitle || undefined}
          description={heroDescription || undefined}
          image={heroImage}
          imageAlt={t("clinicsPage.heroImageAlt")}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
        />
      ) : (
        <div className="bg-brand-warm pt-20 pb-8">
          <div className="container mx-auto px-6 md:px-16">
            <Button variant="cta" size="lg" onClick={() => navigate("/booking")}>
              {t("nav.bookAppointment")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <section className="bg-background" aria-labelledby="clinics-heading">
        <h2 id="clinics-heading" className="sr-only">
          {t("clinicsPage.listHeading")}
        </h2>

        {list.map((clinic: (typeof list)[number], idx: number) => {
          const detailHref = `/klinikker/${clinic.slug}`;
          const serviceCount = clinic.services?.length || 0;
          const resolved = resolveCmsMedia(clinic.heroMedia, {
            mediaType: "image",
            imageUrl: clinic.primaryImage,
          });
          const listingImage = clinicListingImageSrc(
            resolved,
            clinic.primaryImage,
            clinic.slug,
          );
          const reverse = idx % 2 === 1;
          const description =
            (typeof clinic.description === "string" && clinic.description) ||
            clinic.detail?.description ||
            "";
          const imageLoading = idx === 0 ? "eager" : "lazy";
          const mediaClassName =
            "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]";

          return (
            <div
              key={clinic.id || clinic.slug}
              className="relative grid min-h-screen grid-cols-1 border-t border-border/40 lg:grid-cols-2"
            >
              <Link
                to={detailHref}
                className={`group relative block h-[60vh] overflow-hidden lg:h-auto lg:min-h-screen ${
                  reverse ? "lg:order-2" : ""
                }`}
                aria-label={t("clinicsPage.readMoreAria", { name: clinic.label })}
              >
                {resolved?.kind === "video" ? (
                  <CmsMedia
                    media={resolved}
                    alt={`CMedical ${clinic.label}`}
                    className={mediaClassName}
                    variant="gallery"
                    loading={imageLoading}
                    interactive={false}
                  />
                ) : listingImage ? (
                  <ResponsiveImage
                    src={listingImage}
                    alt={`CMedical ${clinic.label}`}
                    variant="gallery"
                    hotspot={resolved?.hotspot}
                    crop={resolved?.crop}
                    imageWidth={1920}
                    loading={imageLoading}
                    fetchPriority={idx === 0 ? "high" : undefined}
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className={mediaClassName}
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-mid/20" />
                )}
              </Link>

              <div className={`flex items-center bg-background ${reverse ? "lg:order-1" : ""}`}>
                <div className="w-full max-w-xl px-6 py-12 md:px-12 lg:px-16 lg:py-20">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-dark leading-tight mb-5">
                      <Link to={detailHref} className="hover:text-foreground transition-colors">
                        CMedical {clinic.label}
                      </Link>
                    </h3>

                    {description ? (
                      <p className="text-base text-muted-foreground font-light leading-[1.8] mb-8 max-w-md">
                        {description}
                      </p>
                    ) : null}

                    <ul className="space-y-3 mb-7 border-t border-border/50 pt-6">
                      <li className="flex items-start gap-3 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-brand-dark/50 mt-1 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-foreground font-light">{clinic.address}</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <Clock className="w-3.5 h-3.5 text-brand-dark/50 mt-1 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-foreground font-light">{clinic.hours}</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <Phone className="w-3.5 h-3.5 text-brand-dark/50 mt-1 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        {clinic.phone ? (
                          <a
                            href={`tel:+47${String(clinic.phone).replace(/\s/g, "")}`}
                            className="text-foreground font-light hover:underline underline-offset-4"
                          >
                            {clinic.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground font-light">—</span>
                        )}
                      </li>
                    </ul>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {clinic.detail?.parking && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/80 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Car className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          {t("clinicsPage.badgeParking")}
                        </span>
                      )}
                      {clinic.detail?.publicTransport && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/80 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Train className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          {t("clinicsPage.badgeTransit")}
                        </span>
                      )}
                      {clinic.detail?.accessibility && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/80 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Accessibility className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          {t("clinicsPage.badgeAccessible")}
                        </span>
                      )}
                      {serviceCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/80 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Stethoscope className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          {t("clinicsPage.badgeServices", { count: serviceCount })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      <Link
                        to={detailHref}
                        className="inline-flex items-center gap-1.5 text-sm font-normal text-brand-dark hover:gap-2.5 transition-all border-b border-brand-dark/40 hover:border-brand-dark pb-1"
                      >
                        {t("clinicsPage.readMore")}
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                      </Link>
                      {clinic.mapsUrl && (
                        <a
                          href={clinic.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground font-light transition-colors"
                        >
                          {t("clinicsPage.viewMap")}
                        </a>
                      )}
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <PageSectionsRenderer sections={page?.pageSections} />
    </PageLayout>
  );
};

export default Clinics;
