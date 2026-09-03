"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { combineGeoJsonLd, medicalWebPageJsonLd } from "@/lib/seo/geo-jsonld";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { SpecialtyAreaGrid } from "@/components/theme/SpecialtyAreaGrid";
import { CmsMedia } from "@/components/media/CmsMedia";
import { Button } from "@/components/ui/button";
import { useThemePage } from "@/hooks/useSanity";
import { useNavigate, useParams } from "@/lib/router";
import { resolveCmsMedia } from "@/lib/sanity/media-dual-read";
import { getImageUrl } from "@/lib/sanity/image-url";
import { ArrowRight } from "lucide-react";

type Props = {
  isChatOpen: boolean;
  /** Slug stored in Sanity — matches the active locale URL segment. */
  themeSlug: string;
};

/** Generic theme page renderer — content from Sanity, no hardcoded route slug. */
export default function CmsThemePage({ isChatOpen, themeSlug }: Props) {
  const navigate = useNavigate();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const { data: page } = useThemePage(themeSlug);

  const title = page?.title?.trim() || "";
  const heroImageUrl = page?.heroImage ? getImageUrl(page.heroImage) : "";
  const heroMedia = resolveCmsMedia(page?.heroMedia, {
    mediaType: heroImageUrl ? "image" : undefined,
    imageUrl: heroImageUrl,
  });
  const introTexts = (page?.introTexts || []).filter((text) => text?.trim());
  const sections = page?.sections || [];
  const lifePhases = page?.lifePhases || [];
  const supportSection = page?.supportSpecialtiesSection;
  const specialtySection = page?.specialtyAreasSection;
  const ctaText = page?.ctaText?.trim();
  const ctaLink = page?.ctaLink?.trim();
  const seoTitle = page?.seo?.metaTitle?.trim() || title;
  const seoDescription = page?.seo?.metaDescription?.trim() || "";
  const pagePath = `/${themeSlug}`;
  const summaryText =
    page?.geoSummary?.trim() || introTexts[0] || seoDescription;
  const geoJsonLd = combineGeoJsonLd(
    medicalWebPageJsonLd({
      name: title,
      description: summaryText.slice(0, 320),
      url: pagePath,
      inLanguage: locale === "en" ? "en" : "nb-NO",
    }),
  );

  const hasHeroMedia = Boolean(heroMedia?.src || heroMedia?.poster);
  const heroPoster =
    heroMedia?.kind === "video" ? heroMedia.poster : heroMedia?.src || heroImageUrl;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {!title ? (
        <h1 className="sr-only">
          {page?.seo?.metaTitle?.trim() || themeSlug.replace(/-/g, " ")}
        </h1>
      ) : null}
      {seoTitle || seoDescription ? (
        <PageSEO
          title={seoTitle}
          description={seoDescription}
          canonical={pagePath}
          ogImage={
            typeof page?.seo?.ogImage === "string"
              ? page.seo.ogImage
              : heroPoster || undefined
          }
          noIndex={page?.seo?.noIndex}
          jsonLd={geoJsonLd.length === 1 ? geoJsonLd[0] : geoJsonLd}
          breadcrumbs={[
            { name: locale === "en" ? "Home" : "Hjem", path: "/" },
            ...(title ? [{ name: title, path: pagePath }] : []),
          ]}
        />
      ) : null}

      {/* Hero */}
      {hasHeroMedia && heroMedia ? (
        <section className="relative h-[30vh] min-h-[220px] md:h-[40vh] md:min-h-[280px] overflow-hidden bg-brand-dark">
          <CmsMedia
            media={heroMedia}
            alt={title}
            variant="hero"
            objectPosition="center 40%"
            className="w-full h-full"
            loading="eager"
            interactive={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/20 to-transparent" />
          {title ? (
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
              <div className="container mx-auto">
                <h1 className="text-3xl md:text-5xl font-light text-white">{title}</h1>
              </div>
            </div>
          ) : null}
        </section>
      ) : heroImageUrl ? (
        <section className="relative h-[30vh] min-h-[220px] md:h-[40vh] md:min-h-[280px] overflow-hidden">
          <img
            src={heroImageUrl}
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 40%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/20 to-transparent" />
          {title ? (
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
              <div className="container mx-auto">
                <h1 className="text-3xl md:text-5xl font-light text-white">{title}</h1>
              </div>
            </div>
          ) : null}
        </section>
      ) : title ? (
        <div className="container mx-auto px-6 md:px-16 pt-20 pb-8">
          <h1 className="text-3xl md:text-5xl font-light text-brand-dark">{title}</h1>
        </div>
      ) : null}

      <div className="bg-brand-warm">
        <div className="container mx-auto px-6 md:px-16 py-12 md:py-16 lg:py-20">
          {introTexts.length > 0 ? (
            <div className="max-w-3xl space-y-4 mb-12 md:mb-16">
              {introTexts.map((text, i) => (
                <p
                  key={i}
                  className="text-lg md:text-xl text-brand-dark/80 font-light leading-relaxed"
                >
                  {text}
                </p>
              ))}
            </div>
          ) : null}

          <div className="max-w-3xl space-y-12 md:space-y-16">
            {sections.map((section, i) => (
              <section key={i}>
                {section.heading ? (
                  <h2 className="text-2xl md:text-3xl font-light text-brand-dark mb-4 md:mb-6">
                    {section.heading}
                  </h2>
                ) : null}
                {(section.paragraphs || []).map((p, j) => (
                  <p
                    key={j}
                    className="text-base text-brand-dark/75 font-light leading-relaxed mb-4 last:mb-0"
                  >
                    {p}
                  </p>
                ))}
                {section.bulletPoints?.length ? (
                  <ul className="list-disc pl-5 space-y-2 text-brand-dark/75 font-light mt-4">
                    {section.bulletPoints.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {supportSection?.items?.length ? (
              <section className="space-y-6">
                {supportSection.title ? (
                  <h2 className="text-2xl md:text-3xl font-light text-brand-dark mb-4 md:mb-6">
                    {supportSection.title}
                  </h2>
                ) : null}
                {supportSection.intro ? (
                  <p className="text-base text-brand-dark/75 font-light leading-relaxed">
                    {supportSection.intro}
                  </p>
                ) : null}
                <dl className="space-y-6">
                  {supportSection.items.map((item, j) => (
                    <div key={j}>
                      <dt className="text-base font-medium text-brand-dark mb-1">
                        {item.title}
                      </dt>
                      <dd className="text-base text-brand-dark/75 font-light leading-relaxed">
                        {item.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>

          {specialtySection?.title && specialtySection.cards?.length ? (
            <div className="mt-16 md:mt-20 -mx-6 md:-mx-16 px-6 md:px-16">
              <SpecialtyAreaGrid
                title={specialtySection.title}
                cards={specialtySection.cards.map((card) => ({
                  title: card.title,
                  href: card.href,
                  image: card.image,
                  imageAlt: card.imageAlt,
                }))}
              />
            </div>
          ) : null}

          {lifePhases.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 mt-16 md:mt-20 max-w-5xl">
              {lifePhases.map((phase, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-sm border border-brand-mid/10"
                >
                  <h3 className="text-lg font-medium text-brand-dark mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-brand-dark/70 font-light leading-relaxed">
                    {phase.text}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {page?.pageSections ? (
            <div className="mt-16 md:mt-20">
              <PageSectionsRenderer sections={page.pageSections} />
            </div>
          ) : null}

          {ctaText && ctaLink ? (
            <div className="mt-12 md:mt-16">
              <Button
                onClick={() => navigate(ctaLink)}
                className="rounded-sm bg-brand-dark hover:bg-brand-dark/90 font-light"
              >
                {ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </PageLayout>
  );
}
