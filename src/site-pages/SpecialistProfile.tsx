"use client";

import { useEffect, useMemo } from "react";
import { useParams, useNavigate, useRouteSlug } from "@/lib/router";
import { Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialistBySlug, useSpecialistsData } from "@/hooks/useSpecialistsData";
import { useSpecialistsListingPage } from "@/hooks/useSanity";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { SpecialistInlineBookingBand } from "@/components/specialist/InlineBookingSection";
import { SpecialistHero } from "@/components/specialist/SpecialistHero";
import { SpecialistBio } from "@/components/specialist/SpecialistBio";
import { SpecialistFeaturedService } from "@/components/specialist/SpecialistFeaturedService";
import { SpecialistReviews } from "@/components/specialist/SpecialistReviews";
import { RelatedSpecialists } from "@/components/specialist/RelatedSpecialists";
import { SpecialistFAQBlock } from "@/components/specialist/SpecialistFAQBlock";
import { SpecialistBookNowButton } from "@/components/specialist/SpecialistCtaButtons";
import { SpecialistPageBookingProvider, useSpecialistPageBookingOptional } from "@/components/specialist/SpecialistPageBooking";
import {
  SpecialistProfileUiProvider,
  useSpecialistProfileUi,
} from "@/components/specialist/SpecialistProfileUiContext";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { resolveSeoShareImageUrl } from "@/lib/seo/resolve-seo-share-image";
import { resolveOgImageAlt } from "@/lib/seo/seo-fields";
import { siteUrl } from "@/lib/env";
import { assetSrc } from "@/lib/media";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { specialistExpertiseLabels } from "@/lib/sanity/specialist-types";
import type { SpecialistProfileUi } from "@/lib/sanity/specialist-profile-ui";
import { defaultSpecialistProfileUi } from "@/lib/sanity/specialist-profile-ui";
import { specialistProfileBookingPending, specialistShowsProfileBookingButton } from "@/lib/sanity/specialist-cta";
import { trackSpecialistView } from "@/lib/tracking/form-events";
import { resolveRelatedSpecialistsForProfile } from "@/lib/sanity/related-specialists";
interface SpecialistProfileProps {
  isChatOpen: boolean;
}

const SpecialistProfile = ({ isChatOpen }: SpecialistProfileProps) => {
  const params = useParams<{ locale?: string; slug: string }>();
  const slug = useRouteSlug() || params.slug || "";
  const navigate = useNavigate();
  const { specialist, isLoading: specialistLoading } = useSpecialistBySlug(slug || "");
  const { data: listingPage, isLoading: listingLoading } = useSpecialistsListingPage();
  const profileUi = listingPage?.profileUi ?? defaultSpecialistProfileUi(
    params?.locale === "en" ? "en" : "no",
  );
  const loadingLabel = params?.locale === "en" ? "Loading..." : "Laster...";

  const isLoading = specialistLoading || listingLoading;

  if (isLoading) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground font-light">{loadingLabel}</p>
        </div>
      </PageLayout>
    );
  }

  if (!specialist) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-foreground mb-4">
              {profileUi.notFoundTitle}
            </h1>
            <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full">
              {profileUi.notFoundBackLabel}
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const firstName = specialist.name.split(" ")[0];

  return (
    <SpecialistProfileUiProvider firstName={firstName} profileUi={profileUi}>
      <SpecialistPageBookingProvider specialist={specialist}>
        <SpecialistProfileBody
          isChatOpen={isChatOpen}
          specialist={specialist}
          profileUi={profileUi}
        />
      </SpecialistPageBookingProvider>
    </SpecialistProfileUiProvider>
  );
};

