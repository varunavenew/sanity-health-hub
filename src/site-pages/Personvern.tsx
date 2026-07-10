"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/lib/sanityClient";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { usePrivacyPolicyPage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { youtubeEmbedPortableTextType } from "@/lib/portable-text/youtube-embed-type";
import { useTranslation } from "react-i18next";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";
import { useParams } from "@/lib/router";
import { getImageUrl } from "@/lib/sanity/image-url";

interface PersonvernProps {
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
      <p className="text-foreground/80 leading-relaxed mb-3">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 italic text-foreground/70 my-4">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 space-y-1 text-foreground/80">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 space-y-1 text-foreground/80">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ value, children }: any) => (
      <a href={value?.href} target={value?.blank ? "_blank" : undefined} rel={value?.blank ? "noopener noreferrer" : undefined} className="text-primary hover:underline">{children}</a>
    ),
  },
  types: {
    ...youtubeEmbedPortableTextType,
    image: ({ value }: any) => {
      const imageUrl = value?.asset?._ref ? urlFor(value.asset._ref) : "";
      return imageUrl ? (
        <figure className="my-6">
          <img src={imageUrl} alt={value?.alt || ""} className="rounded-lg w-full" />
          {value?.caption && <figcaption className="text-sm text-muted-foreground mt-2">{value.caption}</figcaption>}
        </figure>
      ) : null;
    },
  },
};

const Personvern = ({ isChatOpen = false }: PersonvernProps) => {
  const { t, i18n } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale: AppLocale = params?.locale === "en" ? "en" : "no";
  const localePath = (path: string) => withLocalePath(locale, path);
  const isEn = i18n.language?.startsWith("en");
  const { data: sanityData, isLoading: loading } = usePrivacyPolicyPage();

  const defaultTitle = isEn ? "Privacy Policy" : "Personvernerklæring";
  const title = sanityData?.title || defaultTitle;
  const privacyPath = localePath(`/${sanityData?.slug || "personvern"}`);
  const fallbackDescription = isEn
    ? "Read CMedical's privacy policy. Information about how we process your personal data in accordance with GDPR and applicable privacy legislation."
    : "Les CMedicals personvernerklæring. Informasjon om hvordan vi behandler dine personopplysninger i samsvar med GDPR og norsk personvernlovgivning.";
  const seoTitle = sanityData?.seo?.metaTitle || title;
  const privacyDescription = sanityData?.seo?.metaDescription || fallbackDescription;
  const ogImage = sanityData?.seo?.ogImage
    ? getImageUrl(sanityData.seo.ogImage)
    : undefined;
  const loadingLabel = isEn ? "Loading..." : "Laster innhold...";
  const schemaLocale = locale === "en" ? "en" : "nb";
  const hasSanityBody = sanityData?.body && sanityData.body.length > 0;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={seoTitle}
        description={privacyDescription}
        canonical={privacyPath}
        noIndex={!!sanityData?.seo?.noIndex}
        ogImage={ogImage || undefined}
        breadcrumbs={[
          { name: isEn ? "Home" : "Hjem", path: localePath("/") },
          { name: t("footer.privacy"), path: privacyPath },
        ]}
        jsonLd={buildMedicalWebPageGeoJsonLd({
          name: title,
          geoSummary: sanityData?.geoSummary,
          fallbackDescription: privacyDescription,
          url: privacyPath,
          locale: schemaLocale,
        })}
      />
      <div className="container mx-auto px-6 md:px-16 py-20 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">{title}</h1>
        <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
          {loading ? (
            <p className="text-muted-foreground">
              {loadingLabel}
            </p>
          ) : hasSanityBody ? (
            <PortableText
              value={(sanityData?.body ?? []) as PortableTextBlock[]}
              components={portableTextComponents}
            />
          ) : (
            <p className="text-muted-foreground">
              {sanityData?.emptyMessage ||
                (isEn
                  ? "Privacy policy content is not available in English yet."
                  : "Innholdet er ikke tilgjengelig.")}
            </p>
          )}
        </div>
      </div>
      <PageSectionsRenderer sections={sanityData?.pageSections} />
    </PageLayout>
  );
};

export default Personvern;
