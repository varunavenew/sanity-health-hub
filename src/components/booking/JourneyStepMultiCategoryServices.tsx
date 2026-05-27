import { useEffect, useState } from "react";
import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import {
  bookingCategoryPageIdForClinicService,
  buildBookingUrl,
  categoryPageToBookingId,
  slugifyNo,
} from "@/lib/bookingLinks";
import type { BookingCategoryFromApi } from "@/hooks/useBookingCategoryServices";

const PRIMARY_CLINIC_IDS = new Set(Object.values(categoryPageToBookingId));

type ActivityGroupsResponse = {
  ok?: boolean;
  categories?: BookingCategoryFromApi[];
};

/** Lists API booking services for categories outside the main specialty pages. */
export function JourneyStepMultiCategoryServices() {
  const [categories, setCategories] = useState<BookingCategoryFromApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/booking/activity-groups");
        const json = (await res.json()) as ActivityGroupsResponse;
        if (cancelled) return;

        if (res.ok && json.ok && Array.isArray(json.categories)) {
          const secondary = json.categories.filter(
            (c) => !PRIMARY_CLINIC_IDS.has(c.clinicServiceId),
          );
          setCategories(secondary);
        }
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="text-sm font-light text-muted-foreground mt-4">Henter tjenester…</p>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="mt-4 space-y-5 border-t border-border/40 pt-4">
      {categories.map((category) => {
        const pageId = bookingCategoryPageIdForClinicService(category.clinicServiceId);
        return (
          <div key={category.id}>
            <p className="text-xs font-light text-muted-foreground mb-2">{category.label}</p>
            <ul className="space-y-2">
              {category.services.map((service) => (
                <li key={service.apiActivityId ?? service.name}>
                  <Link
                    to={buildBookingUrl({
                      kategori: pageId,
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
          </div>
        );
      })}
    </div>
  );
}
