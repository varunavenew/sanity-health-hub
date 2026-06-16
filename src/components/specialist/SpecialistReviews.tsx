import { useMemo } from "react";
import { Quote, User } from "lucide-react";
import { PartialStars } from "@/components/ui/partial-stars";
import { useGoogleReviews } from "@/hooks/useSanity";
import type { Specialist } from "@/lib/sanity/specialist-types";

interface SpecialistReviewsProps {
  specialist: Specialist;
}

type ReviewItem = {
  id: string;
  name: string;
  text: string;
  rating: number;
  date?: string;
};

const categoryKeywords: Record<string, string[]> = {
  gynekologi: ["gynekolog", "kvinne", "ultralyd"],
  fertilitet: ["fertil", "ivf", "egg", "befruktning", "embryo"],
  urologi: ["urolog", "prostata"],
  ortopedi: ["skulder", "kne", "hånd", "fot", "ortoped", "kirurg"],
  annet: [],
};

function getRelevantReviews(specialist: Specialist, reviews: ReviewItem[]): ReviewItem[] {
  const firstName = specialist.name.split(" ")[0].toLowerCase();
  const lastName = specialist.name.split(" ").slice(-1)[0].toLowerCase();

  const nameMatched = reviews.filter(
    (r) =>
      r.text.toLowerCase().includes(firstName) ||
      r.text.toLowerCase().includes(lastName),
  );

  if (nameMatched.length >= 3) return nameMatched.slice(0, 6);

  const keywords = categoryKeywords[specialist.category] || [];
  const catMatched = reviews.filter((r) =>
    keywords.some((kw) => r.text.toLowerCase().includes(kw)),
  );

  const combined: ReviewItem[] = [...nameMatched];
  for (const r of catMatched) {
    if (!combined.some((item) => item.id === r.id) && combined.length < 3) {
      combined.push(r);
    }
  }

  for (const r of reviews) {
    if (combined.length >= 3) break;
    if (!combined.some((item) => item.id === r.id)) combined.push(r);
  }

  return combined;
}

export const SpecialistReviews = ({ specialist }: SpecialistReviewsProps) => {
  const { data: sanityReviews = [] } = useGoogleReviews();

  const reviews = useMemo(() => {
    const normalized: ReviewItem[] = sanityReviews.map((review, index) => ({
      id: `review-${index}`,
      name: review.name || "Anonym",
      text: review.text || "",
      rating: review.rating || 5,
      date: review.date,
    }));
    return getRelevantReviews(specialist, normalized);
  }, [sanityReviews, specialist]);

  if (reviews.length === 0) return null;

  return (
    <section className="bg-brand-warm py-14 md:py-20">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-light text-brand-dark">
            Hva pasientene sier
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((review) => {
            const isAnonymous = review.name === "Anonym";
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
                    {review.name}
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
