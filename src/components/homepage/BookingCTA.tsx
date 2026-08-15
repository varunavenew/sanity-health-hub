"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useNavigate, Link } from "@/lib/router";
import { useClinics } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import { buildBookingUrl } from "@/lib/bookingLinks";
import type { BookingCtaQuickInfoItem } from "@/lib/sanity/page-sections";
import { AssetImg } from "@/components/AssetImg";

export type BookingCtaContent = {
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  variant?: "dark" | "warm" | "withImage";
  primaryLabel?: string;
  primaryPath?: string;
  bookingCategoryId?: string;
  showSecondaryButton?: boolean;
  secondaryLabel?: string;
  secondaryPath?: string;
  quickInfoItems?: BookingCtaQuickInfoItem[];
  /** Optional CMS background; empty uses variant default. */
  backgroundColor?: string;
  /** Optional CMS text color for title / subtitle / quick info. */
  textColor?: string;
  /** Dark-band primary: lime (default), white, or custom CSS color. */
  primaryButtonStyle?: "accent" | "white" | "custom";
  /** Used when primaryButtonStyle is custom (or as an explicit override). */
  primaryButtonColor?: string;
};

const QUICK_INFO_ICONS: Record<NonNullable<BookingCtaQuickInfoItem["icon"]>, LucideIcon> = {
  // Reference booking band uses checkmarks for both quick-info rows.
  clock: Check,
  shield: Check,
};

type BookingCTAProps = BookingCtaContent;

