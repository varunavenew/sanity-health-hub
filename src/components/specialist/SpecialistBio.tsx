import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Specialist, BioBlock } from "@/data/specialists";

interface SpecialistBioProps {
  specialist: Specialist;
}

const renderBlock = (block: BioBlock, idx: number) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={idx}
          className="text-base md:text-lg text-foreground/80 font-light leading-[1.85]"
        >
          {block.text}
        </p>
      );
    case "image":
      return (
        <figure key={idx} className="my-4">
          <img
            src={block.src}
            alt={block.alt || ""}
            loading="lazy"
            className="w-full rounded-sm object-cover"
          />
          {block.caption && (
            <figcaption className="mt-2 text-xs text-muted-foreground font-light">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "video":
      return (
        <figure key={idx} className="my-4">
          <video
            src={block.src}
            poster={block.poster}
            controls
            className="w-full rounded-sm"
          />
          {block.caption && (
            <figcaption className="mt-2 text-xs text-muted-foreground font-light">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "embed":
      return (
        <figure key={idx} className="my-4 aspect-video">
          <iframe
            src={block.url}
            className="w-full h-full rounded-sm"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={block.caption || "Innebygd video"}
          />
          {block.caption && (
            <figcaption className="mt-2 text-xs text-muted-foreground font-light">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "link":
      return (
        <a
          key={idx}
          href={block.href}
          target={block.href.startsWith("http") ? "_blank" : undefined}
          rel={block.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="group block p-5 border border-foreground/10 rounded-sm hover:border-foreground/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-normal text-foreground">{block.label}</p>
              {block.description && (
                <p className="text-xs text-muted-foreground font-light mt-1">
                  {block.description}
                </p>
              )}
            </div>
            <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-0.5" />
          </div>
        </a>
      );
  }
};

export const SpecialistBio = ({ specialist }: SpecialistBioProps) => {
  const firstName = specialist.name.split(" ")[0];
  const blocks: BioBlock[] =
    specialist.richBio && specialist.richBio.length > 0
      ? specialist.richBio
      : (specialist.bio?.split("\n\n") || []).map((text) => ({
          type: "paragraph" as const,
          text,
        }));

  if (blocks.length === 0) return null;

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
          {blocks.map(renderBlock)}
        </motion.div>
      </div>
    </section>
  );
};
