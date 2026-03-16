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

  // Build a lead sentence from expertise for the "intro" feel
  const bioSections = specialist.bio?.split('\n\n') || [];
  const introParagraph = bioSections[0];
  const remainingParagraphs = bioSections.slice(1);

  return (
    <section id="specialist-bio" className="bg-background py-14 md:py-20">
      <div className="container mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl space-y-5"
        >
          {introParagraph && (
            <p className="text-lg md:text-xl lg:text-2xl text-foreground font-light leading-[1.7]">
              {introParagraph}
            </p>
          )}
          {remainingParagraphs.map((paragraph, idx) => (
            <p key={idx} className="text-[15px] md:text-base text-muted-foreground font-light leading-[1.85]">
              {paragraph}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
