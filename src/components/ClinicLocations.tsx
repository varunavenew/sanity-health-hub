import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const locations = [
  { city: "Oslo", clinic: "Majorstuen" },
  { city: "Oslo", clinic: "Sentrum" },
  { city: "Bergen", clinic: "Sentrum" },
  { city: "Stavanger", clinic: "Sentrum" },
  { city: "Trondheim", clinic: "Midtbyen" },
  { city: "Stockholm", clinic: "City" },
];

export const ClinicLocations = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-16">
          <h2 className="text-6xl md:text-7xl font-light mb-6 leading-tight tracking-tight">
            Våre klinikker
          </h2>
          <p className="text-sm text-muted-foreground tracking-wide max-w-2xl font-light">
            Med 14 klinikker i Norge og Sverige er vi alltid nær deg. 
            Alle våre klinikker holder høyeste standard med moderne utstyr og komfortable omgivelser.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {locations.map((location, index) => (
            <Card
              key={index}
              className="group p-6 hover:shadow-lg transition-all cursor-pointer border-border bg-card"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-light mb-1">{location.city}</div>
                  <div className="text-sm text-muted-foreground font-light">{location.clinic}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full px-8"
            onClick={() => navigate('/booking')}
          >
            Finn din nærmeste klinikk
          </Button>
        </div>
      </div>
    </section>
  );
};
