"use client";

import { Link, useLocation } from "@/lib/router";
import { coercePath } from "@/lib/navigation/coerce-path";
import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSanity";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";

interface NotFoundProps {
  isChatOpen?: boolean;
}

const NotFound = ({ isChatOpen = false }: NotFoundProps) => {
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    // Soft signal for analytics — not user-visible
    console.warn("[404] Ukjent sti:", location.pathname);
  }, [location.pathname]);

  const title = settings?.notFoundTitle?.trim() || "";
  const text = settings?.notFoundText?.trim() || "";
  const image = settings?.notFoundImage?.trim() || "";
  const ctaLabel = settings?.notFoundCtaLabel?.trim() || "";
  const ctaPath = coercePath(settings?.notFoundCtaPath);
  const showCta = Boolean(ctaLabel && ctaPath);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Siden finnes ikke | CMedical"
        description="Lenken er utdatert eller siden er flyttet. Finn frem til gynekologi, fertilitet, spesialister og booking hos CMedical."
        canonical="/404"
        noIndex
      />

      {/* HERO — rolig, varmt, på merkevaren */}
      <section className="bg-brand-light">
        <div className="grid lg:grid-cols-12 min-h-[70vh]">
          <div
            className={`${image ? "lg:col-span-7" : "lg:col-span-12"} px-6 md:px-16 lg:px-20 py-20 lg:py-28 flex items-center`}
          >
            <div className="max-w-xl">
              {title ? (
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-light leading-[1.05] text-foreground mb-6">
                  {title}
                </h1>
              ) : null}
              {text ? (
                <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
                  {text}
                </p>
              ) : null}

              {showCta ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild variant="cta" size="lg" className="px-8">
                    <Link to={ctaPath}>{ctaLabel}</Link>
                  </Button>
                </div>
              ) : null}

              {location.pathname && location.pathname !== "/" && (
                <p className="mt-8 text-xs font-light text-foreground/45">
                  Forsøkt sti:{" "}
                  <code className="font-mono text-foreground/70">
                    {location.pathname}
                  </code>
                </p>
              )}
            </div>
          </div>

          {image ? (
            <div className="lg:col-span-5 relative bg-secondary/40 min-h-[320px] lg:min-h-full overflow-hidden">
              <img
                src={image}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>
    </PageLayout>
  );
};

export default NotFound;
