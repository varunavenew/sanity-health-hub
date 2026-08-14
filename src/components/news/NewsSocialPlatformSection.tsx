import type { ReactNode } from "react";
import { ArrowUpRight, Facebook, Instagram, Linkedin } from "lucide-react";

export type NewsSocialPlatformCard = {
  _key?: string;
  platform?: string;
  title?: string;
  handle?: string;
  description?: string;
  url?: string;
};

function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3c2.6 0 4.4 1.9 4.4 4.6 0 .9-.1 1.7-.1 2.4.5.3 1.1.2 1.7-.1.5-.2 1 .1 1.1.6.1.5-.2.9-.8 1.2-.6.3-1.3.5-1.3.9 0 .6 2 2.9 3.7 3.4.4.1.6.5.4.9-.3.7-1.6 1.1-2.8 1.3-.2.5-.2 1-.6 1.2-.4.2-1.1 0-1.9 0-.9 0-1.7.6-2.4 1.1-.4.3-.9.5-1.4.5s-1-.2-1.4-.5c-.7-.5-1.5-1.1-2.4-1.1-.8 0-1.5.2-1.9 0-.4-.2-.4-.7-.6-1.2-1.2-.2-2.5-.6-2.8-1.3-.2-.4 0-.8.4-.9 1.7-.5 3.7-2.8 3.7-3.4 0-.4-.7-.6-1.3-.9-.6-.3-.9-.7-.8-1.2.1-.5.6-.8 1.1-.6.6.3 1.2.4 1.7.1 0-.7-.1-1.5-.1-2.4C7.6 4.9 9.4 3 12 3Z" />
    </svg>
  );
}

const PlatformIcon = ({ platform }: { platform?: string }) => {
  switch (platform) {
    case "facebook":
      return <Facebook className="w-6 h-6" />;
    case "linkedin":
      return <Linkedin className="w-6 h-6" />;
    case "snapchat":
      return <SnapchatIcon className="w-6 h-6" />;
    default:
      return <Instagram className="w-6 h-6" />;
  }
};

interface NewsSocialPlatformSectionProps {
  title: string;
  cards: NewsSocialPlatformCard[];
  children?: ReactNode;
}

export function NewsSocialPlatformSection({
  title,
  cards,
  children,
}: NewsSocialPlatformSectionProps) {
  if (!cards.length) return null;

  return (
    <section className="bg-background border-t border-border">
      <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-foreground">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((card) => (
            <a
              key={card._key || card.platform || card.url}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-sm aspect-[4/3] flex flex-col items-center justify-center text-center p-6 bg-brand-beige text-brand-dark border border-brand-mid/40 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-brand-dark hover:text-brand-warm hover:border-brand-dark"
            >
              <ArrowUpRight
                className="absolute top-4 right-4 w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                aria-hidden="true"
              />
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-brand-dark/10 group-hover:bg-brand-warm/15 transition-colors duration-500"
                aria-hidden="true"
              >
                <PlatformIcon platform={card.platform} />
              </span>
              <span className="text-base md:text-lg font-light">{card.title}</span>
              {card.handle ? (
                <span className="text-sm font-light mt-1 opacity-70">{card.handle}</span>
              ) : null}
              {card.description ? (
                <p className="text-sm font-light mt-2 max-w-[22ch] opacity-70">{card.description}</p>
              ) : null}
            </a>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}
