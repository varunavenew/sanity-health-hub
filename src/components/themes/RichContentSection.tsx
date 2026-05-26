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
      // Image is hoisted to the split-screen side — not rendered inline.
      return null;
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
        <div key={i} className="my-10 grid grid-cols-[auto,1fr] gap-6 md:gap-10 items-start">
          <div>
            <p className="text-5xl md:text-6xl font-light text-foreground leading-none">
              {block.value}
            </p>
            {block.label && (
              <p className="text-sm text-foreground/70 font-light mt-3">
                {block.label}
              </p>
            )}
          </div>
          <p className="text-base text-foreground/80 font-light leading-relaxed pt-2">
            {block.body}
          </p>
        </div>
      );
  }
};

export const RichContentSection = ({
  eyebrow,
  title,
  blocks,
  imagePosition = "right",
}: RichContentSectionProps & { imagePosition?: "left" | "right" }) => {
  const imageBlock = blocks.find((b): b is ImageBlock => b.type === "image");
  const otherBlocks = blocks.filter((b) => b.type !== "image");

  return (
    <section className="bg-background">
      <div className={`grid lg:grid-cols-2 ${imagePosition === "left" ? "" : "lg:[&>*:first-child]:order-2"}`}>
        {imageBlock && (
          <div className="relative bg-secondary/40 min-h-[360px] lg:min-h-[640px] overflow-hidden">
            <img
              src={imageBlock.src}
              alt={imageBlock.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {imageBlock.caption && (
              <figcaption className="absolute bottom-4 left-4 right-4 text-xs text-white/90 font-light bg-black/40 backdrop-blur-sm px-3 py-2 rounded-sm">
                {imageBlock.caption}
              </figcaption>
            )}
          </div>
        )}
        <div className={`flex items-center px-6 md:px-12 lg:px-16 py-16 md:py-24 ${!imageBlock ? "lg:col-span-2" : ""}`}>
          <div className="max-w-xl">
            {eyebrow && (
              <p className="text-xs text-foreground/60 font-light mb-3">{eyebrow}</p>
            )}
            {title && (
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8">
                {title}
              </h2>
            )}
            {otherBlocks.map((block, i) => renderBlock(block, i))}
          </div>
        </div>
      </div>
    </section>
  );
};
