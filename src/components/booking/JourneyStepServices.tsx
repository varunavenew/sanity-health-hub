import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { buildBookingUrl, slugifyNo } from "@/lib/bookingLinks";
import { useBookingCategoryServices } from "@/hooks/useBookingCategoryServices";

type JourneyStepServicesProps = {
  /** Clinic service id from booking API mapping (e.g. gynekolog). */
  clinicServiceId: string;
  /** Category page slug for booking URL (e.g. gynekologi). */
  categoryPageId: string;
};

export function JourneyStepServices({
  clinicServiceId,
  categoryPageId,
}: JourneyStepServicesProps) {
  const { services, loading, fromApi } = useBookingCategoryServices(clinicServiceId);

  if (loading) {
    return (
      <p className="text-sm font-light text-muted-foreground mt-4">Henter tjenester…</p>
    );
  }

  if (!fromApi || services.length === 0) {
    return null;
  }

  return (
    <ul className="mt-4 space-y-2 border-t border-border/40 pt-4">
      {services.map((service) => (
        <li key={service.apiActivityId ?? service.name}>
          <Link
            to={buildBookingUrl({
              kategori: categoryPageId,
              tjeneste: slugifyNo(service.name),
            })}
            className="group flex items-center justify-between gap-3 text-sm font-light text-foreground hover:text-foreground/80 transition-colors"
          >
            <span className="min-w-0">{service.name}</span>
            <ArrowRight
              className="w-3.5 h-3.5 flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
