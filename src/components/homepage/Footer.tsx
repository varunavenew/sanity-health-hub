import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logoNegative from "@/assets/logos/cm-wordmark-negative.png";
import { useSiteSettings, useClinics } from "@/hooks/useSanity";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { clinics as staticClinics } from "@/data/clinicServices";

const FOOTER_CATEGORY_ORDER = ["gynekologi", "graviditet", "fertilitet", "urologi", "ortopedi", "flere"];
const FOOTER_LABEL_MAP: Record<string, string> = { "flere": "Flere tjenester" };

export const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { categories } = useServiceCategories();
  const { data: clinics } = useClinics();

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
        { label: "Flere tjenester", path: "/flere-fagomrader" },
      ];

  // Clinic names from Sanity or static
  const clinicNames = clinics && clinics.length > 0
    ? clinics.map((c: any) => c.label || c.title || c.id)
    : ["Oslo Majorstuen", "Bekkestua", "Ski", "Moss", "Moelv"];

  const phone = settings?.phone || "+47 22 60 00 50";
  const email = settings?.email || "info@cmedical.no";
  const address = settings?.address || "Oslo · Bekkestua · Ski · Moss · Moelv";
  const social = settings?.socialMedia || {};

  return (
    <footer className="bg-[#180404] text-white pt-20 pb-10" role="contentinfo">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Column 1: Tjenester */}
          <div>
            <h3 className="text-xs text-white/40 mb-4 font-normal">Tjenester</h3>
            <nav className="space-y-2.5" aria-label="Tjenester">
              {serviceLinks.map((link: any) => (
                <Link key={link.path} to={link.path} className="block text-sm text-white/60 hover:text-white transition-colors font-light">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 2: Klinikker */}
          <div>
            <h3 className="text-xs text-white/40 mb-4 font-normal">Klinikker</h3>
            <nav className="space-y-2.5" aria-label="Klinikker">
              {clinicNames.map((name: string) => (
                <span key={name} className="block text-sm text-white/60 font-light">{name}</span>
              ))}
            </nav>
          </div>

          {/* Column 3: Om CMedical */}
          <div>
            <h3 className="text-xs text-white/40 mb-4 font-normal">Om CMedical</h3>
            <nav className="space-y-2.5" aria-label="Om CMedical">
              <Link to="/om-oss" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Om oss</Link>
              <Link to="/spesialister" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Spesialister</Link>
              <Link to="/priser" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Priser</Link>
              <Link to="/forsikring" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Forsikring</Link>
              <Link to="/karriere" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Karriere / Ledige jobber</Link>
            </nav>
          </div>

          {/* Column 4: Kontakt */}
          <div>
            <h3 className="text-xs text-white/40 mb-4 font-normal">Kontakt</h3>
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
            <p className="text-xs text-white/30">© {new Date().getFullYear()} CMedical. Alle rettigheter reservert.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-5 text-xs text-white/40">
              <Link to="/personvern" className="hover:text-white/70 transition-colors">Personvern</Link>
              <Link to="/karriere" className="hover:text-white/70 transition-colors">Karriere</Link>
            </div>
            
            <div className="flex gap-2.5">
              <a href={social.instagram || "#"} aria-label="Følg oss på Instagram" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4 text-white/40" aria-hidden="true" />
              </a>
              <a href={social.facebook || "#"} aria-label="Følg oss på Facebook" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Facebook className="w-4 h-4 text-white/40" aria-hidden="true" />
              </a>
              <a href={social.linkedin || "#"} aria-label="Følg oss på LinkedIn" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-4 h-4 text-white/40" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
