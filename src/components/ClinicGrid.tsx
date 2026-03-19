import { MapPin, Phone, Clock } from "lucide-react";
import { useClinics } from "@/hooks/useSanity";
import { clinics as staticClinics } from "@/data/clinicServices";

const ClinicCard = ({ clinic }: { clinic: any }) => (
  <article className="bg-background p-5 md:p-6">
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
);

export const ClinicGrid = () => {
  const { data: sanityClinics } = useClinics();
  const clinics = sanityClinics?.length ? sanityClinics : staticClinics;

  const topRow = clinics.slice(0, 3);
  const bottomRow = clinics.slice(3);

  return (
    <section className="bg-muted/50 py-10 md:py-14" aria-labelledby="clinics-heading">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 id="clinics-heading" className="text-lg font-normal text-foreground">
              Våre klinikker
            </h2>
          </div>

          {/* Top row: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/40 rounded-t-sm overflow-hidden">
            {topRow.map((clinic: any) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>

          {/* Bottom row: 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40 rounded-b-sm overflow-hidden mt-px">
            {bottomRow.map((clinic: any) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
