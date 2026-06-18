import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { specialistBioPortableTextComponents } from "@/components/specialist/specialist-bio-portable-text";

interface SpecialistBioProps {
  specialist: Specialist;
}

export const SpecialistBio = ({ specialist }: SpecialistBioProps) => {
  const firstName = specialist.name.split(" ")[0];
  const hasBioBody = Array.isArray(specialist.bioBody) && specialist.bioBody.length > 0;
  const shortBioParagraphs = specialist.bio?.split("\n\n").filter(Boolean) ?? [];
  const hasShortBio = shortBioParagraphs.length > 0;

  if (!hasBioBody && !hasShortBio && !specialist.education) return null;

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
          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
            Om {firstName}
          </h2>

          {hasBioBody ? (
            <div className="space-y-6">
              <PortableText
                value={specialist.bioBody as PortableTextBlock[]}
                components={specialistBioPortableTextComponents}
              />
            </div>
          ) : (
            shortBioParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-base md:text-lg text-foreground/80 font-light leading-[1.85]"
              >
                {paragraph}
              </p>
            ))
          )}

          {specialist.education ? (
            <p className="text-sm text-muted-foreground font-light pt-2">
              {specialist.education}
            </p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
};
