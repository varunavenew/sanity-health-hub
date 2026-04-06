import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logoNegative from "@/assets/logos/cm-wordmark-negative.png";
import { useSiteSettings, useClinics } from "@/hooks/useSanity";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { clinics as staticClinics } from "@/data/clinicServices";
import { useTranslation } from "react-i18next";

const FOOTER_CATEGORY_ORDER = ["gynekologi", "graviditet", "fertilitet", "urologi", "ortopedi", "flere"];
const FOOTER_LABEL_MAP: Record<string, string> = {};

export const Footer = () => {
  const { t } = useTranslation();
  const { data: settings } = useSiteSettings();
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

  // Clinic links from Sanity or static
  const clinicLinks = clinics && clinics.length > 0
    ? clinics.map((c: any) => ({ label: c.label || c.title, slug: c.slug || c.id }))
    : staticClinics.map(c => ({ label: c.label, slug: c.slug }));

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
              <Link to="/om-oss" className="block text-sm text-white/60 hover:text-white transition-colors font-light">{t("nav.about")}</Link>
              <Link to="/spesialister" className="block text-sm text-white/60 hover:text-white transition-colors font-light">{t("nav.specialists")}</Link>
              <Link to="/priser" className="block text-sm text-white/60 hover:text-white transition-colors font-light">{t("nav.pricing")}</Link>
              <Link to="/forsikring" className="block text-sm text-white/60 hover:text-white transition-colors font-light">{t("nav.insurance")}</Link>
              <Link to="/aktuelt" className="block text-sm text-white/60 hover:text-white transition-colors font-light">{t("nav.news")}</Link>
              <Link to="/karriere" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Karriere</Link>
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
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={logoNegative} alt="CMedical" className="h-10" />
            <p className="text-xs text-white/30">© {new Date().getFullYear()} CMedical. {t("footer.rights")}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-5 text-xs text-white/40">
              <Link to="/personvern" className="hover:text-white/70 transition-colors">{t("footer.privacy")}</Link>
            </div>
            
            <div className="flex gap-2.5">
              <a href={social.instagram || "#"} aria-label="Instagram" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4 text-white/40" aria-hidden="true" />
              </a>
              <a href={social.facebook || "#"} aria-label="Facebook" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Facebook className="w-4 h-4 text-white/40" aria-hidden="true" />
              </a>
              <a href={social.linkedin || "#"} aria-label="LinkedIn" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-4 h-4 text-white/40" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
