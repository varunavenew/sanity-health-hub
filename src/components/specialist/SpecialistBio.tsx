import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Specialist } from "@/data/specialists";

interface SpecialistBioProps {
  specialist: Specialist;
}

export const SpecialistBio = ({ specialist }: SpecialistBioProps) => {
  const bioSections = specialist.bio?.split('\n\n') || [];
  const hasMeta = (specialist.clinics && specialist.clinics.length > 0) || (specialist.expertise && specialist.expertise.length > 0);

  if (!specialist.bio && !hasMeta) {
    return null;
  }

  return (
    <section id="specialist-bio" className="bg-background py-14 md:py-20">
      <div className="container mx-auto px-6 md:px-16">
        {/* Meta: clinics & expertise */}
        {hasMeta && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-10"
          >
            {specialist.clinics?.map((clinic) => (
              <span
                key={clinic}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-foreground/70 bg-secondary rounded-full"
              >
                <MapPin className="w-3 h-3" aria-hidden="true" />
                {clinic}
              </span>
            ))}
            {specialist.expertise?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-foreground/70 bg-secondary rounded-full"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Bio text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl space-y-6"
        >
          {bioSections.map((paragraph, idx) => (
            <p key={idx} className="text-[15px] md:text-base text-muted-foreground font-light leading-[1.85]">
              {paragraph}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
