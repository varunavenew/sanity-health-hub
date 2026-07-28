/**
 * Browser GROQ fetch via the server proxy (`/api/sanity/groq`).
 * Safe to import from client components and hooks.
 */
export async function fetchSanityGroqBrowser<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch("/api/sanity/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, params }),
  });
  const payload = (await res.json().catch(() => ({}))) as {
    data?: T;
    message?: string;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(
      payload.error || payload.message || `Sanity proxy HTTP ${res.status}`,
    );
  }
  return payload.data as T;
}
