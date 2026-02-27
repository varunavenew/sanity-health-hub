import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Stethoscope, Clipboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const clinics = [
  { value: "oslo-majorstuen", label: "Oslo – Majorstuen" },
  { value: "oslo-vika", label: "Oslo – Vika" },
  { value: "bergen", label: "Bergen" },
  { value: "trondheim", label: "Trondheim" },
];

const specialties = [
  { value: "gynekologi", label: "Gynekologi" },
  { value: "fertilitet", label: "Fertilitet" },
  { value: "urologi", label: "Urologi" },
];

const treatments: Record<string, { value: string; label: string }[]> = {
  gynekologi: [
    { value: "undersoekelse", label: "Gynekologisk undersøkelse" },
    { value: "ultralyd", label: "Ultralyd" },
    { value: "spiral", label: "Spiral/prevensjon" },
    { value: "celleprove", label: "Celleprøve" },
  ],
  fertilitet: [
    { value: "fertilitetsutredning", label: "Fertilitetsutredning" },
    { value: "ivf", label: "IVF-behandling" },
    { value: "eggdonasjon", label: "Eggdonasjon" },
  ],
  urologi: [
    { value: "inkontinens", label: "Inkontinens" },
    { value: "prostata", label: "Prostataundersøkelse" },
    { value: "erektil", label: "Erektil dysfunksjon" },
  ],
};

export const BookingWidget = () => {
  const navigate = useNavigate();
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState("");

  const availableTreatments = selectedSpecialty ? treatments[selectedSpecialty] || [] : [];

  return (
    <section className="py-20 md:py-28 bg-brand-dark">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white">
              <Calendar className="w-4 h-4" />
              Rask og enkel booking
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-4">
              Bestill time på få sekunder
            </h2>
            <p className="text-white/70 font-light text-lg">
              Velg klinikk, fagområde og behandling – så tar vi deg videre til booking
            </p>
          </div>

          {/* Booking Card */}
          <div className="bg-card rounded-xl shadow-lg p-8 md:p-10">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Clinic Select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  1. Velg klinikk
                </label>
                <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                  <SelectTrigger className="w-full h-12 bg-muted/50 border-border">
                    <SelectValue placeholder="Velg klinikk" />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics.map((clinic) => (
                      <SelectItem key={clinic.value} value={clinic.value}>
                        {clinic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specialty Select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <Stethoscope className="w-4 h-4 text-muted-foreground" />
                  2. Velg fagområde
                </label>
                <Select 
                  value={selectedSpecialty} 
                  onValueChange={(value) => {
                    setSelectedSpecialty(value);
                    setSelectedTreatment("");
                  }}
                >
                  <SelectTrigger className="w-full h-12 bg-muted/50 border-border">
                    <SelectValue placeholder="Velg fagområde" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Treatment Select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <Clipboard className="w-4 h-4 text-muted-foreground" />
                  3. Velg behandling
                </label>
                <Select 
                  value={selectedTreatment} 
                  onValueChange={setSelectedTreatment}
                  disabled={!selectedSpecialty}
                >
                  <SelectTrigger className="w-full h-12 bg-muted/50 border-border">
                    <SelectValue placeholder="Velg behandling" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTreatments.map((treatment) => (
                      <SelectItem key={treatment.value} value={treatment.value}>
                        {treatment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              size="lg" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg h-14 text-base font-medium"
              onClick={() => navigate('/booking')}
            >
              Gå til booking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Info badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Ledig time innen 1-3 dager
              </span>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Ingen henvisning nødvendig
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
