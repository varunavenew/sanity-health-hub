import type { ClinicLocation } from "@/lib/maps/clinic-location";
import { clinicMapsEmbedUrl } from "@/lib/maps/clinic-location";

interface ClinicMapProps {
  location?: ClinicLocation | null;
  address?: string;
  title: string;
  className?: string;
}

export function ClinicMap({ location, address, title, className }: ClinicMapProps) {
  const embedUrl = clinicMapsEmbedUrl(location, address);
  if (!embedUrl) return null;

  return (
    <div className="overflow-hidden rounded-sm border border-border/40">
      <iframe
        title={`Kart – ${title}`}
        src={embedUrl}
        className={className ?? "h-56 w-full border-0 md:h-64"}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
