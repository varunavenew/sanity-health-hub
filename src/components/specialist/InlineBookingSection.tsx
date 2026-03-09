import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Specialist } from "@/data/specialists";
import { motion, AnimatePresence } from "framer-motion";

interface BookingService {
  name: string;
  price: string;
  duration: string;
}

interface BookingCategory {
  id: string;
  label: string;
  services: BookingService[];
}

const categoryToBookingIds: Record<string, string[]> = {
  gynekologi: ["gynekolog", "fostermedisiner"],
  fertilitet: ["fertilitet"],
  urologi: ["urolog"],
  ortopedi: ["ortoped", "handterapeut"],
  annet: ["gastrokirurg", "ernaringsfysiolog", "psykolog", "sexolog", "endokrinolog", "revmatolog", "hudlege", "fysioterapeut", "areknuter", "sprengte-blodkar"],
};

const allBookingServices: BookingCategory[] = [
  {
    id: "fertilitet",
    label: "Fertilitet",
    services: [
      { name: "Enkel sædanalyse", price: "1950", duration: "30 min" },
      { name: "Fertilitetsutredning enkeltperson/single", price: "2850", duration: "1 time" },
      { name: "Fertilitetsutredning par", price: "2850", duration: "1 time" },
      { name: "Infertilitet Mann (inkl. sædprøve)", price: "2850", duration: "45 min" },
      { name: "Telefonkonsultasjon fertilitet", price: "2850", duration: "45 min" },
      { name: "Uforpliktende telefonsamtale med sykepleier", price: "0", duration: "20 min" },
    ]
  },
  {
    id: "fostermedisiner",
    label: "Fostermedisiner",
    services: [
      { name: "Organrettet ultralyd", price: "2100", duration: "30 min" },
      { name: "Organrettet ultralyd + NIPT test (uke 12-14)", price: "9950", duration: "30 min" },
      { name: "Svangerskapskontroll", price: "2100", duration: "30 min" },
      { name: "Tidlig ultralyd + NIPT-test", price: "8990", duration: "30 min" },
      { name: "Tidlig ultralyd", price: "2100", duration: "30 min" },
    ]
  },
  {
    id: "gynekolog",
    label: "Gynekolog",
    services: [
      { name: "Generell undersøkelse", price: "2100", duration: "30 min" },
      { name: "Endometriose / adenomyose", price: "3200", duration: "45 min" },
      { name: "Overgangsalder", price: "3200", duration: "45 min" },
      { name: "PCOS / Hormonforstyrrelser", price: "3200", duration: "45 min" },
      { name: "Kontroll etter fødsel", price: "2100", duration: "30 min" },
      { name: "Urinlekkasje", price: "2100", duration: "30 min" },
    ]
  },
  {
    id: "ortoped",
    label: "Ortoped",
    services: [
      { name: "Konsultasjon ortoped skulder", price: "1800", duration: "30 min" },
      { name: "Konsultasjon ortoped kne", price: "1800", duration: "30 min" },
      { name: "Konsultasjon ortoped hofte", price: "1800", duration: "30 min" },
      { name: "Konsultasjon ortoped fot/ankel", price: "1800", duration: "30 min" },
      { name: "Konsultasjon ortoped hånd", price: "1800", duration: "30 min" },
    ]
  },
  {
    id: "urolog",
    label: "Urolog",
    services: [
      { name: "Konsultasjon urolog", price: "1900", duration: "30 min" },
      { name: "Prostataundersøkelse", price: "1900", duration: "30 min" },
      { name: "Blod i urin, cystoskopi", price: "2650", duration: "30 min" },
      { name: "Sterilisering Mann", price: "6500", duration: "30 min" },
    ]
  },
  {
    id: "gastrokirurg",
    label: "Gastrokirurg",
    services: [
      { name: "Digital konsultasjon fedme vurdering", price: "0", duration: "45 min" },
      { name: "Endetarmsplager", price: "2100", duration: "30 min" },
      { name: "Mage / tarm spesialist", price: "2100", duration: "30 min" },
    ]
  },
  {
    id: "handterapeut",
    label: "Håndterapeut",
    services: [
      { name: "Konsultasjon håndterapeut", price: "1400", duration: "45 min" },
    ]
  },
];

const categoryBookingMap: Record<string, string> = {
  gynekologi: "gynekolog",
  fertilitet: "fertilitet",
  urologi: "urolog",
  ortopedi: "ortoped",
  annet: "",
};

interface InlineBookingSectionProps {
  specialist: Specialist;
}

export const InlineBookingSection = ({ specialist }: InlineBookingSectionProps) => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const bookingIds = categoryToBookingIds[specialist.category] || [];
  const relevantCategories = allBookingServices.filter(c => bookingIds.includes(c.id));

  if (relevantCategories.length === 0) {
    return null;
  }

  const handleSelectService = (categoryId: string, serviceName: string) => {
    const kategori = categoryBookingMap[specialist.category] || categoryId;
    navigate(`/booking?kategori=${kategori}`);
  };

  const effectiveExpanded = relevantCategories.length === 1 
    ? relevantCategories[0].id 
    : expandedCategory;

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-accent" />
              <h2 className="text-2xl md:text-3xl font-light text-foreground">
                Bestill time
              </h2>
            </div>
            <p className="text-muted-foreground font-light">
              Velg tjeneste for å booke time hos {specialist.name.split(" ")[0]}
            </p>
          </div>

          <div className="space-y-3">
            {relevantCategories.map((category) => (
              <div key={category.id} className="border border-border rounded-sm overflow-hidden">
                <button
                  onClick={() => relevantCategories.length > 1 && setExpandedCategory(
                    effectiveExpanded === category.id ? null : category.id
                  )}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                    relevantCategories.length > 1 ? "hover:bg-secondary/50 cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">{category.label}</span>
                  {relevantCategories.length > 1 && (
                    effectiveExpanded === category.id 
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {effectiveExpanded === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border">
                        {category.services.map((service, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectService(category.id, service.name)}
                            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/30 transition-colors border-b border-border/50 last:border-b-0 group"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground font-light truncate pr-4">
                                {service.name}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {service.duration}
                                </span>
                                <span className="text-xs font-medium text-foreground">
                                  {service.price === "0" ? "Gratis" : `kr ${parseInt(service.price).toLocaleString("nb-NO")},-`}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-dark transition-colors shrink-0" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="rounded-full font-light text-sm"
              onClick={() => navigate(`/booking?kategori=${categoryBookingMap[specialist.category] || specialist.category}`)}
            >
              Se alle tjenester og priser
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};