import { TreatmentAreaCard } from "@/components/treatments/TreatmentAreaCard";
import { useSpecialistProfileUi } from "@/components/specialist/SpecialistProfileUiContext";
import type { Specialist } from "@/lib/sanity/specialist-types";

interface SpecialistProfileTreatmentsProps {
  specialist: Specialist;
}

export function SpecialistProfileTreatments({ specialist }: SpecialistProfileTreatmentsProps) {
  const ui = useSpecialistProfileUi();
  const cards = specialist.profileTreatments ?? [];
  if (cards.length === 0) return null;

  return (
    <section className="bg-secondary/40 pt-14 md:pt-28 pb-14 md:pb-28">
      <div className="container mx-auto px-6 md:px-16">
        <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-10 md:mb-14 max-w-3xl">
          {ui.treatmentsSectionTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl">
            {cards.map((card) => (
              <TreatmentAreaCard
                key={card.href}
                href={card.href}
                title={card.title}
                description={card.description}
                image={card.image}
                imageAlt={card.imageAlt}
                readMoreLabel={ui.treatmentCardReadMoreLabel}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
