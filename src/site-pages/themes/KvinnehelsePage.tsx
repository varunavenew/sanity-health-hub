"use client";

import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "@/lib/router";
import { useThemePage } from "@/hooks/useSanity";
import { getImageUrl } from "@/lib/sanityClient";
import { PageSEO } from "@/components/seo/PageSEO";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { VideoPlayer } from "@/components/ui/video-player";

interface PageProps {
  isChatOpen: boolean;
}

const KvinnehelsePage = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { data: page } = useThemePage("kvinnehelse");

  const title = page?.title?.trim() || "";
  const heroImage = page?.heroImage ? getImageUrl(page.heroImage) : "";
  const introTexts = page?.introTexts || [];
  const sections = page?.sections || [];
  const lifePhases = page?.lifePhases || [];
  const ctaText = page?.ctaText?.trim();
  const ctaLink = page?.ctaLink?.trim();

  useEffect(() => {
    if (title) document.title = `${title} | CMedical`;
  }, [title]);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={page?.seo?.metaTitle?.trim() || title}
        description={page?.seo?.metaDescription?.trim() || ""}
        canonical="/kvinnehelse"
        ogImage={typeof page?.seo?.ogImage === "string" ? page.seo.ogImage : undefined}
        noIndex={page?.seo?.noIndex}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          ...(title ? [{ name: title, path: "/kvinnehelse" }] : []),
        ]}
      />
      <header className="bg-brand-warm">
        <div className="grid md:grid-cols-2 items-stretch">
          <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-16 md:py-20 order-2 md:order-1">
            {title ? (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
                {title}
              </h1>
            ) : null}
            {ctaText && ctaLink ? (
              <div className="flex flex-wrap gap-3">
                <Button variant="cta" size="lg" onClick={() => navigate(ctaLink)}>
                  {ctaText}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ) : null}
          </div>

          <div className="order-1 md:order-2">
            <VideoPlayer
              thumbnailUrl={heroImage || "/videos/kvinnehelse-konsept-poster.jpg"}
              videoUrl="/videos/kvinnehelse-konsept.mp4"
              title={title || "Kvinnehelse"}
              className="!rounded-none w-full h-full"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {(introTexts.length > 0 || sections.length > 0 || lifePhases.length > 0) && (
        <section className="pt-6 md:pt-8 pb-16 md:pb-24 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            {introTexts.map((text, i) => (
              <p key={i} className="text-base text-muted-foreground font-light leading-relaxed mb-6">
                {text}
              </p>
            ))}

            {sections.map((section, sIdx) => (
              <div key={sIdx} className="mb-12">
                {section.heading ? (
                  <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
                    {section.heading}
                  </h2>
                ) : null}
                {section.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx} className="text-base text-muted-foreground font-light leading-relaxed mb-6">
                    {p}
                  </p>
                ))}
                {section.bulletPoints && section.bulletPoints.length > 0 ? (
                  <ul className="space-y-2 mb-8">
                    {section.bulletPoints.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}

            {lifePhases.length > 0 ? (
              <div className="space-y-8 mb-12">
                {lifePhases.map((phase) => (
                  <div key={phase.title}>
                    {phase.title ? (
                      <h3 className="text-lg font-normal text-foreground mb-2">{phase.title}</h3>
                    ) : null}
                    {phase.text ? (
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        {phase.text}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {ctaText && ctaLink ? (
              <Button
                onClick={() => navigate(ctaLink)}
                className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-full font-light"
              >
                {ctaText}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : null}
          </div>
        </section>
      )}

      <PageSectionsRenderer sections={page?.pageSections} />
    </PageLayout>
  );
};

export default KvinnehelsePage;
