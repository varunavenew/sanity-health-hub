import { getIcon, type IconName } from "@/lib/icons";

/**
 * Icon proposal preview for client review.
 * - "lucide" = current production icon
 * - "custom" = proposed CMedical replacement (key with -cm suffix, or unique speciality icon)
 *
 * Pairs without a Lucide equivalent (e.g. "gynecology") show only the custom icon.
 */

type Pair = {
  label: string;        // Norwegian label
  usage?: string;       // Where it's used on the site
  lucide?: IconName;    // current Lucide key
  custom: IconName;     // proposed custom key
};

type Group = {
  title: string;
  intro?: string;
  pairs: Pair[];
};

const GROUPS: Group[] = [
  {
    title: "1 — Medisinske spesialiteter (ny — finnes ikke i Lucide)",
    intro:
      "Helt nye, CMedical-spesifikke ikoner som gir merket et eget særpreg. Brukes i meny, kategorisider, FAQ og treatment-lister.",
    pairs: [
      { label: "Gynekologi", usage: "Tjenester, meny, kategorier", custom: "gynecology" },
      { label: "Fertilitet", usage: "Tjenester, kategorier", custom: "fertility" },
      { label: "Robotassistert kirurgi", usage: "Robotkirurgi-side, treatments", custom: "robot-surgery" },
      { label: "Urologi", usage: "Tjenester, kategorier", custom: "urology" },
      { label: "Graviditet", usage: "Kvinnehelse, treatment-sider", custom: "pregnancy" },
      { label: "Overgangsalder / menopause", usage: "Fastlegeveiledning, kvinnehelse", custom: "menopause" },
      { label: "Ultralyd", usage: "Behandlingssider, prisliste", custom: "ultrasound" },
      { label: "Konsultasjon", usage: "Booking, behandlingsflyt", custom: "consultation" },
      { label: "Fastlege", usage: "Forsikring, henvisning", custom: "gp-doctor" },
      { label: "Forsikring (skjold)", usage: "Forsikrings-side, badges", custom: "insurance-shield" },
      { label: "Privatklinikk", usage: "Klinikk-sider, footer", custom: "private-clinic" },
      { label: "Behandlingsplan", usage: "Pasientreise, info-blokker", custom: "treatment-plan" },
      { label: "Før / etter", usage: "BeforeAfter-seksjon", custom: "before-after" },
      { label: "Konfidensielt / trygt", usage: "Personvern, tillit-blokker", custom: "confidential" },
    ],
  },
  {
    title: "2 — Navigasjon og knapper",
    intro: "Brukes i CTA-knapper, lister, meny, breadcrumbs, accordion, paginering.",
    pairs: [
      { label: "Pil høyre", usage: "Alle 'Les mer' / CTA-lenker", lucide: "arrow-right", custom: "arrow-right-cm" },
      { label: "Pil venstre", usage: "Tilbake-knapper", lucide: "arrow-left", custom: "arrow-left-cm" },
      { label: "Pil opp-høyre", usage: "Eksterne lenker, design-hub", lucide: "arrow-up-right", custom: "arrow-up-right-cm" },
      { label: "Chevron høyre", usage: "Breadcrumbs, services-dropdown", lucide: "chevron-right", custom: "chevron-right-cm" },
      { label: "Chevron venstre", usage: "Carousel, paginering", lucide: "chevron-left", custom: "chevron-left-cm" },
      { label: "Chevron ned", usage: "Accordion, dropdown", lucide: "chevron-down", custom: "chevron-down-cm" },
      { label: "Chevron opp", usage: "Accordion åpen", lucide: "chevron-up", custom: "chevron-up-cm" },
      { label: "Pluss", usage: "FAQ lukket, legg til", lucide: "plus", custom: "plus-cm" },
      { label: "Minus", usage: "FAQ åpen, fjern", lucide: "minus", custom: "minus-cm" },
      { label: "Sjekk", usage: "Lister, valgt tilstand", lucide: "check", custom: "check-cm" },
      { label: "Sjekk i sirkel", usage: "Trust-blokker, fordeler", lucide: "check-circle", custom: "check-circle-cm" },
      { label: "Lukk (X)", usage: "Modal, drawer, popup", lucide: "x", custom: "x-cm" },
      { label: "Søk", usage: "Header, command, søkefelt", lucide: "search", custom: "search-cm" },
      { label: "Hjelp", usage: "Tooltip, FAQ", lucide: "help-circle", custom: "help-circle-cm" },
      { label: "Meny (burger)", usage: "Mobil-meny", custom: "menu-cm" },
      { label: "Ekstern lenke", usage: "Lenker til andre nettsider", lucide: "external-link", custom: "external-link-cm" },
      { label: "Mer (3 prikker)", usage: "Sekundær meny", lucide: "more-horizontal", custom: "more-horizontal-cm" },
    ],
  },
  {
    title: "3 — Kontakt og lokasjon",
    intro: "Header, footer, klinikk-kort, kontaktside, spesialist-profil.",
    pairs: [
      { label: "Telefon", usage: "Header, footer, kontakt", custom: "phone-cm", lucide: "phone" },
      { label: "E-post", usage: "Footer, newsletter, kontakt", lucide: "mail", custom: "mail-cm" },
      { label: "Adresse / kart", usage: "Klinikker, footer, spesialist", lucide: "map-pin", custom: "map-pin-cm" },
      { label: "Åpningstider", usage: "Klinikk-side", lucide: "clock", custom: "clock-cm" },
      { label: "Kalender / booking", usage: "Sticky CTA, booking, spesialist", lucide: "calendar", custom: "calendar-cm" },
      { label: "Bygg / klinikk", usage: "Klinikk-grid, value badges", lucide: "building", custom: "building-cm" },
      { label: "Tog", usage: "Kollektiv-info klinikk", lucide: "train", custom: "train-cm" },
      { label: "Bil / parkering", usage: "Klinikk-info", lucide: "car", custom: "car-cm" },
    ],
  },
  {
    title: "4 — Mennesker og omsorg",
    intro: "Spesialist-presentasjon, om-oss, stats, testimonials.",
    pairs: [
      { label: "Person", usage: "Profil, anonym bruker", lucide: "user", custom: "user-cm" },
      { label: "Personer (team)", usage: "Stats, om-oss, WhyCMedical", lucide: "users", custom: "users-cm" },
      { label: "Verifisert person", usage: "Spesialist-godkjenning", lucide: "user-check", custom: "user-check-cm" },
      { label: "Baby", usage: "Fertilitet, graviditet", lucide: "baby", custom: "baby-cm" },
      { label: "Hjerte", usage: "Favoritt, omsorg", lucide: "heart", custom: "heart-cm" },
      { label: "Hånd-hjerte", usage: "Verdier, omsorg", lucide: "hand-heart", custom: "hand-heart-cm" },
    ],
  },
  {
    title: "5 — Helse og medisin",
    intro: "Behandlingssider, kategorier, prisliste, fagområder.",
    pairs: [
      { label: "Hjerte-puls", usage: "Helse, vitale tegn", lucide: "heart-pulse", custom: "heart-pulse-cm" },
      { label: "Stetoskop", usage: "Konsultasjon, generell helse", lucide: "stethoscope", custom: "stethoscope-cm" },
      { label: "Mikroskop", usage: "Lab, diagnose", lucide: "microscope", custom: "microscope-cm" },
      { label: "Pille / medisin", usage: "Behandling, resept", lucide: "pill", custom: "pill-cm" },
      { label: "Sprøyte / injeksjon", usage: "Vaksine, behandling", lucide: "syringe", custom: "syringe-cm" },
      { label: "Aktivitet", usage: "Helse, livsstil", lucide: "activity", custom: "activity-cm" },
      { label: "Skann", usage: "MR, røntgen, FaceScan", lucide: "scan", custom: "scan-cm" },
      { label: "Journal / clipboard", usage: "Pasientjournal, sjekkliste", lucide: "clipboard", custom: "clipboard-cm" },
      { label: "Skjelett / ortopedi", usage: "Ortopedi-kategori", lucide: "bone", custom: "bone-cm" },
      { label: "Hjerne / nevrologi", usage: "Nevro-relatert", lucide: "brain", custom: "brain-cm" },
      { label: "Saks / kirurgi", usage: "Kirurgi-tjenester", lucide: "scissors", custom: "scissors-cm" },
      { label: "Termometer", usage: "Symptomer, feber", lucide: "thermometer", custom: "thermometer-cm" },
      { label: "Smil / trivsel", usage: "Pasienterfaring", lucide: "smile", custom: "smile-cm" },
      { label: "Tilgjengelighet", usage: "Universell utforming", lucide: "accessibility", custom: "accessibility-cm" },
    ],
  },
  {
    title: "6 — Tillit og dokumenter",
    intro: "Trust-blokker, sertifiseringer, FAQ, artikler, personvern.",
    pairs: [
      { label: "Skjold", usage: "Trygghet, sikkerhet", lucide: "shield", custom: "shield-cm" },
      { label: "Skjold med sjekk", usage: "Garantier, ValueBadges", lucide: "shield-check", custom: "shield-check-cm" },
      { label: "Pris / utmerkelse", usage: "Awards, sertifiseringer", lucide: "award", custom: "award-cm" },
      { label: "Stjerne", usage: "Reviews, rating", lucide: "star", custom: "star-cm" },
      { label: "Info", usage: "Hjelpetekst, varsler", lucide: "info", custom: "info-cm" },
      { label: "Glitter / premium", usage: "Premium-banner, sesong", lucide: "sparkles", custom: "sparkles-cm" },
      { label: "Sitat", usage: "Testimonials, reviews", lucide: "quote", custom: "quote-cm" },
      { label: "Dokument", usage: "Artikler, rapporter, henvisning", lucide: "file-text", custom: "file-text-cm" },
      { label: "Godkjent dokument", usage: "Sertifikater, godkjenning", lucide: "file-check", custom: "file-check-cm" },
      { label: "Bok / guide", usage: "Guide-side, ressurser", lucide: "book-open", custom: "book-open-cm" },
      { label: "Vekt / juridisk", usage: "Personvern, vilkår", lucide: "scale", custom: "scale-cm" },
      { label: "Lås / privat", usage: "Personvern, login", lucide: "lock", custom: "lock-cm" },
    ],
  },
  {
    title: "7 — Pris, handel og pakker",
    intro: "Prisliste, produkter, pakker, betaling.",
    pairs: [
      { label: "Mynt / pris", usage: "Pris-badges, ValueBadges", lucide: "coins", custom: "coins-cm" },
      { label: "Kredittkort / betaling", usage: "Betaling, kassen", lucide: "credit-card", custom: "credit-card-cm" },
      { label: "Pris-tag", usage: "Tilbud, kampanjer", lucide: "tag", custom: "tag-cm" },
      { label: "Handlepose", usage: "Produkter, kassen", lucide: "shopping-bag", custom: "shopping-bag-cm" },
      { label: "Pakke / bundle", usage: "BundlePackages", lucide: "package", custom: "package-cm" },
      { label: "Lommebok", usage: "Betaling, refusjon", lucide: "wallet", custom: "wallet-cm" },
      { label: "Timer / tilbud", usage: "Sale-seksjon, kampanje", lucide: "timer", custom: "timer-cm" },
      { label: "Trend opp", usage: "Mest sett, populært", lucide: "trending-up", custom: "trending-up-cm" },
    ],
  },
  {
    title: "8 — Karriere",
    intro: "Karriere-side, jobbannonser, om-oss.",
    pairs: [
      { label: "Utdanning / kvalifikasjon", usage: "Spesialist-CV, expertise", lucide: "graduation-cap", custom: "graduation-cap-cm" },
      { label: "Stilling / jobb", usage: "Karriere, jobbannonse", lucide: "briefcase", custom: "briefcase-cm" },
    ],
  },
  {
    title: "9 — Media og chat",
    intro: "Hero-bilder, video-spiller, chat, IDA-assistent, Instagram.",
    pairs: [
      { label: "Kamera", usage: "FaceScan, IDA Guide", lucide: "camera", custom: "camera-cm" },
      { label: "Video", usage: "Video-seksjoner", lucide: "video", custom: "video-cm" },
      { label: "Play", usage: "VideoPlayer, VisualStorytelling", lucide: "play", custom: "play-cm" },
      { label: "Send", usage: "HeroChat, kontaktskjema", lucide: "send", custom: "send-cm" },
      { label: "Chat-melding", usage: "ChatBubble, support", lucide: "message-circle", custom: "message-cm" },
      { label: "Bot / IDA", usage: "ChatBubble, IDA-assistent", lucide: "bot", custom: "bot-cm" },
      { label: "Mikrofon", usage: "Voice input", lucide: "mic", custom: "mic-cm" },
      { label: "Globus / språk", usage: "LanguageSelector", lucide: "globe", custom: "globe-cm" },
      { label: "Innstillinger", usage: "Bruker-innstillinger", lucide: "settings", custom: "settings-cm" },
      { label: "Loader", usage: "Lasting", lucide: "loader", custom: "loader-cm" },
      { label: "Lyn / rask", usage: "Hurtighet, energi", lucide: "zap", custom: "zap-cm" },
    ],
  },
  {
    title: "10 — Sosiale medier",
    intro: "Footer, SoMe-feed, deling.",
    pairs: [
      { label: "Instagram", usage: "Footer, SoMeFeed", lucide: "instagram", custom: "instagram-cm" },
      { label: "Facebook", usage: "Footer", lucide: "facebook", custom: "facebook-cm" },
      { label: "LinkedIn", usage: "Footer, karriere", lucide: "linkedin", custom: "linkedin-cm" },
      { label: "YouTube", usage: "Footer, video", lucide: "youtube", custom: "youtube-cm" },
      { label: "X (Twitter)", usage: "Footer", lucide: "twitter", custom: "twitter-cm" },
      { label: "Apple", usage: "App-lenker, login", lucide: "apple", custom: "apple-cm" },
    ],
  },
  {
    title: "11 — Gynekologi: alle 18 undertjenester",
    intro:
      "Komplett liste fra treatmentContent.ts — hver behandling har et unikt symbolsk ikon. Ingen saks for «Fjerne livmor», ingen repetert dråpe.",
    pairs: [
      { label: "Tverrfaglig team", usage: "/behandlinger/gynekologi/tverrfaglig", lucide: "users", custom: "interdisciplinary-sym" },
      { label: "Gynekologisk undersøkelse", usage: "/gynekologi/undersokelse", lucide: "stethoscope", custom: "stethoscope-cm" },
      { label: "Urinlekkasje", usage: "/gynekologi/urinlekkasje", lucide: "droplets", custom: "continence-sym" },
      { label: "Endometriose", usage: "/gynekologi/endometriose", lucide: "ribbon", custom: "endometriosis-sym" },
      { label: "Overgangsalder", usage: "/gynekologi/overgangsalder", lucide: "sun", custom: "horizon-sym" },
      { label: "Vaginale fremfall", usage: "/gynekologi/vaginale-fremfall", lucide: "heart-pulse", custom: "prolapse-support-sym" },
      { label: "Blødningsforstyrrelser", usage: "/gynekologi/blodningsforstyrrelser", lucide: "activity", custom: "cycle-sym" },
      { label: "Celleforandringer", usage: "/gynekologi/celleforandringer", lucide: "microscope", custom: "cell-change-sym" },
      { label: "Cyster på eggstokkene", usage: "/gynekologi/cyster", lucide: "circle-dot", custom: "cyst-cluster-sym" },
      { label: "Fjerne livmor", usage: "/gynekologi/fjerne-livmor — IKKE saks", lucide: "scissors", custom: "hysterectomy-sym" },
      { label: "Graviditet", usage: "/gynekologi/graviditet", lucide: "baby", custom: "pregnancy-bump-sym" },
      { label: "Gynekologisk kirurgi", usage: "/gynekologi/kirurgi — presisjon, ikke saks", lucide: "scissors", custom: "precision-surgery-sym" },
      { label: "Hormonforstyrrelser", usage: "/gynekologi/hormonforstyrrelser", lucide: "activity", custom: "hormones-sym" },
      { label: "Hysteroskopi", usage: "/gynekologi/hysteroskopi", lucide: "scan", custom: "hysteroscopy-sym" },
      { label: "Labiaplastikk", usage: "/gynekologi/labiaplastikk", lucide: "flower", custom: "butterfly-sym" },
      { label: "Robotkirurgi (gyn)", usage: "/gynekologi/robotkirurgi", lucide: "bot", custom: "robotic-arm-sym" },
      { label: "Spontanabort", usage: "/gynekologi/spontanabort", lucide: "heart", custom: "pregnancy-loss-sym" },
      { label: "Vulvalidelser", usage: "/gynekologi/vulvalidelser", lucide: "shield-check", custom: "vulvar-care-sym" },
      // ekstra (ikke i treatmentContent men brukt i lister/PromoBanner)
      { label: "PMS og PMDD", usage: "PromoBanner, kvinnehelse", lucide: "heart", custom: "mood-wave-sym" },
      { label: "Vaginal tørrhet", usage: "Symptom-lister", lucide: "droplets", custom: "hydration-balance-sym" },
    ],
  },
  {
    title: "12 — Fertilitet: alle 8 undertjenester",
    intro: "Komplett liste fra treatmentContent.ts. Hver behandling har sitt eget symbol — ingen sprøyte, ingen gjentatt egg-form.",
    pairs: [
      { label: "Infertilitet (utredning)", usage: "/fertilitet/infertilitet", lucide: "help-circle", custom: "fertility-assessment-sym" },
      { label: "Assistert befruktning", usage: "/fertilitet/assistert-befruktning", lucide: "heart-handshake", custom: "assisted-fertilisation-sym" },
      { label: "IVF", usage: "/fertilitet/ivf", lucide: "baby", custom: "ivf-sym" },
      { label: "Eggfrys", usage: "/fertilitet/eggfrys", lucide: "circle-dot", custom: "egg-freeze-sym" },
      { label: "Donorbehandling", usage: "/fertilitet/donorbehandling", lucide: "users", custom: "donor-treatment-sym" },
      { label: "Hysteroskopi (fert)", usage: "/fertilitet/hysteroskopi", lucide: "scan", custom: "hysteroscopy-sym" },
      { label: "Sædanalyse", usage: "/fertilitet/saedanalyse", lucide: "microscope", custom: "sperm-analysis-sym" },
      { label: "Fertilitetsteamet", usage: "/fertilitet/teamet", lucide: "users", custom: "fertility-team-sym" },
      // brukt i prislister / underseksjoner
      { label: "IUI / inseminasjon", usage: "Pris- og info-lister", lucide: "syringe", custom: "insemination-sym" },
      { label: "Eggdonasjon (alt)", usage: "Donor-undersider", lucide: "circle-dot", custom: "egg-donation-sym" },
      { label: "Sæddonasjon (alt)", usage: "Donor-undersider", lucide: "activity", custom: "sperm-donation-sym" },
    ],
  },
  {
    title: "13 — Urologi: alle 9 undertjenester",
    intro: "Komplett liste fra treatmentContent.ts. Anatomisk nøytrale symboler — ingen saks for sirkumsisjon/sterilisering.",
    pairs: [
      { label: "Blære og urinveier", usage: "/urologi/blaere", lucide: "droplets", custom: "bladder-sym" },
      { label: "Forhud / sirkumsisjon", usage: "/urologi/forhud — IKKE saks", lucide: "scissors", custom: "foreskin-sym" },
      { label: "Mannlig infertilitet", usage: "/urologi/infertilitet", lucide: "user", custom: "male-infertility-sym" },
      { label: "Nyrer", usage: "/urologi/nyrer", lucide: "activity", custom: "kidneys-sym" },
      { label: "Prostata", usage: "/urologi/prostata", lucide: "stethoscope", custom: "prostate-sym" },
      { label: "Refertilisering", usage: "/urologi/refertilisering", lucide: "refresh", custom: "refertilisation-sym" },
      { label: "Robotkirurgi (uro)", usage: "/urologi/robotkirurgi", lucide: "bot", custom: "robotic-arm-sym" },
      { label: "Sterilisering", usage: "/urologi/sterilisering — IKKE saks", lucide: "scissors", custom: "sterilisation-sym" },
      { label: "Testikler og pung", usage: "/urologi/testikler", lucide: "circle-dot", custom: "testicles-sym" },
      // ekstra brukt på urologi-undersider
      { label: "Urinveisinfeksjon", usage: "Urologi info-lister", lucide: "droplets", custom: "urinary-health-sym" },
      { label: "Erektil dysfunksjon", usage: "Urologi info-lister", lucide: "heart-pulse", custom: "vitality-sym" },
    ],
  },
  {
    title: "14 — Ortopedi: alle 5 undertjenester",
    intro: "Komplett liste fra treatmentContent.ts. Anatomiske, men minimalistiske symboler.",
    pairs: [
      { label: "Fot og ankel", usage: "/ortopedi/fot-ankel", lucide: "footprints", custom: "foot-sym" },
      { label: "Hofte", usage: "/ortopedi/hofte", lucide: "user", custom: "hip-sym" },
      { label: "Hånd og albue", usage: "/ortopedi/hand-albue", lucide: "hand-heart", custom: "arm-sym" },
      { label: "Kne", usage: "/ortopedi/kne", lucide: "activity", custom: "knee-sym" },
      { label: "Skulder", usage: "/ortopedi/skulder", lucide: "user-round", custom: "shoulder-sym" },
    ],
  },
  {
    title: "15 — Flere fagområder: alle 14 undertjenester",
    intro: "Komplett liste fra treatmentContent.ts. Spesialitets-spesifikke symboler — ingen gjenbruk av Stethoscope.",
    pairs: [
      { label: "Endokrinologi", usage: "/flere-fagomrader/endokrinologi", lucide: "activity", custom: "endocrinology-sym" },
      { label: "Hudlege", usage: "/flere-fagomrader/hudlege", lucide: "user", custom: "dermatology-sym" },
      { label: "Ernæringsfysiolog", usage: "/flere-fagomrader/ernaringsfysiolog", lucide: "heart", custom: "nutrition-sym" },
      { label: "Gastrokirurgi", usage: "/flere-fagomrader/gastrokirurgi", lucide: "scissors", custom: "gastro-surgery-sym" },
      { label: "Osteopati", usage: "/flere-fagomrader/osteopati", lucide: "bone", custom: "osteopathy-sym" },
      { label: "Plastikkirurgi", usage: "/flere-fagomrader/plastikkirurgi", lucide: "sparkles", custom: "plastic-surgery-sym" },
      { label: "Psykologi", usage: "/flere-fagomrader/psykologi", lucide: "brain", custom: "psychology-sym" },
      { label: "Revmatologi", usage: "/flere-fagomrader/revmatologi", lucide: "bone", custom: "rheumatology-sym" },
      { label: "Robotkirurgi (flere)", usage: "/flere-fagomrader/robotkirurgi", lucide: "bot", custom: "robotic-arm-sym" },
      { label: "Sexologi", usage: "/flere-fagomrader/sexologi", lucide: "heart", custom: "sexology-sym" },
      { label: "Åreknutebehandling", usage: "/flere-fagomrader/areknuter", lucide: "activity", custom: "varicose-veins-sym" },
      { label: "Hudhelse", usage: "/flere-fagomrader/hudhelse", lucide: "sparkles", custom: "skin-health-sym" },
      { label: "Overvektskirurgi", usage: "/flere-fagomrader/overvektskirurgi", lucide: "user", custom: "weight-surgery-sym" },
    ],
  },
  {
    title: "14 — Pasientreise & prosess",
    intro: "Steg 01–04 brukt på alle behandlingssider (categoryPageContent.ts, JourneyVariant).",
    pairs: [
      { label: "Steg — bestill time", usage: "Steg 01: Booking", lucide: "calendar", custom: "calendar-cm" },
      { label: "Steg — samtale", usage: "Steg 02: Konsultasjon", lucide: "message-circle", custom: "message-cm" },
      { label: "Steg — plan / omsorg", usage: "Steg 03: Behandlingsplan", lucide: "heart-handshake", custom: "handshake-cm" },
      { label: "Steg — oppfølging", usage: "Steg 04: Oppfølging", lucide: "clock", custom: "clock-cm" },
      { label: "Sjekkliste / journal", usage: "Pasientreise, henvisning", lucide: "list-checks", custom: "checklist-cm" },
      { label: "Steg-progresjon", usage: "Alternativ for trinn-grafikk", lucide: "footprints", custom: "steps-cm" },
    ],
  },
  {
    title: "15 — Klinikk & tilgjengelighet",
    intro: "Klinikkside, header, footer, klinikk-grid.",
    pairs: [
      { label: "Klinikk / hjem", usage: "Klinikker, footer, hjem-lenke", lucide: "home", custom: "home-cm" },
      { label: "Tilgjengelighet (HC)", usage: "Klinikk-info", lucide: "accessibility", custom: "accessibility-cm" },
      { label: "Tog", usage: "Kollektiv-info klinikk", lucide: "train", custom: "train-cm" },
      { label: "Bil / parkering", usage: "Klinikk-info", lucide: "car", custom: "car-cm" },
      { label: "Bygg", usage: "Klinikk-grid", lucide: "building", custom: "building-cm" },
      { label: "Oppdater / fornye", usage: "Refresh-handlinger", lucide: "refresh", custom: "refresh-cm" },
    ],
  },
  {
    title: "16 — Premium / banner / kvalitet",
    intro: "PremiumBanner, ValueBadges, TrustSection.",
    pairs: [
      { label: "Stjerne i sirkel", usage: "Kvalitetsmerke, badges", lucide: "star", custom: "star-circle-cm" },
      { label: "Glitter / premium", usage: "PremiumBanner", lucide: "sparkles", custom: "sparkles-cm" },
      { label: "Tidsbegrenset tilbud", usage: "SaleSection", lucide: "timer", custom: "timer-cm" },
      { label: "Trend opp", usage: "Mest valgte", lucide: "trending-up", custom: "trending-up-cm" },
      { label: "Plaster / behandling", usage: "Småinngrep, sårbehandling", lucide: "shield-check", custom: "bandage-cm" },
      { label: "Temperatur / symptom", usage: "Symptomliste", lucide: "thermometer", custom: "temperature-cm" },
    ],
  },
];

