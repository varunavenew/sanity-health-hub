import type { PortableTextTypeComponent } from "@portabletext/react";
import { YoutubeEmbedBlock } from "@/components/portable-text/YoutubeEmbedBlock";

export const youtubeEmbedPortableTextType: Record<
  string,
  PortableTextTypeComponent<{ url?: string; caption?: string }>
> = {
  youtubeEmbed: ({ value }) => (
    <YoutubeEmbedBlock url={value?.url} caption={value?.caption} />
  ),
};
