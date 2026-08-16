"use client";

import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
import { Link, useLocaleParam } from "@/lib/router";
import { useSiteSettings, useClinics } from "@/hooks/useSanity";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { resolveNavLabel, resolveNavPath } from "@/lib/navigation/resolve-nav-label";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";

const FOOTER_CATEGORY_ORDER = [
  "gynekologi",
  "graviditet",
  "fertilitet",
  "urologi",
  "ortopedi",
  "flere",
  "flere-fagomrader",
];

function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3c2.6 0 4.4 1.9 4.4 4.6 0 .9-.1 1.7-.1 2.4.5.3 1.1.2 1.7-.1.5-.2 1 .1 1.1.6.1.5-.2.9-.8 1.2-.6.3-1.3.5-1.3.9 0 .6 2 2.9 3.7 3.4.4.1.6.5.4.9-.3.7-1.6 1.1-2.8 1.3-.2.5-.2 1-.6 1.2-.4.2-1.1 0-1.9 0-.9 0-1.7.6-2.4 1.1-.4.3-.9.5-1.4.5s-1-.2-1.4-.5c-.7-.5-1.5-1.1-2.4-1.1-.8 0-1.5.2-1.9 0-.4-.2-.4-.7-.6-1.2-1.2-.2-2.5-.6-2.8-1.3-.2-.4 0-.8.4-.9 1.7-.5 3.7-2.8 3.7-3.4 0-.4-.7-.6-1.3-.9-.6-.3-.9-.7-.8-1.2.1-.5.6-.8 1.1-.6.6.3 1.2.4 1.7.1 0-.7-.1-1.5-.1-2.4C7.6 4.9 9.4 3 12 3Z" />
    </svg>
  );
}

const socialButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-white/10 bg-white/[0.08] text-white/80 transition-colors hover:bg-white/[0.14] hover:text-white";

export const Footer = () => {
  const { t } = useTranslation();
  const locale = useLocaleParam();
  const uiLang = locale === "en" ? "en" : "nb";
  const { data: settings } = useSiteSettings();
  const { index: cmsRouteIndex } = useCmsRouteContext();
  const { categories } = useServiceCategories();
  const { data: clinics } = useClinics();

  const footerLabelMap: Record<string, string> = {
    flere: t("footer.moreServices"),
    "flere-fagomrader": t("footer.moreServices"),
  };

  const serviceLinks = [...categories]
    .filter((c) => FOOTER_CATEGORY_ORDER.includes(c.id))
    .sort((a, b) => FOOTER_CATEGORY_ORDER.indexOf(a.id) - FOOTER_CATEGORY_ORDER.indexOf(b.id))
    .map((c) => {
      const isMoreServices = c.id === "flere" || c.id === "flere-fagomrader";
      const path = isMoreServices
        ? uiLang === "en"
          ? "/other"
          : "/flere-fagomrader"
        : c.path;
      return {
        label: footerLabelMap[c.id] || c.label,
        path,
      };
    });

  const clinicLinks = (clinics || []).map((c: { label?: string; title?: string; slug?: string; id?: string }) => ({
    label: c.label || c.title,
    slug: c.slug || c.id,
  }));

  const footerAboutLinks = useMemo(() => {
    const raw = settings?.footerAboutLinks ?? [];
    return raw.map((link: { _key?: string; label?: string; path?: string; navId?: string }) => ({
      ...link,
      label: resolveNavLabel(link, t, uiLang),
      path: resolveNavPath(link, locale, cmsRouteIndex),
    }));
  }, [settings?.footerAboutLinks, t, locale, uiLang, cmsRouteIndex]);

  const phone = settings?.phone?.trim() || "";
  const email = settings?.email?.trim() || "";
  const address = settings?.address?.trim() || "";
  const telHref = phone ? `tel:${phone.replace(/\s/g, "")}` : undefined;
  const social = (settings?.socialMedia || {}) as Record<string, string | undefined>;
  const snapchat = social.snapchat?.trim();

  const linkClass =
    "text-sm text-white/70 hover:text-white transition-colors font-light leading-snug";
  const blockLinkClass = `block ${linkClass}`;
  const headingClass = "text-sm font-medium text-white/90 mb-4";

  return (
    <footer className="bg-[var(--footer-bg)] text-brand-beige pt-16 md:pt-20 pb-8 md:pb-10" role="contentinfo">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 lg:gap-16 mb-12 md:mb-16">
          <div>
            <h3 className={headingClass}>{t("footer.services")}</h3>
            <nav className="space-y-2" aria-label={t("footer.services")}>
              {serviceLinks.map((link) => (
                <Link key={link.path} to={link.path} className={blockLinkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className={headingClass}>{t("footer.clinics")}</h3>
            <nav className="space-y-2" aria-label={t("footer.clinics")}>
              {clinicLinks.map((clinic) => (
                <Link
                  key={clinic.slug}
                  to={`/klinikker/${clinic.slug}`}
                  className={blockLinkClass}
                >
                  {clinic.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className={headingClass}>{t("footer.aboutCMedical")}</h3>
            <nav className="space-y-2" aria-label={t("footer.aboutCMedical")}>
              {footerAboutLinks.map((link) => (
                <Link
                  key={link._key || link.path}
                  to={link.path}
                  className={blockLinkClass}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className={headingClass}>{t("footer.contact")}</h3>
            <div className="space-y-2.5">
              {phone ? (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className={`flex items-center gap-2.5 ${linkClass}`}
                >
                  <Phone className="w-4 h-4 flex-shrink-0 text-white/70" aria-hidden="true" />
                  {phone}
                </a>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className={`flex items-center gap-2.5 ${linkClass}`}>
                  <Mail className="w-4 h-4 flex-shrink-0 text-white/70" aria-hidden="true" />
                  {email}
                </a>
              ) : null}
              {address ? (
                <div className={`flex items-start gap-2.5 text-sm text-white/70 font-light leading-snug`}>
                  <MapPin className="w-4 h-4 flex-shrink-0 text-white/70 mt-0.5" aria-hidden="true" />
                  {address}
                </div>
              ) : null}
              {social.instagram || social.facebook || social.linkedin || snapchat ? (
                <div className="flex flex-wrap gap-2 pt-3">
                  {social.instagram ? (
                    <a href={social.instagram} aria-label="Instagram" className={socialButtonClass}>
                      <Instagram className="w-4 h-4" />
                    </a>
                  ) : null}
                  {social.facebook ? (
                    <a href={social.facebook} aria-label="Facebook" className={socialButtonClass}>
                      <Facebook className="w-4 h-4" />
                    </a>
                  ) : null}
                  {social.linkedin ? (
                    <a href={social.linkedin} aria-label="LinkedIn" className={socialButtonClass}>
                      <Linkedin className="w-4 h-4" />
                    </a>
                  ) : null}
                  {snapchat ? (
                    <a href={snapchat} aria-label="Snapchat" className={socialButtonClass}>
                      <SnapchatIcon className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-3 text-center md:pt-8">
          <p className="text-xs text-white/50 font-light">
            <span className="font-medium text-white/80">CMedical</span>
            <span className="mx-2 text-white/30" aria-hidden="true">
              ·
            </span>
            © {new Date().getFullYear()} CMedical. {t("footer.rights")}
          </p>

          <Link
            to="/personvern"
            className="text-xs text-white/50 hover:text-white/80 transition-colors font-light"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
};
