import { Instagram, Linkedin } from "lucide-react";
import type { SVGProps } from "react";

/** Snapchat ghost — Lucide has no Snapchat glyph, so we ship a matching thin-line one. */
export const SnapchatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3c2.6 0 4.4 1.9 4.4 4.6 0 .9-.1 1.7-.1 2.4.5.3 1.1.2 1.7-.1.5-.2 1 .1 1.1.6.1.5-.2.9-.8 1.2-.6.3-1.3.5-1.3.9 0 .6 2 2.9 3.7 3.4.4.1.6.5.4.9-.3.7-1.6 1.1-2.8 1.3-.2.5-.2 1-.6 1.2-.4.2-1.1 0-1.9 0-.9 0-1.7.6-2.4 1.1-.4.3-.9.5-1.4.5s-1-.2-1.4-.5c-.7-.5-1.5-1.1-2.4-1.1-.8 0-1.5.2-1.9 0-.4-.2-.4-.7-.6-1.2-1.2-.2-2.5-.6-2.8-1.3-.2-.4 0-.8.4-.9 1.7-.5 3.7-2.8 3.7-3.4 0-.4-.7-.6-1.3-.9-.6-.3-.9-.7-.8-1.2.1-.5.6-.8 1.1-.6.6.3 1.2.4 1.7.1 0-.7-.1-1.5-.1-2.4C7.6 4.9 9.4 3 12 3Z" />
  </svg>
);

export interface SocialChannel {
  id: "instagram" | "linkedin" | "snapchat";
  name: string;
  handle: string;
  description: string;
  url: string;
  Icon: React.ElementType;
}

/** Fallbacks used when Sanity siteSettings has no value for a channel. */
export const defaultSocialUrls = {
  instagram: "https://www.instagram.com/cmedical.no",
  linkedin: "https://www.linkedin.com/company/cmedical",
  snapchat: "https://www.snapchat.com/add/cmedical",
};

export const buildSocialChannels = (
  social: Record<string, string | undefined> = {},
): SocialChannel[] => [
  {
    id: "instagram",
    name: "Instagram",
    handle: "@cmedical.no",
    description: "Hverdagen i klinikkene, fagtips og nytt fra spesialistene.",
    url: social.instagram || defaultSocialUrls.instagram,
    Icon: Instagram,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "CMedical",
    description: "Fagartikler, ledige stillinger og nyheter fra selskapet.",
    url: social.linkedin || defaultSocialUrls.linkedin,
    Icon: Linkedin,
  },
  {
    id: "snapchat",
    name: "Snapchat",
    handle: "cmedical",
    description: "Kort og uformelt — bak kulissene hos behandlerne våre.",
    url: (social as { snapchat?: string }).snapchat || defaultSocialUrls.snapchat,
    Icon: SnapchatIcon,
  },
];
