import { useMemo, useState, useCallback } from "react";
import { Users, Heart, Microscope, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import familyHero from "@/assets/hero/family-hero.webp";
import { usePinnedSplitScroll } from "@/hooks/usePinnedSplitScroll";

const reasons = [
  {
    icon: Users,
    title: "Tverrfaglige spesialistteam",
    description:
      "Erfarne spesialister arbeider tett sammen på tvers av fagområder – for helhetlig utredning og behandling.",
  },
  {
    icon: Heart,
    title: "Kropp, livsfase og individ",
    description: "Hos oss møter du et tilbud som tar hele deg på alvor – gjennom alle livets faser.",
  },
  {
    icon: Microscope,
    title: "Presisjon og teknologi",
    description:
      "Høy fagkompetanse kombinert med moderne behandlingsteknologi gir presise utredninger og skånsomme inngrep.",
  },
  {
    icon: Shield,
    title: "Trygg oppfølging",
    description:
      "Ro, forutsigbarhet og verdighet i møte med pasienten – i lokaler innredet med varme og omsorg.",
  },
  {
    icon: Sparkles,
    title: "Tilgjengelig for flere",
    description: "Spesialisthelsetjenester til en pris som gjør kvalitetsbehandling mulig for flere.",
  },
];

export const WhyCMedicalSection = () => {
  const navigate = useNavigate();
  // Viktig: refs via state/callback, ellers blir sectionEl/scrollEl ofte null (ref.current trigger ikke re-render)
  const [sectionEl, setSectionEl] = useState<HTMLElement | null>(null);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  const sectionRef = useCallback((node: HTMLElement | null) => setSectionEl(node), []);
  const rightScrollRef = useCallback((node: HTMLDivElement | null) => setScrollEl(node), []);

  const desktopEnabled = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  }, []);

  usePinnedSplitScroll({
    sectionEl,
    scrollEl,
    enabled: desktopEnabled,
    // Sticky nav gjør at seksjonen sjelden treffer "top: 0" – gi litt margin.
    topOffset: 80,
  });

  return (
    <section ref={sectionRef} className="relative bg-brand-dark">
      <div className="lg:flex lg:min-h-screen">
        {/* Left - Sticky Image (desktop) */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="sticky top-0 h-screen overflow-hidden">
            <img
              src={familyHero}
              alt="CMedical - Familie"
              className="w-full h-full object-cover object-[50%_30%]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/30 to-transparent" />
          </div>
        </div>

        {/* Mobile image */}
        <div className="lg:hidden h-[50vh] relative">
          <img
            src={familyHero}
            alt="CMedical - Familie"
            className="w-full h-full object-cover object-[50%_30%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent" />
        </div>

        {/* Right - scrollable panel (desktop), normal flow (mobile) */}
        <div className="lg:w-1/2 bg-brand-dark">
          <div
            ref={rightScrollRef}
            className="lg:h-screen lg:overflow-y-auto lg:overscroll-contain"
          >
            {/* Header */}
            <div className="px-8 lg:px-16 py-16 lg:pt-32 lg:pb-16">
              <p className="text-sm text-white/50 font-medium mb-4 tracking-wide">
                Hvorfor CMedical
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
                Behandling handler om å
                <br />
                <span className="font-normal">bli tatt på alvor</span>
              </h2>
              <p className="text-white/60 font-light text-base md:text-[17px] max-w-md leading-relaxed">
                Faglig trygghet, respekt og helhetlig oppfølging – for kvinner, menn og alle som drømmer om å skape liv.
              </p>
            </div>

            {/* Reasons List */}
            <div className="px-8 lg:px-16 pb-16">
              <div className="space-y-4">
                {reasons.map((reason) => (
                  <div
                    key={reason.title}
                    className="group flex items-start gap-5 p-6 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-colors duration-300">
                      <reason.icon className="w-6 h-6 text-white/80" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-white mb-1">{reason.title}</h3>
                      <p className="text-sm text-white/50 font-light leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-16 pt-8 border-t border-white/10">
                <blockquote className="text-base md:text-lg font-light text-white/80 italic leading-relaxed">
                  "Hos CMedical handler behandling om å bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging."
                </blockquote>
                <p className="mt-4 text-sm text-white/40 font-light">— CMedical</p>
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full px-8 border border-white text-white hover:bg-white hover:text-brand-dark bg-transparent"
                  onClick={() => (window.location.href = "/om-oss")}
                >
                  Les mer om oss
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-white text-brand-dark hover:bg-white/90"
                  onClick={() => (window.location.href = "/booking")}
                >
                  Bestill time
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* breathing room at end so user clearly hits the bottom before page continues */}
              <div className="h-24" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
