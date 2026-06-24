import { useMemo, useState } from "react";
import { useNavigate } from "@/lib/router";
import { ArrowRight, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { motion, AnimatePresence } from "framer-motion";
import { useSpecialistMetodikaBooking } from "@/hooks/useBookingCategoryServices";
import {
  bookingUrlForSpecialistContext,
  formatBookingServicePrice,
  resolveSpecialistBookingCategoryIds,
} from "@/lib/booking/specialist-booking";
import { buildBookingUrl, categoryNumericIdToPageId } from "@/lib/bookingLinks";

interface InlineBookingSectionProps {
  specialist: Specialist;
}

export const InlineBookingSection = ({ specialist }: InlineBookingSectionProps) => {
  const navigate = useNavigate();
  const bookingCategoryIds = useMemo(
    () => resolveSpecialistBookingCategoryIds(specialist),
    [specialist.bookingCategoryIds],
  );
  const { categories, loading } = useSpecialistMetodikaBooking(bookingCategoryIds);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  if (bookingCategoryIds.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        <span className="text-sm font-light">Henter tjenester…</span>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-white/60 font-light py-4">
        Ingen bookbare tjenester er tilgjengelig akkurat nå. Prøv booking-siden for full oversikt.
      </p>
    );
  }

  const handleSelectService = (
    apiGroupId: number,
    categorySlug: string,
    serviceName: string,
  ) => {
    navigate(
      bookingUrlForSpecialistContext({
        specialistSlug: specialist.slug,
        apiGroupId,
        kategori: categorySlug,
        tjeneste: serviceName,
      }),
    );
  };

  const effectiveExpanded =
    categories.length === 1 ? categories[0].apiGroupId : expandedCategory;

  const firstCategoryId = bookingCategoryIds[0];

  return (
    <div>
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.apiGroupId}
            className="border border-white/15 rounded-sm overflow-hidden bg-white/10"
          >
            <button
              type="button"
              onClick={() =>
                categories.length > 1 &&
                setExpandedCategory(
                  effectiveExpanded === category.apiGroupId ? null : category.apiGroupId,
                )
              }
              aria-expanded={effectiveExpanded === category.apiGroupId}
              className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                categories.length > 1 ? "hover:bg-white/15 cursor-pointer" : "cursor-default"
              }`}
            >
              <span className="text-sm font-medium text-white">{category.label}</span>
              {categories.length > 1 &&
                (effectiveExpanded === category.apiGroupId ? (
                  <ChevronUp className="w-4 h-4 text-white/40" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white/40" aria-hidden="true" />
                ))}
            </button>

            <AnimatePresence>
              {effectiveExpanded === category.apiGroupId && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10">
                    {category.services.map((service) => (
                      <button
                        key={service.apiActivityId ?? service.name}
                        type="button"
                        onClick={() =>
                          handleSelectService(
                            category.apiGroupId,
                            category.id,
                            service.name,
                          )
                        }
                        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/15 transition-colors border-b border-white/5 last:border-b-0 group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-light truncate pr-4">
                            {service.name}
                          </p>
                          <span className="text-xs font-medium text-white/80 mt-1 inline-block">
                            {formatBookingServicePrice(service.price)}
                          </span>
                        </div>
                        <ArrowRight
                          className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0"
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="outline"
          className="rounded-full font-light text-sm bg-brand-mid text-brand-dark border-brand-mid hover:bg-brand-mid/80"
          onClick={() =>
            navigate(
              buildBookingUrl({
                kategori:
                  categories.find((c) => c.apiGroupId === firstCategoryId)?.id ??
                  categoryNumericIdToPageId[firstCategoryId],
                kategoriId: firstCategoryId,
                spesialist: specialist.slug,
              }),
            )
          }
        >
          Se alle tjenester og priser
          <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
