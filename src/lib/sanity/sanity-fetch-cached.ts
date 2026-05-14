import { unstable_cache } from "next/cache";
import { sanityClient } from "@/lib/sanityClient";

export async function sanityFetchCached<T>(options: {
  query: string;
  params?: Record<string, unknown>;
  tags: string[];
  key: string[];
  revalidate: number;
}): Promise<T> {
  const { query, params, tags, key, revalidate } = options;
  const cached = unstable_cache(
    async () => sanityClient.fetch<T>(query, params ?? {}),
    key,
    { tags, revalidate },
  );
  return cached();
}
