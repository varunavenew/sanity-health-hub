"use client";

import { useNavigate } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import { useGuidePage } from "@/hooks/useSanity";
import { useParams } from "@/lib/router";

interface GuideProps {
  isChatOpen: boolean;
}

type GuideCategory = {
  title: string;
  slug: string;
  description: string;
  heroImage?: string;
  treatments: Array<{ title: string }>;
};

const CategorySection = ({
  category,
  index,
}: {
  category: GuideCategory;
  index: number;
}) => {
  const isReversed = index % 2 !== 0;
  const bgClass = index % 2 === 0 ? "bg-background" : "bg-gradient-to-b from-background to-primary/5";

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className={isReversed ? "order-2 md:order-2" : ""}>
              <h2 className="text-4xl font-light mb-8 text-foreground">{category.title}</h2>
              {category.description ? (
                <p className="text-muted-foreground mb-6 font-light leading-relaxed">
                  {category.description}
                </p>
              ) : null}
              {category.treatments.length > 0 ? (
                <div className="space-y-4">
                  {category.treatments.map((t) => (
                    <div key={t.title} className="flex items-start gap-3">
                      <span className="text-foreground/40 mt-1">•</span>
                      <span className="text-muted-foreground font-light">{t.title}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {category.heroImage ? (
              <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden ${isReversed ? "order-1 md:order-1" : ""}`}>
                <img
                  src={category.heroImage}
                  alt={category.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

const Guide = ({ isChatOpen }: GuideProps) => {
  const navigate = useNavigate();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const { data: page, isLoading } = useGuidePage();

  const heroTitle = page?.heroTitle?.trim() || "";
  const heroSubtitle = page?.heroSubtitle?.trim() || "";
  const hasHero = Boolean(heroTitle || heroSubtitle);

  const showCategories = page?.showCategorySections !== false;
  const categories: GuideCategory[] = showCategories
    ? (page?.categories || [])
        .filter((cat) => cat?.title)
        .map((cat) => ({
          title: cat.title || "",
          slug: cat.slug || "",
          description: cat.description?.trim() || "",
          heroImage: cat.heroImage,
          treatments: (cat.treatments || [])
            .map((t) => ({ title: t.title?.trim() || "" }))
            .filter((t) => t.title),
        }))
    : [];

  const ctaTitle = page?.ctaTitle?.trim() || "";
  const ctaSubtitle = page?.ctaSubtitle?.trim() || "";
  const ctaButtonLabel = page?.ctaButtonLabel?.trim() || "";
  const ctaButtonPath = page?.ctaButtonPath?.trim() || "/booking";
  const hasCta = Boolean(ctaTitle || ctaSubtitle || ctaButtonLabel);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {hasHero ? (
        <section className="pt-32 pb-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              {heroTitle ? (
                <h1 className="text-5xl md:text-7xl font-light mb-6 text-foreground">{heroTitle}</h1>
              ) : null}
              {heroSubtitle ? (
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                  {heroSubtitle}
                </p>
              ) : null}
              <GeoPageEnhancements
                name={heroTitle || "Guide"}
                geoSummary={page?.geoSummary}
                fallbackDescription={heroSubtitle || page?.seo?.metaDescription}
                path="/guide"
                locale={locale}
                className="mt-6 text-left"
              />
            </div>
          </div>
        </section>
      ) : (
        <GeoPageEnhancements
          name="Guide"
          geoSummary={page?.geoSummary}
          fallbackDescription={page?.seo?.metaDescription}
          path="/guide"
          locale={locale}
          className="container mx-auto px-4 pt-32 max-w-3xl"
        />
      )}

      {showCategories ? (
        isLoading ? (
          <div className="container mx-auto px-4 py-20 space-y-8 max-w-5xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid md:grid-cols-2 gap-16">
                <div className="space-y-4">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="aspect-[4/5] rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          categories.map((cat, index) => (
            <CategorySection key={cat.slug || cat.title} category={cat} index={index} />
          ))
        )
      ) : null}

      {hasCta ? (
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              {ctaTitle ? (
                <h2 className="text-4xl font-light mb-6 text-foreground">{ctaTitle}</h2>
              ) : null}
              {ctaSubtitle ? (
                <p className="text-lg text-muted-foreground font-light mb-8 leading-relaxed">
                  {ctaSubtitle}
                </p>
              ) : null}
              {ctaButtonLabel ? (
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full px-12 py-6 text-lg"
                  onClick={() => navigate(ctaButtonPath)}
                >
                  {ctaButtonLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <PageSectionsRenderer sections={page?.pageSections} />
    </PageLayout>
  );
};

export default Guide;
