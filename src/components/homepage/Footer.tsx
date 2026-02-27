import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logoNegative from "@/assets/logos/cm-wordmark-negative.png";

export const Footer = () => {
  return (
    <footer className="bg-[#180404] text-white pt-20 pb-10" role="contentinfo">
      <div className="container mx-auto px-6 md:px-16">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Column 1: Tjenester */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-4 font-normal">Tjenester</h3>
            <nav className="space-y-2.5" aria-label="Tjenester">
              <Link to="/gynekologi" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Gynekologi</Link>
              <Link to="/fertilitet" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Fertilitet</Link>
              <Link to="/urologi" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Urologi</Link>
              <Link to="/ortopedi" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Ortopedi</Link>
              <Link to="/flere-fagomrader" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Flere fagområder</Link>
            </nav>
          </div>

          {/* Column 2: Klinikker */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-4 font-normal">Klinikker</h3>
            <nav className="space-y-2.5" aria-label="Klinikker">
              <span className="block text-sm text-white/60 font-light">Oslo Majorstuen</span>
              <span className="block text-sm text-white/60 font-light">Bekkestua</span>
              <span className="block text-sm text-white/60 font-light">Moss</span>
              <span className="block text-sm text-white/60 font-light">Moelv</span>
            </nav>
          </div>

          {/* Column 3: Om CMedical */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-4 font-normal">Om CMedical</h3>
            <nav className="space-y-2.5" aria-label="Om CMedical">
              <Link to="/om-oss" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Om oss</Link>
              <Link to="/spesialister" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Spesialister</Link>
              <Link to="/priser" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Priser</Link>
              <Link to="/forsikring" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Forsikring</Link>
              <a href="#" className="block text-sm text-white/60 hover:text-white transition-colors font-light">Karriere / Ledige jobber</a>
            </nav>
          </div>

          {/* Column 4: Kontakt */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-4 font-normal">Kontakt</h3>
            <div className="space-y-3">
              <a href="tel:+4722600050" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors font-light">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +47 22 60 00 50
              </a>
              <a href="mailto:info@cmedical.no" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors font-light">
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@cmedical.no
              </a>
              <div className="flex items-center gap-2.5 text-sm text-white/60 font-light">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Oslo · Bekkestua · Moss · Moelv
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
              <a href="#" className="hover:text-white/70 transition-colors">Personvern</a>
              <a href="#" className="hover:text-white/70 transition-colors">Vilkår</a>
              <a href="#" className="hover:text-white/70 transition-colors">Karriere</a>
            </div>
            
            {/* Social icons */}
            <div className="flex gap-2.5">
              <a href="#" aria-label="Følg oss på Instagram" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4 text-white/40" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Følg oss på Facebook" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Facebook className="w-4 h-4 text-white/40" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Følg oss på LinkedIn" className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-4 h-4 text-white/40" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