function SpecialistProfileBody({
  isChatOpen,
  specialist,
  profileUi,
}: {
  isChatOpen: boolean;
  specialist: Specialist;
  profileUi: SpecialistProfileUi;
}) {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const specialistsPath = useNavCmsPath("specialists");
  const ui = useSpecialistProfileUi();
  const pageBooking = useSpecialistPageBookingOptional();

  const relatedSection = specialist.relatedSpecialistsSection;
  const { sorted: allSpecialists } = useSpecialistsData();
  const relatedSpecialists = useMemo(
    () => resolveRelatedSpecialistsForProfile(specialist, allSpecialists),
    [specialist, allSpecialists],
  );

  const seoTitle = specialist.seo?.metaTitle ?? specialist.name;
  const seoDescription = specialist.seo?.metaDescription ?? specialist.bio ?? "";
  const profilePath = `${specialistsPath}/${specialist.slug}`;
  const shareImageUrl = resolveSeoShareImageUrl({
    seo: specialist.seo,
    portraitImageUrl: assetSrc(specialist.image),
    heroMedia: specialist.heroMedia,
  });
  const ogImageAlt = resolveOgImageAlt(
    specialist.seo,
    locale === "en" ? "en" : "nb",
    specialist.name,
  );

  useEffect(() => {
    const clinicLabel =
      specialist.clinicRefs?.[0]?.label ??
      specialist.clinics?.[0] ??
      null;
    trackSpecialistView({
      specialist_name: specialist.name,
      specialty: specialist.title || specialist.expertise?.[0]?.label || null,
      clinic: clinicLabel,
    });
  }, [specialist.slug, specialist.name, specialist.title, specialist.expertise, specialist.clinicRefs, specialist.clinics]);

  const physicianJsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: specialist.name,
    jobTitle: specialist.title,
    medicalSpecialty: specialistExpertiseLabels(specialist.expertise),
    ...(shareImageUrl ? { image: shareImageUrl } : {}),
    worksFor: {
      "@type": "MedicalClinic",
      name: "CMedical",
    },
    url: `${siteUrl()}${profilePath}`,
  };
  const profileJsonLd = buildMedicalWebPageGeoJsonLd({
    name: specialist.name,
    geoSummary: specialist.geoSummary,
    fallbackDescription: specialist.bio,
    url: profilePath,
    locale,
    extra: [physicianJsonLd],
  });

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        canonical={profilePath}
        ogImage={shareImageUrl}
        ogImageAlt={ogImageAlt}
        type="profile"
        breadcrumbs={[
          { name: profileUi.breadcrumbHomeLabel, path: "/" },
          { name: profileUi.breadcrumbSpecialistsLabel, path: specialistsPath },
          { name: specialist.name, path: profilePath },
        ]}
        jsonLd={profileJsonLd}
      />
      <SpecialistHero specialist={specialist} />
      <SpecialistBio specialist={specialist} />
      <SpecialistFeaturedService specialist={specialist} />
      <SpecialistReviews specialist={specialist} />

      <SpecialistInlineBookingBand specialist={specialist} />

      <RelatedSpecialists
        specialists={relatedSpecialists}
        specialistsPath={specialistsPath}
        eyebrow={relatedSection?.eyebrow}
        heading={relatedSection?.heading}
        ctaLabel={relatedSection?.ctaLabel}
        ctaPath={relatedSection?.ctaPath}
      />
      <SpecialistFAQBlock faqs={specialist.faqs} title={specialist.faqSectionTitle} />

      {specialistProfileBookingPending(specialist, pageBooking) ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 px-4 py-3 safe-area-pb">
          <div
            role="status"
            aria-live="polite"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-muted text-sm font-normal text-muted-foreground"
          >
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
            <span>{ui.bookingAvailabilityCheckingLabel}</span>
          </div>
        </div>
      ) : specialistShowsProfileBookingButton(specialist, pageBooking) ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 px-4 py-3 safe-area-pb">
          <SpecialistBookNowButton
            specialist={specialist}
            variant="default"
            className="w-full rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
            {ui.bookingCtaLabel}
          </SpecialistBookNowButton>
        </div>
      ) : null}
    </PageLayout>
  );
}

export default SpecialistProfile;
