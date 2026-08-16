"use client";

import { AssetImg } from "@/components/AssetImg";
import { useNavigate } from "@/lib/router";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useAboutPage } from "@/hooks/useSanity";
import { getImageUrl } from "@/lib/sanity/image-url";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { ClinicGrid } from "@/components/ClinicGrid";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";

interface AboutProps {
  isChatOpen: boolean;
}

type AboutBodyBlock = {
  _key?: string;
  style?: string;
  text: string;
};

/**
 * Insert the hero image after the first editorial section (first h2 + following
 * normals), matching the reference About layout on avenewdemo.
 */
function splitBodyAroundHeroImage(blocks: AboutBodyBlock[]) {
  if (!blocks.length) return { before: [] as AboutBodyBlock[], after: [] as AboutBodyBlock[] };

  let splitAt = -1;
  let seenFirstHeading = false;
  for (let i = 0; i < blocks.length; i++) {
    const style = blocks[i].style || "normal";
    if (style === "h2" || style === "h3") {
      if (!seenFirstHeading) {
        seenFirstHeading = true;
        continue;
      }
      splitAt = i;
      break;
    }
  }

  if (splitAt < 0) {
    const cut = Math.min(3, blocks.length);
    return { before: blocks.slice(0, cut), after: blocks.slice(cut) };
  }

  return { before: blocks.slice(0, splitAt), after: blocks.slice(splitAt) };
}

const About = ({ isChatOpen }: AboutProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const routeLocale: AppLocale = params?.locale === "en" ? "en" : "no";
  const { data: sanityData } = useAboutPage();
  const pageSections = sanityData?.pageSections;

  const title = sanityData?.title?.trim() || "";
  const heroEyebrow = sanityData?.heroEyebrow?.trim() || "";
  const heroImage = sanityData?.heroImage ? getImageUrl(sanityData.heroImage) : "";
  const heroImageAlt = sanityData?.heroImageAlt?.trim() || "";
  const aboutPath = sanityData?.slug
    ? withLocalePath(routeLocale, `/${sanityData.slug}`)
    : "";

  const bodyBlocks: AboutBodyBlock[] = Array.isArray(sanityData?.bodyBlocks)
    ? sanityData.bodyBlocks
    : (sanityData?.sections || [])
        .map((s: { content?: string }) => ({
          style: "normal",
          text: typeof s.content === "string" ? s.content : "",
        }))
        .filter((b: AboutBodyBlock) => Boolean(b.text?.trim()));

  const { before, after } = splitBodyAroundHeroImage(bodyBlocks);
  const firstParagraph =
    bodyBlocks.find((b) => (b.style || "normal") === "normal" && b.text.trim())?.text || "";

  const renderBlocks = (blocks: AboutBodyBlock[], keyPrefix: string) =>
    blocks.map((block, i) => {
      const text = block.text.trim();
      if (!text) return null;
      const style = block.style || "normal";
      const key = block._key || `${keyPrefix}-${i}`;

      if (style === "h2") {
        return (
          <h2
            key={key}
            className="text-xl md:text-2xl font-light text-brand-dark pt-6 first:pt-0"
          >
            {text}
          </h2>
        );
      }
      if (style === "h3") {
        return (
          <h3
            key={key}
            className="text-lg md:text-xl font-light text-brand-dark pt-4 first:pt-0"
          >
            {text}
          </h3>
        );
      }
      return <p key={key}>{text}</p>;
    });

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <article className="bg-brand-warm pt-20">
        <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <GeoPageEnhancements
              name={title}
              geoSummary={sanityData?.geoSummary}
              fallbackDescription={sanityData?.subtitle?.trim() || firstParagraph}
              path={aboutPath}
              locale={locale}
              className="mb-6"
            />
            {title ? (
              <header className="mb-8 pb-6 border-b border-brand-dark/10">
                {heroEyebrow ? (
                  <p className="text-muted-foreground text-xs mb-2">{heroEyebrow}</p>
                ) : null}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-dark leading-none">
                  {title}
                </h1>
              </header>
            ) : null}

            {before.length > 0 ? (
              <div className="space-y-5 text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
                {renderBlocks(before, "before")}
              </div>
            ) : null}
          </div>
        </div>

        {heroImage ? (
          <div className="container mx-auto px-6 md:px-16 pb-10 md:pb-14">
            <div className="max-w-3xl mx-auto">
              <AssetImg
                src={heroImage}
                alt={heroImageAlt || title}
                className="w-full aspect-[3/2] object-cover object-[30%_20%]"
                preset="hero"
              />
            </div>
          </div>
        ) : null}

        <div className="container mx-auto px-6 md:px-16 pb-10 md:pb-14">
          <div className="max-w-3xl mx-auto">
            {after.length > 0 ? (
              <div className="space-y-5 text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
                {renderBlocks(after, "after")}
              </div>
            ) : null}

            {/* Mid-page consultation CTA — present on reference even when the
                shared booking CTA band is also rendered below. */}
            <div className={`${after.length > 0 ? "mt-8" : ""} pt-6 border-t border-brand-dark/10`}>
              <Button
                variant="cta"
                size="lg"
                className="w-full md:w-auto"
                onClick={() => navigate("/booking")}
              >
                {t("cta.bookConsultation")}
              </Button>
            </div>
          </div>
        </div>
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
