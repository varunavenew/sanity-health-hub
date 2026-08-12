"use client";

/**
 * Pricing-page-owned CTA band.
 * Intentionally separate from shared BookingCTA chrome (white primary on dark).
 * Reference (avenewdemo /priser): dark brown band, lime primary, outline secondary.
 */

import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@/lib/router";
import { buildBookingUrl } from "@/lib/bookingLinks";
import type { ResolvedBookingCtaBody } from "@/lib/sanity/cta-dual-read";
import { isUsableBookingCtaBody } from "@/lib/sanity/cta-dual-read";

type Props = {
  config: ResolvedBookingCtaBody | null | undefined;
};

export function PricingPageCta({ config }: Props) {
  if (!config || !isUsableBookingCtaBody(config)) return null;

  const title = config.title?.trim();
  const subtitle = config.subtitle?.trim();
  const primaryLabel = config.primaryLabel?.trim();
  const secondaryLabel = config.secondaryLabel?.trim();
  const showSecondary = config.showSecondaryButton !== false && Boolean(secondaryLabel);
  const secondaryPath = config.secondaryPath?.trim() || "/kontakt";
  const bookingTarget =
    config.primaryPath?.trim() ||
    (config.bookingCategory?.categoryId
      ? buildBookingUrl({ kategori: config.bookingCategory.categoryId })
      : "/booking");

  return (
    <PricingPageCtaInner
      title={title}
      subtitle={subtitle}
      primaryLabel={primaryLabel}
      bookingTarget={bookingTarget}
      showSecondary={showSecondary}
      secondaryLabel={secondaryLabel}
      secondaryPath={secondaryPath}
      backgroundColor={config.backgroundColor}
      textColor={config.textColor}
    />
  );
}

function PricingPageCtaInner({
  title,
  subtitle,
  primaryLabel,
  bookingTarget,
  showSecondary,
  secondaryLabel,
  secondaryPath,
  backgroundColor,
  textColor,
}: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  bookingTarget: string;
  showSecondary: boolean;
  secondaryLabel?: string;
  secondaryPath: string;
  backgroundColor?: string;
  textColor?: string;
}) {
  const navigate = useNavigate();
  const customBg = backgroundColor?.trim();
  const customText = textColor?.trim();

  const handlePrimary = () => {
    if (bookingTarget.startsWith("http://") || bookingTarget.startsWith("https://")) {
      window.location.href = bookingTarget;
      return;
    }
    navigate(bookingTarget);
  };

  return (
    <section
      className="bg-brand-dark pt-[5.3rem] pb-[2.65rem] md:pt-[5.3rem] md:pb-[2.65rem]"
      style={customBg ? { backgroundColor: customBg } : undefined}
      data-pricing-cta="true"
    >
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          {title ? (
            <h2
              className="text-[2rem] leading-none md:text-[51px] md:leading-none font-normal text-white mb-6 md:mb-[25px]"
              style={customText ? { color: customText } : undefined}
            >
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p
              className="text-[17px] font-light leading-snug text-white/70 mb-10 md:mb-[2.65rem] max-w-[38.25rem] mx-auto"
              style={customText ? { color: customText, opacity: 0.7 } : undefined}
            >
              {subtitle}
            </p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {primaryLabel ? (
              <Button
                variant="cta"
                size="lg"
                className="rounded-[10px] h-[51px] px-8 text-[15px] font-normal min-w-[10.5rem]"
                onClick={handlePrimary}
              >
                {primaryLabel}
              </Button>
            ) : null}

            {showSecondary && secondaryLabel ? (
              <Button
                variant="cta-outline-dark"
                size="lg"
                className="rounded-[10px] h-[51px] px-8 text-[15px] font-normal min-w-[10.5rem]"
                asChild
              >
                <Link to={secondaryPath}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
