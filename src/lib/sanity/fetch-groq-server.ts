import "server-only";

import { sanityClient } from "@/lib/sanityClient";

/** Server-side GROQ fetch using the token-bearing Sanity client. */
export async function fetchSanityGroqServer<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return sanityClient.fetch<T>(query, params);
}
