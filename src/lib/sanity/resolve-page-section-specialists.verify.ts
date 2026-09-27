/**
 * Run: npx tsx src/lib/sanity/resolve-page-section-specialists.verify.ts
 */
import { resolvePageSectionSpecialists } from "./resolve-page-section-specialists";
import type { Specialist } from "./specialist-types";

function spec(name: string, category: Specialist["category"], slug = name.toLowerCase()): Specialist {
  return {
    name,
    title: "Role",
    expertise: [{ label: "Tag" }],
    image: "https://example.com/x.jpg",
    category,
    slug,
    sanityCategories: [{ categoryId: category, slug: category, title: category }],
  };
}

function assert(cond: unknown, message: string) {
  if (!cond) throw new Error(message);
}

const a = spec("Ashi", "gynekologi", "ashi-ahmad");
const b = spec("Birgir", "annet", "birgir-gudbrandsson");
const c = spec("Madeleine", "gynekologi", "madeleine-engen");
const d = spec("Andreas", "annet", "andreas-edenberg");
const all = [d, a, c, b];

// 1. Manual add/remove
const manual = resolvePageSectionSpecialists({
  displayMode: "manual",
  explicit: [a, b],
  allSpecialists: all,
});
assert(manual.visible.map((s) => s.slug).join() === "ashi-ahmad,birgir-gudbrandsson", "manual list");

// 2. Category matches
const category = resolvePageSectionSpecialists({
  displayMode: "category",
  explicit: [],
  allSpecialists: all,
  categoryKey: "gynekologi",
});
assert(
  category.visible.map((s) => s.slug).join() === "ashi-ahmad,madeleine-engen",
  "category name order",
);

// 3. Out-of-category extra
const extra = resolvePageSectionSpecialists({
  displayMode: "category",
  includeExplicitInCategory: true,
  explicit: [b],
  allSpecialists: all,
  categoryKey: "gynekologi",
});
assert(extra.visible.some((s) => s.slug === "birgir-gudbrandsson"), "extra appears");
assert(extra.visible.some((s) => s.slug === "ashi-ahmad"), "category members remain");
assert(
  extra.rows.find((r) => r.specialist.slug === "birgir-gudbrandsson")?.source === "individual",
  "extra labeled individual",
);

// 4. Dedup both
const both = resolvePageSectionSpecialists({
  displayMode: "category",
  includeExplicitInCategory: true,
  explicit: [a],
  allSpecialists: all,
  categoryKey: "gynekologi",
});
assert(both.visible.filter((s) => s.slug === "ashi-ahmad").length === 1, "dedup");
assert(both.rows.find((r) => r.specialist.slug === "ashi-ahmad")?.source === "both", "both label");

// 5. All + limit + extra
const allLimited = resolvePageSectionSpecialists({
  displayMode: "all",
  explicit: [b],
  allSpecialists: all,
  limit: 2,
});
assert(allLimited.visible.some((s) => s.slug === "birgir-gudbrandsson"), "all extra reserved");
assert(
  allLimited.visible.length === 2,
  `all limit: 1 reserved explicit + 1 base (got ${allLimited.visible.map((s) => s.slug)})`,
);
assert(allLimited.visible.some((s) => s.slug === "andreas-edenberg"), "first all-list specialist kept");
assert(allLimited.truncatedBaseCount > 0, "base truncated");

// 6. Extra exceeds limit
const overflow = resolvePageSectionSpecialists({
  displayMode: "all",
  explicit: [a, b, c],
  allSpecialists: all,
  limit: 2,
});
assert(overflow.visible.length === 3, "extras never dropped");
assert(overflow.extrasExceedLimit, "warning flag");
assert(overflow.visible.every((s) => ["ashi-ahmad", "birgir-gudbrandsson", "madeleine-engen"].includes(s.slug)), "only extras");

// 7. Manual → category keeps explicit
const afterMode = resolvePageSectionSpecialists({
  displayMode: "category",
  includeExplicitInCategory: true,
  explicit: [b],
  allSpecialists: all,
  categoryKey: "gynekologi",
});
assert(afterMode.visible.some((s) => s.slug === "birgir-gudbrandsson"), "explicit retained after mode change");

// 8. Category → manual drops derived
const toManual = resolvePageSectionSpecialists({
  displayMode: "manual",
  explicit: [b],
  allSpecialists: all,
  categoryKey: "gynekologi",
});
assert(toManual.visible.map((s) => s.slug).join() === "birgir-gudbrandsson", "manual drops category-only");

// 9. Missing displayMode
const empty = resolvePageSectionSpecialists({
  displayMode: undefined,
  explicit: [a],
  allSpecialists: all,
});
assert(empty.visible.length === 0, "unconfigured band");

// 10. Hidden from this page removes a category match
const hidden = resolvePageSectionSpecialists({
  displayMode: "category",
  explicit: [],
  allSpecialists: all,
  categoryKey: "gynekologi",
  excluded: [{ slug: "ashi-ahmad" }],
});
assert(hidden.visible.map((s) => s.slug).join() === "madeleine-engen", "excluded category match");
assert(hidden.excluded.map((s) => s.slug).join() === "ashi-ahmad", "excluded reported");

// 11. Individual selection wins over Hidden from this page
const explicitWins = resolvePageSectionSpecialists({
  displayMode: "all",
  explicit: [a],
  allSpecialists: all,
  excluded: [{ slug: "ashi-ahmad" }, { slug: "andreas-edenberg" }],
});
assert(explicitWins.visible.some((s) => s.slug === "ashi-ahmad"), "explicit beats exclusion");
assert(!explicitWins.visible.some((s) => s.slug === "andreas-edenberg"), "all mode exclusion");

// 12. Filter by category with the switch off ignores individual picks
const switchOff = resolvePageSectionSpecialists({
  displayMode: "category",
  explicit: [b],
  allSpecialists: all,
  categoryKey: "gynekologi",
});
assert(
  switchOff.visible.map((s) => s.slug).join() === "ashi-ahmad,madeleine-engen",
  "category ignores individual picks when switch is off",
);

console.log("resolve-page-section-specialists: all checks passed");
