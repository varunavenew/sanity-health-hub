"use client";

import { AssetImg } from "@/components/AssetImg";
import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "@/lib/router";
import { useThemePage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { getImageUrl } from "@/lib/sanityClient";
import { PageSEO } from "@/components/seo/PageSEO";

interface PageProps {
  isChatOpen: boolean;
}

const THEME_SLUG = "robotassistert-kirurgi";

const RobotkirurgiPage = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { data: page } = useThemePage(THEME_SLUG);

  const title = page?.title?.trim() || "";
  const heroImg = page?.heroImage ? getImageUrl(page.heroImage) : "";
  const introTexts = page?.introTexts || [];
  const sections = page?.sections || [];
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
        canonical={`/${THEME_SLUG}`}
        ogImage={typeof page?.seo?.ogImage === "string" ? page.seo.ogImage : undefined}
        noIndex={page?.seo?.noIndex}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          ...(title ? [{ name: title, path: `/${THEME_SLUG}` }] : []),
        ]}
      />
      {heroImg ? (
        <section className="relative h-[30vh] min-h-[220px] overflow-hidden">
          <AssetImg
            src={heroImg}
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 40%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
          {title ? (
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="container mx-auto">
                <h1 className="text-3xl md:text-5xl font-light text-white">{title}</h1>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {(introTexts.length > 0 || sections.length > 0) && (
        <section className="py-16 md:py-24 bg-background">
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
                {(section.paragraphs || []).map((p, pIdx) => (
                  <p key={pIdx} className="text-base text-muted-foreground font-light leading-relaxed mb-6">
                    {p}
                  </p>
                ))}
                {section.bulletPoints && section.bulletPoints.length > 0 ? (
                  <ul className="space-y-2 mb-6">
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

export default RobotkirurgiPage;
