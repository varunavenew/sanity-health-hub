import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { hasPortableText } from "@/lib/sanity/section-visibility";

const LINK_CLASS =
  "text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity";

export function SimpleRichText({ value }: { value: PortableTextBlock[] }) {
  if (!hasPortableText(value)) return null;

  return (
    <PortableText
      value={value}
      components={{
        block: {
          normal: ({ children }) => <p>{children}</p>,
        },
        list: {
          bullet: ({ children }) => <ul>{children}</ul>,
          number: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-1">{children}</ol>
          ),
        },
        listItem: {
          bullet: ({ children }) => <li>{children}</li>,
          number: ({ children }) => <li>{children}</li>,
        },
        marks: {
          strong: ({ children }) => (
            <strong className="font-medium text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em>{children}</em>,
          link: ({ children, value: mark }) => (
            <a
              href={mark?.href}
              target={mark?.blank ? "_blank" : undefined}
              rel={mark?.blank ? "noopener noreferrer" : undefined}
              className={LINK_CLASS}
            >
              {children}
            </a>
          ),
        },
      }}
    />
  );
}
