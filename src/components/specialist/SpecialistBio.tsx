import { motion } from "framer-motion";
import { Specialist } from "@/data/specialists";

interface SpecialistBioProps {
  specialist: Specialist;
}

export const SpecialistBio = ({ specialist }: SpecialistBioProps) => {
  const firstName = specialist.name.split(" ")[0];

  if (!specialist.bio && (!specialist.expertise || specialist.expertise.length === 0)) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          {/* Left column: label + expertise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-4"
          >
            <div className="md:sticky md:top-32 space-y-8">
              <div>
                <h3 className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground/60 mb-5">
                  Fagområder
                </h3>
                {specialist.expertise && specialist.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {specialist.expertise.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs font-light text-foreground bg-secondary/50 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {specialist.clinics && specialist.clinics.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground/60 mb-3">
                    Klinikk
                  </h3>
                  <div className="space-y-1">
                    {specialist.clinics.map((clinic) => (
                      <p key={clinic} className="text-sm text-foreground font-light">{clinic}</p>
                    ))}
                  </div>
                </div>
              )}

              {specialist.education && specialist.education.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground/60 mb-3">
                    Utdanning
                  </h3>
                  <div className="space-y-1">
                    {specialist.education.map((edu) => (
                      <p key={edu} className="text-sm text-foreground font-light">{edu}</p>
                    ))}
                  </div>
                </div>
              )}

              {specialist.languages && specialist.languages.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground/60 mb-3">
                    Språk
                  </h3>
                  <p className="text-sm text-foreground font-light">
                    {specialist.languages.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right column: bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-8"
          >
            {specialist.bio && (
              <>
                <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8 leading-tight">
                  Om {firstName}
                </h2>
                <div className="space-y-5">
                  {specialist.bio.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-[15px] md:text-base text-muted-foreground font-light leading-[1.9] max-w-prose">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
