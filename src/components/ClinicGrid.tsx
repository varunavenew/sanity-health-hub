import { MapPin, Phone, Clock } from "lucide-react";
import { useClinics } from "@/hooks/useSanity";
import { clinics as staticClinics } from "@/data/clinicServices";

export const ClinicGrid = () => {
  const { data: sanityClinics } = useClinics();
  const clinics = sanityClinics?.length ? sanityClinics : staticClinics;

  return (
    <section className="bg-muted/50 py-12 md:py-16" aria-labelledby="clinics-heading">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-muted-foreground text-xs tracking-[0.15em] mb-3">Våre klinikker</p>
            <h2 id="clinics-heading" className="text-2xl md:text-3xl font-light text-foreground">
              {clinics.length} klinikker – ett helsetilbud
            </h2>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40 overflow-hidden rounded-sm">
            {clinics.map((clinic: any) => (
              <article key={clinic.id} className="bg-background p-6 md:p-8">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-4 h-4 text-brand-dark/40 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-base font-normal text-foreground">CMedical {clinic.label}</h3>
                    <p className="text-sm text-muted-foreground font-light">{clinic.address}</p>
                  </div>
                </div>
                <div className="ml-7 space-y-1.5">
                  <p className="text-sm font-light flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <a href={`tel:+47${clinic.phone.replace(/\s/g, '')}`} className="text-foreground hover:underline" aria-label={`Ring CMedical ${clinic.label}: ${clinic.phone}`}>
                      {clinic.phone}
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground font-light flex items-center gap-2.5">
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
