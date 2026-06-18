import type { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanityClient";
import { youtubeEmbedPortableTextType } from "@/lib/portable-text/youtube-embed-type";

export const specialistBioPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base md:text-lg text-foreground/80 font-light leading-[1.85]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-light text-foreground mt-8 mb-3">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="text-lg font-light text-foreground mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-foreground/20 pl-5 my-6 text-foreground/80 italic font-light leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80 font-light">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80 font-light">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-[1.85]">{children}</li>,
    number: ({ children }) => <li className="leading-[1.85]">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-normal">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-foreground underline underline-offset-4 hover:text-foreground/70 transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    ...youtubeEmbedPortableTextType,
    image: ({ value }) => {
      const imageUrl = value?.asset?._ref ? urlFor(value.asset._ref) : "";
      if (!imageUrl) return null;
      return (
        <figure className="my-4">
          <img
            src={imageUrl}
            alt={value?.alt || ""}
            loading="lazy"
            className="w-full rounded-sm object-cover"
          />
          {value?.caption ? (
            <figcaption className="mt-2 text-xs text-muted-foreground font-light">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};
