import { useState } from "react";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGoogleReviews } from "@/hooks/useSanity";
import { googleReviews as staticReviews, googleRatingData } from "@/data/googleReviews";

const ReviewCard = ({ review }: { review: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 120;
  const isLongText = review.text.length > maxLength;
  const displayText = isExpanded ? review.text : review.text.slice(0, maxLength);

  return (
    <div className="group relative flex-shrink-0 w-[380px] p-8 rounded-2xl bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300">
      <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
      <div className="flex gap-0.5 mb-4">
        {[...Array(review.rating)].map((_: any, i: number) => (
          <Star key={i} className="w-4 h-4 text-[#FBBC05] fill-[#FBBC05]" />
        ))}
      </div>
      <p className="text-brand-dark font-light leading-relaxed mb-2 text-base">
        "{displayText}{isLongText && !isExpanded && '...'}"
      </p>
      {isLongText && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-brand-dark/60 hover:text-brand-dark underline mb-4">
          {isExpanded ? 'Vis mindre' : 'Les mer'}
        </button>
      )}
      {!isLongText && <div className="mb-4" />}
      <div className="pt-4 border-t border-brand-dark/10">
        <p className="font-normal text-brand-dark">{review.name}</p>
        <p className="text-xs text-brand-dark/40 font-light">{review.date}</p>
      </div>
    </div>
  );
};

export const GoogleReviewsSection = () => {
  const navigate = useNavigate();
  const { data: sanityReviews } = useGoogleReviews();
  
  const reviews = sanityReviews?.length ? sanityReviews : staticReviews;
  const { averageRating } = googleRatingData;
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-24 md:py-32 bg-brand-warm relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <p className="text-sm text-brand-dark/50 font-medium mb-3 tracking-wide">Våre pasienter forteller</p>
            <h2 className="text-3xl md:text-5xl font-light text-brand-dark leading-tight">
              Trygghet, omsorg og helsehjelp i livets ulike faser
            </h2>
          </div>
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-brand-dark/10">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5 mb-1">
                <span className="text-[#4285F4] font-semibold text-lg">G</span>
                <span className="text-[#EA4335] font-semibold text-lg">o</span>
                <span className="text-[#FBBC05] font-semibold text-lg">o</span>
                <span className="text-[#4285F4] font-semibold text-lg">g</span>
                <span className="text-[#34A853] font-semibold text-lg">l</span>
                <span className="text-[#EA4335] font-semibold text-lg">e</span>
              </div>
              <span className="text-xs text-brand-dark/50">Anmeldelser</span>
            </div>
            <div className="w-px h-12 bg-brand-dark/10" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-normal text-brand-dark">{averageRating}</span>
                <div className="flex">
                  {[...Array(5)].map((_: any, i: number) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-[#FBBC05] fill-[#FBBC05]' : 'text-brand-dark/20'}`} />
                  ))}
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
          {duplicatedReviews.map((review: any, index: number) => (
            <ReviewCard key={`${review._id || review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-16 mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-brand-dark">
          <div className="text-center sm:text-left">
            <p className="text-white font-normal mb-1">Over 150 000 fornøyde pasienter siden 2002</p>
            <p className="text-white/50 text-sm font-light">Bli en del av vår historie</p>
          </div>
          <Button size="lg" className="rounded-full px-8 bg-white text-brand-dark hover:bg-white/90 flex-shrink-0" onClick={() => navigate('/booking')}>
            Bestill time
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
