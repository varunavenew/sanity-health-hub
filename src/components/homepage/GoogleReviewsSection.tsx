import { useRef, useState } from "react";
import { Star, Quote, ArrowRight, User, ShieldCheck, FileX, Clock } from "lucide-react";
import { PartialStars } from "@/components/ui/partial-stars";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { googleReviews as staticReviews, googleRatingData, type GoogleReview } from "@/data/googleReviews";
import { useGoogleReviews, useGoogleReviewSettings } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ScrollArrows } from "@/components/ui/ScrollArrows";

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

const SourceBadge = ({ source }: { source: 'google' | 'legelisten' }) => (
  <div className="flex items-center gap-1.5 text-xs text-brand-dark/75">
    {source === 'google' ? <GoogleIcon /> : <LegelistenIcon />}
    <span>{source === 'google' ? 'Google' : 'Legelisten'}</span>
  </div>
);

const ReviewCard = ({ review }: { review: GoogleReview }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const maxLength = 120;
  const isLongText = review.text.length > maxLength;
  const displayText = isExpanded ? review.text : review.text.slice(0, maxLength);
  const isAnonymous = review.name === "Anonym";

  return (
    <div className="group relative flex-shrink-0 w-[380px] p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300">
      <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
      <div className="mb-4">
        <PartialStars rating={review.rating || 5} />
      </div>
      <p className="text-brand-dark font-light leading-relaxed mb-2 text-base">
        "{displayText}{isLongText && !isExpanded && '...'}"
      </p>
      {isLongText && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-brand-dark/60 hover:text-brand-dark underline mb-4"
        >
          {isExpanded ? t("reviews.readLess") : t("reviews.readMore")}
        </button>
      )}
      {!isLongText && <div className="mb-4" />}
      <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
        <div>
          <p className={`text-brand-dark ${isAnonymous ? 'italic text-brand-dark/60 font-light' : 'font-normal'} flex items-center gap-2`}>
            {isAnonymous && <User className="w-3.5 h-3.5" />}
            {review.name}
          </p>
          <p className="text-xs text-brand-dark/60 font-light">{review.date}</p>
        </div>
        <SourceBadge source={review.source} />
      </div>
    </div>
  );
};

interface GoogleReviewsSectionProps {
  showTrustSection?: boolean;
}

export const GoogleReviewsSection = ({ showTrustSection = true }: GoogleReviewsSectionProps) => {
  const navigate = useNavigate();
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { data: sanityReviews } = useGoogleReviews();
  const { data: settings } = useGoogleReviewSettings();
  const googleReviewsList = sanityReviews && sanityReviews.length > 0
    ? sanityReviews.map((r, i) => ({ id: i, name: r.name, rating: r.rating, text: r.text, date: r.date, source: 'google' as const }))
    : staticReviews;
  const averageRating = settings?.googleAverageRating ?? googleRatingData.averageRating;
  const legelistenRating = settings?.legelistenAverageRating ?? 4.8;
  const heading = settings?.heading ?? t("reviews.heading");
  const subheading = settings?.subheading ?? t("reviews.subheading");
  const ctaTitle = settings?.ctaTitle ?? t("reviews.ctaTitle");
  const ctaSubtitle = settings?.ctaSubtitle ?? t("reviews.ctaSubtitle");
  const duplicatedReviews = [...googleReviewsList, ...googleReviewsList];
  const mobileLoop = googleReviewsList.length > 1;
  const mobileList = mobileLoop ? duplicatedReviews : googleReviewsList;
  useAutoScroll(mobileScrollRef, { enabled: mobileLoop, seamless: true });


  return (
    <section className="py-10 md:py-14 bg-brand-warm relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">{heading}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 p-5 rounded-sm bg-white border border-brand-dark/10">
              <GoogleIcon />
              <div>
                <p className="text-xs text-brand-dark/60 font-light">Google Reviews</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-normal text-brand-dark">{averageRating}</span>
                  <div className="flex"><PartialStars rating={averageRating} /></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-sm bg-white border border-brand-dark/10">
              <LegelistenIcon />
              <div>
                <p className="text-xs text-brand-dark/60 font-light">Legelisten</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-normal text-brand-dark">{legelistenRating}</span>
                  <div className="flex"><PartialStars rating={legelistenRating} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: infinite marquee */}
      <div className="relative mt-8 hidden md:block">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-warm to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-warm to-transparent z-10 pointer-events-none" />
        <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused]">
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>

      {/* Mobile: seamless auto-scroll marquee (>3 items), still manually swipeable */}
      <div className="md:hidden mt-4">
        <div
          ref={mobileScrollRef}
          className={`flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 ${mobileLoop ? "" : "snap-x snap-proximity"}`}
          style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
        >
          {mobileList.map((review, idx) => {
            const isAnonymous = review.name === "Anonym";
            return (
              <div
                key={`${review.id}-${idx}`}
                className={`flex-shrink-0 w-[78vw] p-6 rounded-sm bg-white border border-brand-dark/10 ${mobileLoop ? "" : "snap-center"}`}
              >
                <Quote className="w-7 h-7 text-brand-dark/10 rotate-180 mb-3" />
                <div className="mb-3">
                  <PartialStars rating={review.rating || 5} />
                </div>
                <p className="text-brand-dark font-light leading-relaxed text-sm mb-3">
                  "{review.text.length > 140 ? review.text.slice(0, 140) + '...' : review.text}"
                </p>
                <div className="pt-3 border-t border-brand-dark/10 flex items-center justify-between">
                  <div>
                    <p className={`text-sm text-brand-dark ${isAnonymous ? 'italic text-brand-dark/60 font-light' : 'font-normal'} flex items-center gap-2`}>
                      {isAnonymous && <User className="w-3.5 h-3.5" />}
                      {review.name}
                    </p>
                    <p className="text-xs text-brand-dark/60 font-light">{review.date}</p>
                  </div>
                  <SourceBadge source={review.source} />
                </div>
              </div>
            );
          })}
        </div>
        <ScrollArrows scrollRef={mobileScrollRef} slideCount={googleReviewsList.length} />
      </div>


      {showTrustSection && (
        <div className="container mx-auto px-6 md:px-16 mt-10 md:mt-14">
          <div className="max-w-5xl">
            {/* Editorial composition: restrained number + heading + CTA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl md:text-7xl font-light leading-none tracking-tight text-brand-dark">
                    150&thinsp;000<span className="text-brand-mid font-extralight ml-1">+</span>
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
                  {ctaTitle.replace(/Over\s*150\s*000\+?\s*/i, '').replace(/^[a-zæøå]/, (c) => c.toUpperCase()) || 'Fornøyde pasienter siden 2002.'}
                </h2>
              </div>

              <div className="pb-1">
                <button
                  onClick={() => navigate('/tjenester')}
                  className="group inline-flex items-center gap-3 text-sm font-light border-b border-brand-mid pb-2 hover:border-brand-dark transition-colors"
                >
                  Se våre tjenester
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Trust badges — grid layout with hairline divider */}
            <div className="pt-8 border-t border-brand-dark/10 grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-brand-dark/50 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm leading-snug font-light text-brand-dark/70">{t("valueBadges.tech")}</span>
              </div>
              <div className="flex items-center gap-4">
                <FileX className="w-5 h-5 text-brand-dark/50 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm leading-snug font-light text-brand-dark/70">Ingen henvisninger</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-brand-dark/50 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm leading-snug font-light text-brand-dark/70">Kort ventetid</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