const SIZES = [16, 20, 24];

const Cell = ({
  iconKey,
  label,
}: {
  iconKey?: IconName;
  label: string;
}) => {
  if (!iconKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80px] text-[10px] text-foreground/30">
        — finnes ikke i Lucide —
      </div>
    );
  }
  const Icon = getIcon(iconKey);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-3 min-h-[36px]">
        {SIZES.map((sz) => (
          <Icon key={sz} size={sz} strokeWidth={1.5} />
        ))}
      </div>
      <div className="flex gap-1.5">
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded"
          style={{ background: "#42332A", color: "#F2ECE6" }}
        >
          <Icon size={14} strokeWidth={1.5} />
        </span>
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded"
          style={{ background: "#CCBAAD", color: "#42332A" }}
        >
          <Icon size={14} strokeWidth={1.5} />
        </span>
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded"
          style={{ background: "#F4FF78", color: "#42332A" }}
        >
          <Icon size={14} strokeWidth={1.5} />
        </span>
      </div>
      <code className="text-[10px] text-foreground/40">{iconKey}</code>
    </div>
  );
};

// Claude.ai editorial proposal — grouped data
type ClaudeItem = { key: IconName; label: string; description: string };
type ClaudeGroup = { title: string; icons: ClaudeItem[] };

