"use client";

import { PortableText } from "@portabletext/react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import { CmsMedia } from "@/components/media/CmsMedia";
import { useGuidePage } from "@/hooks/useSanity";
import { useParams } from "@/lib/router";
import { resolveCmsMedia } from "@/lib/sanity/media-dual-read";
import { AssetImg } from "@/components/AssetImg";

interface GuideProps {
  isChatOpen: boolean;
}

type GuideSection = {
  id: string;
  title: string;
  description: unknown;
  image?: string;
};

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: ReactNode }) => (
      <p className="text-muted-foreground mb-4 font-light leading-relaxed">{children}</p>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-2xl font-light mb-4 text-foreground">{children}</h3>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h4 className="text-xl font-light mb-3 text-foreground">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }: { children?: ReactNode }) => (
      <div className="space-y-4 mb-6">{children}</div>
    ),
    number: ({ children }: { children?: ReactNode }) => (
      <ol className="list-decimal ml-5 text-muted-foreground font-light space-y-2 mb-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: ReactNode }) => (
      <div className="flex items-start gap-3">
        <span className="text-foreground/40 mt-1">•</span>
        <span className="text-muted-foreground font-light">{children}</span>
      </div>
    ),
  },
};

const GuideMarketingSection = ({
  section,
  index,
}: {
  section: GuideSection;
  index: number;
}) => {
  const isReversed = index % 2 !== 0;
  const bgClass = index % 2 === 0 ? "bg-background" : "bg-gradient-to-b from-background to-primary/5";
  const hasText = Boolean(section.title || section.description);
  const hasImage = Boolean(section.image);

  if (!hasText && !hasImage) return null;

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className={isReversed ? "order-2 md:order-2" : ""}>
              {section.title ? (
                <h2 className="text-4xl font-light mb-8 text-foreground">{section.title}</h2>
              ) : null}
              {section.description ? (
                <PortableText
                  value={section.description as any}
                  components={portableTextComponents}
                />
              ) : null}
            </div>
            {hasImage ? (
              <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden ${isReversed ? "order-1 md:order-1" : ""}`}>
                <AssetImg
                  src={section.image}
                  alt={section.title || "Guide section image"}
                  preset="gallery"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

const Guide = ({ isChatOpen }: GuideProps) => {
  const navigate = useNavigate();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const { data: page, isLoading } = useGuidePage();

  const heroTitle = page?.heroTitle?.trim() || "";
  const heroSubtitle = page?.heroSubtitle?.trim() || "";
  const breadcrumbHome = page?.breadcrumbHome?.trim() || "";
  const primaryCtaLabel = page?.primaryCtaLabel?.trim() || "";
  const primaryCtaPath = page?.primaryCtaPath?.trim() || "";
  const heroMedia = resolveCmsMedia(page?.heroMedia, { mediaType: "image" });
  const hasHeroContent = Boolean(
    heroTitle ||
      heroSubtitle ||
      breadcrumbHome ||
      primaryCtaLabel ||
      heroMedia,
  );

  const categoriesIntroTitle = page?.categoriesIntroTitle?.trim() || "";
  const categoriesIntroDescription = page?.categoriesIntroDescription?.trim() || "";
  const hasCategoriesIntro = Boolean(categoriesIntroTitle || categoriesIntroDescription);

  const guideSections: GuideSection[] = (page?.guideSections || [])
    .filter((section) => section?.title || section?.description || section?.image)
    .map((section, index) => ({
      id: section._key?.trim() || `guide-section-${index}`,
      title: section.title?.trim() || "",
      description: section.description,
      image: section.image,
    }));

  const introSectionClass = hasHeroContent
    ? "pb-24 bg-gradient-to-b from-background to-primary/5"
    : "pt-32 pb-24 bg-gradient-to-b from-primary/5 to-background";
  const IntroHeadingTag = hasHeroContent ? "h2" : "h1";

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {hasHeroContent ? (
        <section className="pt-32 pb-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className={`max-w-5xl mx-auto ${heroMedia ? "grid md:grid-cols-2 gap-16 items-center" : "max-w-3xl text-center"}`}>
              <div>
                {breadcrumbHome ? (
                  <nav aria-label="breadcrumb" className="text-xs font-light text-muted-foreground flex items-center gap-2 mb-6">
                    <Link to="/" className="hover:text-foreground transition-colors">{breadcrumbHome}</Link>
                    {heroTitle ? (
                      <>
                        <span aria-hidden="true">›</span>
                        <span className="text-foreground/80">{heroTitle}</span>
                      </>
                    ) : null}
                  </nav>
                ) : null}
                {heroTitle ? (
                  <h1 className="text-5xl md:text-7xl font-light mb-6 text-foreground">{heroTitle}</h1>
                ) : null}
                {heroSubtitle ? (
                  <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                    {heroSubtitle}
                  </p>
                ) : null}
                {primaryCtaLabel && primaryCtaPath ? (
                  <div className="mt-8">
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full px-12 py-6 text-lg"
                      onClick={() => navigate(primaryCtaPath)}
                    >
                      {primaryCtaLabel}
                    </Button>
                  </div>
                ) : null}
              </div>
              {heroMedia ? (
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <CmsMedia
                    media={heroMedia}
                    alt={heroTitle || "Guide hero"}
                    className="w-full h-full object-cover"
                    loading="eager"
                    autoPlay={false}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <GeoPageEnhancements
            name={heroTitle || "Guide"}
            geoSummary={page?.geoSummary}
            fallbackDescription={heroSubtitle || page?.seo?.metaDescription}
            path="/guide"
            locale={locale}
            className="container mx-auto px-4 max-w-3xl pt-8"
          />
        </section>
      ) : !hasCategoriesIntro ? (
        <GeoPageEnhancements
          name="Guide"
          geoSummary={page?.geoSummary}
          fallbackDescription={page?.seo?.metaDescription}
          path="/guide"
          locale={locale}
          className="container mx-auto px-4 pt-32 max-w-3xl"
        />
      ) : null}

      {hasCategoriesIntro ? (
        <section className={introSectionClass}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              {categoriesIntroTitle ? (
                <IntroHeadingTag className="text-5xl md:text-7xl font-light mb-6 text-foreground">
                  {categoriesIntroTitle}
                </IntroHeadingTag>
              ) : null}
              {categoriesIntroDescription ? (
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                  {categoriesIntroDescription}
                </p>
              ) : null}
              {!hasHeroContent ? (
                <GeoPageEnhancements
                  name={categoriesIntroTitle || "Guide"}
                  geoSummary={page?.geoSummary}
                  fallbackDescription={
                    categoriesIntroDescription || page?.seo?.metaDescription
                  }
                  path="/guide"
                  locale={locale}
                  className="mt-6 text-left"
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {isLoading ? (
        <div className="container mx-auto px-4 py-20 space-y-8 max-w-5xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid md:grid-cols-2 gap-16">
              <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="aspect-[4/5] rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        guideSections.map((section, index) => (
          <GuideMarketingSection key={section.id} section={section} index={index} />
        ))
      )}

      <PageSectionsRenderer sections={page?.pageSections} />
    </PageLayout>
  );
};

export default Guide;
