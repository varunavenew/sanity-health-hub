import { NextResponse } from "next/server";
import { sanityClient, SANITY_DATASET, SANITY_PROJECT_ID } from "@/lib/sanityClient";

/**
 * Development helper: confirms which Sanity project/dataset the Next server uses
 * and how many `googleReview` / `homepage` documents exist (public read).
 * GET /api/sanity/health — disabled in production.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const [googleReviewCount, googleReviewSettingsCount, homepageCount] = await Promise.all([
      sanityClient.fetch<number>(`count(*[_type == "googleReview"])`),
      sanityClient.fetch<number>(`count(*[_type == "googleReviewSettings"])`),
      sanityClient.fetch<number>(`count(*[_type == "homepage"])`),
    ]);

    return NextResponse.json({
      ok: true,
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
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
