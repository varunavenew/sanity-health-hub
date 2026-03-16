import { motion } from "framer-motion";
import { Specialist } from "@/data/specialists";
import { Briefcase } from "lucide-react";

interface SpecialistBioProps {
  specialist: Specialist;
}

export const SpecialistBio = ({ specialist }: SpecialistBioProps) => {
  const firstName = specialist.name.split(" ")[0];

  if (!specialist.bio && (!specialist.expertise || specialist.expertise.length === 0)) {
    return null;
  }

  return (
    <section id="specialist-bio" className="py-16 md:py-24 bg-primary/[0.03]">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 lg:col-span-8"
          >
            {specialist.bio && (
              <>
                <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8 leading-tight">
                  Om {firstName}
                </h2>
                <div className="space-y-5">
                  {specialist.bio.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-[15px] md:text-base text-muted-foreground font-light leading-[1.85] max-w-prose">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Sidebar: Expertise */}
          {specialist.expertise && specialist.expertise.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-5 lg:col-span-4"
            >
              <div className="md:sticky md:top-32 p-6 md:p-8 bg-primary rounded-2xl">
                <div className="flex items-center gap-2 mb-5">
                  <Briefcase className="w-4 h-4 text-accent" />
                  <h3 className="text-[11px] font-medium tracking-widest uppercase text-primary-foreground/50">
                    Fagområder
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialist.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-xs font-light text-primary-foreground/70 border border-primary-foreground/10 rounded-full"
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
    </section>
  );
};
