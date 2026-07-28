import type { Metadata, Viewport } from "next";
import type { Config } from "sanity";
import {
  NextStudio,
  metadata as studioMetadata,
  viewport as studioViewport,
} from "next-sanity/studio";
import config from "../../../../sanity.config";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Sanity Studio",
};

export const viewport: Viewport = {
  ...studioViewport,
  // Narrow next-sanity's broader string typing to Next's Viewport union.
  viewportFit: studioViewport.viewportFit as Viewport["viewportFit"],
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <NextStudio config={config as unknown as Config} />;
}
