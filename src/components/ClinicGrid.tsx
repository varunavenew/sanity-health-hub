import { MapPin, Phone, Clock } from "lucide-react";
import { useClinics } from "@/hooks/useSanity";
import { clinics as staticClinics } from "@/data/clinicServices";

export const ClinicGrid = () => {
  const { data: sanityClinics } = useClinics();
  const clinics = sanityClinics?.length ? sanityClinics : staticClinics;

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

          {/* 3-2 grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/40 rounded-sm overflow-hidden">
            {clinics.map((clinic: any) => (
              <article key={clinic.id} className="bg-background p-5 md:p-6">
                <div className="flex items-start gap-2.5 mb-3">
                  <MapPin className="w-4 h-4 text-brand-dark/40 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-normal text-foreground">CMedical {clinic.label}</h3>
                    <p className="text-xs text-muted-foreground font-light mt-0.5">{clinic.address}</p>
                  </div>
                </div>
                <div className="ml-[26px] space-y-1">
                  <p className="text-xs font-light flex items-center gap-2">
                    <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <a href={`tel:+47${clinic.phone.replace(/\s/g, '')}`} className="text-foreground hover:underline">
                      {clinic.phone}
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground font-light flex items-center gap-2">
                    <Clock className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
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
