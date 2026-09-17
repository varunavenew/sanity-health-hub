/**
 * DISABLED 16 Sep 2026 — tickets #386 / #315.
 *
 * This script copied `treatment-flere-fagomrader-hudhelse` heroImage +
 * heroMedia onto nine hud child pages (and behandlingsutstyr). After the
 * first run every target's filename became `flere-hudhelse.jpg`, so the
 * "skip unique files" guard never fired on re-run. Unique hud heroes then
 * reverted whenever this ran again (production 4 Sep 11:59).
 *
 * Do not re-enable the hud copy list. Unique heroes are set by
 * `patch-hud-hero-images.ts`.
 */
import { DATASET, PROJECT_ID } from "./config";

async function main() {
  if (PROJECT_ID !== "9jhqpk3a" || DATASET !== "developer") {
    throw new Error("Developer dataset only");
  }

  throw new Error(
    "DISABLED (#386 / #315): do not copy hudhelse heroes onto child treatments. Use test/sanity/patch-hud-hero-images.ts to set unique hud heroes.",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
