import { CalendarPlus, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSanity";

/**
 * Slim mobile bottom CTA bar — two actions only:
 * "Bestill time" (primary) + "Ring" (tel: link).
 * Hidden on md+.
 */
export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const { data: siteSettings } = useSiteSettings();
  const ctaPath = siteSettings?.ctaButton?.path || "/booking";
  const ctaLabel = siteSettings?.ctaButton?.label || "Bestill time";
  const phone = siteSettings?.phone || "22 60 00 50";
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <nav
      aria-label="Hurtighandlinger"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => navigate(ctaPath)}
          className="flex-[2] inline-flex items-center justify-center gap-2 min-h-[52px] rounded-2xl bg-accent text-accent-foreground font-normal text-base shadow-sm hover:bg-accent/90 transition-colors"
        >
          <CalendarPlus className="h-5 w-5" aria-hidden="true" />
          <span>{ctaLabel}</span>
        </button>
        <a
          href={telHref}
          className="flex-1 inline-flex items-center justify-center gap-2 min-h-[52px] rounded-2xl border border-brand-dark/30 text-brand-dark font-normal text-base hover:bg-brand-dark/5 transition-colors"
          aria-label={`Ring ${phone}`}
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          <span>Ring</span>
        </a>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
