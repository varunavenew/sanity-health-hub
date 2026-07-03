"use client";

import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { useSpecialistsPage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { PortableText } from "@portabletext/react";
import { youtubeEmbedPortableTextType } from "@/lib/portable-text/youtube-embed-type";
import { useParams } from "@/lib/router";

interface AboutSpecialistsProps {
  isChatOpen: boolean;
}

const AboutSpecialists = ({ isChatOpen }: AboutSpecialistsProps) => {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const { data: pageData } = useSpecialistsPage();

  const title = pageData?.title?.trim();
  const subtitle = pageData?.subtitle?.trim();
  const heroEyebrow = pageData?.heroEyebrow?.trim();
  const localizedSlug =
    locale === "en" ? pageData?.slugEn?.trim() : pageData?.slugNb?.trim();
  const aboutSpecialistsPath = localizedSlug ? `/${localizedSlug}` : undefined;
  const seoTitle = pageData?.seo?.metaTitle?.trim();
  const seoDescription = pageData?.seo?.metaDescription?.trim();
  const hasSeo = Boolean(seoTitle && seoDescription && aboutSpecialistsPath);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {hasSeo ? (
        <PageSEO
          title={seoTitle!}
          description={seoDescription!}
          canonical={aboutSpecialistsPath!}
          jsonLd={buildMedicalWebPageGeoJsonLd({
            name: title || seoTitle!,
            geoSummary: pageData?.geoSummary,
            fallbackDescription: subtitle,
            url: aboutSpecialistsPath!,
            locale,
          })}
        />
      ) : null}

      {/* Hero */}
      <section className="bg-brand-dark pt-24 pb-14 md:pt-28 md:pb-20">
        <div className="container mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {heroEyebrow ? (
              <p className="text-white/60 text-xs mb-2">{heroEyebrow}</p>
            ) : null}
            {title ? (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="text-white/70 font-light text-base md:text-lg leading-relaxed">
                {subtitle}
              </p>
            ) : null}
          </motion.div>
        </div>
      </section>

      {/* Body content */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl space-y-6"
          >
            {pageData?.body ? (
              <div className="prose prose-lg max-w-none text-foreground/80 font-light leading-[1.85]">
                <PortableText
                  value={pageData.body}
                  components={{ types: youtubeEmbedPortableTextType }}
                />
              </div>
            ) : null}

            <Link
              to="/spesialister"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors mt-8"
            >
              Se alle våre spesialister
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
      <PageSectionsRenderer sections={pageData?.pageSections} />
    </PageLayout>
  );
};

export default AboutSpecialists;
