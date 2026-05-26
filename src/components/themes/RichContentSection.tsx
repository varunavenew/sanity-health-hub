import { ExternalLink } from "lucide-react";
import { VideoPlayer } from "@/components/ui/video-player";

/**
 * RichContentSection – fri innholdsblokk for temasider.
 *
 * En komposisjon av inline tekst-elementer som editor kan plassere hvor som
 * helst på siden: avsnitt, bilde med caption, video, lenke, og stat-blokk
 * (stort tall + brødtekst på lys brand-warm rute).
 *
 * I dag rendrer den et statisk demo-utvalg. Når Sanity-schemaet for temaside
 * utvides med en `richContent` portable text-array, kobler vi disse blokkene
 * 1:1 mot serializer-typene (image, video, link, stat).
 */

type Paragraph = { type: "paragraph"; text: string };
type ImageBlock = { type: "image"; src: string; alt: string; caption?: string };
type VideoBlock = { type: "video"; src: string; poster?: string; title?: string };
type LinkBlock = { type: "link"; href: string; label: string; external?: boolean };
type StatBlock = { type: "stat"; value: string; label: string; body: string };

export type RichBlock = Paragraph | ImageBlock | VideoBlock | LinkBlock | StatBlock;

interface RichContentSectionProps {
  eyebrow?: string;
  title?: string;
  blocks: RichBlock[];
}

const renderBlock = (block: RichBlock, i: number) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={i}
          className="text-base text-foreground/70 font-light leading-relaxed mb-6"
        >
          {block.text}
        </p>
      );
    case "image":
      return (
        <figure key={i} className="my-8">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="w-full rounded-sm"
          />
          {block.caption && (
            <figcaption className="text-xs text-foreground/55 font-light mt-3">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "video":
      return (
        <figure key={i} className="my-8">
          <VideoPlayer
            videoUrl={block.src}
            thumbnailUrl={block.poster || ""}
            title={block.title || ""}
            className="w-full aspect-video"
          />
        </figure>
      );
    case "link":
      return (
        <p key={i} className="mb-6">
          <a
            href={block.href}
            target={block.external ? "_blank" : undefined}
            rel={block.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 text-brand-dark underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            {block.label}
            {block.external && <ExternalLink className="w-3.5 h-3.5" />}
          </a>
        </p>
      );
    case "stat":
      return (
        <div
          key={i}
          className="my-10 grid md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-10 bg-brand-warm rounded-sm"
        >
          <div className="flex flex-col">
            <p className="text-xs text-foreground/55 font-light mb-3">Tall</p>
            <p className="text-5xl md:text-6xl font-light text-foreground leading-none">
              {block.value}
            </p>
            <p className="text-sm text-foreground/70 font-light mt-3">
              {block.label}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-foreground/55 font-light mb-3">Tekst</p>
            <p className="text-base text-foreground font-light leading-relaxed">
              {block.body}
            </p>
          </div>
        </div>
      );
  }
};

export const RichContentSection = ({
  eyebrow,
  title,
  blocks,
}: RichContentSectionProps) => (
  <section className="py-14 md:py-20 bg-background">
    <div className="container mx-auto px-6 md:px-16 max-w-3xl">
      {eyebrow && (
        <p className="text-xs text-foreground/60 font-light mb-3">{eyebrow}</p>
      )}
      {title && (
        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8">
          {title}
        </h2>
      )}
      {blocks.map(renderBlock)}
    </div>
  </section>
);
