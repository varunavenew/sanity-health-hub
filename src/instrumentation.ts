export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { logSanityConfiguration } = await import("@/lib/sanity/dataset-env");
  logSanityConfiguration("Next.js");
}
