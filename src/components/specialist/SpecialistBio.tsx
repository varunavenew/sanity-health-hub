import { motion } from "framer-motion";
import { Specialist } from "@/data/specialists";
import { GraduationCap, Languages } from "lucide-react";

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

      {/* Remaining bio */}
      {remainingParagraphs.length > 0 && (
        <div className="py-14 md:py-20">
          <div className="container mx-auto px-6 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="space-y-5">
                {remainingParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="text-[15px] md:text-base text-muted-foreground font-light leading-[1.85]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
};
