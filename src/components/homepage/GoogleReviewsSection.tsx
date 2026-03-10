import { useState } from "react";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { googleReviews as staticReviews, googleRatingData, type GoogleReview } from "@/data/googleReviews";
import { useGoogleReviews } from "@/hooks/useSanity";

const ReviewCard = ({ review }: { review: GoogleReview }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 120;
  const isLongText = review.text.length > maxLength;
  const displayText = isExpanded ? review.text : review.text.slice(0, maxLength);

  return (
    <div className="group relative flex-shrink-0 w-[380px] p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300">
      {/* Quote icon */}
      <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
      
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-[#FBBC05] fill-[#FBBC05]" />
        ))}
      </div>

      {/* Review text */}
      <p className="text-brand-dark font-light leading-relaxed mb-2 text-base">
        "{displayText}{isLongText && !isExpanded && '...'}"
      </p>
      
      {isLongText && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-brand-dark/60 hover:text-brand-dark underline mb-4"
        >
          {isExpanded ? 'Vis mindre' : 'Les mer'}
        </button>
      )}
      {!isLongText && <div className="mb-4" />}

      {/* Author */}
      <div className="pt-4 border-t border-brand-dark/10">
        <p className="font-normal text-brand-dark">{review.name}</p>
        <p className="text-xs text-brand-dark/40 font-light">{review.date}</p>
      </div>
    </div>
  );
};

export const GoogleReviewsSection = () => {
  const navigate = useNavigate();
  const { averageRating } = googleRatingData;

  // Duplicate reviews for seamless infinite scroll
  const duplicatedReviews = [...googleReviews, ...googleReviews];

  return (
    <section className="py-24 md:py-32 bg-brand-warm relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 relative">
        {/* Header with Google rating */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <p className="text-sm text-brand-dark/50 font-medium mb-3">
              Våre pasienter forteller
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-brand-dark leading-tight">
              Trygghet, omsorg og helsehjelp i livets ulike faser
            </h2>
          </div>

          {/* Goldstar Rating Card */}
          <div className="flex items-center gap-6 p-6 rounded-sm bg-white border border-brand-dark/10">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-1">
                <Star className="w-5 h-5 text-[#FBBC05] fill-[#FBBC05]" />
                <span className="text-brand-dark font-semibold text-lg tracking-tight">Goldstar</span>
              </div>
              <span className="text-xs text-brand-dark/50">Anmeldelser</span>
            </div>
            <div className="w-px h-12 bg-brand-dark/10" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-normal text-brand-dark">{averageRating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-[#FBBC05] fill-[#FBBC05]' : i < averageRating ? 'text-[#FBBC05] fill-[#FBBC05]/50' : 'text-brand-dark/20'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Reviews */}
      <div className="relative mt-8">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-warm to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-warm to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling container */}
        <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused]">
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-6 md:px-16 mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-sm bg-brand-dark">
          <div className="text-center sm:text-left">
            <p className="text-white font-normal mb-1">
              Over 150 000 fornøyde pasienter siden 2002
            </p>
            <p className="text-white/50 text-sm font-light">
              Bli en del av vår historie
            </p>
          </div>
          <Button 
            size="lg" 
            className="rounded-full px-8 bg-white text-brand-dark hover:bg-white/90 flex-shrink-0"
            onClick={() => navigate('/booking')}
          >
            Bestill time
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
