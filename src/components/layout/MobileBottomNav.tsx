"use client";

import { useMemo } from "react";
import { Link, useLocaleParam } from "@/lib/router";
import { useSiteSettings } from "@/hooks/useSanity";
import { resolveNavPath } from "@/lib/navigation/resolve-nav-label";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type MobileBottomNavProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Fixed mobile bottom bar — split CTA: "Bestill time" + "Ring oss".
 */
export const MobileBottomNav = ({ className, style }: MobileBottomNavProps) => {
  const locale = useLocaleParam();
  const { t } = useTranslation();
  const { data: siteSettings } = useSiteSettings();
  const { index: cmsRouteIndex } = useCmsRouteContext();

  const bookingPath = useMemo(
    () => resolveNavPath({ navId: "bookAppointment" }, locale, cmsRouteIndex),
    [locale, cmsRouteIndex],
  );

  const phone = siteSettings?.phone?.trim() || "22 60 00 50";
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <nav
      aria-label={t("nav.quickActions")}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-brand-dark/15",
        className,
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)", ...style }}
    >
      <div className="flex items-stretch">
        <Link
          to={bookingPath}
          className="flex flex-1 items-center justify-center bg-accent px-4 py-4 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          {t("nav.bookAppointment")}
        </Link>

        <a
          href={telHref}
          className="flex flex-1 items-center justify-center bg-brand-warm px-4 py-4 text-base font-medium text-brand-dark transition-colors hover:bg-brand-warm/80"
          aria-label={t("nav.callPhone", { phone })}
        >
          {t("booking.callUs")}
        </a>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
