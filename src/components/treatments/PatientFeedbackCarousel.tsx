import { useRef } from "react";
import { Star } from "lucide-react";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ScrollArrows } from "@/components/ui/ScrollArrows";

export interface PatientReview {
  text: string;
  author: string;
  date: string;
}

interface PatientFeedbackCarouselProps {
  reviews: PatientReview[];
  title?: string;
  /** Section background class. Default: warm skin tone. */
  className?: string;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
  </svg>
);

/**
 * Én felles «Tilbakemeldinger fra ekte pasienter»-karusell.
 * Kortene auto-scroller rolig og kontinuerlig (marquee) på både mobil og
 * desktop, pauser ved touch/hover/piler og fortsetter etterpå.
 */
export const PatientFeedbackCarousel = ({
  reviews,
  title = "Tilbakemeldinger fra ekte pasienter",
  className = "bg-brand-warm",
}: PatientFeedbackCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const loop = reviews.length > 1;
  const list = loop ? [...reviews, ...reviews] : reviews;
  useAutoScroll(scrollRef, { enabled: loop, seamless: true });

  if (reviews.length === 0) return null;

  return (
    <section className={`${className} pt-12 md:pt-16 pb-14 md:pb-24`}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
              {title}
            </h2>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide -mx-6 md:-mx-16 px-6 md:px-16 pb-2"
          >
            {list.map((r, i) => (
              <div
                key={`${r.author}-${i}`}
                className="flex-shrink-0 w-[78vw] sm:w-[360px] p-6 md:p-8 rounded-sm bg-white border border-brand-dark/10"
              >
                <div className="flex mb-4">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                  ))}
                </div>
                <p className="text-brand-dark font-light leading-relaxed mb-6 text-sm md:text-base">
                  "{r.text}"
                </p>
                <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
                  <div>
                    <p className="text-brand-dark font-normal text-sm">{r.author}</p>
                    <p className="text-xs text-brand-dark/60 font-light">{r.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-dark/75">
                    <GoogleIcon />
                    <span>Google</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ScrollArrows scrollRef={scrollRef} slideCount={reviews.length} className="mt-4" />
        </div>
      </div>
    </section>
  );
};
