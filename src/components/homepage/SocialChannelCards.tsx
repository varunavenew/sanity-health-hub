import { ArrowUpRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanity";
import { buildSocialChannels } from "@/components/shared/socialChannels";

/**
 * Channel cards (Instagram, Facebook, LinkedIn, Snapchat) in the brand palette —
 * calm beige surfaces on brand-dark, no platform brand colours.
 */
export const SocialChannelCards = () => {
  const { data: settings } = useSiteSettings();
  const channels = buildSocialChannels(settings?.socialMedia || {});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="list">
      {channels.map(({ id, name, handle, description, url, Icon }) => (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          role="listitem"
          aria-label={`${name} — ${handle}`}
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
            <Icon className="w-6 h-6" />
          </span>

          <span className="text-base md:text-lg font-light">{name}</span>
          <span className="text-sm font-light mt-1 opacity-70">{handle}</span>
          <p className="text-sm font-light mt-2 max-w-[22ch] opacity-70">{description}</p>
        </a>
      ))}
    </div>
  );
};
