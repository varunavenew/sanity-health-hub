import { categoryPageBookingConfig } from "@/lib/bookingLinks";
import { JourneyStepServices } from "@/components/booking/JourneyStepServices";
import { JourneyStepMultiCategoryServices } from "@/components/booking/JourneyStepMultiCategoryServices";

type JourneyStepServicesForPageProps = {
  categoryPageId: string;
};

/** API-backed service list for patient journey step 01 on category pages. */
export function JourneyStepServicesForPage({
  categoryPageId,
}: JourneyStepServicesForPageProps) {
  const config = categoryPageBookingConfig[categoryPageId];
  if (!config) return null;

  if (config.showAllApiCategories) {
    return <JourneyStepMultiCategoryServices />;
  }

  return (
    <JourneyStepServices
      clinicServiceId={config.clinicServiceId}
      categoryPageId={categoryPageId}
    />
  );
}
