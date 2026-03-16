import { motion } from "framer-motion";
import { Specialist } from "@/data/specialists";

interface SpecialistBioProps {
  specialist: Specialist;
}

export const SpecialistBio = ({ specialist }: SpecialistBioProps) => {
  const bioSections = specialist.bio?.split('\n\n') || [];

  if (!specialist.bio) {
    return null;
  }

  return (
    <section id="specialist-bio" className="bg-background py-14 md:py-20">
      <div className="container mx-auto px-6 md:px-16">
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
