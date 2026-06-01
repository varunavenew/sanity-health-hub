import type { QueryClient } from "@tanstack/react-query";

/** Drop cached Sanity data when the URL locale changes (prevents NO content on /en). */
export function invalidateSanityLocaleQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: ["sanity"] });
}
