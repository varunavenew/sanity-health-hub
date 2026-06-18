import { useState } from "react";
import { Instagram, Linkedin, Facebook, Youtube, Twitter } from "lucide-react";
import { AssetImg } from "@/components/AssetImg";
import { useSiteSettings } from "@/hooks/useSanity";
import type { SanitySocialPost } from "@/hooks/useSanity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ImageRef } from "@/lib/media";

// Local fallback images
import socialPost1 from "@/assets/social/social-post-1.jpg";
import socialPost2 from "@/assets/social/social-post-2.jpg";
import socialPost3 from "@/assets/social/social-post-3.jpg";
import socialPost4 from "@/assets/social/social-post-4.jpg";
import socialPost5 from "@/assets/social/social-post-5.jpg";
import socialPost6 from "@/assets/social/social-post-6.jpg";

const fallbackPosts = [
  { id: "1", platform: "instagram" as const, image: socialPost1, caption: "Vårt team er klare for en ny uke med å hjelpe pasienter! 💛 #CMedical #Kvinnehelse", permalink: "https://www.instagram.com/cmedical.no" },
  { id: "2", platform: "instagram" as const, image: socialPost2, caption: "Vi er stolte av å annonsere vår nye robotassisterte kirurgienhet.", permalink: "https://www.instagram.com/cmedical.no" },
  { id: "3", platform: "instagram" as const, image: socialPost3, caption: "Visste du at vi tilbyr uforpliktende telefonsamtaler med sykepleier om fertilitet? 🤍", permalink: "https://www.instagram.com/cmedical.no" },
  { id: "4", platform: "instagram" as const, image: socialPost4, caption: "Møt vår nye gynekolog som har spesialisering innen endometriose. Velkommen! 🩺", permalink: "https://www.instagram.com/cmedical.no" },
  { id: "5", platform: "instagram" as const, image: socialPost5, caption: "CMedical deltar på Nordens største konferanse for reproduksjonsmedisin.", permalink: "https://www.instagram.com/cmedical.no" },
  { id: "6", platform: "instagram" as const, image: socialPost6, caption: "Trygge omgivelser for deg og din familie. Velkommen til våre nyrenoverte lokaler ✨", permalink: "https://www.instagram.com/cmedical.no" },
  { id: "7", platform: "instagram" as const, image: socialPost1, caption: "En ny dag, en ny mulighet til å hjelpe familier på veien mot drømmen 🌟", permalink: "https://www.instagram.com/cmedical.no" },
  { id: "8", platform: "instagram" as const, image: socialPost3, caption: "Vi er her for deg – uansett hvor du er i livet. Bestill en uforpliktende samtale i dag 💙", permalink: "https://www.instagram.com/cmedical.no" },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "instagram": return <Instagram className="w-4 h-4" />;
    case "linkedin": return <Linkedin className="w-4 h-4" />;
    case "facebook": return <Facebook className="w-4 h-4" />;
    case "youtube": return <Youtube className="w-4 h-4" />;
    default: return <Instagram className="w-4 h-4" />;
  }
};

const fallbackSocial = {
  instagram: "https://www.instagram.com/cmedical.no",
  facebook: "https://www.facebook.com/cmedical.no",
  linkedin: "https://www.linkedin.com/company/cmedical",
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
      return social.facebook || fallbackSocial.facebook;
    case "linkedin":
      return social.linkedin || fallbackSocial.linkedin;
    case "youtube":
      return social.youtube || fallbackSocial.instagram;
    default:
      return social.instagram || fallbackSocial.instagram;
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
  fallbackImage,
  className,
}: {
  post: SoMePost;
  fallbackImage: ImageRef;
  className?: string;
}) => {
  const [src, setSrc] = useState<ImageRef>(post.image);

  return (
    <AssetImg
      src={src}
      alt={post.alt || ""}
      loading="lazy"
      className={className}
      onError={() => setSrc(fallbackImage)}
    />
  );
};

interface SoMeFeedProps {
  maxPosts?: number;
  compact?: boolean;
  /** CMS posts from Sanity — takes priority over live Instagram feed */
  posts?: SanitySocialPost[] | null;
  /** When true, skip Instagram API and only use CMS / fallback images */
  cmsOnly?: boolean;
}

export const SoMeFeed = ({
  maxPosts,
  compact,
  posts: cmsPosts,
  cmsOnly = false,
}: SoMeFeedProps = {}) => {
  const { data: settings } = useSiteSettings();
  const social = settings?.socialMedia || fallbackSocial;

  const { data: livePosts } = useQuery({
    queryKey: ["instagram-feed"],
    queryFn: fetchInstagramPosts,
    staleTime: 1000 * 60 * 15,
    retry: 1,
    enabled: !cmsOnly && !cmsPosts?.length,
  });

  const cmsMapped = sanityPostsToSoMeFeed(cmsPosts || undefined, social);

  const instagramPosts: SoMePost[] = (livePosts || [])
    .filter((p: { image?: unknown }) => isUsableRemoteImage(p.image))
    .map((p: { id: string; image: string; caption?: string; permalink?: string }) => ({
      id: p.id,
      platform: "instagram" as const,
      image: p.image,
      caption: p.caption || "",
      permalink: p.permalink || fallbackSocial.instagram,
    }));

  const posts: SoMePost[] =
    cmsMapped.length > 0
      ? cmsMapped
      : instagramPosts.length > 0
        ? instagramPosts
        : fallbackPosts;

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
        {displayPosts.map((post, index) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-sm overflow-hidden bg-secondary"
          >
            <SoMePostImage
              post={post}
              fallbackImage={fallbackPosts[index % fallbackPosts.length].image}
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
          {displayPosts.map((post, index) => (
            <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-sm overflow-hidden bg-secondary">
              <SoMePostImage
                post={post}
                fallbackImage={fallbackPosts[index % fallbackPosts.length].image}
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
