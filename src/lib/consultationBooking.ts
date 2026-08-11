// Bookbar konsultasjon per behandlingsside — urologi og ortopedi.
//
// Kunden krever (som på fertilitet) at «Se ledige tider og book» alltid åpner
// bookingflyten med en konkret konsultasjonstjeneste forhåndsvalgt, og at
// prisen for konsultasjonen vises i hero.
//
// Prisene er hentet fra prislistedataene på /priser (src/data/priceList.ts).
// Ingen priser er funnet på — sider uten pris i prislisten får ingen
// prisvisning.

export interface ConsultationChoice {
  /** Slug/navnfragment som forhåndsvelger tjenesten i bookingflyten. */
  tjeneste: string;
  /** Etikett vist over prisen i hero. */
  label: string;
  /** Prisvisning, f.eks. "fra 1 900 kr". */
  price: string;
}

const UROLOG: ConsultationChoice = {
  tjeneste: "konsultasjon-urolog",
  label: "Konsultasjon urolog",
  price: "fra 1 900 kr",
};

const ortoped = (part: string, slug: string): ConsultationChoice => ({
  tjeneste: `konsultasjon-ortoped-${slug}`,
  label: `Konsultasjon ortoped ${part}`,
  price: "fra 1 800 kr",
});

/** Ortopedi: kroppsregion-spesifikk konsultasjon der den finnes. */
const ORTOPEDI_BY_SUB: Record<string, ConsultationChoice> = {
  skulder: ortoped("skulder", "skulder"),
  kne: ortoped("kne", "kne"),
  hofte: ortoped("hofte", "hofte"),
  "fot-ankel": ortoped("fot/ankel", "fot-ankel"),
  "hand-albue": ortoped("hånd", "hand"),
};

const ORTOPEDI_DEFAULT: ConsultationChoice = ortoped("skulder", "skulder");

/**
 * Returnerer bookbar konsultasjon + prisvisning for en underside.
 * Returnerer null for kategorier vi ikke har definert konsultasjon for.
 */
export function getConsultationBooking(
  categoryId: string,
  subId: string,
): ConsultationChoice | null {
  if (categoryId === "urologi") return UROLOG;
  if (categoryId === "ortopedi") return ORTOPEDI_BY_SUB[subId] ?? ORTOPEDI_DEFAULT;
  return null;
}
