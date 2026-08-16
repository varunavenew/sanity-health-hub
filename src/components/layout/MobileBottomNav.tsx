"use client";

import { ArrowRight } from "lucide-react";
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

type BottomActionCardProps = {
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactNode;
};

function BottomActionCard({ title, subtitle, className, children }: BottomActionCardProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-2xl px-5 py-4", className)}>
      <div className="min-w-0 text-left">
        <p className="text-base font-medium leading-tight">{title}</p>
        <p className="mt-1 text-sm font-light leading-snug opacity-70">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

/**
 * Fixed mobile bottom bar — card CTAs on warm background.
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
        "fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-brand-dark/10 bg-[#faf7f5] px-4 pt-3",
        className,
      )}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))", ...style }}
    >
      <div className="space-y-2">
        <Link to={bookingPath} className="block transition-opacity hover:opacity-95">
          <BottomActionCard
            title={t("nav.bookAppointment")}
            subtitle={t("nav.bookAppointmentHint")}
            className="bg-[#3e3025] text-white"
          >
            <ArrowRight className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />
          </BottomActionCard>
        </Link>

        <a
          href={telHref}
          className="block transition-opacity hover:opacity-95"
          aria-label={t("nav.callPhone", { phone })}
        >
          <BottomActionCard
            title={t("booking.callUs")}
            subtitle={t("nav.callUsHint")}
            className="border border-brand-dark/15 bg-white text-brand-dark"
          >
            <ArrowRight className="h-5 w-5 shrink-0 text-brand-dark/45" aria-hidden="true" />
          </BottomActionCard>
        </a>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
