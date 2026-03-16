import { motion } from "framer-motion";
import { Specialist } from "@/data/specialists";
import { GraduationCap, Languages, Briefcase, MapPin } from "lucide-react";

interface SpecialistBioProps {
  specialist: Specialist;
}

export const SpecialistBio = ({ specialist }: SpecialistBioProps) => {
  const firstName = specialist.name.split(" ")[0];

  if (!specialist.bio && (!specialist.expertise || specialist.expertise.length === 0)) {
    return null;
  }

  // Build a lead sentence from expertise for the "intro" feel
  const bioSections = specialist.bio?.split('\n\n') || [];
  const introParagraph = bioSections[0];
  const remainingParagraphs = bioSections.slice(1);

  return (
    <section id="specialist-bio" className="bg-background">
      {/* Intro — large, editorial lead */}
      {introParagraph && (
        <div className="py-14 md:py-20 border-b border-border/30">
          <div className="container mx-auto px-6 md:px-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-lg md:text-xl lg:text-2xl text-foreground font-light leading-[1.7] max-w-3xl"
            >
              {introParagraph}
            </motion.p>
          </div>
        </div>
      )}

      {/* Quick facts strip */}
      <div className="border-b border-border/30">
        <div className="container mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/30"
          >
            {specialist.clinics && specialist.clinics.length > 0 && (
              <div className="py-6 md:py-8 pr-6 md:pr-8">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60">Klinikk</span>
                </div>
                <p className="text-sm text-foreground font-light">{specialist.clinics.join(", ")}</p>
              </div>
            )}
            {specialist.education && (
              <div className="py-6 md:py-8 px-6 md:px-8">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60">Utdanning</span>
                </div>
                <p className="text-sm text-foreground font-light">{specialist.education}</p>
              </div>
            )}
            {specialist.languages && specialist.languages.length > 0 && (
              <div className="py-6 md:py-8 px-6 md:px-8">
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60">Språk</span>
                </div>
                <p className="text-sm text-foreground font-light">{specialist.languages.join(", ")}</p>
              </div>
            )}
            {specialist.expertise && specialist.expertise.length > 0 && (
              <div className="py-6 md:py-8 pl-6 md:pl-8">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60">Fagområder</span>
                </div>
                <p className="text-sm text-foreground font-light">{specialist.expertise.slice(0, 3).join(", ")}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Remaining bio + expertise sidebar */}
      {(remainingParagraphs.length > 0 || (specialist.expertise && specialist.expertise.length > 0)) && (
        <div className="py-14 md:py-20">
          <div className="container mx-auto px-6 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
              {/* Bio text */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="md:col-span-7 lg:col-span-8"
              >
                {remainingParagraphs.length > 0 && (
                  <div className="space-y-5">
                    {remainingParagraphs.map((paragraph, idx) => (
                      <p key={idx} className="text-[15px] md:text-base text-muted-foreground font-light leading-[1.85] max-w-prose">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Expertise tags */}
              {specialist.expertise && specialist.expertise.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="md:col-span-5 lg:col-span-4"
                >
                  <div className="md:sticky md:top-32">
                    <h3 className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground/50 mb-4">
                      Kompetanseområder
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {specialist.expertise.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 text-xs font-light text-foreground/80 bg-secondary/60 border border-border/40 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
