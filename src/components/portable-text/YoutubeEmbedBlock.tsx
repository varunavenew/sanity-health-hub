import { toYouTubeEmbedUrl } from "@/lib/video/to-embed-url";

type Props = {
  url?: string;
  caption?: string;
  className?: string;
};

export function YoutubeEmbedBlock({ url, caption, className = "" }: Props) {
  const embedUrl = url ? toYouTubeEmbedUrl(url) : null;
  if (!embedUrl) return null;

  return (
    <figure className={`my-8 ${className}`.trim()}>
      <div className="relative aspect-video overflow-hidden rounded-sm bg-secondary">
        <iframe
          src={embedUrl}
          title={caption || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
