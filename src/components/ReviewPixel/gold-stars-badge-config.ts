/**
 * Gold Stars rating badge (hero) — React port of the self-contained embed block.
 * Widget IDs are fixed in Gold Stars admin; no Sanity/CMS fields required.
 * Reviews load live from the platform. Works on any domain (staging or production).
 *
 * Local dev note: widgets require HTTPS. On http://localhost you may see
 * "EMR: Failed to load widget settings — Network Error". Test on https staging
 * (e.g. https://avenewdemo.online) where both widgets are verified.
 */
export const DEFAULT_GOLD_STARS_BADGE_WIDGET_ID = "45aa8e9e-3c4b-4d42-961b-338b9d45244e";