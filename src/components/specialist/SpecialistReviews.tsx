import { Quote, User } from "lucide-react";
import { PartialStars } from "@/components/ui/partial-stars";
import { googleReviews, type GoogleReview } from "@/data/googleReviews";
import { Specialist } from "@/data/specialists";

interface SpecialistReviewsProps {
  specialist: Specialist;
}

const categoryKeywords: Record<string, string[]> = {
  gynekologi: ["gynekolog", "kvinne", "ultralyd"],
  fertilitet: ["fertil", "ivf", "egg", "befruktning", "embryo"],
  urologi: ["urolog", "prostata"],
  ortopedi: ["skulder", "kne", "hånd", "fot", "ortoped", "kirurg"],
  annet: [],
};

function getRelevantReviews(specialist: Specialist): GoogleReview[] {
  const firstName = specialist.name.split(" ")[0].toLowerCase();
  const lastName = specialist.name.split(" ").slice(-1)[0].toLowerCase();

  // Try direct name match first
  const nameMatched = googleReviews.filter(
    (r) =>
      r.text.toLowerCase().includes(firstName) ||
      r.text.toLowerCase().includes(lastName)
  );

  if (nameMatched.length >= 3) return nameMatched.slice(0, 6);

  // Fall back to category keyword match
  const keywords = categoryKeywords[specialist.category] || [];
  const catMatched = googleReviews.filter((r) =>
    keywords.some((kw) => r.text.toLowerCase().includes(kw))
  );

  const combined = [...nameMatched];
  for (const r of catMatched) {
    if (!combined.includes(r) && combined.length < 3) combined.push(r);
  }
  // Pad with top general reviews to always reach 3
  for (const r of googleReviews) {
    if (combined.length >= 3) break;
    if (!combined.includes(r)) combined.push(r);
  }
  return combined;
}

export const SpecialistReviews = ({ specialist }: SpecialistReviewsProps) => {
  const reviews = getRelevantReviews(specialist);
  if (reviews.length === 0) return null;

  return (
    <section className="bg-brand-warm py-14 md:py-20">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm text-brand-dark/75 font-light mb-2">
            Pasienterfaringer
          </p>
          <h2 className="text-2xl md:text-3xl font-light text-brand-dark">
            Hva pasientene sier
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((review) => {
            const isAnonymous = review.name === "Anonym";
            const text =
              review.text.length > 180
                ? review.text.slice(0, 180) + "…"
                : review.text;
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
                  "{text}"
                </p>
                <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
                  <p
                    className={`text-brand-dark text-sm ${
                      isAnonymous
                        ? "italic text-brand-dark/60 font-light"
                        : "font-normal"
                    } flex items-center gap-2`}
                  >
                    {isAnonymous && <User className="w-3.5 h-3.5" />}
                    {review.name}
                  </p>
                  <span className="text-xs text-brand-dark/60 font-light">
                    {review.date}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
