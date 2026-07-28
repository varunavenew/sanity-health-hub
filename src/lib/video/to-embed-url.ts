/**
 * Normalize YouTube / Vimeo watch/share URLs to iframe embed URLs.
 * Never stores embed HTML from CMS — only converts known URL shapes.
 */

export type VideoEmbedOptions = {
  /** Default true for hero backgrounds. */
  autoplay?: boolean;
  /** Required for browser autoplay policies. Default true. */
  mute?: boolean;
  /** Default true for hero backgrounds. */
  loop?: boolean;
  /** Default false for muted autoplay backgrounds. */
  controls?: boolean;
  /** Default true. */
  playsInline?: boolean;
  /** YouTube: hide related videos. Default true when autoplaying. */
  rel?: boolean;
};

const DEFAULT_HERO: Required<VideoEmbedOptions> = {
  autoplay: true,
  mute: true,
  loop: true,
  controls: false,
  playsInline: true,
  rel: false,
};

/** Interactive player (click-to-play with sound). */
export const INTERACTIVE_EMBED: Required<VideoEmbedOptions> = {
  autoplay: true,
  mute: false,
  loop: false,
  controls: true,
  playsInline: true,
  rel: false,
};

function mergeOptions(options?: VideoEmbedOptions): Required<VideoEmbedOptions> {
  return { ...DEFAULT_HERO, ...options };
}

function youtubeVideoId(input: string): string | null {
  const raw = input?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/")[2] || null;
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] || null;
      }
      return url.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Normalize YouTube watch/share URLs to an iframe embed URL.
 * Returns null when the URL is not a recognized YouTube link.
 * When options are omitted, returns a bare embed URL (portable-text / legacy).
 * Pass options (or `{}`) for hero autoplay params.
 */
export function toYouTubeEmbedUrl(
  input: string,
  options?: VideoEmbedOptions,
): string | null {
  const id = youtubeVideoId(input);
  if (!id) return null;

  if (options === undefined) {
    return `https://www.youtube.com/embed/${id}`;
  }

  const opts = mergeOptions(options);
  const params = new URLSearchParams();
  params.set("autoplay", opts.autoplay ? "1" : "0");
  params.set("mute", opts.mute ? "1" : "0");
  params.set("loop", opts.loop ? "1" : "0");
  params.set("controls", opts.controls ? "1" : "0");
  params.set("playsinline", opts.playsInline ? "1" : "0");
  params.set("rel", opts.rel ? "1" : "0");
  // YouTube requires playlist=VIDEO_ID for single-video loop
  if (opts.loop) {
    params.set("playlist", id);
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function toVimeoEmbedUrl(
  input: string,
  options?: VideoEmbedOptions,
): string | null {
  const raw = input?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    let path: string | null = null;

    if (host === "player.vimeo.com" && url.pathname.startsWith("/video/")) {
      path = url.pathname;
    } else if (host === "vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      path = id ? `/video/${id}` : null;
    }

    if (!path) return null;

    if (options === undefined) {
      return `https://player.vimeo.com${path}`;
    }

    const opts = mergeOptions(options);
    const params = new URLSearchParams();
    params.set("autoplay", opts.autoplay ? "1" : "0");
    params.set("muted", opts.mute ? "1" : "0");
    params.set("loop", opts.loop ? "1" : "0");
    params.set("controls", opts.controls ? "1" : "0");
    params.set("playsinline", opts.playsInline ? "1" : "0");
    // background mode hides chrome for muted looping heroes
    if (opts.autoplay && opts.mute && !opts.controls) {
      params.set("background", "1");
    }

    return `https://player.vimeo.com${path}?${params.toString()}`;
  } catch {
    return null;
  }
}

/** Prefer YouTube, then Vimeo. Pass options for hero autoplay embeds. */
export function toExternalVideoEmbedUrl(
  input: string,
  options?: VideoEmbedOptions,
): string | null {
  return toYouTubeEmbedUrl(input, options) || toVimeoEmbedUrl(input, options);
}

/** Public watch / page URL for opening the normal player (new tab). */
export function toExternalVideoWatchUrl(input: string): string | null {
  const ytId = youtubeVideoId(input);
  if (ytId) return `https://www.youtube.com/watch?v=${ytId}`;

  try {
    const url = new URL(input.trim());
    const host = url.hostname.replace(/^www\./, "");
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id =
        host === "player.vimeo.com"
          ? url.pathname.split("/").filter(Boolean)[1]
          : url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://vimeo.com/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}
