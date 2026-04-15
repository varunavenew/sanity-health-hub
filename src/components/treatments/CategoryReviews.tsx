import { useState, useRef } from "react";
import { Quote, Star, ChevronLeft, ChevronRight, User } from "lucide-react";
import { PartialStars } from "@/components/ui/partial-stars";
import { googleReviews as staticReviews, googleRatingData, type GoogleReview } from "@/data/googleReviews";

// Keywords per category to filter relevant reviews
const categoryKeywords: Record<string, string[]> = {
  gynekologi: ["gynekolog", "kvinne", "ida", "siri", "eggfrys", "egg", "ivf", "osteopat", "ingvild"],
  fertilitet: ["fertil", "ivf", "eggfrys", "egg", "prøverør", "befruktning", "embryo", "jackson", "birgitte"],
  urologi: ["urolog", "prostata", "nicolai", "wessel", "robot"],
  ortopedi: ["skulder", "kne", "hånd", "fot", "operasjon", "kirurg", "haugstvedt", "warholm", "kristian"],
  graviditet: ["gravid", "foster", "fødsel", "ultralyd", "nipt"],
};

function getRelevantReviews(categoryId: string): GoogleReview[] {
  const keywords = categoryKeywords[categoryId] || [];
  if (keywords.length === 0) return staticReviews.slice(0, 6);

  const matched = staticReviews.filter((r) =>
    keywords.some((kw) => r.text.toLowerCase().includes(kw) || r.name.toLowerCase().includes(kw))
  );

  // Fill up to 6 with remaining reviews if not enough matches
  if (matched.length >= 6) return matched.slice(0, 8);
  const remaining = staticReviews.filter((r) => !matched.includes(r));
  return [...matched, ...remaining].slice(0, 6);
}

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
  </svg>
);

const LegelistenIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#0A7E8C"/>
    <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.7 0-5.8 1.29-6 2h12c-.2-.71-3.3-2-6-2z" fill="white"/>
    <path d="M12 13c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3z" fill="white"/>
  </svg>
);

interface CategoryReviewsProps {
  categoryId: string;
  categoryTitle: string;
}

export const CategoryReviews = ({ categoryId, categoryTitle }: CategoryReviewsProps) => {
  const reviews = getRelevantReviews(categoryId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-14 md:py-20 bg-brand-warm overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm text-brand-dark/50 font-light mb-2">Pasienterfaringer</p>
            <h2 className="text-2xl md:text-3xl font-light text-brand-dark">
              Hva pasientene sier om {categoryTitle.toLowerCase()}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-sm border border-brand-dark/10">
              <GoogleIcon />
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-normal text-brand-dark">{googleRatingData.averageRating}</span>
                <PartialStars rating={googleRatingData.averageRating} />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors" aria-label="Forrige">
                <ChevronLeft className="w-4 h-4 text-brand-dark/60" />
              </button>
              <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors" aria-label="Neste">
                <ChevronRight className="w-4 h-4 text-brand-dark/60" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide px-6 md:px-16 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review) => {
          const isAnonymous = review.name === "Anonym";
          return (
            <div
              key={review.id}
              className="flex-shrink-0 w-[320px] md:w-[360px] snap-start bg-white rounded-sm border border-brand-dark/10 p-6 flex flex-col justify-between"
            >
              <div>
                <Quote className="w-6 h-6 text-brand-dark/10 rotate-180 mb-3" />
                <div className="mb-3">
                  <PartialStars rating={review.rating} />
                </div>
                <p className="text-brand-dark font-light leading-relaxed text-[15px] line-clamp-5">
                  "{review.text}"
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-brand-dark/10 flex items-center justify-between">
                <div>
                  <p className={`text-sm text-brand-dark ${isAnonymous ? "italic opacity-60" : "font-normal"} flex items-center gap-1.5`}>
                    {isAnonymous && <User className="w-3 h-3" />}
                    {review.name}
                  </p>
                  <p className="text-xs text-brand-dark/50 font-light">{review.date}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-dark/40">
                  {review.source === "google" ? <GoogleIcon /> : <LegelistenIcon />}
                  <span>{review.source === "google" ? "Google" : "Legelisten"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
