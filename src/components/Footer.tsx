import { useSettings } from "@/hooks/useSanityData";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const { data: settings } = useSettings();

  return (
    <footer className="bg-foreground py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif text-background mb-3">{settings?.siteName}</h3>
            <p className="text-background/60 max-w-sm leading-relaxed">
              Providing compassionate, world-class healthcare to our community for over 25 years.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {["Services", "Doctors", "Testimonials", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-background/60 hover:text-background transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-background/60 text-sm">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                {settings?.phone}
              </li>
              <li className="flex items-start gap-2 text-background/60 text-sm">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                {settings?.email}
              </li>
              <li className="flex items-start gap-2 text-background/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                {settings?.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/40 text-sm">
          © {new Date().getFullYear()} {settings?.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
