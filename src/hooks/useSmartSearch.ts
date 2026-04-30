import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { searchItems, searchSuggestions, type SearchItem } from "@/data/searchData";

const CACHE_PREFIX = "smart-search:";
const DEBOUNCE_MS = 350;
const MIN_LOCAL_RESULTS = 2;
const MIN_QUERY_LENGTH = 3;

function getCached(query: string): string[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + query.toLowerCase().trim());
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setCached(query: string, paths: string[]) {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + query.toLowerCase().trim(),
      JSON.stringify(paths)
    );
  } catch {
    // sessionStorage full or unavailable — ignore
  }
}

/**
 * Hybrid search hook:
 * - Returns instant local results from searchSuggestions().
 * - If local results are weak (<2), debounces and asks the AI smart-search
 *   edge function which understands symptoms/slang ("vondt i pungen" etc.).
 * - AI results are merged after local results and cached in sessionStorage.
 */
export function useSmartSearch(query: string, limit = 8) {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Always show local results immediately
    const local = searchSuggestions(query, limit);
    setResults(local);

    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setIsAiLoading(false);
      return;
    }
    if (local.length >= MIN_LOCAL_RESULTS) {
      setIsAiLoading(false);
      return;
    }

    // Cache hit?
    const cached = getCached(trimmed);
    if (cached) {
      const cachedItems = cached
        .map((p) => searchItems.find((i) => i.path === p))
        .filter((i): i is SearchItem => Boolean(i));
      const merged = mergeResults(local, cachedItems, limit);
      setResults(merged);
      setIsAiLoading(false);
      return;
    }

    // Debounced AI call
    setIsAiLoading(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase.functions.invoke("smart-search", {
          body: {
            query: trimmed,
            items: searchItems.map(({ label, path, category, keywords }) => ({
              label,
              path,
              category,
              keywords,
            })),
          },
        });

        if (controller.signal.aborted) return;
        if (error) {
          console.warn("smart-search error:", error);
          setIsAiLoading(false);
          return;
        }

        const paths: string[] = Array.isArray(data?.paths) ? data.paths : [];
        setCached(trimmed, paths);

        const aiItems = paths
          .map((p) => searchItems.find((i) => i.path === p))
          .filter((i): i is SearchItem => Boolean(i));

        setResults(mergeResults(local, aiItems, limit));
      } catch (e) {
        if (!controller.signal.aborted) {
          console.warn("smart-search exception:", e);
        }
      } finally {
        if (!controller.signal.aborted) setIsAiLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, limit]);

  return { results, isAiLoading };
}

function mergeResults(
  local: SearchItem[],
  ai: SearchItem[],
  limit: number
): SearchItem[] {
  const seen = new Set(local.map((i) => i.path));
  const merged = [...local];
  for (const item of ai) {
    if (!seen.has(item.path)) {
      seen.add(item.path);
      merged.push(item);
      if (merged.length >= limit) break;
    }
  }
  return merged;
}
