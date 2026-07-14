"use client";

import { useParams, useNavigate, useRouteSlug } from "@/lib/router";
import { useRef } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialistBySlug } from "@/hooks/useSpecialistsData";
import { useSpecialistsListingPage } from "@/hooks/useSanity";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { InlineBookingSection } from "@/components/specialist/InlineBookingSection";
import { SpecialistHero } from "@/components/specialist/SpecialistHero";
import { SpecialistBio } from "@/components/specialist/SpecialistBio";
import { SpecialistFeaturedService } from "@/components/specialist/SpecialistFeaturedService";
import { SpecialistReviews } from "@/components/specialist/SpecialistReviews";
import { RelatedSpecialists } from "@/components/specialist/RelatedSpecialists";
import { SpecialistFAQBlock } from "@/components/specialist/SpecialistFAQBlock";
import {
  SpecialistProfileUiProvider,
  useSpecialistProfileUi,
} from "@/components/specialist/SpecialistProfileUiContext";
import { motion } from "framer-motion";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { siteUrl } from "@/lib/env";
import type { Specialist } from "@/lib/sanity/specialist-types";
import type { SpecialistProfileUi } from "@/lib/sanity/specialist-profile-ui";
import { defaultSpecialistProfileUi } from "@/lib/sanity/specialist-profile-ui";

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
      <SpecialistProfileBody
        isChatOpen={isChatOpen}
        specialist={specialist}
        profileUi={profileUi}
      />
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
  const bookingRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const specialistsPath = useNavCmsPath("specialists");
  const ui = useSpecialistProfileUi();

  const relatedSection = specialist.relatedSpecialistsSection;
  const relatedSpecialists = relatedSection?.specialists ?? [];

  const seoTitle = specialist.seo?.metaTitle ?? specialist.name;
  const seoDescription = specialist.seo?.metaDescription ?? specialist.bio ?? "";
  const profilePath = `${specialistsPath}/${specialist.slug}`;

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const physicianJsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: specialist.name,
    jobTitle: specialist.title,
    medicalSpecialty: specialist.expertise || [],
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
        type="profile"
        breadcrumbs={[
          { name: profileUi.breadcrumbHomeLabel, path: "/" },
          { name: profileUi.breadcrumbSpecialistsLabel, path: specialistsPath },
          { name: specialist.name, path: profilePath },
        ]}
        jsonLd={profileJsonLd}
      />
      <SpecialistHero specialist={specialist} onScrollToBooking={scrollToBooking} />
      <SpecialistBio specialist={specialist} />
      <SpecialistFeaturedService specialist={specialist} />
      <SpecialistReviews specialist={specialist} />

      <section ref={bookingRef} className="py-14 md:py-20 bg-brand-dark scroll-mt-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-4"
            >
              <h2 className="text-2xl md:text-3xl font-light text-white mb-3">
                {ui.bookingSectionTitle}
              </h2>
              <p className="text-sm text-white/60 font-light leading-relaxed max-w-sm">
                {ui.bookingSectionDescription}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-8"
            >
              <InlineBookingSection specialist={specialist} />
            </motion.div>
          </div>
        </div>
      </section>

      <RelatedSpecialists
        specialists={relatedSpecialists}
        specialistsPath={specialistsPath}
        eyebrow={relatedSection?.eyebrow}
        heading={relatedSection?.heading}
        ctaLabel={relatedSection?.ctaLabel}
        ctaPath={relatedSection?.ctaPath}
      />
      <SpecialistFAQBlock faqs={specialist.faqs} title={specialist.faqSectionTitle} />

      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 px-4 py-3 safe-area-pb">
        <Button
          onClick={scrollToBooking}
          className="w-full rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
          {ui.bookingCtaLabel}
        </Button>
      </div>
    </PageLayout>
  );
}

export default SpecialistProfile;
