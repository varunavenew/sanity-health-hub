import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanityClient";
import { setSanityServiceImages } from "@/data/serviceImages";

/**
 * Fetches hero images for all treatmentCategory + treatment documents from
 * Sanity and populates the module-level cache in `serviceImages.ts` so the
 * synchronous `getServiceImage()` / `getCategoryHeroImage()` resolvers can
 * return a Sanity URL when one exists (CDN pointer stays as fallback).
 *
 * Mount this once at the App root.
 */
const QUERY = /* groq */ `{
  "categories": *[_type == "treatmentCategory" && defined(heroImage.asset)]{
    "categoryId": coalesce(categoryId, slug.current),
    "url": heroImage.asset->url
  },
  "treatments": *[_type == "treatment" && defined(heroImage.asset)]{
    "slug": slug.current,
    "categoryId": coalesce(category->categoryId, category->slug.current),
    "url": heroImage.asset->url
  }
}`;

type QueryResult = {
  categories: Array<{ categoryId?: string; url?: string }>;
  treatments: Array<{ slug?: string; categoryId?: string; url?: string }>;
};

export const useServiceImagesSync = () => {
  const { data } = useQuery({
    queryKey: ["sanity", "serviceImages"],
    queryFn: () => sanityClient.fetch<QueryResult>(QUERY),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;
    const entries: Record<string, string> = {};
    for (const c of data.categories || []) {
      if (c.categoryId && c.url) entries[c.categoryId] = c.url;
    }
    for (const t of data.treatments || []) {
      if (t.categoryId && t.slug && t.url) {
        entries[`${t.categoryId}/${t.slug}`] = t.url;
      }
    }
    setSanityServiceImages(entries);
  }, [data]);
};
