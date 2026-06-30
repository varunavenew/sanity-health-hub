"use client";

import { AssetImg } from "@/components/AssetImg";
import { useNavigate } from "@/lib/router";
import { PageLayout } from "@/components/layout/PageLayout";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAboutPage } from "@/hooks/useSanity";
import { getImageUrl } from "@/lib/sanityClient";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { ClinicGrid } from "@/components/ClinicGrid";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";

interface AboutProps {
  isChatOpen: boolean;
}

const About = ({ isChatOpen }: AboutProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const aboutPath = useNavCmsPath("about") || "/om-oss";
  const { data: sanityData } = useAboutPage();
  const pageSections = sanityData?.pageSections;

  const title = sanityData?.title?.trim() || "";
  const heroImage = sanityData?.heroImage ? getImageUrl(sanityData.heroImage) : "";
  const aboutParagraphs = sanityData?.sections?.length
    ? sanityData.sections.map((s: any) => s.content).filter(Boolean)
    : [];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <article className="bg-brand-warm pt-20">
        <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <GeoPageEnhancements
              name={title || "Om CMedical"}
              geoSummary={sanityData?.geoSummary}
              fallbackDescription={sanityData?.subtitle?.trim() || aboutParagraphs[0]}
              path={aboutPath}
              locale={locale}
              className="mb-6"
            />
            {title ? (
              <header className="mb-8 pb-6 border-b border-brand-dark/10">
                <p className="text-muted-foreground text-xs mb-2">Om CMedical</p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-dark">
                  {title}
                </h1>
              </header>
            ) : null}

            {aboutParagraphs.length > 0 ? (
              <div className="space-y-5 text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
                {aboutParagraphs.slice(0, 3).map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {heroImage ? (
          <div className="container mx-auto px-6 md:px-16 pb-10 md:pb-14">
            <div className="max-w-3xl mx-auto">
              <AssetImg
                src={heroImage}
                alt={title || "CMedical"}
                className="w-full aspect-[3/2] object-cover object-[30%_20%]"
              />
            </div>
          </div>
        ) : null}

        {aboutParagraphs.length > 3 ? (
          <div className="container mx-auto px-6 md:px-16 pb-10 md:pb-14">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-5 text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
                {aboutParagraphs.slice(3).map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-brand-dark/10">
                <Button
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-sm px-8 h-11 font-light"
                  onClick={() => navigate("/booking")}
                >
                  {t("cta.bookConsultation")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : aboutParagraphs.length > 0 ? (
          <div className="container mx-auto px-6 md:px-16 pb-10 md:pb-14">
            <div className="max-w-3xl mx-auto">
              <div className="mt-8 pt-6 border-t border-brand-dark/10">
                <Button
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-sm px-8 h-11 font-light"
                  onClick={() => navigate("/booking")}
                >
                  {t("cta.bookConsultation")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </article>

      {sanityData?.clinicsSection?.showSection !== false ? (
        <ClinicGrid
          title={sanityData?.clinicsSection?.title}
          clinics={sanityData?.clinicsSection?.clinics}
        />
      ) : null}

      {pageSections?.length ? <PageSectionsRenderer sections={pageSections} /> : null}
    </PageLayout>
  );
};

export default About;