export const BookingCTA = ({
  title,
  subtitle,
  image,
  imageAlt,
  variant = "dark",
  primaryLabel,
  primaryPath,
  bookingCategoryId,
  showSecondaryButton = true,
  secondaryLabel,
  secondaryPath,
  quickInfoItems,
  backgroundColor,
  textColor,
  primaryButtonStyle,
  primaryButtonColor,
}: BookingCTAProps = {}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: clinics = [] } = useClinics();
  const callableClinics = (clinics as { label: string; phone?: string }[])
    .filter((c) => c.phone)
    .map((c) => ({ label: c.label, phone: c.phone! }));
  const [showClinicPicker, setShowClinicPicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowClinicPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resolvedTitle = title?.trim() || t("booking.title");
  const resolvedSubtitle = subtitle?.trim() || t("booking.subtitle");
  const resolvedPrimaryLabel = primaryLabel?.trim() || t("booking.bookNow");
  const resolvedSecondaryLabel = secondaryLabel?.trim() || t("booking.callUs");

  const defaultQuickInfo: BookingCtaQuickInfoItem[] = [
    { icon: "clock", text: t("booking.availableTime") },
    { icon: "shield", text: t("booking.noReferral") },
  ];
  const resolvedQuickInfo =
    quickInfoItems === undefined
      ? defaultQuickInfo
      : quickInfoItems.filter((item) => item.text?.trim());

  const bookingTarget =
    primaryPath?.trim() ||
    (bookingCategoryId
      ? buildBookingUrl({ kategori: bookingCategoryId })
      : "/booking");

  const handlePrimaryClick = () => {
    if (primaryPath?.trim()) {
      navigate(primaryPath.trim());
      return;
    }
    window.location.href = bookingTarget;
  };

  const customBg = backgroundColor?.trim() || "";
  const customText = textColor?.trim() || "";
  const hasCustomBg = Boolean(customBg);
  const hasCustomText = Boolean(customText);
  /** When a custom background is set without text color, keep dark-variant contrast (white text). */
  const useWarmChrome = variant === "warm" && !hasCustomBg && !hasCustomText;

  const customPrimaryBtn =
    primaryButtonStyle === "custom" || primaryButtonColor?.trim()
      ? primaryButtonColor?.trim() || ""
      : "";
  const hasCustomPrimaryBtn = Boolean(customPrimaryBtn);
  /** Shared Booking CTA default is brand lime; white only when CMS asks for it. */
  const darkPrimaryVariant =
    primaryButtonStyle === "white" && !hasCustomPrimaryBtn ? "cta-dark" : "cta";

  const sectionClass = useWarmChrome
    ? "py-20 bg-brand-warm border-t border-border/60"
    : "pt-14 pb-10 sm:pt-16 sm:pb-12 md:pt-20 md:pb-10 bg-brand-dark";

  const titleClass = useWarmChrome
    ? "text-2xl md:text-3xl font-light text-brand-dark mb-4"
    : "text-2xl md:text-3xl font-light text-white mb-4";
  const subtitleClass = useWarmChrome
    ? "text-brand-dark/70 font-light text-base md:text-lg mb-10 max-w-xl mx-auto"
    : "text-white/95 font-light text-base md:text-lg mb-10 max-w-xl mx-auto";
  const quickInfoClass = useWarmChrome
    ? "flex items-center gap-2 text-sm text-brand-dark/60"
    : "flex items-center gap-2 text-sm text-white/90";

  const titleStyle: CSSProperties | undefined = hasCustomText ? { color: customText } : undefined;
  const subtitleStyle: CSSProperties | undefined = hasCustomText
    ? { color: customText, opacity: 0.75 }
    : undefined;
  const quickInfoStyle: CSSProperties | undefined = hasCustomText
    ? { color: customText, opacity: 0.9 }
    : undefined;
  const sectionStyle: CSSProperties | undefined = hasCustomBg
    ? { backgroundColor: customBg }
    : undefined;

  const content = (
    <>
      <h2 className={hasCustomText ? "text-2xl md:text-3xl font-light mb-4" : titleClass} style={titleStyle}>
        {resolvedTitle}
      </h2>
      <p
        className={
          hasCustomText
            ? "font-light text-base md:text-lg mb-10 max-w-xl mx-auto"
            : subtitleClass
        }
        style={subtitleStyle}
      >
        {resolvedSubtitle}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Button
          variant={useWarmChrome ? "cta" : darkPrimaryVariant}
          size="lg"
          className="rounded-lg"
          style={
            hasCustomPrimaryBtn
              ? {
                  backgroundColor: customPrimaryBtn,
                  color: "hsl(var(--accent-foreground))",
                }
              : undefined
          }
          onClick={handlePrimaryClick}
        >
          {resolvedPrimaryLabel}
        </Button>

        {showSecondaryButton ? (
          secondaryPath?.trim() ? (
            <Button
              variant={useWarmChrome ? "outline" : "cta-outline-dark"}
              size="lg"
              className="rounded-lg"
              asChild
            >
              <Link to={secondaryPath.trim()}>{resolvedSecondaryLabel}</Link>
            </Button>
          ) : (
          <div className="relative" ref={dropdownRef}>
            <Button
              variant={useWarmChrome ? "outline" : "cta-outline-dark"}
              size="lg"
              className="rounded-lg"
              onClick={() => setShowClinicPicker(!showClinicPicker)}
            >
              {resolvedSecondaryLabel}
              <ChevronDown
                className={`ml-2 w-4 h-4 transition-transform ${showClinicPicker ? "rotate-180" : ""}`}
              />
            </Button>

            {showClinicPicker && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-border overflow-hidden z-50 min-w-[240px]">
                <p className="px-4 pt-3 pb-2 text-xs text-muted-foreground font-light">
                  {t("booking.selectClinic")}
                </p>
                {callableClinics.map((clinic) => (
                  <a
                    key={clinic.label}
                    href={`tel:${clinic.phone.replace(/\s/g, "")}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors text-left"
                  >
                    <span className="text-sm font-normal text-foreground">{clinic.label}</span>
                    <span className="text-sm text-muted-foreground font-light">{clinic.phone}</span>
                  </a>
                ))}
                <div className="border-t border-border">
                  <button
                    onClick={() => {
                      setShowClinicPicker(false);
                      navigate("/kontakt");
                    }}
                    className="w-full px-4 py-3 text-sm text-brand-dark hover:bg-secondary transition-colors text-left font-light"
                  >
                    {t("booking.goToContact")}
                  </button>
                </div>
              </div>
            )}
          </div>
          )
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8">
        {resolvedQuickInfo.map((item, i) => {
          const Icon = QUICK_INFO_ICONS[item.icon === "shield" ? "shield" : "clock"];
          return (
            <span
              key={`${item.text}-${i}`}
              className={hasCustomText ? "flex items-center gap-2 text-sm" : quickInfoClass}
              style={quickInfoStyle}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {item.text}
            </span>
          );
        })}
      </div>
    </>
  );

  if (variant === "withImage" && image) {
    return (
      <section
        className={hasCustomBg ? "py-20" : "py-20 bg-brand-dark"}
        style={sectionStyle}
      >
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div className="text-center md:text-left">{content}</div>
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
              <AssetImg
                src={image}
                alt={imageAlt || resolvedTitle}
                preset="card"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={hasCustomBg ? "py-20" : sectionClass} style={sectionStyle}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto text-center">{content}</div>
      </div>
    </section>
  );
};
