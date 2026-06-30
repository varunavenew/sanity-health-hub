import { Quote, User } from "lucide-react";
import { PartialStars } from "@/components/ui/partial-stars";
import { useSpecialistProfileUi } from "@/components/specialist/SpecialistProfileUiContext";
import type { Specialist } from "@/lib/sanity/specialist-types";

interface SpecialistReviewsProps {
  specialist: Specialist;
}

export const SpecialistReviews = ({ specialist }: SpecialistReviewsProps) => {
  const ui = useSpecialistProfileUi();
  const reviews = specialist.patientReviews ?? [];

  if (reviews.length === 0) return null;

  return (
    <section className="bg-brand-warm py-14 md:py-20">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-light text-brand-dark">
            {ui.reviewsSectionTitle}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((review) => {
            const isAnonymous =
              !review.name.trim() ||
              review.name.trim().toLowerCase() === ui.anonymousReviewLabel.toLowerCase();
            const displayName = isAnonymous ? ui.anonymousReviewLabel : review.name;
            const text =
              review.text.length > 180 ? `${review.text.slice(0, 180)}…` : review.text;

            return (
              <article
                key={review.id}
                className="p-7 rounded-sm bg-white border border-brand-dark/10"
              >
                <Quote
                  className="w-7 h-7 text-brand-dark/10 rotate-180 mb-3"
                  aria-hidden="true"
                />
                <div className="mb-3">
                  <PartialStars rating={review.rating} />
                </div>
                <p className="text-brand-dark font-light leading-relaxed text-sm mb-5">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
                  <p
                    className={`text-brand-dark text-sm ${
                      isAnonymous
                        ? "italic text-brand-dark/60 font-light"
                        : "font-normal"
                    } flex items-center gap-2`}
                  >
                    {isAnonymous && <User className="w-3.5 h-3.5" aria-hidden="true" />}
                    {displayName}
                  </p>
                  {review.date ? (
                    <span className="text-xs text-brand-dark/60 font-light">
                      {review.date}
                    </span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
