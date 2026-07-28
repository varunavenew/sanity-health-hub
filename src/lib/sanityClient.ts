import "server-only";

import { createClient } from "@sanity/client";
import {
  requireSanityDataset,
  requireSanityProjectId,
} from "@/lib/sanity/dataset-env";

export const SANITY_PROJECT_ID = requireSanityProjectId();
export const SANITY_DATASET = requireSanityDataset();

/** Server-only token — required to read the private `developer` dataset locally. */
const SANITY_TOKEN = process.env.SANITY_TOKEN?.trim();

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  ...(SANITY_TOKEN ? { token: SANITY_TOKEN } : {}),
});

// Image URL helpers live in `@/lib/sanity/image-url` (client-safe).
// Re-export for server modules that already import from here.
export { getImageUrl, urlForImageRef as urlFor } from "@/lib/sanity/image-url";
