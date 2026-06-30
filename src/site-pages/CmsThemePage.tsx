"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { combineGeoJsonLd, medicalWebPageJsonLd } from "@/lib/seo/geo-jsonld";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/video-player";
import { useThemePage } from "@/hooks/useSanity";
import { useNavigate, useParams } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/sanityClient";

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
  const heroImage = page?.heroImage ? getImageUrl(page.heroImage) : "";
  const introTexts = (page?.introTexts || []).filter((text) => text?.trim());
  const sections = page?.sections || [];
  const lifePhases = page?.lifePhases || [];
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

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {seoTitle || seoDescription ? (
        <PageSEO
          title={seoTitle}
          description={seoDescription}
          canonical={pagePath}
          ogImage={typeof page?.seo?.ogImage === "string" ? page.seo.ogImage : undefined}
          noIndex={page?.seo?.noIndex}
          jsonLd={geoJsonLd.length === 1 ? geoJsonLd[0] : geoJsonLd}
        />
      ) : null}
      <div className="bg-brand-warm">
        {heroImage ? (
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/30 to-transparent" />
            {title ? (
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <div className="container mx-auto">
                  <h1 className="text-3xl md:text-5xl font-light text-white">{title}</h1>
                </div>
              </div>
            ) : null}
          </div>
        ) : title ? (
          <div className="container mx-auto px-6 md:px-16 pt-20 pb-8">
            <h1 className="text-3xl md:text-5xl font-light text-brand-dark">{title}</h1>
          </div>
        ) : null}

        <div className="container mx-auto px-6 md:px-16 py-12 md:py-16 space-y-12">

          {introTexts.map((text, i) => (
            <p key={i} className="text-lg text-brand-dark/80 font-light max-w-3xl">
              {text}
            </p>
          ))}

          {sections.map((section, i) => (
            <section key={i} className="max-w-3xl">
              {section.heading ? (
                <h2 className="text-2xl font-light text-brand-dark mb-4">{section.heading}</h2>
              ) : null}
              {(section.paragraphs || []).map((p, j) => (
                <p key={j} className="text-brand-dark/75 font-light mb-3">
                  {p}
                </p>
              ))}
              {section.bulletPoints?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-brand-dark/75 font-light">
                  {section.bulletPoints.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {lifePhases.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {lifePhases.map((phase, i) => (
                <div key={i} className="bg-white p-6 rounded-sm border border-brand-mid/10">
                  <h3 className="text-lg font-medium text-brand-dark mb-2">{phase.title}</h3>
                  <p className="text-sm text-brand-dark/70 font-light">{phase.text}</p>
                </div>
              ))}
            </div>
          ) : null}

          {page?.pageSections ? (
            <PageSectionsRenderer sections={page.pageSections} />
          ) : null}

          {ctaText && ctaLink ? (
            <Button
              onClick={() => navigate(ctaLink)}
              className="rounded-sm bg-brand-dark hover:bg-brand-dark/90"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </PageLayout>
  );
}
