"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { AssetImg } from "@/components/AssetImg";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { useOpennessActPage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { SpecialistFAQ } from "@/components/specialist/SpecialistFAQ";
import { youtubeEmbedPortableTextType } from "@/lib/portable-text/youtube-embed-type";
import { useParams } from "@/lib/router";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";
import { getImageUrl } from "@/lib/sanity/image-url";
import { resolveOgImageAlt } from "@/lib/seo/seo-fields";

interface Aapenhetsloven2025Props {
  isChatOpen?: boolean;
}

const portableTextComponents = {
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-base font-medium text-foreground mt-3 mb-2">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-foreground/70 font-light leading-relaxed mb-3">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 italic text-foreground/70 my-4">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 space-y-1 text-foreground/70 font-light">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 space-y-1 text-foreground/70 font-light">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-brand-dark hover:underline"
      >
        {children}
      </a>
    ),
  },
  types: {
    ...youtubeEmbedPortableTextType,
    image: ({ value }: any) => {
      const ref = value?.asset?._ref || "";
      if (!ref) return null;
      return (
        <figure className="my-6">
          <AssetImg
            src={ref}
            alt={value?.alt || ""}
            preset="gallery"
            loading="lazy"
            className="rounded-lg w-full"
          />
          {value?.caption && (
            <figcaption className="text-sm text-muted-foreground mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

const Aapenhetsloven2025 = ({ isChatOpen = false }: Aapenhetsloven2025Props) => {
  const params = useParams<{ locale?: string }>();
  const locale: AppLocale = params?.locale === "en" ? "en" : "no";
  const isEn = locale === "en";
  const localePath = (path: string) => withLocalePath(locale, path);
  const { data: sanityData, isLoading: loading } = useOpennessActPage();

  const defaultTitle = isEn ? "Transparency Act 2025" : "Åpenhetsloven 2025";
  const defaultSubtitle = isEn
    ? "Disclosure for the 2025 reporting year. Due diligence assessments for sustainable business practices for CMedical Group AS."
    : "Redgjørelse rapporteringsåret 2025. Aktsomhetsvurderinger for bærekraftig forretningspraksis for CMedical Group AS.";
  const title = sanityData?.title || defaultTitle;
  const subtitle = sanityData?.subtitle || defaultSubtitle;
  const pagePath = localePath(`/${sanityData?.slug || (isEn ? "transparency-act-2025" : "aapenhetsloven-2025")}`);
  const homeLabel = sanityData?.breadcrumbHome || (isEn ? "Home" : "Hjem");
  const fallbackDescription = subtitle;
  const seoTitle = sanityData?.seo?.metaTitle || `${title} | CMedical`;
  const seoDescription = sanityData?.seo?.metaDescription || fallbackDescription;
  const schemaLocale = locale === "en" ? "en" : "nb";
  const ogImage = sanityData?.seo?.ogImage ? getImageUrl(sanityData.seo.ogImage) : undefined;
  const ogImageAlt = resolveOgImageAlt(sanityData?.seo, schemaLocale, title);
  const loadingLabel = isEn ? "Loading..." : "Laster innhold...";
  const hasSanityBody = sanityData?.body && sanityData.body.length > 0;
  const showFaq = sanityData?.showPracticalInfoSection !== false;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        canonical={pagePath}
        noIndex={!!sanityData?.seo?.noIndex}
        ogImage={ogImage || undefined}
        ogImageAlt={ogImageAlt}
        breadcrumbs={[
          { name: homeLabel, path: localePath("/") },
          { name: title, path: pagePath },
        ]}
        jsonLd={buildMedicalWebPageGeoJsonLd({
          name: title,
          geoSummary: sanityData?.geoSummary,
          fallbackDescription: seoDescription,
          url: pagePath,
          locale: schemaLocale,
        })}
      />

      <header className="bg-brand-warm">
        <div className="container mx-auto px-6 md:px-16 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] max-w-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          {loading ? (
            <p className="text-muted-foreground font-light">{loadingLabel}</p>
          ) : hasSanityBody ? (
            <PortableText
              value={(sanityData?.body ?? []) as PortableTextBlock[]}
              components={portableTextComponents}
            />
          ) : (
            <p className="text-foreground/70 font-light leading-relaxed">
              {sanityData?.emptyMessage ||
                (isEn
                  ? "Content is not available in English yet."
                  : "Innholdet er ikke tilgjengelig.")}
            </p>
          )}
        </div>
      </section>

      {showFaq ? <SpecialistFAQ /> : null}
      <PageSectionsRenderer sections={sanityData?.pageSections} />
    </PageLayout>
  );
};

export default Aapenhetsloven2025;
