import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { heroStepForWidth, resolveHeroZoomStep } from "@/lib/media/hero-zoom-step";

/** Chromium: outerWidth stays at screen size, innerWidth = screen / zoom. */
const at = (screen: number, zoom: number, frame = 0) => ({
  outerWidth: screen + frame,
  innerWidth: Math.round(screen / zoom),
});

describe("heroStepForWidth", () => {
  it("matches the index.css breakpoints", () => {
    assert.equal(heroStepForWidth(1920), 0);
    assert.equal(heroStepForWidth(2000), 1);
    assert.equal(heroStepForWidth(2300), 2);
    assert.equal(heroStepForWidth(2650), 3);
    assert.equal(heroStepForWidth(3000), 4);
  });
});

describe("resolveHeroZoomStep", () => {
  it("keeps 100% unchanged on laptop and 1920 screens", () => {
    assert.equal(resolveHeroZoomStep(at(1440, 1)), 0);
    assert.equal(resolveHeroZoomStep(at(1920, 1, 16)), 0);
  });

  it("steps down on a 1440 laptop when zoomed out", () => {
    assert.equal(resolveHeroZoomStep(at(1440, 0.9)), 1);
    assert.equal(resolveHeroZoomStep(at(1440, 0.85)), 1);
    assert.equal(resolveHeroZoomStep(at(1440, 0.8)), 2);
    assert.equal(resolveHeroZoomStep(at(1440, 0.75)), 2);
    assert.equal(resolveHeroZoomStep(at(1440, 0.7)), 3);
    assert.equal(resolveHeroZoomStep(at(1440, 0.67)), 3);
    assert.equal(resolveHeroZoomStep(at(1440, 0.5)), 4);
  });

  it("gives a 1920 screen the same steps as the width breakpoints", () => {
    for (const zoom of [0.9, 0.8, 0.67, 0.5]) {
      const m = at(1920, zoom);
      assert.equal(resolveHeroZoomStep(m), heroStepForWidth(m.innerWidth), String(zoom));
    }
  });

  it("uses the larger step on big monitors", () => {
    assert.equal(resolveHeroZoomStep(at(2560, 1)), 2);
    assert.equal(resolveHeroZoomStep(at(2560, 0.9)), 3);
  });

  it("ignores docked devtools (reads as zoom-in)", () => {
    assert.equal(resolveHeroZoomStep({ outerWidth: 1440, innerWidth: 940 }), 0);
  });

  it("falls back to width when zoom cannot be estimated", () => {
    assert.equal(resolveHeroZoomStep({ outerWidth: 0, innerWidth: 2133 }), 1);
    assert.equal(resolveHeroZoomStep({ outerWidth: 1600, innerWidth: 1600 }), 0);
  });
});
