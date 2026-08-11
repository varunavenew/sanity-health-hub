import type { ReactNode } from "react";

/**
 * Minimal markdown for CMS text fields that store bold + bullet lists.
 * Renders React nodes — does not use dangerouslySetInnerHTML.
 */
export function renderLightMarkdown(input: string): ReactNode {
  const text = input.replace(/\r\n/g, "\n").trim();
  if (!text) return null;

  const blocks = text.split(/\n{2,}/);
  const nodes: ReactNode[] = [];

  blocks.forEach((block, blockIndex) => {
    const lines = block.split("\n").map((line) => line.trimEnd());
    const isList = lines.every((line) => !line.trim() || /^[-*]\s+/.test(line.trim()));
    const listLines = lines.filter((line) => /^[-*]\s+/.test(line.trim()));

    if (isList && listLines.length > 0) {
      nodes.push(
        <ul key={`ul-${blockIndex}`} className="list-disc pl-5 space-y-2">
          {listLines.map((line, i) => (
            <li key={`li-${blockIndex}-${i}`}>
              {renderInlineMarkdown(line.trim().replace(/^[-*]\s+/, ""))}
            </li>
          ))}
        </ul>,
      );
      return;
    }

    nodes.push(
      <p key={`p-${blockIndex}`} className={blockIndex > 0 ? "mt-3" : undefined}>
        {lines.map((line, i) => (
          <span key={`line-${blockIndex}-${i}`}>
            {i > 0 ? <br /> : null}
            {renderInlineMarkdown(line)}
          </span>
        ))}
      </p>,
    );
  });

  return <div className="space-y-3">{nodes}</div>;
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={index} className="font-medium text-foreground">{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}
