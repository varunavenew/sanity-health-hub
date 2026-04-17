import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { useClinics } from "@/hooks/useSanity";
import { clinics as staticClinics } from "@/data/clinicServices";

interface ClinicsProps {
  isChatOpen: boolean;
}

const Clinics = ({ isChatOpen }: ClinicsProps) => {
  const { data: sanityClinics } = useClinics();
  const clinics = sanityClinics?.length ? sanityClinics : staticClinics;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Våre klinikker | CMedical"
        description="Oversikt over alle CMedical-klinikker i Norge. Finn nærmeste klinikk – med adresse, telefon, åpningstider og fagområder."
        canonical="/klinikker"
        breadcrumbs={[
          { name: "Hjem", url: "/" },
          { name: "Klinikker", url: "/klinikker" },
        ]}
      />

      {/* Hero */}
      <header className="bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 font-light mb-4">Våre klinikker</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
              Finn din nærmeste klinikk
            </h1>
            <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-xl">
              CMedical har klinikker over hele Norge. Velg din lokasjon for å se
              tjenester, åpningstider og kontaktinformasjon.
            </p>
          </div>
        </div>
      </header>

      {/* Clinic list */}
      <section className="bg-background py-16 md:py-24" aria-labelledby="clinics-heading">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 id="clinics-heading" className="sr-only">
              Liste over klinikker
            </h2>

            <div className="divide-y divide-border">
              {clinics.map((clinic: any) => (
                <Link
                  to={`/klinikker/${clinic.slug || clinic.id}`}
                  key={clinic.id}
                  className="group block py-6 md:py-8 transition-colors hover:bg-muted/40 -mx-4 px-4 rounded-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4 md:w-2/5">
                      <MapPin
                        className="w-5 h-5 text-foreground/40 flex-shrink-0 mt-1"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="text-lg md:text-xl font-light text-foreground group-hover:text-brand-dark transition-colors">
                          CMedical {clinic.label}
                        </h3>
                        <p className="text-sm text-muted-foreground font-light mt-1">
                          {clinic.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:w-1/4 ml-9 md:ml-0">
                      <Phone
                        className="w-4 h-4 text-muted-foreground flex-shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-foreground font-light">
                        {clinic.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 md:w-1/4 ml-9 md:ml-0">
                      <Clock
                        className="w-4 h-4 text-muted-foreground flex-shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground font-light">
                        {clinic.hours}
                      </span>
                    </div>

                    <ArrowRight
                      className="hidden md:block w-4 h-4 text-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Clinics;
