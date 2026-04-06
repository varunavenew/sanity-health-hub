import { useState } from "react";
import { Star, Quote, ArrowRight, User } from "lucide-react";
import { PartialStars } from "@/components/ui/partial-stars";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { googleReviews as staticReviews, googleRatingData, type GoogleReview } from "@/data/googleReviews";
import { useGoogleReviews, useGoogleReviewSettings } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

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
  <div className="flex items-center gap-1.5 text-xs text-brand-dark/50">
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

export const GoogleReviewsSection = () => {
  const navigate = useNavigate();
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

  return (
    <section className="py-24 md:py-32 bg-brand-warm relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <p className="text-sm text-brand-dark/60 font-light mb-3">{subheading}</p>
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

      <div className="relative mt-8">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-warm to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-warm to-transparent z-10 pointer-events-none" />
        <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused]">
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-16 mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-sm bg-brand-dark">
          <div className="text-center sm:text-left">
            <p className="text-white font-normal mb-1">{ctaTitle}</p>
            <p className="text-white/70 text-sm font-light">{ctaSubtitle}</p>
          </div>
          <Button 
            size="lg" 
            className="rounded-full px-8 bg-white text-brand-dark hover:bg-white/90 flex-shrink-0"
            onClick={() => navigate('/booking')}
          >
            {t("nav.bookAppointment")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
