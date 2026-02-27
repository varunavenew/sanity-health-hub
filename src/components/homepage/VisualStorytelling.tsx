import { Play, Heart, Microscope, Building2 } from "lucide-react";
import heroImage1 from "@/assets/hero/cmedical-hero-1.jpg";
import heroImage2 from "@/assets/hero/cmedical-hero-2.jpg";
import heroImage3 from "@/assets/hero/cmedical-hero-3.jpg";

const stories = [
  {
    id: 1,
    image: heroImage2,
    icon: Heart,
    title: "Omsorg i hver behandling",
    subtitle: "Fertilitet & graviditet",
    description: "Vi følger deg gjennom hele reisen mot foreldreskap",
  },
  {
    id: 2,
    image: heroImage1,
    icon: Microscope,
    title: "Ekspertise du kan stole på",
    subtitle: "Spesialister i arbeid",
    description: "Nordens fremste fagfolk med lang erfaring",
  },
  {
    id: 3,
    image: heroImage3,
    icon: Building2,
    title: "Moderne fasiliteter",
    subtitle: "Klinikk & utstyr",
    description: "Topp moderne utstyr og komfortable lokaler",
  },
];

export const VisualStorytelling = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium text-accent mb-3 tracking-wide">
            Livsforvandlende behandling
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-6 leading-tight">
            Se hvordan vi gjør en forskjell
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            Opplev CMedical gjennom øynene til våre pasienter og spesialister
          </p>
        </div>

        {/* Stories grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="group relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Background image */}
              <img
                src={story.image}
                alt={story.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Play button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <story.icon className="w-5 h-5 text-accent" />
                  <span className="text-sm text-white/80 font-light">{story.subtitle}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                  {story.title}
                </h3>
                <p className="text-sm text-white/70 font-light">
                  {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
