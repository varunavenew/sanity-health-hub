import { Instagram } from "lucide-react";
import { AssetImg } from "@/components/AssetImg";
import type { SanitySocialPost } from "@/hooks/useSanity";

export type NewsInstagramProfile = {
  username?: string;
  displayName?: string;
  category?: string;
  bio?: string;
  followLabel?: string;
  profileUrl?: string;
  postsCount?: string;
  followersCount?: string;
  followingCount?: string;
};

type InstagramPost = {
  id: string;
  image: string;
  caption: string;
  permalink: string;
  alt: string;
};

function mapInstagramPosts(
  posts: SanitySocialPost[],
  postLimit: number,
  profileUrl: string,
  socialUrls: Record<string, string | undefined>,
): InstagramPost[] {
  return posts
    .slice(0, postLimit)
    .map((post) => {
      const image =
        typeof post.image === "string" && post.image.startsWith("http")
          ? post.image
          : "";
      return {
        id: post._id || post.caption || "instagram-post",
        image,
        caption: post.caption || "",
        permalink:
          post.postUrl || profileUrl || socialUrls.instagram || "https://www.instagram.com/cmedical.no",
        alt: post.alt || post.caption || "",
      };
    })
    .filter((post) => Boolean(post.image));
}

function splitBio(bio?: string) {
  if (!bio?.trim()) return { body: "", location: "" };
  const lines = bio
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) return { body: lines[0] || "", location: "" };
  return {
    body: lines[0],
    location: lines.slice(1).join(" "),
  };
}

interface NewsInstagramSectionProps {
  title: string;
  profile: NewsInstagramProfile | null | undefined;
  posts: SanitySocialPost[];
  postLimit: number;
  socialUrls?: Record<string, string | undefined>;
  locale?: "no" | "en";
  /** When true, omit outer cream section (nested inside social section). */
  nested?: boolean;
}

export function NewsInstagramSection({
  title,
  profile,
  posts,
  postLimit,
  socialUrls = {},
  locale = "no",
  nested = false,
}: NewsInstagramSectionProps) {
  const profileUrl =
    profile?.profileUrl || socialUrls.instagram || "https://www.instagram.com/cmedical.no";
  const displayPosts = mapInstagramPosts(posts, postLimit, profileUrl, socialUrls);
  const username = profile?.username?.trim() || profile?.displayName?.trim();

  if (!username || !displayPosts.length) return null;

  const statLabels =
    locale === "en"
      ? { posts: "posts", followers: "followers", following: "following" }
      : { posts: "innlegg", followers: "følgere", following: "følger" };
  const stats = [
    profile?.postsCount && { value: profile.postsCount, label: statLabels.posts },
    profile?.followersCount && { value: profile.followersCount, label: statLabels.followers },
    profile?.followingCount && { value: profile.followingCount, label: statLabels.following },
  ].filter(Boolean) as { value: string; label: string }[];

  const { body: bioBody, location: bioLocation } = splitBio(profile?.bio);
  const followLabel = profile?.followLabel || (locale === "en" ? "Follow" : "Følg");

  const content = (
    <div className={nested ? "mt-8 md:mt-10" : undefined}>
      {title ? (
        <p className="text-sm text-muted-foreground font-light mb-4">{title}</p>
      ) : null}
      <div className="rounded-sm bg-brand-dark text-brand-warm p-5 md:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5 md:gap-8">
          <div
            className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-brand-yellow flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span className="text-brand-dark font-semibold text-xl md:text-3xl tracking-tight">CM</span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-xl font-light hover:opacity-80 transition-opacity"
              >
                {username}
              </a>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-light px-3 py-1.5 rounded-full bg-brand-warm/15 hover:bg-brand-warm/25 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
                {followLabel}
              </a>
            </div>
            {profile?.displayName && profile.displayName !== username ? (
              <p className="text-sm font-light text-brand-warm/70 mb-3">{profile.displayName}</p>
            ) : null}
            {stats.length > 0 ? (
              <dl className="flex flex-wrap gap-x-6 gap-y-1 mb-4 text-sm font-light">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-1.5">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-medium">{stat.value}</dd>
                    <span className="text-brand-warm/60">{stat.label}</span>
                  </div>
                ))}
              </dl>
            ) : null}
            {profile?.category ? (
              <p className="text-sm font-light text-brand-warm/60">{profile.category}</p>
            ) : null}
            {bioBody ? <p className="text-sm font-light max-w-[52ch]">{bioBody}</p> : null}
            {bioLocation ? (
              <p className="text-sm font-light text-brand-warm/70">{bioLocation}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-6 md:mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayPosts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-sm overflow-hidden bg-secondary"
              >
                <AssetImg
                  src={post.image}
                  alt={post.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-brand-dark" aria-hidden="true" />
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
      </div>
    </div>
  );

  if (nested) return content;

  return (
    <section className="bg-background border-t border-border">
      <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">{content}</div>
    </section>
  );
}
