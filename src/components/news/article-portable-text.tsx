import type { PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { AssetImg } from "@/components/AssetImg";
import { youtubeEmbedPortableTextType } from "@/lib/portable-text/youtube-embed-type";

function blockText(value: PortableTextBlock | undefined): string {
  if (!value?.children?.length) return "";
  return value.children
    .map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
    .join("");
}

function isAuthorLine(text: string): boolean {
  return /^Av\s+/i.test(text.trim());
}

function isSectionLabel(text: string): boolean {
  return /^Pasienthistorie:$/i.test(text.trim());
}

function findLeadBlockKey(body: PortableTextBlock[] | undefined): string | null {
  if (!body?.length) return null;

  let hasSeenH2 = false;
  let normalParagraphCount = 0;

  for (const block of body) {
    if (block._type !== "block") continue;

    if (block.style === "h2" || block.style === "h3" || block.style === "h4") {
      hasSeenH2 = true;
      continue;
    }

    if (block.style !== "normal") continue;

    const text = blockText(block);
    if (isAuthorLine(text) || isSectionLabel(text)) continue;

    normalParagraphCount += 1;
    if (hasSeenH2 && normalParagraphCount === 1) {
      return block._key || null;
    }
  }

  return null;
}

export function createArticlePortableTextComponents(
  body: PortableTextBlock[] = [],
): PortableTextComponents {
  const leadBlockKey = findLeadBlockKey(body);

  return {
    block: {
      normal: ({ children, value }) => {
        const text = blockText(value);

        if (isAuthorLine(text)) {
          return (
            <p className="text-sm text-muted-foreground italic mb-6">{children}</p>
          );
        }

        if (isSectionLabel(text)) {
          return (
            <h2 className="text-xl md:text-2xl font-medium text-foreground mt-10 mb-4">
              {children}
            </h2>
          );
        }

        const isLead = Boolean(value?._key && value._key === leadBlockKey);

        return (
          <p
            className={
              isLead
                ? "text-foreground font-medium leading-relaxed mb-5"
                : "text-foreground/80 font-light leading-relaxed mb-5"
            }
          >
            {children}
          </p>
        );
      },
      h2: ({ children }) => (
        <h2 className="text-xl md:text-2xl font-medium text-foreground mt-10 mb-4">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-lg font-medium text-foreground mt-8 mb-3">{children}</h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-base font-medium text-foreground mt-6 mb-2">{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-brand-dark/30 pl-5 my-6 text-foreground/80 italic font-light leading-relaxed">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="text-foreground/80 font-light leading-relaxed">{children}</li>
      ),
      number: ({ children }) => (
        <li className="text-foreground/80 font-light leading-relaxed">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-medium">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ children, value }) => (
        <a
          href={value?.href}
          target={value?.blank ? "_blank" : undefined}
          rel={value?.blank ? "noopener noreferrer" : undefined}
          className="text-brand-dark underline underline-offset-4 hover:text-brand-dark/70 transition-colors"
        >
          {children}
        </a>
      ),
    },
    types: {
      ...youtubeEmbedPortableTextType,
      image: ({ value }) => (
        <figure className="my-8">
          <AssetImg
            src={value?.asset?._ref || ""}
            alt={value?.alt || ""}
            preset="gallery"
            loading="lazy"
            className="w-full rounded-sm"
          />
          {value?.caption ? (
            <figcaption className="text-sm text-muted-foreground mt-2">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      ),
    },
  };
}
