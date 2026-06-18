import type { ClinicLocation } from "@/lib/maps/clinic-location";
import { clinicMapsEmbedUrl } from "@/lib/maps/clinic-location";

interface ClinicMapProps {
  location?: ClinicLocation | null;
  address?: string;
  title: string;
}

export function ClinicMap({ location, address, title }: ClinicMapProps) {
  const embedUrl = clinicMapsEmbedUrl(location, address);
  if (!embedUrl) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-sm border border-border/40">
      <iframe
        title={`Kart – ${title}`}
        src={embedUrl}
        className="h-56 w-full border-0 md:h-64"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
