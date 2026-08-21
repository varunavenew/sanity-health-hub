/**
 * Gold Stars review slider — React port of the self-contained embed block.
 * Widget IDs are fixed in Gold Stars admin; no Sanity/CMS fields required.
 * Reviews load live from the platform. Works on any domain (staging or production).
 *
 * Local dev note: widgets require HTTPS. On http://localhost you may see
 * "EMR: Failed to load widget settings — Network Error". Test on https staging
 * (e.g. https://avenewdemo.online) where both widgets are verified.
 */
export const DEFAULT_GOLD_STARS_WIDGET_ID = "6137cba4-0791-45ec-9cab-6ea667442f9a";
export const GOLD_STARS_SLIDER_MAX_CARDS = 14;
export const GOLD_STARS_SLIDER_SPEED_PX_S = 50;
export const GOLD_STARS_SLIDER_MAX_LINES = 5;