const CLAUDE_GROUPS: ClaudeGroup[] = [
  {
    title: "Paraply / kategori-ledere",
    icons: [
      { key: "gynekologi-cl", label: "Gynekologi", description: "Vesica piscis med roligt sentrum" },
      { key: "fertilitet-cl", label: "Fertilitet", description: "Sirkel med spirende topp" },
      { key: "urologi-cl", label: "Urologi", description: "Dråpe i et mykt kar" },
      { key: "ortopedi-cl", label: "Ortopedi", description: "To leddpunkter forbundet" },
      { key: "flere-fagomrader-cl", label: "Flere fagområder", description: "Konstellasjonsmønster" },
    ],
  },
  {
    title: "Graviditet",
    icons: [
      { key: "ultralyd-cl", label: "Ultralyd", description: "Tre konsentriske buer" },
      { key: "nipt-cl", label: "NIPT", description: "Dråpe med to fine kryss" },
      { key: "svangerskapsteam-cl", label: "Svangerskapsteam", description: "Mage-kurve med tre figurer" },
      { key: "fosterdiagnostikk-cl", label: "Fosterdiagnostikk", description: "Myk hjerterytme over horisont" },
    ],
  },
  {
    title: "Gynekologi",
    icons: [
      { key: "gynekologisk-undersokelse-cl", label: "Gynekologisk undersøkelse", description: "Fire kronblader rundt et roligt sentrum" },
      { key: "urinlekkasje-cl", label: "Urinlekkasje", description: "Dråpe trygt favnet av en åpen skål" },
      { key: "endometriose-cl", label: "Endometriose", description: "Lag som folder seg innover" },
      { key: "overgangsalder-cl", label: "Overgangsalder", description: "Tre månefaser side om side" },
      { key: "vaginale-fremfall-cl", label: "Vaginale fremfall", description: "Hvelv båret av to lette søyler" },
      { key: "blodningsforstyrrelser-cl", label: "Blødningsforstyrrelser", description: "Syklus med uregelmessig markør" },
      { key: "celleforandringer-cl", label: "Celleforandringer", description: "Tre celler, én med stille sentrum" },
      { key: "cyster-cl", label: "Cyster", description: "Tre myke former samlet" },
      { key: "fjerne-livmor-cl", label: "Fjerne livmor", description: "Åpen skål som løfter et tegn" },
      { key: "graviditet-cl", label: "Graviditet", description: "Halvmåne som favner et frø" },
      { key: "gynekologisk-kirurgi-cl", label: "Gynekologisk kirurgi", description: "Konsentriske sirkler mot et punkt" },
      { key: "hormonforstyrrelser-cl", label: "Hormonforstyrrelser", description: "To bølger ute av takt" },
      { key: "hysteroskopi-cl", label: "Hysteroskopi", description: "Slank linse med en lysstråle" },
      { key: "labiaplastikk-cl", label: "Labiaplastikk", description: "To organiske kronblader som møtes" },
      { key: "robotkirurgi-gyn-cl", label: "Robotkirurgi (gyn)", description: "Hjørnemarkører, presist sentrum" },
      { key: "spontanabort-cl", label: "Spontanabort", description: "Fallende blad fanget av åpne hender" },
      { key: "vulvalidelser-cl", label: "Vulvalidelser", description: "Mykt skjold med roligt sentrum" },
      { key: "pms-pmdd-cl", label: "PMS / PMDD", description: "Stille bølge inne i en sirkel" },
      { key: "vaginal-torrhet-cl", label: "Vaginal tørrhet", description: "Dråpe med et nytt skudd" },
      { key: "tverrfaglig-team-cl", label: "Tverrfaglig team", description: "Tre overlappende ringer" },
    ],
  },
  {
    title: "Fertilitet",
    icons: [
      { key: "infertilitet-cl", label: "Infertilitet", description: "Søkende blikk over et lite frø" },
      { key: "assistert-befruktning-cl", label: "Assistert befruktning", description: "To favnende buer rundt et sentrum" },
      { key: "ivf-cl", label: "IVF", description: "Grunn skål som rommer ett frø" },
      { key: "eggfrys-cl", label: "Eggfrys", description: "Krystallinsk mønster rundt en sirkel" },
      { key: "donorbehandling-cl", label: "Donorbehandling", description: "Sirkel ombundet av et bånd" },
      { key: "saedanalyse-cl", label: "Sædanalyse", description: "Linsefelt over små markører" },
      { key: "fertilitetsteamet-cl", label: "Fertilitetsteamet", description: "Tre tette punkter forbundet" },
      { key: "inseminasjon-cl", label: "Inseminasjon", description: "Åpen trakt med et frø ovenfra" },
      { key: "eggdonasjon-cl", label: "Eggdonasjon", description: "Åpen skål som løfter en sirkel" },
      { key: "saeddonasjon-cl", label: "Sæddonasjon", description: "Kalk med en dråpe over" },
    ],
  },
  {
    title: "Urologi",
    icons: [
      { key: "blaere-cl", label: "Blære", description: "Mykt kar med stille forbindelse oppover" },
      { key: "forhud-cl", label: "Forhud", description: "To hvilende konsentriske ringer" },
      { key: "mannlig-infertilitet-cl", label: "Mannlig infertilitet", description: "Vei med to brudd" },
      { key: "nyrer-cl", label: "Nyrer", description: "To rolige bønneformer" },
      { key: "prostata-cl", label: "Prostata", description: "Mykt skjold med oppmerksomt sentrum" },
      { key: "refertilisering-cl", label: "Refertilisering", description: "To buer som møtes igjen" },
      { key: "robotkirurgi-uro-cl", label: "Robotkirurgi (uro)", description: "Hjørnerom rammer et større sentrum" },
      { key: "sterilisering-cl", label: "Sterilisering", description: "Lukket løkke som krysser seg selv" },
      { key: "testikler-cl", label: "Testikler", description: "To sirkler i en myk pose" },
      { key: "urinveisinfeksjon-cl", label: "Urinveisinfeksjon", description: "Dråpe omsluttet av to favnende buer" },
      { key: "erektil-dysfunksjon-cl", label: "Erektil dysfunksjon", description: "Spire som strekker seg oppover" },
    ],
  },
  {
    title: "Ortopedi",
    icons: [
      { key: "fot-ankel-cl", label: "Fot / ankel", description: "Vinklet linje med et roligt leddpunkt" },
      { key: "hofte-cl", label: "Hofte", description: "Kule møter en bue" },
      { key: "hand-albue-cl", label: "Hånd / albue", description: "Vinkel med leddpunkt" },
      { key: "kne-cl", label: "Kne", description: "To linjer møtes i hvilende leddpunkt" },
      { key: "skulder-cl", label: "Skulder", description: "Kuleledd som hviler ut i en arm" },
    ],
  },
  {
    title: "Flere fagområder",
    icons: [
      { key: "endokrinologi-cl", label: "Endokrinologi", description: "Tre kjertler i et stille nettverk" },
      { key: "hudlege-cl", label: "Hudlege", description: "To parallelle bølger" },
      { key: "ernaringsfysiolog-cl", label: "Ernæringsfysiolog", description: "Frukt med et lite blad" },
      { key: "gastrokirurgi-cl", label: "Gastrokirurgi", description: "S-formet bue med stille sentrum" },
      { key: "osteopati-cl", label: "Osteopati", description: "Oppadgående søyle med myke ribber" },
      { key: "plastikkirurgi-cl", label: "Plastikkirurgi", description: "To møtende profiler" },
      { key: "psykologi-cl", label: "Psykologi", description: "Profil i ro med lyttende sentrum" },
      { key: "revmatologi-cl", label: "Revmatologi", description: "Ledd kranset av varme stråler" },
      { key: "sexologi-cl", label: "Sexologi", description: "To ringer som møtes" },
      { key: "areknuter-cl", label: "Åreknuter", description: "Forgrenet mønster — blodets vei" },
      { key: "hudhelse-cl", label: "Hudhelse", description: "Sol som hever seg over en horisont" },
      { key: "overvektskirurgi-cl", label: "Overvektskirurgi", description: "Vekt i balanse" },
    ],
  },
];

