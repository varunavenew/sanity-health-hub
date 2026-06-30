"use client";

import { useEffect, useRef, useState } from "react";
import type { ClinicLocation } from "@/lib/maps/clinic-location";
import { clinicMapsEmbedUrl } from "@/lib/maps/clinic-location";
import { cn } from "@/lib/utils";

interface ClinicMapProps {
  location?: ClinicLocation | null;
  address?: string;
  title: string;
  className?: string;
}

/**
 * Google Maps embed — loads only once the container is visible so the iframe
 * gets the correct width (avoids the partial/grey map tile bug).
 */
export function ClinicMap({ location, address, title, className }: ClinicMapProps) {
  const embedUrl = clinicMapsEmbedUrl(location, address);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !embedUrl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [embedUrl]);

  if (!embedUrl) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-sm border border-border/40",
        className ?? "h-56 md:h-64",
      )}
    >
      {isVisible ? (
        <iframe
          title={`Kart – ${title}`}
          src={embedUrl}
          className="absolute inset-0 block h-full w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 bg-muted/30" aria-hidden />
      )}
    </div>
  );
}
