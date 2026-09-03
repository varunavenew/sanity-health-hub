/** Demo parity — «Flere tjenester» grid on /tjenester (row-major, 3 columns). */
export type MoreServicesListItem = {
  titleNo: string;
  titleEn: string;
  slug: string;
};

export const FLERE_TJENESTER_MORE_SERVICES: MoreServicesListItem[] = [
  { titleNo: "Endokrinologi", titleEn: "Endocrinology", slug: "endokrinologi" },
  { titleNo: "Ernæringsfysiolog", titleEn: "Clinical nutritionist", slug: "ernaringsfysiolog" },
  { titleNo: "Hudhelse", titleEn: "Skin health", slug: "hudhelse" },
  {
    titleNo: "Mage- og tarmlidelser (Gastrokirurgi)",
    titleEn: "Stomach and intestinal conditions (GI surgery)",
    slug: "gastrokirurgi",
  },
  { titleNo: "Osteopati", titleEn: "Osteopathy", slug: "osteopati" },
  { titleNo: "Plastikkirurgi", titleEn: "Plastic surgery", slug: "plastikkirurgi" },
  { titleNo: "Psykologi", titleEn: "Psychology", slug: "psykologi" },
  { titleNo: "Revmatologi", titleEn: "Rheumatology", slug: "revmatologi" },
  { titleNo: "Robotassistert kirurgi", titleEn: "Robot-assisted surgery", slug: "robotkirurgi" },
  { titleNo: "Sexologi", titleEn: "Sexology", slug: "sexologi" },
  { titleNo: "Åreknutebehandling", titleEn: "Varicose vein treatment", slug: "areknuter" },
];

export function resolveFlereTjenesterMoreServices(
  lang: "no" | "en",
): { title: string; path: string }[] {
  const segment = lang === "en" ? "other" : "ovrige";
  return FLERE_TJENESTER_MORE_SERVICES.map((item) => ({
    title: lang === "en" ? item.titleEn : item.titleNo,
    path: `/${segment}/${item.slug}`,
  }));
}
