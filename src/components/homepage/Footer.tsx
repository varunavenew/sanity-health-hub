import { AssetImg } from "@/components/AssetImg";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
import { Link, useLocaleParam } from "@/lib/router";
import logoNegative from "@/assets/logos/cm-wordmark-negative.png";
import { useSiteSettings, useClinics } from "@/hooks/useSanity";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { resolveNavLabel, resolveNavPath } from "@/lib/navigation/resolve-nav-label";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";

const FOOTER_CATEGORY_ORDER = ["gynekologi", "graviditet", "fertilitet", "urologi", "ortopedi", "flere"];
const FOOTER_LABEL_MAP: Record<string, string> = {};

export const Footer = () => {
  const { t } = useTranslation();
  const locale = useLocaleParam();
  const uiLang = locale === "en" ? "en" : "nb";
  const { data: settings } = useSiteSettings();
  const { index: cmsRouteIndex } = useCmsRouteContext();
  const { categories } = useServiceCategories();
  const { data: clinics } = useClinics();

  FOOTER_LABEL_MAP["flere"] = t("footer.moreServices");

  // Services links sorted to match reference design
  const serviceLinks = categories.length > 0
    ? [...categories]
        .filter((c) => FOOTER_CATEGORY_ORDER.includes(c.id))
        .sort((a, b) => FOOTER_CATEGORY_ORDER.indexOf(a.id) - FOOTER_CATEGORY_ORDER.indexOf(b.id))
        .map((c) => ({
          label: FOOTER_LABEL_MAP[c.id] || c.label,
          path: c.path,
        }))
    : [
        { label: "Gynekologi", path: "/gynekologi" },
        { label: "Fertilitet", path: "/fertilitet" },
        { label: "Urologi", path: "/urologi" },
        { label: "Ortopedi", path: "/ortopedi" },
        { label: t("footer.moreServices"), path: "/flere-fagomrader" },
      ];

  const clinicLinks = (clinics || []).map((c: any) => ({
    label: c.label || c.title,
    slug: c.slug || c.id,
  }));

  const footerAboutLinks = useMemo(() => {
    const raw = settings?.footerAboutLinks?.length
      ? settings.footerAboutLinks
      : [
          { _key: "om-oss", navId: "about" },
          { _key: "spesialister", navId: "specialists" },
          { _key: "priser", navId: "pricing" },
          { _key: "forsikring", navId: "insurance" },
          { _key: "aktuelt", navId: "news" },
          { _key: "karriere", path: "/karriere", pathNb: "/karriere", pathEn: "/karriere" },
        ];
    return raw.map((link: { _key?: string; label?: string; path?: string; navId?: string }) => ({
      ...link,
      label: resolveNavLabel(link, t, uiLang),
      path: resolveNavPath(link, locale, cmsRouteIndex),
    }));
  }, [settings?.footerAboutLinks, t, locale, uiLang, cmsRouteIndex]);

  const phone = settings?.phone || "+47 22 60 00 50";
  const email = settings?.email || "info@cmedical.no";
  const address = settings?.address || "Oslo · Bekkestua · Moss · Moelv";
  const social = settings?.socialMedia || {};

  return (
    <footer className="bg-[#180404] text-white pt-20 pb-10" role="contentinfo">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Column 1: Tjenester */}
          <div>
            <h3 className="text-xs text-white/40 mb-4 font-normal">{t("footer.services")}</h3>
            <nav className="space-y-2.5" aria-label={t("footer.services")}>
              {serviceLinks.map((link: any) => (
                <Link key={link.path} to={link.path} className="block text-sm text-white/60 hover:text-white transition-colors font-light">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 2: Klinikker */}
          <div>
            <h3 className="text-xs text-white/40 mb-4 font-normal">{t("footer.clinics")}</h3>
            <nav className="space-y-2.5" aria-label={t("footer.clinics")}>
              {clinicLinks.map((clinic) => (
                <Link key={clinic.slug} to={`/klinikker/${clinic.slug}`} className="block text-sm text-white/60 hover:text-white transition-colors font-light">{clinic.label}</Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Om CMedical */}
          <div>
            <h3 className="text-xs text-white/40 mb-4 font-normal">{t("footer.aboutCMedical")}</h3>
            <nav className="space-y-2.5" aria-label={t("footer.aboutCMedical")}>
              {footerAboutLinks.map((link) => (
                <Link key={link._key || link.path} to={link.path} className="block text-sm text-white/60 hover:text-white transition-colors font-light">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Kontakt */}
          <div>
            <h3 className="text-xs text-white/40 mb-4 font-normal">{t("footer.contact")}</h3>
            <div className="space-y-3">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors font-light">
                <Phone className="w-4 h-4 flex-shrink-0" />
                {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors font-light">
                <Mail className="w-4 h-4 flex-shrink-0" />
                {email}
              </a>
              <div className="flex items-center gap-2.5 text-sm text-white/60 font-light">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {address}
              </div>
              <div className="flex gap-2.5 pt-3">
                <a href={social.instagram || "#"} aria-label="Instagram" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Instagram className="w-4 h-4 text-white/60" aria-hidden="true" />
                </a>
                <a href={social.facebook || "#"} aria-label="Facebook" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Facebook className="w-4 h-4 text-white/60" aria-hidden="true" />
                </a>
                <a href={social.linkedin || "#"} aria-label="LinkedIn" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Linkedin className="w-4 h-4 text-white/60" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <AssetImg src={logoNegative} alt="CMedical" className="h-10" />
            <p className="text-xs text-white/30">© {new Date().getFullYear()} CMedical. {t("footer.rights")}</p>
          </div>
          
          <div className="flex gap-5 text-xs text-white/40">
            <Link to="/personvern" className="hover:text-white/70 transition-colors">{t("footer.privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
