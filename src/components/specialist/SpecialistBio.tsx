import { motion } from "framer-motion";
import { Specialist } from "@/data/specialists";

interface SpecialistBioProps {
  specialist: Specialist;
}

export const SpecialistBio = ({ specialist }: SpecialistBioProps) => {
  const firstName = specialist.name.split(" ")[0];

  if (!specialist.bio) return null;

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-6">
            Om {firstName}
          </h2>
          <div className="space-y-4">
            {specialist.bio.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-sm text-muted-foreground font-light leading-[1.85]">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
