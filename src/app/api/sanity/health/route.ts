import { NextResponse } from "next/server";
import { sanityClient, SANITY_DATASET, SANITY_PROJECT_ID } from "@/lib/sanityClient";

/**
 * Confirms which Sanity project/dataset this Next deployment reads.
 *
 * Production: returns only projectId + dataset (no document counts).
 * Development: also returns sample document counts for local debugging.
 *
 * GET /api/sanity/health
 */
export async function GET() {
  const base = {
    ok: true as const,
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    useCdn: false,
    apiVersion: "2024-01-01",
  };

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(base);
  }

  try {
    const [googleReviewCount, googleReviewSettingsCount, homepageCount] =
      await Promise.all([
        sanityClient.fetch<number>(`count(*[_type == "googleReview"])`),
        sanityClient.fetch<number>(`count(*[_type == "googleReviewSettings"])`),
        sanityClient.fetch<number>(`count(*[_type == "homepage"])`),
      ]);

    return NextResponse.json({
      ...base,
      counts: {
        googleReview: googleReviewCount,
        googleReviewSettings: googleReviewSettingsCount,
        homepage: homepageCount,
      },
      hint:
        googleReviewCount === 0
          ? "No googleReview documents in this dataset — the homepage uses static review fallbacks until you add some in Studio."
          : undefined,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        ok: false,
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
        error: message,
        hint: "Check NEXT_PUBLIC_SANITY_* or SANITY_PROJECT_ID / SANITY_DATASET in .env (mirrored via next.config).",
      },
      { status: 502 },
    );
  }
}
