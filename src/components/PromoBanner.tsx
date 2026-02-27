import { useState, useEffect } from "react";

export const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const conditions = [
    { text: "Smerter i underlivet", icon: "♀" },
    { text: "Forstørret prostata", icon: "♂" },
    { text: "Urinlekkasje", icon: "◊" },
    { text: "Overgangsalder", icon: "○" },
    { text: "Endometriose", icon: "♀" },
    { text: "Fertilitet", icon: "∞" },
    { text: "Seksuell helse", icon: "◇" },
  ];

  if (!isVisible) return null;

  return (
    <div className="bg-brand-beige overflow-hidden w-full h-10">
      <div className="relative h-full px-4 flex items-center">
        {/* Subtle gradient overlays for seamless edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand-beige to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-beige to-transparent z-10" />
        
        <div className="flex items-center justify-center overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {[...conditions, ...conditions, ...conditions].map((condition, index) => (
              <span 
                key={index} 
                className="inline-flex items-center mx-6 group"
              >
                <span className="text-brand-dark/70 text-[11px] mr-2 font-medium">
                  {condition.icon}
                </span>
                <span className="text-brand-dark/90 text-[11px] font-light tracking-[0.15em] uppercase">
                  {condition.text}
                </span>
              </span>
            ))}
            
            {/* Tagline with visual separator */}
            <span className="inline-flex items-center mx-10">
              <span className="w-8 h-px bg-brand-dark/20 mr-4" />
              <span className="text-brand-dark text-[11px] font-medium tracking-[0.2em] uppercase">
                I alle livets faser
              </span>
              <span className="w-8 h-px bg-brand-dark/20 ml-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
