"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { JsonLd } from "@/components/seo/JsonLd";
import { combineGeoJsonLd, medicalWebPageJsonLd } from "@/lib/seo/geo-jsonld";
import { Button } from "@/components/ui/button";
import { CmsMedia } from "@/components/media/CmsMedia";
import { useRobotkirurgiPage } from "@/hooks/useSanity";
import { useNavigate, useParams } from "@/lib/router";
import { resolveCmsMedia } from "@/lib/sanity/media-dual-read";
import { IMAGE_PRESET } from "@/lib/media/delivery";
import { getImageUrl } from "@/lib/sanity/image-url";
import { resolveOgImageAlt } from "@/lib/seo/seo-fields";

interface PageProps {
  isChatOpen: boolean;
}

function renderBodyText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function quotedText(text: string, locale: string) {
  const trimmed = text.trim().replace(/^[“"«]+|[”"»]+$/g, "");
  return locale === "en" ? `"${trimmed}"` : `«${trimmed}»`;
}

function quotedAttribution(attribution: string) {
  const trimmed = attribution.trim().replace(/^[-–—]\s*/, "");
  return `— ${trimmed}`;
}

const RobotkirurgiPage = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const { data: page } = useRobotkirurgiPage();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const title = page?.title || "";
  const subtitle = page?.subtitle || "";
  const heroMedia = resolveCmsMedia(page?.heroMedia, {});
  const heroAlt = page?.heroImageAlt || title;
  const pagePath = locale === "en" ? "/robot-assisted-surgery" : "/robotassistert-kirurgi";
  const seoTitle = page?.seo?.metaTitle?.trim() || title;
  const seoDescription = page?.seo?.metaDescription?.trim() || subtitle;
  const summaryText = page?.geoSummary?.trim() || subtitle || seoDescription;
  const faqs = page?.faqs || [];

  const geoJsonLd = combineGeoJsonLd(
    medicalWebPageJsonLd({
      name: title,
      description: summaryText.slice(0, 320),
      url: pagePath,
      inLanguage: locale === "en" ? "en" : "nb-NO",
    }),
  );

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  const hasHeroMedia = Boolean(heroMedia?.src || heroMedia?.poster);
  const heroPoster =
    heroMedia?.kind === "video" ? heroMedia.poster : heroMedia?.src;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {!title ? (
        <h1 className="sr-only">
          {page?.seo?.metaTitle?.trim() ||
            (locale === "en" ? "Robot-assisted surgery" : "Robotassistert kirurgi")}
        </h1>
      ) : null}
      {seoTitle || seoDescription ? (
        <PageSEO
          title={seoTitle}
          description={seoDescription}
          canonical={pagePath}
          ogImage={
            page?.seo?.ogImage
              ? getImageUrl(page.seo.ogImage, { width: IMAGE_PRESET.og.defaultWidth })
              : heroPoster || undefined
          }
          ogImageAlt={resolveOgImageAlt(page?.seo, locale === "en" ? "en" : "nb", title)}
          noIndex={page?.seo?.noIndex}
          jsonLd={geoJsonLd.length === 1 ? geoJsonLd[0] : geoJsonLd}
          breadcrumbs={[
            { name: locale === "en" ? "Home" : "Hjem", path: "/" },
            ...(title ? [{ name: title, path: pagePath }] : []),
          ]}
        />
      ) : null}

      <div className="bg-background">
        <section className="page-shell pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="max-w-2xl text-left">
            {title ? (
              <h1 className="text-3xl md:text-5xl font-light text-foreground leading-tight">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mt-4 md:mt-5 text-sm md:text-base font-light text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            ) : null}
            {page?.primaryCtaLabel && page?.primaryCtaPath ? (
              <Button
                variant="cta"
                size="lg"
                className="mt-6 h-11 px-6 md:mt-8 max-sm:w-auto"
                onClick={() => navigate(page.primaryCtaPath)}
              >
                {page.primaryCtaLabel}
              </Button>
            ) : null}
          </div>

          {hasHeroMedia && heroMedia ? (
            <div className="mt-10 overflow-hidden rounded-2xl md:mt-14">
              <CmsMedia
                media={heroMedia}
                alt={heroAlt}
                variant="hero"
                objectPosition="center 40%"
                className="aspect-[16/9] w-full md:aspect-[2/1]"
                loading="eager"
                interactive={false}
              />
            </div>
          ) : null}
        </section>

        <article className="page-shell pb-8 md:pb-12">
          <div className="mx-auto max-w-3xl text-left">
            {(page?.introTexts ?? []).map((text, i) => (
              <p
                key={i}
                className="mb-5 text-base font-normal leading-[1.7] text-muted-foreground last:mb-0"
              >
                {text}
              </p>
            ))}

            {(page?.sections ?? []).map((section, sIdx) => {
              const isListSection = section.bulletPoints.length > 0;
              return (
              <section
                key={`${section.heading}-${sIdx}`}
                className={isListSection ? "mt-5" : "mt-12 md:mt-16"}
              >
                {section.heading ? (
                  isListSection ? (
                    <h2 className="mb-3 text-base font-semibold text-foreground">
                      {section.heading}
                    </h2>
                  ) : (
                    <h2 className="mb-5 text-2xl font-light text-foreground md:text-3xl md:mb-6">
                      {section.heading}
                    </h2>
                  )
                ) : null}
                {isListSection && section.bulletPoints.length > 0 ? (
                  <ul className="mb-5 list-disc space-y-1 pl-5 text-base font-normal leading-[1.7] text-muted-foreground">
                    {section.bulletPoints.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="mb-5 text-base font-normal leading-[1.7] text-muted-foreground last:mb-0"
                  >
                    {renderBodyText(paragraph)}
                  </p>
                ))}
              </section>
              );
            })}

            {page?.quoteText ? (
              <blockquote className="mt-10 rounded-[20px] border-l-[3px] border-l-brand-mid bg-muted px-8 py-6 md:mt-12 md:px-10 md:py-8">
                <p className="text-base font-light leading-[1.65] text-muted-foreground">
                  {quotedText(page.quoteText, locale)}
                </p>
                {page.quoteAttribution ? (
                  <footer className="mt-5 text-sm font-light text-muted-foreground">
                    {quotedAttribution(page.quoteAttribution)}
                  </footer>
                ) : null}
              </blockquote>
            ) : null}

            {page?.secondaryCtaLabel && page?.secondaryCtaPath ? (
              <div className="mt-8 md:mt-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="h-11 px-6"
                  onClick={() => navigate(page.secondaryCtaPath)}
                >
                  {page.secondaryCtaLabel}
                </Button>
              </div>
            ) : null}
          </div>
        </article>

        {faqs.length > 0 ? (
          <section className="page-shell pb-16 md:pb-24">
            {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-2xl font-light text-foreground md:text-3xl text-center">
                {page?.faqSectionTitle ||
                  (locale === "en" ? "Frequently asked questions" : "Ofte stilte spørsmål")}
              </h2>
              <div className="overflow-hidden rounded-2xl bg-white px-6 shadow-sm md:px-8">
                {faqs.map((faq, index) => {
                  const id = `robotkirurgi-faq-${index}`;
                  const isOpen = openFaq === id;
                  return (
                    <div
                      key={id}
                      className="border-b border-border/60 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : id)}
                        className="flex w-full items-center justify-between py-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="pr-4 text-base font-normal text-foreground">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          isOpen ? "max-h-96 pb-5" : "max-h-0"
                        }`}
                      >
                        <p className="pr-8 text-sm font-light leading-relaxed text-muted-foreground md:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </PageLayout>
  );
};

export default RobotkirurgiPage;
