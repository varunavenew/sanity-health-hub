import { ArrowUpRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanity";
import { buildSocialChannels } from "@/components/shared/socialChannels";

import socialPost2 from "@/assets/social/social-post-2.jpg";
import socialPost4 from "@/assets/social/social-post-4.jpg";
import socialPost6 from "@/assets/social/social-post-6.jpg";

const imageById: Record<string, string> = {
  instagram: socialPost2,
  linkedin: socialPost4,
  snapchat: socialPost6,
};

/**
 * Three channel cards (Instagram, LinkedIn, Snapchat) using the same
 * magazine-card language as the service cards under the homepage hero.
 */
export const SocialChannelCards = () => {
  const { data: settings } = useSiteSettings();
  const channels = buildSocialChannels(settings?.socialMedia || {});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="list">
      {channels.map(({ id, name, handle, description, url, Icon }) => (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          role="listitem"
          className="group relative overflow-hidden rounded-sm aspect-[4/3] sm:aspect-[3/4] text-left bg-secondary/40"
          aria-label={`${name} — ${handle}`}
        >
          <img
            src={imageById[id]}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/35 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-2 text-white text-sm md:text-base font-light">
                <Icon className="w-4 h-4" aria-hidden="true" />
                {name}
              </span>
              <ArrowUpRight
                className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                aria-hidden="true"
              />
            </div>
            <p className="text-white/70 text-xs font-light">{handle}</p>
            <p className="text-white/60 text-xs font-light mt-1 hidden sm:block">
              {description}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};