const ClaudeCard = ({ label, description, iconKey }: { label: string; description: string; iconKey: IconName }) => {
  const Icon = getIcon(iconKey);
  return (
    <div className="rounded-md border border-foreground/10 bg-background overflow-hidden">
      <div className="grid grid-cols-4">
        <div className="aspect-square flex items-center justify-center" style={{ background: "#F2ECE6", color: "#42332A" }}>
          <Icon size={26} strokeWidth={1.5} />
        </div>
        <div className="aspect-square flex items-center justify-center border-l border-foreground/5" style={{ background: "#CCBAAD", color: "#42332A" }}>
          <Icon size={26} strokeWidth={1.5} />
        </div>
        <div className="aspect-square flex items-center justify-center border-l border-foreground/5" style={{ background: "#42332A", color: "#F2ECE6" }}>
          <Icon size={26} strokeWidth={1.5} />
        </div>
        <div className="aspect-square flex items-center justify-center border-l border-foreground/5" style={{ background: "#F4FF78", color: "#42332A" }}>
          <Icon size={26} strokeWidth={1.5} />
        </div>
      </div>
      <div className="p-3 space-y-1">
        <div className="text-[13px]">{label}</div>
        <div className="text-[11px] text-foreground/55 leading-snug">{description}</div>
        <code className="text-[10px] text-foreground/40">{iconKey}</code>
      </div>
    </div>
  );
};

