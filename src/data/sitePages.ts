import { articles } from "./articles";
import { specialists } from "./specialists";
import { clinics } from "./clinicServices";

export interface SitePage {
  path: string;
  name: string;
  category: string;
}

export const sitePages: SitePage[] = [
  // Hovedsider
  { path: "/", name: "Forside", category: "Hovedsider" },
  { path: "/om-oss", name: "Om oss", category: "Hovedsider" },
  { path: "/kontakt", name: "Kontakt", category: "Hovedsider" },
  { path: "/klinikker", name: "Klinikker", category: "Hovedsider" },
  { path: "/tjenester", name: "Tjenester (oversikt)", category: "Hovedsider" },
  { path: "/priser", name: "Priser", category: "Hovedsider" },
  { path: "/forsikring", name: "Forsikring", category: "Hovedsider" },
  { path: "/karriere", name: "Karriere", category: "Hovedsider" },
  { path: "/aktuelt", name: "Aktuelt", category: "Hovedsider" },
  { path: "/spesialister", name: "Spesialister (oversikt)", category: "Hovedsider" },
  { path: "/personvern", name: "Personvern", category: "Hovedsider" },
  { path: "/booking", name: "Booking", category: "Hovedsider" },

  // Fagområder
  { path: "/gynekologi", name: "Gynekologi", category: "Fagområder" },
  { path: "/fertilitet", name: "Fertilitet", category: "Fagområder" },
  { path: "/urologi", name: "Urologi", category: "Fagområder" },
  { path: "/ortopedi", name: "Ortopedi", category: "Fagområder" },
  { path: "/graviditet", name: "Graviditet", category: "Fagområder" },
  { path: "/flere-fagomrader", name: "Flere tjenester", category: "Fagområder" },

  // Tema
  { path: "/kvinnehelse", name: "Kvinnehelse", category: "Tema" },
  { path: "/behandlinger/gynekologi/tverrfaglig", name: "Tverrfaglige team", category: "Tema" },
  { path: "/robotassistert-kirurgi", name: "Robotassistert kirurgi", category: "Tema" },
  { path: "/fastlegeveiledning-overgangsalder", name: "Fastlegeveiledning – overgangsalder", category: "Tema" },

  // Gynekologi underbehandlinger
  { path: "/behandlinger/gynekologi/undersokelse", name: "Gynekologisk undersøkelse", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/urinlekkasje", name: "Urinlekkasje", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/endometriose", name: "Endometriose", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/overgangsalder", name: "Overgangsalder", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/vaginale-fremfall", name: "Vaginale fremfall", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/blodningsforstyrrelser", name: "Blødningsforstyrrelser", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/celleforandringer", name: "Celleforandringer", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/cyster", name: "Cyster på eggstokkene", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/fjerne-livmor", name: "Fjerne livmor", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/graviditet", name: "Graviditet (gyn)", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/kirurgi", name: "Gynekologisk kirurgi", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/hormonforstyrrelser", name: "Hormonforstyrrelser", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/hysteroskopi", name: "Hysteroskopi", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/labiaplastikk", name: "Labiaplastikk", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/robotkirurgi", name: "Robotkirurgi (gyn)", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/spontanabort", name: "Spontanabort", category: "Gynekologi – underbehandlinger" },
  { path: "/behandlinger/gynekologi/vulvalidelser", name: "Vulvalidelser", category: "Gynekologi – underbehandlinger" },

  // Fertilitet underbehandlinger
  { path: "/behandlinger/fertilitet/infertilitet", name: "Infertilitet", category: "Fertilitet – underbehandlinger" },
  { path: "/behandlinger/fertilitet/assistert-befruktning", name: "Assistert befruktning", category: "Fertilitet – underbehandlinger" },
  { path: "/behandlinger/fertilitet/eggfrys", name: "Nedfrysning av egg", category: "Fertilitet – underbehandlinger" },
  { path: "/behandlinger/fertilitet/donorbehandling", name: "Donorbehandling", category: "Fertilitet – underbehandlinger" },
  { path: "/behandlinger/fertilitet/saedanalyse", name: "Sædanalyse", category: "Fertilitet – underbehandlinger" },
  { path: "/behandlinger/fertilitet/hysteroskopi", name: "Hysteroskopi", category: "Fertilitet – underbehandlinger" },

  // Urologi underbehandlinger
  { path: "/behandlinger/urologi/blaere", name: "Blære og urinveier", category: "Urologi – underbehandlinger" },
  { path: "/behandlinger/urologi/forhud", name: "Forhud", category: "Urologi – underbehandlinger" },
  { path: "/behandlinger/urologi/infertilitet", name: "Mannlig infertilitet", category: "Urologi – underbehandlinger" },
  { path: "/behandlinger/urologi/nyrer", name: "Nyrer", category: "Urologi – underbehandlinger" },
  { path: "/behandlinger/urologi/prostata", name: "Prostata", category: "Urologi – underbehandlinger" },
  { path: "/behandlinger/urologi/refertilisering", name: "Refertilisering", category: "Urologi – underbehandlinger" },
  { path: "/behandlinger/urologi/robotkirurgi", name: "Robotkirurgi (uro)", category: "Urologi – underbehandlinger" },
  { path: "/behandlinger/urologi/sterilisering", name: "Sterilisering", category: "Urologi – underbehandlinger" },
  { path: "/behandlinger/urologi/testikler", name: "Testikler og pung", category: "Urologi – underbehandlinger" },

  // Ortopedi underbehandlinger
  { path: "/behandlinger/ortopedi/fot-ankel", name: "Fot og ankel", category: "Ortopedi – underbehandlinger" },
  { path: "/behandlinger/ortopedi/hofte", name: "Hofte", category: "Ortopedi – underbehandlinger" },
  { path: "/behandlinger/ortopedi/hand-albue", name: "Hånd og albue", category: "Ortopedi – underbehandlinger" },
  { path: "/behandlinger/ortopedi/kne", name: "Kne", category: "Ortopedi – underbehandlinger" },
  { path: "/behandlinger/ortopedi/skulder", name: "Skulder", category: "Ortopedi – underbehandlinger" },

  // Flere fagområder
  { path: "/behandlinger/flere-fagomrader/endokrinologi", name: "Endokrinologi", category: "Flere – underbehandlinger" },
  
  { path: "/behandlinger/flere-fagomrader/hudhelse", name: "Hudhelse", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/ernaringsfysiolog", name: "Ernæringsfysiolog", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/gastrokirurgi", name: "Gastrokirurgi", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/osteopati", name: "Osteopati", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi", name: "Overvektskirurgi", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/gastrokirurgi/brokkoperasjon", name: "Brokkoperasjon", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager", name: "Hemorroider og endetarmsplager", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/plastikkirurgi", name: "Plastikkirurgi", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/psykologi", name: "Psykologi", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/revmatologi", name: "Revmatologi", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/robotkirurgi", name: "Robotkirurgi (flere)", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/sexologi", name: "Sexologi", category: "Flere – underbehandlinger" },
  { path: "/behandlinger/flere-fagomrader/areknuter", name: "Åreknutebehandling", category: "Flere – underbehandlinger" },
];
