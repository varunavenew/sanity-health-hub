import { useState } from "react";
import { Instagram, Linkedin, Facebook, Youtube, Twitter } from "lucide-react";
import { AssetImg } from "@/components/AssetImg";
import { useSiteSettings } from "@/hooks/useSanity";
import type { SanitySocialPost } from "@/hooks/useSanity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ImageRef } from "@/lib/media";

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "instagram": return <Instagram className="w-4 h-4" />;
    case "linkedin": return <Linkedin className="w-4 h-4" />;
    case "facebook": return <Facebook className="w-4 h-4" />;
    case "youtube": return <Youtube className="w-4 h-4" />;
    default: return <Instagram className="w-4 h-4" />;
  }
};

type SoMePost = {
  id: string;
  platform: "instagram" | "linkedin" | "facebook" | "youtube";
  image: ImageRef;
  caption: string;
  permalink: string;
  alt?: string;
};

const isUsableRemoteImage = (url: unknown): url is string =>
  typeof url === "string" && /^https?:\/\//.test(url);

const fetchInstagramPosts = async () => {
  const { data, error } = await supabase.functions.invoke("instagram-feed");
  if (error) throw error;
  return data?.posts || [];
};

function defaultPermalinkForPlatform(
  platform: SoMePost["platform"],
  social: Record<string, string | undefined>,
): string {
  switch (platform) {
    case "facebook":
      return social.facebook || "";
    case "linkedin":
      return social.linkedin || "";
    case "youtube":
      return social.youtube || "";
    default:
      return social.instagram || "";
  }
}

export function sanityPostsToSoMeFeed(
  posts: SanitySocialPost[] | undefined,
  social: Record<string, string | undefined>,
): SoMePost[] {
  if (!posts?.length) return [];

  return posts
    .filter((post) => isUsableRemoteImage(post.image))
    .map((post) => {
      const platform = (post.platform || "instagram") as SoMePost["platform"];
      return {
        id: post._id,
        platform,
        image: post.image,
        caption: post.caption || "",
        permalink: post.postUrl || defaultPermalinkForPlatform(platform, social),
        alt: post.alt || post.caption || "",
      };
    });
}

const SoMePostImage = ({
  post,
  className,
}: {
  post: SoMePost;
  className?: string;
}) => {
  const [src, setSrc] = useState<ImageRef>(post.image);

  return (
    <AssetImg
      src={src}
      alt={post.alt || ""}
      loading="lazy"
      className={className}
      onError={() => setSrc("")}
    />
  );
};

interface SoMeFeedProps {
  maxPosts?: number;
  compact?: boolean;
  /** CMS posts from Sanity — takes priority over live Instagram feed */
  posts?: SanitySocialPost[] | null;
  /** Select one source explicitly; sources never fall through to one another. */
  sourceMode?: "cms" | "api";
}

export const SoMeFeed = ({
  maxPosts,
  compact,
  posts: cmsPosts,
  sourceMode = "cms",
}: SoMeFeedProps = {}) => {
  const { data: settings } = useSiteSettings();
  const social = settings?.socialMedia || {};

  const { data: livePosts } = useQuery({
    queryKey: ["instagram-feed"],
    queryFn: fetchInstagramPosts,
    staleTime: 1000 * 60 * 15,
    retry: 1,
    enabled: sourceMode === "api",
  });

  const cmsMapped = sanityPostsToSoMeFeed(cmsPosts || undefined, social);

  const instagramPosts: SoMePost[] = (livePosts || [])
    .filter((p: { image?: unknown }) => isUsableRemoteImage(p.image))
    .map((p: { id: string; image: string; caption?: string; permalink?: string }) => ({
      id: p.id,
      platform: "instagram" as const,
      image: p.image,
      caption: p.caption || "",
      permalink: p.permalink || social.instagram || "",
    }));

  const posts: SoMePost[] =
    sourceMode === "cms"
      ? cmsMapped
      : instagramPosts;

  const socialLinks = [
    social?.instagram && { platform: "Instagram", url: social.instagram, icon: Instagram },
    social?.facebook && { platform: "Facebook", url: social.facebook, icon: Facebook },
    social?.linkedin && { platform: "LinkedIn", url: social.linkedin, icon: Linkedin },
    social?.youtube && { platform: "YouTube", url: social.youtube, icon: Youtube },
    social?.twitter && { platform: "X", url: social.twitter, icon: Twitter },
  ].filter(Boolean) as { platform: string; url: string; icon: React.ElementType }[];

  const displayPosts = maxPosts ? posts.slice(0, maxPosts) : posts;

  if (!displayPosts.length) return null;

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displayPosts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-sm overflow-hidden bg-secondary"
          >
            <SoMePostImage
              post={post}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                <PlatformIcon platform={post.platform} />
              </div>
            </div>
            {post.caption ? (
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs line-clamp-2 font-light">{post.caption}</p>
              </div>
            ) : null}
          </a>
        ))}
      </div>
    );
  }

  return (
    <section className="py-10 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8 max-w-6xl mx-auto">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-light">Følg oss</p>
            <h2 className="text-2xl md:text-3xl font-light text-foreground">Fra våre sosiale medier</h2>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ platform, url, icon: Icon }) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{platform}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-6xl mx-auto">
          {displayPosts.map((post) => (
            <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-sm overflow-hidden bg-secondary">
              <SoMePostImage
                post={post}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                  <PlatformIcon platform={post.platform} />
                </div>
              </div>
              {post.caption ? (
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs line-clamp-2 font-light">{post.caption}</p>
                </div>
              ) : null}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
