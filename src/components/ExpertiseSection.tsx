import { Card } from "@/components/ui/card";
import { GraduationCap, Microscope, Users, Building2 } from "lucide-react";
import cmedicalFamily from "@/assets/hero/cmedical-family.jpg";

const expertise = [
  {
    icon: GraduationCap,
    title: "Høy kompetanse",
    description: "Alle våre leger er spesialister med omfattende erfaring fra Norge og internasjonalt",
  },
  {
    icon: Microscope,
    title: "Moderne utstyr",
    description: "Vi investerer i det nyeste innen medisinsk teknologi for beste resultater",
  },
  {
    icon: Users,
    title: "Tverrfaglig team",
    description: "Leger, sykepleiere, psykologer og ernæringsfysiologer samarbeider om din behandling",
  },
  {
    icon: Building2,
    title: "Komfortable klinikker",
    description: "Moderne og romslige fasiliteter designet for din trygghet og komfort",
  },
];

export const ExpertiseSection = () => {
  return (
    <section className="py-24 bg-[hsl(30,25%,90%)]">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative h-[600px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10" />
            <img 
              src={cmedicalFamily} 
              alt="CMedical familie"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-light leading-tight tracking-tight">
                Ekspertise du kan stole på
              </h2>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                CMedical er Skandinavias største private aktør innen gynekologi, fertilitet og urologi. 
                Siden oppstarten har vi hjulpet over 25 000 pasienter med høy kvalitet og personlig omsorg.
              </p>
            </div>

            <div className="space-y-6">
              {expertise.map((item, index) => (
                <div
                  key={index}
                  className="p-6 hover:bg-card transition-all duration-300 rounded-lg border border-transparent hover:border-border group"
                >
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 mt-1">
                      <item.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-light tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
