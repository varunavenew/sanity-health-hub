import { MapPin, Phone, Clock } from "lucide-react";
import { Link } from "@/lib/router";
import { useClinics, type SanityClinicListRow } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

type ClinicGridProps = {
  /** From Sanity (e.g. aboutPage.clinicsSection.title). Falls back to i18n. */
  title?: string;
  /** Curated list from Sanity. Empty/omitted = all published clinicPage docs. */
  clinics?: SanityClinicListRow[];
};

export const ClinicGrid = ({ title, clinics: curatedClinics }: ClinicGridProps) => {
  const { data: allClinics = [], isLoading } = useClinics();
  const { t } = useTranslation();

  const useCurated = Boolean(curatedClinics && curatedClinics.length > 0);
  const clinics = useCurated ? curatedClinics! : allClinics;
  const loading = useCurated ? false : isLoading;
  const heading = title?.trim() || t("clinicGrid.title");

  return (
    <section className="bg-muted/50 py-10 md:py-14" aria-labelledby="clinics-heading">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 id="clinics-heading" className="text-lg font-normal text-foreground mb-6">
            {heading}
          </h2>

          <div className="divide-y divide-border/60">
            {loading && (
              <p className="text-sm text-muted-foreground font-light py-4">…</p>
            )}
            {!loading && clinics.length === 0 && (
              <p className="text-sm text-muted-foreground font-light py-4" />
            )}
            {clinics.map((clinic) => (
              <Link
                to={`/klinikker/${clinic.slug || clinic.id}`}
                key={clinic.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 group hover:bg-muted/30 -mx-3 px-3 rounded-sm transition-colors"
              >
                <div className="sm:w-[40%] flex items-center gap-2.5">
                  <MapPin
                    className="w-3.5 h-3.5 text-brand-dark/40 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-sm font-normal text-foreground group-hover:text-brand-dark transition-colors">
                      CMedical {clinic.label}
                    </h3>
                    <p className="text-xs text-muted-foreground font-light">{clinic.address}</p>
                  </div>
                </div>
                <div className="sm:w-[30%] flex items-center gap-2 ml-6 sm:ml-0">
                  <Phone
                    className="w-3 h-3 text-muted-foreground flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-xs text-foreground font-light">{clinic.phone}</span>
                </div>
                <div className="sm:w-[30%] flex items-center gap-2 ml-6 sm:ml-0">
                  <Clock
                    className="w-3 h-3 text-muted-foreground flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-xs text-muted-foreground font-light">{clinic.hours}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
