import { useState, useEffect } from "react";
import heroImage from "@/assets/hero/family-hero.webp";
import skinTextureImage from "@/assets/hero/skin-texture-hero.webp";

const diagnoses = [
  "Smerter i underlivet",
  "Forstørret prostata",
  "Fødselsskader",
  "Overgangsalder",
  "Endometriose",
  "Inkontinens",
  "Infertilitet",
  "PCOS",
  "Myomer",
  "Erektil dysfunksjon",
  "Blærebetennelse",
  "Vulvodyni",
  "Menstruasjonssmerter",
  "Hormonelle ubalanser",
  "Bekkenløsning",
  "Livmortilstander",
  "Eggløsningsproblemer",
  "Prostatakreft",
  "Seksuell helse",
  "Graviditetsproblemer",
  "Tennisalbue",
  "Ballettankel",
  "Hudsykdommer",
  "Muskelsmerter",
  "Åreknuter",
];

// Grid-based position zones to prevent overlap
const positionZones = [
  // Top row
  { xMin: 15, xMax: 35, yMin: 15, yMax: 30 },
  { xMin: 55, xMax: 80, yMin: 18, yMax: 32 },
  // Middle row
  { xMin: 20, xMax: 40, yMin: 40, yMax: 55 },
  { xMin: 55, xMax: 85, yMin: 45, yMax: 58 },
  // Bottom row
  { xMin: 18, xMax: 42, yMin: 68, yMax: 82 },
  { xMin: 52, xMax: 78, yMin: 72, yMax: 85 },
];

const getRandomPositionInZone = (zoneIndex: number) => {
  const zone = positionZones[zoneIndex % positionZones.length];
  return {
    x: zone.xMin + Math.random() * (zone.xMax - zone.xMin),
    y: zone.yMin + Math.random() * (zone.yMax - zone.yMin),
  };
};

interface FloatingWord {
  id: number;
  text: string;
  x: number;
  y: number;
  isExiting: boolean;
  isEntering: boolean;
  scale: number;
}

export const HeroSectionSplit = () => {
  const [visibleWords, setVisibleWords] = useState<FloatingWord[]>([]);

  useEffect(() => {
    // Initialize with 6 words in different zones
    const initialWords: FloatingWord[] = positionZones.slice(0, 6).map((_, i) => {
      const pos = getRandomPositionInZone(i);
      return {
        id: i,
        text: diagnoses[i],
        x: pos.x,
        y: pos.y,
        isExiting: false,
        isEntering: true,
        scale: 0.85 + Math.random() * 0.3, // Vary size slightly
      };
    });
    setVisibleWords(initialWords);
    
    // Remove entering state after animation
    setTimeout(() => {
      setVisibleWords(prev => prev.map(w => ({ ...w, isEntering: false })));
    }, 800);
  }, []);

  useEffect(() => {
    if (visibleWords.length === 0) return;

    let nextWordIndex = 6; // Start after initial 6 words
    let currentSlot = 0;

    const interval = setInterval(() => {
      const replaceIndex = currentSlot;
      
      setVisibleWords((prev) => 
        prev.map((word, i) => 
          i === replaceIndex ? { ...word, isExiting: true } : word
        )
      );
      
      // Fade out before replacing
      setTimeout(() => {
        const newPos = getRandomPositionInZone(replaceIndex);
        const newWord = diagnoses[nextWordIndex % diagnoses.length];
        nextWordIndex++;
        
        setVisibleWords((current) => 
          current.map((word, i) => 
            i === replaceIndex 
              ? {
                  id: Date.now(),
                  text: newWord,
                  x: newPos.x,
                  y: newPos.y,
                  isExiting: false,
                  isEntering: true,
                  scale: 0.85 + Math.random() * 0.3,
                }
              : word
          )
        );
        
        setTimeout(() => {
          setVisibleWords(prev => prev.map(w => 
            w.isEntering ? { ...w, isEntering: false } : w
          ));
        }, 600);
        
      }, 700);
      
      // Move to next slot in order
      currentSlot = (currentSlot + 1) % 6;
      
    }, 2200);

    return () => clearInterval(interval);
  }, [visibleWords.length]);

  return (
    <header className="h-[calc(100vh-80px-40px)] flex flex-col lg:flex-row relative">
      {/* Left - Image */}
      <div className="lg:w-1/2 h-[45vh] lg:h-full relative">
        <img 
          src={heroImage} 
          alt="Familie - CMedical spesialisert helsetjeneste" 
          className="w-full h-full object-cover"
          style={{ objectPosition: '70% 15%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-warm/20 lg:hidden" />
        
        {/* Title overlay on mobile */}
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:hidden bg-gradient-to-t from-brand-dark/80 to-transparent">
          <h1 className="text-3xl md:text-4xl font-medium text-white leading-tight">
            Nordens ledende klinikk for{" "}
            <span className="text-accent">livet og underlivet</span>
          </h1>
        </div>
      </div>

      {/* Right - Word cloud with skin texture background */}
      <div className="lg:w-1/2 relative lg:h-full overflow-hidden hidden lg:block">
        {/* Skin texture background image */}
        <img 
          src={skinTextureImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-brand-dark/35" />
        
        {/* Floating diagnoses - fixed positions, centered */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative w-full h-full">
            {visibleWords.map((word, index) => (
              <div
                key={word.id}
                className={`absolute text-white font-light whitespace-nowrap ${
                  word.isExiting 
                    ? 'opacity-0 scale-90 blur-[2px]' 
                    : word.isEntering
                      ? 'opacity-0'
                      : 'opacity-80'
                }`}
                style={{
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                  transform: `translate(-50%, -50%) scale(${word.scale})`,
                  fontSize: 'clamp(1rem, 1.25vw, 1.35rem)',
                  transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s ease-out',
                  animation: word.isEntering 
                    ? 'wordFadeIn 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards' 
                    : `wordFloat ${4 + (index % 3)}s ease-in-out infinite`,
                  animationDelay: word.isEntering ? '0s' : `${index * 0.5}s`,
                }}
              >
                {word.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
