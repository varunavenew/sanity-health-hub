import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanity";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import notFoundImg from "@/assets/hero/cmedical-hands.jpg";

interface NotFoundProps {
  isChatOpen?: boolean;
}

const quickLinks = [
  { label: "Gynekologi", desc: "Hele kvinnehelseforløpet — fra ung til moden.", href: "/gynekologi" },
  { label: "Fertilitet", desc: "IVF, utredning og rådgivning — for alle veier til familie.", href: "/fertilitet" },
  { label: "Tjenester", desc: "Se hele tilbudet vårt på tvers av spesialiteter.", href: "/tjenester" },
  { label: "Spesialister", desc: "Møt teamet som følger deg gjennom forløpet.", href: "/spesialister" },
  { label: "Bestill time", desc: "Finn ledig time hos riktig spesialist.", href: "/booking" },
  { label: "Kontakt", desc: "Ring, skriv eller besøk en av klinikkene våre.", href: "/kontakt" },
];

const NotFound = ({ isChatOpen = false }: NotFoundProps) => {
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    // Soft signal for analytics — not user-visible
    console.warn("[404] Ukjent sti:", location.pathname);
  }, [location.pathname]);

  const eyebrow = "404 — Vi fant ikke siden";
  const title = settings?.notFoundTitle || "Denne siden finnes ikke lenger.";
  const text =
    settings?.notFoundText ||
    "Lenken kan være utdatert, eller siden kan ha flyttet seg. Du finner det meste igjen et av disse stedene — eller du kan starte forfra på forsiden.";
  const image = settings?.notFoundImage || notFoundImg;
  const ctaLabel = settings?.notFoundCtaLabel || "Tilbake til forsiden";
  const ctaPath = settings?.notFoundCtaPath || "/";

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Siden finnes ikke | CMedical"
        description="Lenken er utdatert eller siden er flyttet. Finn frem til gynekologi, fertilitet, spesialister og booking hos CMedical."
        canonical="/404"
        noindex
      />

      {/* HERO — rolig, varmt, på merkevaren */}
      <section className="bg-brand-light">
        <div className="grid lg:grid-cols-12 min-h-[70vh]">
          <div className="lg:col-span-7 px-6 md:px-16 lg:px-20 py-20 lg:py-28 flex items-center">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.18em] text-foreground/60 mb-6 uppercase">
                {eyebrow}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-light leading-[1.05] text-foreground mb-6">
                {title}
              </h1>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
                {text}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="cta" size="lg" className="px-8">
                  <Link to={ctaPath}>{ctaLabel}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 border-brand-dark/20 text-foreground hover:bg-brand-dark/5"
                >
                  <Link to="/kontakt">Ta kontakt</Link>
                </Button>
              </div>

              {location.pathname && location.pathname !== "/" && (
                <p className="mt-8 text-xs font-light text-foreground/45">
                  Forsøkt sti:{" "}
                  <code className="font-mono text-foreground/70">
                    {location.pathname}
                  </code>
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 relative bg-secondary/40 min-h-[320px] lg:min-h-full overflow-hidden">
            <img
              src={image}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* HJELPENDE NAVIGASJON — populære destinasjoner */}
      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-12">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Kanskje du var på vei hit
              </p>
              <h2 className="text-2xl md:text-4xl font-light leading-tight text-foreground">
                Populære steder hos oss.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="bg-background p-7 flex items-start justify-between gap-4 hover:bg-brand-light transition-colors group"
                >
                  <div>
                    <h3 className="text-base font-normal text-foreground mb-1.5">
                      {link.label}
                    </h3>
                    <p className="text-sm font-light text-muted-foreground leading-snug max-w-xs">
                      {link.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/40 mt-1 flex-shrink-0 group-hover:text-foreground transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NotFound;
