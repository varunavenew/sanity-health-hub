import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage1 from "@/assets/hero/cmedical-hero-1.jpg";
import heroImage2 from "@/assets/hero/cmedical-hero-2.jpg";
import heroImage3 from "@/assets/hero/cmedical-hero-3.jpg";

const slides = [
  {
    id: 1,
    image: heroImage1,
    title: "Skandinavias ledende helhetskonsept",
    subtitle: "Innen gynekologi, fertilitet og urologi",
    description: "Ledende spesialister · Kort ventetid · Ingen henvisning",
  },
  {
    id: 2,
    image: heroImage2,
    title: "I de beste hender",
    subtitle: "Nordens mest komplette private kvinnehelsetilbud",
    description: "Gynekologi · IVF-behandling · Fostermedisiner",
  },
  {
    id: 3,
    image: heroImage3,
    title: "Din reise til foreldreskap",
    subtitle: "Fertilitetsklinikk med forskning og erfaring",
    description: "IVF-behandling · Kirurgi på samme sted · Personlig oppfølging",
  },
];

export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-[500px] md:h-[650px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentSlide 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105"
          }`}
        >
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-16">
                <div 
                  className={`max-w-3xl space-y-6 text-white transition-all duration-700 delay-200 ${
                    index === currentSlide 
                      ? "opacity-100 translate-x-0" 
                      : "opacity-0 -translate-x-12"
                  }`}
                >
                  {/* Large title with minimal weight */}
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight">
                    {slide.title}
                  </h1>
                  
                  {/* Medium subtitle */}
                  <p className="text-2xl md:text-3xl font-light text-white/95">
                    {slide.subtitle}
                  </p>
                  
                  {/* Small description */}
                  <p className="text-sm md:text-base font-light text-white/80 tracking-wide max-w-xl">
                    {slide.description}
                  </p>
                  
                  <div className="pt-4">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-normal px-10 h-12 rounded-sm"
                    >
                      Book time
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Minimal Navigation */}
      <button
        onClick={goToPrevious}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center text-white border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center text-white border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Minimal dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/40 w-1 hover:bg-white/60 hover:w-4"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
