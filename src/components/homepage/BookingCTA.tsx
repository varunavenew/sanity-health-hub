import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Phone, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHomepage } from "@/hooks/useSanity";

export const BookingCTA = () => {
  const navigate = useNavigate();

  const badge = "Rask og enkel booking";
  const title = "Bestill time hos spesialist";
  const subtitle = "Velg fagområde, klinikk og behandler – alt i én enkel booking.";

  return (
    <section className="py-20 md:py-28 bg-brand-dark">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/80">
              <Calendar className="w-4 h-4" />
              {badge}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-4">{title}</h2>
          <p className="text-white/60 font-light text-lg mb-10 max-w-xl mx-auto">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-brand-dark hover:bg-white/90 rounded-sm px-10 h-14 text-base font-light" onClick={() => navigate("/booking")}>
              <Calendar className="mr-2 w-5 h-5" />
              Bestill time nå
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="ghost" className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-brand-dark rounded-sm px-8 h-14 text-base font-light" onClick={() => navigate("/kontakt")}>
              <Phone className="mr-2 w-5 h-5" />
              Ring oss
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="flex items-center gap-2 text-sm text-white/50">
              <Clock className="w-4 h-4" />
              Ledig time innen 1–3 dager
            </span>
            <span className="flex items-center gap-2 text-sm text-white/50">
              <Shield className="w-4 h-4" />
              Ingen henvisning nødvendig
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
