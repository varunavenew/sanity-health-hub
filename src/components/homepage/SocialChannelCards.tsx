import { ArrowUpRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanity";
import { buildSocialChannels } from "@/components/shared/socialChannels";

type ChannelStyle = {
  background: string;
  fg: string;
  fgMuted: string;
  iconBg: string;
};

const styleById: Record<string, ChannelStyle> = {
  instagram: {
    background:
      "linear-gradient(135deg, #F9CE34 0%, #EE2A7B 45%, #6228D7 100%)",
    fg: "#FFFFFF",
    fgMuted: "rgba(255,255,255,0.78)",
    iconBg: "rgba(255,255,255,0.18)",
  },
  facebook: {
    background: "linear-gradient(135deg, #1877F2 0%, #0B5FCC 100%)",
    fg: "#FFFFFF",
    fgMuted: "rgba(255,255,255,0.78)",
    iconBg: "rgba(255,255,255,0.18)",
  },
  linkedin: {
    background: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)",
    fg: "#FFFFFF",
    fgMuted: "rgba(255,255,255,0.78)",
    iconBg: "rgba(255,255,255,0.18)",
  },
  snapchat: {
    background: "linear-gradient(135deg, #FFFC00 0%, #F7E600 100%)",
    fg: "#1A1A1A",
    fgMuted: "rgba(26,26,26,0.7)",
    iconBg: "rgba(26,26,26,0.1)",
  },
};

/**
 * Fully coloured channel cards (Instagram, Facebook, LinkedIn, Snapchat)
 * with centered icon and centered text, in each platform's brand colour.
 */
export const SocialChannelCards = () => {
  const { data: settings } = useSiteSettings();
  const channels = buildSocialChannels(settings?.socialMedia || {});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="list">
      {channels.map(({ id, name, handle, description, url, Icon }) => {
        const s = styleById[id] ?? styleById.linkedin;
        return (
          <a
            key={id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
            aria-label={`${name} — ${handle}`}
            className="group relative overflow-hidden rounded-sm aspect-[4/3] sm:aspect-[4/3] flex flex-col items-center justify-center text-center p-6 transition-transform duration-500 ease-out hover:-translate-y-0.5"
            style={{ background: s.background, color: s.fg }}
          >
            <ArrowUpRight
              className="absolute top-4 right-4 w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
              aria-hidden="true"
            />

            <span
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ease-out group-hover:scale-105"
              style={{ backgroundColor: s.iconBg }}
              aria-hidden="true"
            >
              <Icon className="w-6 h-6" />
            </span>

            <span className="text-base md:text-lg font-light">{name}</span>
            <span className="text-sm font-light mt-1" style={{ color: s.fgMuted }}>
              {handle}
            </span>
            <p
              className="text-sm font-light mt-2 max-w-[22ch]"
              style={{ color: s.fgMuted }}
            >
              {description}
            </p>
          </a>
        );
      })}
    </div>
  );
};
