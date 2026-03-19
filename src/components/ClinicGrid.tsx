import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { useClinics } from "@/hooks/useSanity";
import { clinics as staticClinics } from "@/data/clinicServices";

export const ClinicGrid = () => {
  const { data: sanityClinics } = useClinics();
  const clinics = sanityClinics?.length ? sanityClinics : staticClinics;

  // Split: first clinic featured, rest in grid
  const featured = clinics[0];
  const rest = clinics.slice(1);

  return (
    <section className="bg-muted/50 py-10 md:py-14" aria-labelledby="clinics-heading">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-muted-foreground text-xs mb-2">Våre klinikker</p>
            <h2 id="clinics-heading" className="text-2xl md:text-3xl font-light text-foreground">
              Til stede der du er
            </h2>
          </div>

          {/* Featured clinic */}
          {featured && (
            <div className="bg-background rounded-sm p-6 md:p-8 mb-px">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-4 h-4 text-brand-dark/40 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-normal text-foreground">CMedical {featured.label}</h3>
                  <p className="text-sm text-muted-foreground font-light">{featured.address}</p>
                </div>
              </div>
              <div className="ml-7 flex flex-wrap gap-x-6 gap-y-1.5">
                <p className="text-sm font-light flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                  <a href={`tel:+47${featured.phone.replace(/\s/g, '')}`} className="text-foreground hover:underline">
                    {featured.phone}
                  </a>
                </p>
                <p className="text-sm text-muted-foreground font-light flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{featured.hours}</span>
                </p>
              </div>
            </div>
          )}

          {/* Rest in 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40 overflow-hidden rounded-sm">
            {rest.map((clinic: any) => (
              <article key={clinic.id} className="bg-background p-6 md:p-7">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-4 h-4 text-brand-dark/40 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-base font-normal text-foreground">CMedical {clinic.label}</h3>
                    <p className="text-sm text-muted-foreground font-light">{clinic.address}</p>
                  </div>
                </div>
                <div className="ml-7 space-y-1">
                  <p className="text-sm font-light flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <a href={`tel:+47${clinic.phone.replace(/\s/g, '')}`} className="text-foreground hover:underline">
                      {clinic.phone}
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground font-light flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                    <span>{clinic.hours}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
