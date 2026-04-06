import { useState, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

const languages = [
  { code: "nb", label: "Norsk", short: "NO", flag: "🇳🇴" },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
];

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("nb");
  const containerRef = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === currentLang) || languages[0];

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-all"
        aria-label="Velg språk"
      >
        <span className="text-xs font-medium tracking-wide">{current.short}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-brand-dark/95 backdrop-blur-md border border-white/15 rounded-lg shadow-xl overflow-hidden min-w-[150px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors text-left"
              >
                <span>{lang.flag}</span>
                <span className="font-light">{lang.label}</span>
                {lang.code === currentLang && (
                  <Check className="w-3.5 h-3.5 ml-auto text-accent" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
