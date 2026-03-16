import { motion } from "framer-motion";
import { Specialist } from "@/data/specialists";
import { MapPin, GraduationCap, Languages, Briefcase } from "lucide-react";

interface SpecialistBioProps {
  specialist: Specialist;
}

export const SpecialistBio = ({ specialist }: SpecialistBioProps) => {
  const firstName = specialist.name.split(" ")[0];

  if (!specialist.bio && (!specialist.expertise || specialist.expertise.length === 0)) {
    return null;
  }

  const infoItems = [
    ...(specialist.clinics && specialist.clinics.length > 0
      ? [{ icon: MapPin, label: "Klinikk", value: specialist.clinics.join(", ") }]
      : []),
    ...(specialist.education
      ? [{ icon: GraduationCap, label: "Utdanning", value: specialist.education }]
      : []),
    ...(specialist.languages && specialist.languages.length > 0
      ? [{ icon: Languages, label: "Språk", value: specialist.languages.join(", ") }]
      : []),
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        
        {/* Info cards row */}
        {infoItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16"
          >
            {infoItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border/50"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 shrink-0">
                  <item.icon className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground/60 mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-foreground font-light leading-relaxed">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Bio + expertise in two columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
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

          {/* Expertise sidebar */}
          {specialist.expertise && specialist.expertise.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-5 lg:col-span-4"
            >
              <div className="md:sticky md:top-32 p-6 md:p-8 bg-secondary/40 rounded-2xl">
                <div className="flex items-center gap-2 mb-5">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground/70">
                    Fagområder
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialist.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-xs font-light text-foreground bg-background rounded-full border border-border/50"
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
