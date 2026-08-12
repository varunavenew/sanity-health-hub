/**
 * Single source of truth for the site-wide hero trust tags.
 * Always use these constants — never hardcode variants like
 * "Korte ventetider" or "Uten henvisning".
 */
export const TRUST_SHORT_WAIT = "Kort ventetid";
export const TRUST_NO_REFERRAL = "Ingen henvisning";

/** Standard trust tag pair, in canonical order. */
export const TRUST_TAGS: readonly string[] = [TRUST_NO_REFERRAL, TRUST_SHORT_WAIT];

/** Canonical subtitle used in hero eyebrows. */
export const TRUST_SUBTITLE = `${TRUST_SHORT_WAIT} • ${TRUST_NO_REFERRAL}`;
