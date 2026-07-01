"use client";

import { useMemo } from "react";
import { CalendarPlus, Phone } from "lucide-react";
import { useNavigate, useLocaleParam } from "@/lib/router";
import { useSiteSettings } from "@/hooks/useSanity";
import { resolveNavLabel, resolveNavPath } from "@/lib/navigation/resolve-nav-label";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type MobileBottomNavProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Slim mobile bottom CTA bar — two actions only:
 * "Bestill time" (primary) + "Ring" (tel: link).
 * Hidden on md+.
 */
export const MobileBottomNav = ({ className, style }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const locale = useLocaleParam();
  const uiLang = locale === "en" ? "en" : "nb";
  const { t } = useTranslation();
  const { data: siteSettings } = useSiteSettings();
  const { index: cmsRouteIndex, localeMap } = useCmsRouteContext();

  const ctaButton = useMemo(() => {
    const raw = siteSettings?.ctaButton || { navId: "bookAppointment" };
    return {
      path: resolveNavPath(
        { ...raw, navId: raw.navId || "bookAppointment" },
        locale,
        cmsRouteIndex,
      ),
      label: resolveNavLabel(
        { label: raw.label, path: raw.path, navId: raw.navId || "bookAppointment" },
        t,
        uiLang,
        localeMap,
      ),
    };
  }, [siteSettings?.ctaButton, t, locale, uiLang, cmsRouteIndex, localeMap]);

  const phone = siteSettings?.phone || "22 60 00 50";
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <nav
      aria-label={t("nav.quickActions")}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden",
        className,
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)", ...style }}
    >
      <div className="flex items-stretch gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => navigate(ctaButton.path)}
          className="inline-flex min-h-[52px] flex-[2] items-center justify-center gap-2 rounded-2xl bg-accent text-base font-normal text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
        >
          <CalendarPlus className="h-5 w-5" aria-hidden="true" />
          <span>{ctaButton.label}</span>
        </button>
        <a
          href={telHref}
          className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border border-brand-dark/30 text-base font-normal text-brand-dark transition-colors hover:bg-brand-dark/5"
          aria-label={t("nav.callPhone", { phone })}
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          <span>{t("nav.ring")}</span>
        </a>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