const IconPreview = () => {
  const totalProposed = GROUPS.reduce((n, g) => n + g.pairs.length, 0);

  // Tre unisex fertilitets-alternativer — nøytrale (uten kjønnsreferanse)
  const FERTILITY_ALTS: {
    key: string;
    label: string;
    description: string;
    render: (stroke: string, size: number) => JSX.Element;
  }[] = [
    {
      key: "forbindelse",
      label: "Alternativ 1 — Forbindelse",
      description:
        "To likeverdige buer som omslutter en liten prikk. Symboliserer at fertilitet er et felles prosjekt — uansett konstellasjon.",
      render: (stroke, size) => (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <g stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none">
            <path d="M32 36 Q22 50 32 64" />
            <path d="M68 36 Q78 50 68 64" />
            <circle cx="50" cy="50" r="3.2" fill={stroke} />
          </g>
        </svg>
      ),
    },
    {
      key: "vekst",
      label: "Alternativ 2 — Vekst",
      description:
        "En spire som vokser opp fra en linje. Fokus på «det nye som starter» — universelt for alle veier til foreldreskap.",
      render: (stroke, size) => (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <g stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1="34" y1="70" x2="66" y2="70" />
            <path d="M50 70 Q50 56 50 44" />
            <path d="M50 56 Q44 50 38 48 Q42 56 50 58" />
            <path d="M50 50 Q56 46 60 42 Q56 50 50 52" />
          </g>
        </svg>
      ),
    },
    {
      key: "reise",
      label: "Alternativ 3 — Reise",
      description:
        "En myk, buet linje med et målpunkt. Fertilitet er sjelden en rett vei — symboliserer prosess og mål.",
      render: (stroke, size) => (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <g stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none">
            <path d="M28 64 Q40 44 50 50 Q60 56 68 38" />
            <circle cx="68" cy="38" r="4.5" fill={stroke} />
          </g>
        </svg>
      ),
    },
  ];

  const FERTILITY_BGS = [
    { bg: "#F2ECE6", stroke: "#42332A", name: "Cream" },
    { bg: "#CCBAAD", stroke: "#42332A", name: "Sand" },
    { bg: "#42332A", stroke: "#F2ECE6", name: "Brown" },
    { bg: "#F4FF78", stroke: "#42332A", name: "Yellow" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12 font-light">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="space-y-3 max-w-3xl">
          <h1 className="text-2xl">Ikon-forslag for CMedical</h1>
          <p className="text-sm text-foreground/70 leading-relaxed">
            Komplett forslag til et CMedical-eget ikon-sett som dekker alle behov på siden i dag.
            Totalt <strong>{totalProposed} ikoner</strong> i 10 kategorier — fra navigasjon og
            kontakt til medisinske spesialiteter. Hver rad viser dagens Lucide-ikon ved siden av
            CMedical-forslaget, så du enkelt kan sammenligne.
          </p>
          <ul className="text-xs text-foreground/60 list-disc pl-5 space-y-1">
            <li>Tegnet i samme tynne stil (1.5px stroke, currentColor) — fungerer i alle farger</li>
            <li>Vises i 16 / 20 / 24 px og mot mørk skin-tone, mid skin-tone og gul accent</li>
            <li>Brukes kun funksjonelt (ved tekst, i lister, i knapper) — aldri som store dekorelementer</li>
            <li>14 helt nye spesialitets-ikoner finnes ikke i Lucide og gir merket særpreg</li>
          </ul>
        </header>

        {/* ============================================================
            Fertilitet — 3 unisex alternativer (kjønnsnøytrale)
            ============================================================ */}
        <section className="space-y-6 rounded-lg border border-foreground/15 bg-foreground/[0.02] p-6 md:p-8">
          <div className="space-y-2 max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.18em] text-foreground/50">
              Fertilitet — alternativer
            </div>
            <h2 className="text-xl">Tre unisex-konsepter for fertilitets-ikonet</h2>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Tre helt kjønnsnøytrale alternativer som kan erstatte dagens{" "}
              <code className="text-[11px]">fertilitet-cl</code>. Vist på alle fire
              brand-bakgrunner i 24 / 32 / 48 px.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FERTILITY_ALTS.map((alt) => (
              <div key={alt.key} className="rounded-md border border-foreground/10 bg-background overflow-hidden">
                <div className="grid grid-cols-4">
                  {FERTILITY_BGS.map((b) => (
                    <div
                      key={b.name}
                      className="aspect-square flex items-center justify-center border-l first:border-l-0 border-foreground/5"
                      style={{ background: b.bg }}
                    >
                      {alt.render(b.stroke, 32)}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 border-t border-foreground/5">
                  {[24, 32, 48].map((sz) => (
                    <div
                      key={sz}
                      className="aspect-square flex flex-col items-center justify-center gap-1 border-l first:border-l-0 border-foreground/5"
                      style={{ background: "#F2ECE6", color: "#42332A" }}
                    >
                      {alt.render("#42332A", sz)}
                      <code className="text-[9px] text-foreground/40">{sz}px</code>
                    </div>
                  ))}
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-[13px]">{alt.label}</div>
                  <div className="text-[11px] text-foreground/55 leading-snug">{alt.description}</div>
                  <code className="text-[10px] text-foreground/40">fertilitet-cl · {alt.key}</code>
                </div>
              </div>
            ))}
          </div>
        </section>


        <section className="space-y-5 rounded-lg border border-foreground/15 bg-foreground/[0.02] p-6 md:p-8">
          <div className="space-y-2 max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.18em] text-foreground/50">
              Nytt forslag
            </div>
            <h2 className="text-xl">Scandinavian editorial-sett — 53 symbolske ikoner</h2>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Tegnet etter brief: 1.5px strek, runde hjørner, currentColor, padding 3–21,
              leselig ned til 16px. Symbolsk og aldri brutalt — ingen sakser, sprøyter eller
              anatomisk eksplisitte former. Hvert ikon er unikt for sin behandling/tjeneste.
            </p>
          </div>

          {CLAUDE_GROUPS.map((group, gi) => (
            <div key={gi} className="space-y-3 pt-4">
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-foreground/55 border-b border-foreground/10 pb-2">
                {group.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {group.icons.map((it) => (
                  <ClaudeCard key={it.key} label={it.label} description={it.description} iconKey={it.key} />
                ))}
              </div>
            </div>
          ))}
        </section>

        {GROUPS.map((group, gi) => (
          <section key={gi} className="space-y-4">
            <div className="space-y-1 border-b border-foreground/10 pb-3">
              <h2 className="text-base">{group.title}</h2>
              {group.intro && (
                <p className="text-xs text-foreground/55">{group.intro}</p>
              )}
            </div>

            <div className="grid grid-cols-[2fr_3fr_3fr] gap-x-6 gap-y-1 text-xs text-foreground/40 px-2">
              <div>Bruksområde</div>
              <div>I dag (Lucide)</div>
              <div>Forslag (CMedical)</div>
            </div>

            <div className="divide-y divide-foreground/5 border border-foreground/10 rounded-md">
              {group.pairs.map((p) => (
                <div
                  key={p.custom}
                  className="grid grid-cols-[2fr_3fr_3fr] gap-x-6 px-4 py-4 items-start"
                >
                  <div className="space-y-1">
                    <div className="text-sm">{p.label}</div>
                    {p.usage && (
                      <div className="text-[11px] text-foreground/50">{p.usage}</div>
                    )}
                  </div>
                  <Cell iconKey={p.lucide} label={p.label} />
                  <Cell iconKey={p.custom} label={p.label} />
                </div>
              ))}
            </div>
          </section>
        ))}

        <footer className="pt-8 border-t border-foreground/10 text-xs text-foreground/55 space-y-2">
          <p>
            <strong>Neste steg:</strong> Når kunden har godkjent stilen (eventuelt med justeringer
            på enkelte ikoner), bytter vi defaultet i <code>getIcon()</code> til custom-versjonen
            for hvert godkjent navn — alle steder på siden oppdateres automatisk.
          </p>
          <p>
            Mangler du et ikon for noe spesifikt? Si fra, så tegner jeg det.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default IconPreview;
