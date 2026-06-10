import type { SanityClient } from "@sanity/client";

/** Page / listing document types that own a main-menu navId. */
export const PAGE_TYPE_TO_NAV_ID: Record<string, string> = {
  servicesPage: "services",
  pricingPage: "pricing",
  insurancePage: "insurance",
  newsPage: "news",
  aboutPage: "about",
  clinicsPage: "clinics",
  contactPage: "contact",
  specialistsListingPage: "specialists",
};

export type SlugPair = { slugNb: string; slugEn: string };

type I18nStringItem = {
  _type: "internationalizedArrayStringValue";
  _key: string;
  language: string;
  value: string;
};

type NavItem = {
  _key?: string;
  navId?: string;
  path?: I18nStringItem[] | string;
  label?: unknown;
  isServicesDropdown?: boolean;
};

const SITE_SETTINGS_ID = "siteSettings";

function normalizeSlug(slug: string | undefined): string {
  return (slug || "").replace(/^\/+|\/+$/g, "");
}

function toPath(slug: string): string {
  const normalized = normalizeSlug(slug);
  return normalized ? `/${normalized}` : "/";
}

/** Read NO/EN slugs from internationalizedArraySlug (or legacy slug). */
export function slugPairFromPageDoc(doc: Record<string, unknown>): SlugPair | null {
  const slug = doc.slug;
  if (!slug) return null;

  if (Array.isArray(slug)) {
    const read = (lang: "no" | "en") => {
      const entry = slug.find(
        (row) =>
          row &&
          typeof row === "object" &&
          ((row as { language?: string }).language === lang ||
            (row as { _key?: string })._key === lang),
      ) as { value?: { current?: string } } | undefined;
      return normalizeSlug(entry?.value?.current);
    };
    const slugNb = read("no");
    const slugEn = read("en");
    if (!slugNb && !slugEn) return null;
    return { slugNb: slugNb || slugEn, slugEn: slugEn || slugNb };
  }

  if (typeof slug === "object" && slug !== null && "current" in slug) {
    const legacy = normalizeSlug((slug as { current?: string }).current);
    if (!legacy) return null;
    return { slugNb: legacy, slugEn: legacy };
  }

  return null;
}

export function buildI18nNavPath(pair: SlugPair): I18nStringItem[] {
  return [
    {
      _type: "internationalizedArrayStringValue",
      _key: "no",
      language: "no",
      value: toPath(pair.slugNb),
    },
    {
      _type: "internationalizedArrayStringValue",
      _key: "en",
      language: "en",
      value: toPath(pair.slugEn),
    },
  ];
}

function pathsEqual(
  existing: NavItem["path"],
  next: I18nStringItem[],
): boolean {
  if (!Array.isArray(existing)) return false;
  const read = (lang: string) =>
    existing.find(
      (row) => row.language === lang || row._key === lang,
    )?.value;
  return read("no") === next[0].value && read("en") === next[1].value;
}

function updateNavItems(
  items: NavItem[] | undefined,
  navId: string,
  path: I18nStringItem[],
): { items: NavItem[]; changed: boolean } {
  if (!items?.length) return { items: items ?? [], changed: false };

  let changed = false;
  const next = items.map((item) => {
    if (item.navId !== navId) return item;
    if (pathsEqual(item.path, path)) return item;
    changed = true;
    return { ...item, path };
  });

  return { items: next, changed };
}

export type NavPathSyncResult = {
  updated: boolean;
  navId?: string;
  path?: I18nStringItem[];
};

/**
 * After a CMS page is published, mirror its slug into Site Settings nav paths
 * for every menu/footer item with the matching navId.
 */
export async function syncSiteSettingsNavPaths(
  client: SanityClient,
  doc: Record<string, unknown>,
): Promise<NavPathSyncResult> {
  const pageType = doc._type;
  if (typeof pageType !== "string") return { updated: false };

  const navId = PAGE_TYPE_TO_NAV_ID[pageType];
  if (!navId) return { updated: false };

  const pair = slugPairFromPageDoc(doc);
  if (!pair) return { updated: false };

  const path = buildI18nNavPath(pair);

  const settings = await client.fetch<{
    mainNavigation?: NavItem[];
    footerAboutLinks?: NavItem[];
  }>(`*[_id == $id][0]{ mainNavigation, footerAboutLinks }`, {
    id: SITE_SETTINGS_ID,
  });

  if (!settings) return { updated: false };

  const main = updateNavItems(settings.mainNavigation, navId, path);
  const footer = updateNavItems(settings.footerAboutLinks, navId, path);

  if (!main.changed && !footer.changed) {
    return { updated: false, navId, path };
  }

  await client
    .patch(SITE_SETTINGS_ID)
    .set({
      ...(main.changed ? { mainNavigation: main.items } : {}),
      ...(footer.changed ? { footerAboutLinks: footer.items } : {}),
    })
    .commit();

  return { updated: true, navId, path };
}
