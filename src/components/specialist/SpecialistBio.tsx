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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Left: Expertise / quick facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-4 md:sticky md:top-32"
          >
            <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Fagområder
            </h3>
            {specialist.expertise && specialist.expertise.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {specialist.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs font-light text-foreground border border-border/60 rounded-full hover:border-brand-dark/40 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Clinics on desktop */}
            {specialist.clinics && specialist.clinics.length > 0 && (
              <div className="mt-8 hidden md:block">
                <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
                  Klinikk
                </h3>
                <div className="space-y-1.5">
                  {specialist.clinics.map((clinic) => (
                    <p key={clinic} className="text-sm text-foreground font-light">{clinic}</p>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: Bio text */}
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
                    <p key={idx} className="text-[15px] text-muted-foreground font-light leading-[1.85] max-w-prose">
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
