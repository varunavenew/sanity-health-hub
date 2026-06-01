"use client";

import { AssetImg } from "@/components/AssetImg";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "@/lib/router";
import { ArrowRight, Check, Phone, Clock, FileText, Shield, Plus, Minus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  useTreatment,
  useTreatmentCategory,
  useFaqsByTreatmentCategory,
  useSiteSettings,
} from "@/hooks/useSanity";
import { bookingUrlForTreatment, resolveCategoryNumericId } from "@/lib/bookingLinks";
import { PageSEO } from "@/components/seo/PageSEO";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { TreatmentDataProvider } from "@/components/providers/TreatmentDataProvider";
import type { TreatmentData } from "@/lib/sanity/treatment-data";

interface TreatmentPageProps {
  categoryId: string;
  isChatOpen: boolean;
  initialTreatment?: TreatmentData | null;
  sanityLang?: "no" | "en";
}

type TreatmentPageContentProps = {
  categoryId: string;
  isChatOpen: boolean;
};

const QUICK_INFO_ICONS = [FileText, Clock, Shield] as const;

const formatInlineMarkdown = (text: string): string => {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline underline-offset-4 hover:text-foreground transition-colors">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>');
};

const TreatmentFaq = ({
  question,
  answer,
  isLast,
  customContent,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isLast: boolean;
  customContent?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className={`${!isLast ? "border-b border-border" : ""}`}>
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 px-5 md:px-6 text-left hover:bg-secondary/20 transition-colors group"
    >
      <span className="text-[15px] md:text-base font-normal text-foreground pr-4">{question}</span>
      {isOpen ? (
        <Minus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      ) : (
        <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      )}
    </button>
    <div
      className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className="overflow-hidden">
        <div className="px-5 md:px-6 pb-5 pr-12">
          {customContent || (
            <p className="text-muted-foreground text-sm md:text-[15px] leading-relaxed font-light">{answer}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AccordionGroup = ({
  children,
}: {
  children: (
    openIndex: number | null,
    setOpenIndex: (i: number | null) => void,
  ) => React.ReactNode;
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number | null) => setOpenIndex((prev) => (prev === i ? null : i));
  return <>{children(openIndex, toggle)}</>;
};

const TreatmentPageContent = ({ categoryId, isChatOpen }: TreatmentPageContentProps) => {
  const params = useParams();
  const subId =
    typeof params.subId === "string"
      ? params.subId
      : Array.isArray(params.subId)
        ? params.subId[0] ?? ""
        : "";
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { data: treatment, isLoading } = useTreatment(categoryId, subId || "");
  const { data: sanityCategory } = useTreatmentCategory(categoryId);
  const { data: sanityFaqs } = useFaqsByTreatmentCategory(categoryId);
  const { data: siteSettings } = useSiteSettings();

  const categoryNumericId = useMemo(
    () =>
      resolveCategoryNumericId(categoryId, sanityCategory?.categoryNumericId ?? treatment?.categoryNumericId),
    [categoryId, sanityCategory?.categoryNumericId, treatment?.categoryNumericId],
  );

  const treatmentBookingUrl = useMemo(
    () => bookingUrlForTreatment(categoryId, undefined, categoryNumericId),
    [categoryId, categoryNumericId],
  );

  const breadcrumbHome = useMemo(() => {
    const nav = siteSettings?.mainNavigation as { path?: string; label?: string; navId?: string }[] | undefined;
    const homeNav = nav?.find((item) => item.path === "/" || item.navId === "home");
    return (typeof homeNav?.label === "string" && homeNav.label.trim()) || "";
  }, [siteSettings?.mainNavigation]);

  const pageUi = useMemo(() => {
    const cta = sanityCategory?.bottomCta;
    const primaryPath = cta?.primaryPath?.trim() || treatmentBookingUrl;
    const quickInfoItems = (sanityCategory?.quickInfoItems ?? []).filter(
      (label): label is string => typeof label === "string" && label.length > 0,
    );

    return {
      quickInfoItems,
      linkedServicesTitle: (sanityCategory?.linkedServicesSectionTitle ?? "").trim(),
      processTitle: (sanityCategory?.processSectionTitle ?? "").trim(),
      faqTitle: (sanityCategory?.faqSectionTitle ?? "").trim(),
      ctaTitle: (cta?.title ?? "").trim(),
      ctaSubtitle: (cta?.subtitle ?? "").trim(),
      ctaPrimaryLabel: (cta?.primaryLabel ?? "").trim(),
      ctaSecondaryLabel: (cta?.secondaryLabel ?? "").trim(),
      ctaPrimaryPath: primaryPath,
      ctaSecondaryPath: (cta?.secondaryPath ?? "").trim(),
    };
  }, [sanityCategory, treatmentBookingUrl]);

  const faqs = useMemo(() => {
    if (sanityFaqs && sanityFaqs.length > 0) return sanityFaqs;
    return treatment?.faqs ?? [];
  }, [sanityFaqs, treatment?.faqs]);

  const heroImage = treatment?.heroImage || sanityCategory?.heroImage || "";

  useEffect(() => {
    if (treatment?.title) {
      document.title = `${treatment.title} | CMedical`;
    }
  }, [treatment?.title]);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }
    }
  }, [location.hash, treatment]);

  if (isLoading) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-muted-foreground font-light">{t("common.loading")}</p>
        </div>
      </PageLayout>
    );
  }

  if (!treatment) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-normal text-foreground mb-4">{t("treatmentPage.notFoundTitle")}</h1>
            <p className="text-muted-foreground font-light mb-8">{t("treatmentPage.notFoundBody")}</p>
            <Button onClick={() => navigate(`/${categoryId}`)} className="rounded-md">
              {t("treatmentPage.backTo")} {categoryId}
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const parentCategory =
    treatment.parentCategory || sanityCategory?.title || categoryId;
  const showBottomCta = Boolean(pageUi.ctaTitle);
  const benefitsTitle = (treatment.benefitsTitle ?? "").trim();

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={`${treatment.title} – ${parentCategory}`}
        description={(treatment.description || "").split("\n")[0].slice(0, 155)}
        canonical={`/behandlinger/${categoryId}/${subId}`}
        breadcrumbs={[
          ...(breadcrumbHome ? [{ name: breadcrumbHome, path: "/" }] : []),
          { name: parentCategory, path: `/${categoryId}` },
          { name: treatment.title, path: `/behandlinger/${categoryId}/${subId}` },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: treatment.title,
          description: (treatment.description || "").split("\n")[0] || "",
          howPerformed: treatment.subtitle || undefined,
          provider: { "@type": "MedicalClinic", name: "CMedical" },
        }}
      />

      <header className="relative h-[32vh] md:h-[38vh] overflow-hidden">
        {heroImage ? (
          <AssetImg
            src={heroImage}
            alt={treatment.title}
            className="w-full h-full object-cover object-[center_30%]"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-brand-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto px-0 md:px-8">
            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-3 font-light">
              {breadcrumbHome ? (
                <>
                  <button type="button" onClick={() => navigate("/")} className="hover:text-white/70 transition-colors">
                    {breadcrumbHome}
                  </button>
                  <ChevronRight className="w-3 h-3" />
                </>
              ) : null}
              <button
                type="button"
                onClick={() => navigate(`/${categoryId}`)}
                className="hover:text-white/70 transition-colors"
              >
                {parentCategory}
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/70">{treatment.title}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-white leading-tight">
              {treatment.title}
            </h1>
            {treatment.subtitle && (
              <p className="text-sm md:text-base text-white/60 font-light mt-2">{treatment.subtitle}</p>
            )}
          </div>
        </div>
      </header>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            {pageUi.quickInfoItems.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-10">
                {pageUi.quickInfoItems.map((label, i) => {
                  const Icon = QUICK_INFO_ICONS[i] ?? FileText;
                  return (
                    <div
                      key={`${label}-${i}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/50 border border-border/50"
                    >
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                      <span className="text-xs md:text-sm text-foreground/70 font-light">{label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {treatment.description && (
              <div className="mb-14">
                <div className="text-base md:text-[17px] text-foreground/80 leading-[1.8] font-light whitespace-pre-line">
                  {treatment.description}
                </div>
              </div>
            )}

            {treatment.sections && treatment.sections.length > 0 && (
              <div className="mb-14 space-y-10">
                {treatment.sections.map((section, i) => (
                  <div key={section.id || `section-${i}`} className="rounded-2xl border border-border/50 bg-card p-6 md:p-8">
                    <h3 className="text-lg md:text-xl font-normal text-foreground mb-4">
                      {section.heading || `${i + 1}`}
                    </h3>
                    <div className="space-y-3">
                      {(section.content || "").split("\n").map((line, j) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        if (trimmed.startsWith("- ")) {
                          return (
                            <div key={j} className="flex items-start gap-3 pl-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2.5 flex-shrink-0" />
                              <p
                                className="text-foreground/80 font-light leading-[1.8]"
                                dangerouslySetInnerHTML={{
                                  __html: formatInlineMarkdown(trimmed.slice(2)),
                                }}
                              />
                            </div>
                          );
                        }
                        return (
                          <p
                            key={j}
                            className="text-foreground/80 font-light leading-[1.8]"
                            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {((pageUi.linkedServicesTitle && treatment.linkedServices && treatment.linkedServices.length > 0) ||
              (benefitsTitle && treatment.benefits && treatment.benefits.length > 0) ||
              (pageUi.processTitle && treatment.process && treatment.process.length > 0)) && (
              <div className="mb-14 rounded-2xl border border-border/50 overflow-hidden">
                <AccordionGroup>
                  {(openIndex, setOpenIndex) => {
                    let idx = -1;
                    const next = () => ++idx;
                    return (
                      <>
                        {treatment.linkedServices && treatment.linkedServices.length > 0 && (() => {
                          const myIdx = next();
                          return (
                            <TreatmentFaq
                              question={pageUi.linkedServicesTitle}
                              answer=""
                              isLast={false}
                              isOpen={openIndex === myIdx}
                              onToggle={() => setOpenIndex(myIdx)}
                              customContent={
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {treatment.linkedServices!.map((service) => (
                                    <button
                                      key={service.path + service.label}
                                      type="button"
                                      onClick={() => navigate(service.path)}
                                      className="text-left p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-all group"
                                    >
                                      <h3 className="text-sm font-normal text-foreground mb-1 flex items-center gap-2">
                                        {service.label}
                                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                                      </h3>
                                      {service.description && (
                                        <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                          {service.description}
                                        </p>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              }
                            />
                          );
                        })()}

                        {benefitsTitle && treatment.benefits && treatment.benefits.length > 0 && (() => {
                          const myIdx = next();
                          return (
                            <TreatmentFaq
                              question={benefitsTitle}
                              answer=""
                              isLast={false}
                              isOpen={openIndex === myIdx}
                              onToggle={() => setOpenIndex(myIdx)}
                              customContent={
                                <div className="space-y-3">
                                  {treatment.benefits!.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-accent-foreground" />
                                      </div>
                                      <p className="text-foreground/80 font-light text-[15px] leading-relaxed">
                                        {benefit}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              }
                            />
                          );
                        })()}

                        {pageUi.processTitle && treatment.process && treatment.process.length > 0 && (() => {
                          const myIdx = next();
                          return (
                            <TreatmentFaq
                              question={pageUi.processTitle}
                              answer=""
                              isLast={false}
                              isOpen={openIndex === myIdx}
                              onToggle={() => setOpenIndex(myIdx)}
                              customContent={
                                <div className="relative">
                                  <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
                                  <div className="space-y-0">
                                    {treatment.process!.map((step, i) => (
                                      <div key={i} className="flex gap-5 relative">
                                        <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0 z-10">
                                          {i + 1}
                                        </div>
                                        <div className="pb-6 pt-1 flex-1">
                                          <h3 className="font-medium text-foreground mb-1 text-[15px]">{step.title}</h3>
                                          <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                            {step.description}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              }
                            />
                          );
                        })()}
                      </>
                    );
                  }}
                </AccordionGroup>
              </div>
            )}
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="py-14 md:py-20 bg-secondary">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8">{pageUi.faqTitle}</h2>
              <div className="rounded-2xl border border-border/50 overflow-hidden bg-background">
                <AccordionGroup>
                  {(openIndex, setOpenIndex) => (
                    <>
                      {faqs.map((faq, i) => (
                        <TreatmentFaq
                          key={`faq-${i}`}
                          question={faq.question}
                          answer={faq.answer}
                          isLast={i === faqs.length - 1}
                          isOpen={openIndex === i}
                          onToggle={() => setOpenIndex(i)}
                        />
                      ))}
                    </>
                  )}
                </AccordionGroup>
              </div>
            </div>
          </div>
        </section>
      )}

      <PageSectionsRenderer sections={treatment.pageSections} />

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            {showBottomCta && (
              <div className="bg-brand-dark rounded-2xl p-8 md:p-12 text-center mb-14">
                <h2 className="text-2xl md:text-3xl font-normal text-white mb-3">{pageUi.ctaTitle}</h2>
                {pageUi.ctaSubtitle && (
                  <p className="text-white/60 font-light mb-8 max-w-md mx-auto text-[15px]">{pageUi.ctaSubtitle}</p>
                )}
                {(pageUi.ctaPrimaryLabel || (pageUi.ctaSecondaryLabel && pageUi.ctaSecondaryPath)) && (
                  <div
                    className={`flex flex-col sm:flex-row gap-3 justify-center ${pageUi.ctaSubtitle ? "" : "mt-2"}`}
                  >
                    {pageUi.ctaPrimaryLabel && (
                      <Button
                        size="lg"
                        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 font-normal"
                        onClick={() => navigate(pageUi.ctaPrimaryPath)}
                      >
                        {pageUi.ctaPrimaryLabel}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    )}
                    {pageUi.ctaSecondaryLabel && pageUi.ctaSecondaryPath && (
                      <Button
                        size="lg"
                        variant="ghost"
                        className="border border-white/20 text-white bg-transparent hover:bg-white/10 rounded-full px-8 font-normal"
                        onClick={() => navigate(pageUi.ctaSecondaryPath)}
                      >
                        <Phone className="mr-2 w-4 h-4" />
                        {pageUi.ctaSecondaryLabel}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate(`/${categoryId}`)}
              className="text-sm text-muted-foreground hover:text-foreground font-light flex items-center gap-1.5 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              {parentCategory}
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

const TreatmentPage = ({
  categoryId,
  isChatOpen,
  initialTreatment = null,
  sanityLang = "no",
}: TreatmentPageProps) => {
  const params = useParams();
  const subId =
    typeof params.subId === "string"
      ? params.subId
      : Array.isArray(params.subId)
        ? params.subId[0] ?? ""
        : "";

  return (
    <TreatmentDataProvider
      lang={sanityLang}
      categorySlug={categoryId}
      treatmentSlug={subId}
      data={initialTreatment}
    >
      <TreatmentPageContent categoryId={categoryId} isChatOpen={isChatOpen} />
    </TreatmentDataProvider>
  );
};

export default TreatmentPage;
