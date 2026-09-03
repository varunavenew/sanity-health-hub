export type ReasonI18n = {
  titleNo: string;
  titleEn: string;
  descNo: string;
  descEn: string;
};

export type PageContent = {
  titleNo: string;
  titleEn: string;
  heroTitleNo: string;
  heroTitleEn: string;
  heroLeadNo: string;
  heroLeadEn: string;
  heroPriceNo?: string | null;
  heroPriceEn?: string | null;
  heroPriceLabelNo?: string | null;
  heroPriceLabelEn?: string | null;
  reasonsTitleNo: string;
  reasonsTitleEn: string;
  reasonsLeadNo?: string;
  reasonsLeadEn?: string;
  reasonsLayout?: "prose" | "accordion" | "auto";
  midCtaNo: string;
  midCtaEn: string;
  promiseVariant: "standard";
  relatedSlugs?: string[];
  reasons: ReasonI18n[];
};

type PromiseCard = {
  titleNo: string;
  titleEn: string;
  descNo: string;
  descEn: string;
};

export const SHARED_UI = {
  shortWait: { no: "Kort ventetid", en: "Short waiting time" },
  noReferral: { no: "Ingen henvisning", en: "No referral needed" },
  bookCta: { no: "Se ledige tider og book", en: "See available times and book" },
  callCta: { no: "Ring oss", en: "Call us" },
  related: { no: "Relaterte tjenester", en: "Related services" },
  seeAll: { no: "Se alle behandlinger", en: "See all treatments" },
  seeAllGastro: {
    no: "Se alle gastrokirurgi-tjenester",
    en: "See all gastrointestinal surgery services",
  },
  seeAllHudhelse: {
    no: "Se alle hudhelse-tjenester",
    en: "See all skin health services",
  },
  seeAllHudbehandlinger: {
    no: "Se alle hudbehandlinger",
    en: "See all skin treatments",
  },
  specialistsTitle: {
    no: "Spesialister som utfører dette",
    en: "Specialists who perform this",
  },
  specialistsIntro: {
    no: "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
    en: "Experience, specialist expertise and modern technology gathered in one place.",
  },
  bookingTitle: {
    no: "Bestill time hos spesialist",
    en: "Book an appointment with a specialist",
  },
  bookingDesc: {
    no: "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
    en: "Choose service, clinic and clinician – all in one simple booking.",
  },
  bookNow: { no: "Bestill time nå", en: "Book an appointment now" },
} as const;

export const PROMISE_COPY: Record<"standard", readonly PromiseCard[]> = {
  standard: [
    {
      titleNo: "Tilpasset dine behov",
      titleEn: "Tailored to your needs",
      descNo:
        "Alle undersøkelser og inngrep tilpasses dine behov og ønsker. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
      descEn:
        "All examinations and procedures are tailored to your needs and wishes. You can stop at any time, ask questions along the way and bring someone with you if you wish.",
    },
    {
      titleNo: "Erfarne spesialister",
      titleEn: "Experienced specialists",
      descNo:
        "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
      descEn:
        "With us, you meet doctors who have specialised in their field — not a generalist on rotation. You receive the right expertise from your first consultation.",
    },
    {
      titleNo: "Alt under samme tak",
      titleEn: "Everything under one roof",
      descNo:
        "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.",
      descEn:
        "If you need further assessment, treatment or follow-up, we coordinate your entire care pathway.",
    },
  ],
};

const dermatologyCta = {
  no: "Snakk med en av våre hudleger",
  en: "Talk to one of our dermatologists",
} as const;

const gastroCta = {
  no: "Snakk med en av våre gastrokirurger",
  en: "Talk to one of our gastrointestinal surgeons",
} as const;

const specialistCta = {
  no: "Snakk med en av våre spesialister",
  en: "Talk to one of our specialists",
} as const;

export const FLERE_PAGE_CONTENT: Record<string, PageContent> = {
  endokrinologi: {
    titleNo: "Endokrinologi",
    titleEn: "Endocrinology",
    heroTitleNo: "Endokrinologi",
    heroTitleEn: "Endocrinology",
    heroLeadNo:
      "Endokrinologi er en medisinsk spesialitet som handler om hormonsystemet og sykdommer knyttet til kjertler som produserer hormoner, som for eksempel skjoldbruskkjertelen, binyrene, hypofysen og biskjoldkjertlene. Endokrinologer utreder, behandler og følger opp pasienter med hormonelle forstyrrelser.",
    heroLeadEn:
      "Endocrinology is a medical specialty concerned with the hormonal system and diseases affecting hormone-producing glands, including the thyroid, adrenal, pituitary and parathyroid glands. Endocrinologists assess, treat and follow up patients with hormonal disorders.",
    heroPriceNo: "fra 2.900 kr",
    heroPriceEn: "from NOK 2,900",
    heroPriceLabelNo: "Endokrinologi",
    heroPriceLabelEn: "Endocrinology",
    reasonsTitleNo: "Dette hjelper vi deg med",
    reasonsTitleEn: "How we can help",
    midCtaNo: "Snakk med en av våre endokrinologer",
    midCtaEn: "Talk to one of our endocrinologists",
    promiseVariant: "standard",
    relatedSlugs: ["revmatologi", "ernaeringsfysiolog"],
    reasons: [
      {
        titleNo: "Stoffskifte",
        titleEn: "Thyroid and metabolism",
        descNo:
          "Vi utreder og behandler forstyrrelser i skjoldbruskkjertelen og stoffskiftet, blant annet lavt og høyt stoffskifte.",
        descEn:
          "We assess and treat thyroid and metabolic disorders, including underactive and overactive thyroid.",
      },
      {
        titleNo: "Diabetes",
        titleEn: "Diabetes",
        descNo:
          "Vi tilbyr utredning, behandling og oppfølging ved diabetes og andre forstyrrelser i blodsukkerreguleringen.",
        descEn:
          "We provide assessment, treatment and follow-up for diabetes and other disorders of blood glucose regulation.",
      },
      {
        titleNo: "Binyrer og hormoner",
        titleEn: "Adrenal glands and hormones",
        descNo:
          "Vi undersøker hormonelle plager knyttet til blant annet binyrer, hypofyse og biskjoldkjertler.",
        descEn:
          "We investigate hormonal symptoms related to the adrenal, pituitary and parathyroid glands.",
      },
    ],
  },

  ernaeringsfysiolog: {
    titleNo: "Ernæringsfysiolog",
    titleEn: "Clinical nutritionist",
    heroTitleNo: "Ernæringsfysiolog",
    heroTitleEn: "Clinical nutritionist",
    heroLeadNo:
      "Ernæringsfysiologi er et felt som ser på hvordan mat påvirker kroppen og helsen. Ernæringsfysiologer studerer næringsstoffer i mat, vurderer ernæringsbehov, og gir råd for å oppmuntre til en sunn livsstil.",
    heroLeadEn:
      "Nutritional science examines how food affects the body and health. Clinical nutritionists study nutrients in food, assess nutritional needs and provide advice that encourages a healthy lifestyle.",
    reasonsTitleNo: "Om ernæringsfysiolog",
    reasonsTitleEn: "About clinical nutrition",
    reasonsLeadNo:
      "Ernæringsfysiologi er et felt som ser på hvordan mat påvirker kroppen og helsen. Ernæringsfysiologer studerer næringsstoffer i mat, vurderer ernæringsbehov, og gir råd for å oppmuntre til en sunn livsstil.",
    reasonsLeadEn:
      "Nutritional science examines how food affects the body and health. Clinical nutritionists study nutrients in food, assess nutritional needs and provide advice that encourages a healthy lifestyle.",
    midCtaNo: "Snakk med en av våre ernæringsfysiologer",
    midCtaEn: "Talk to one of our clinical nutritionists",
    promiseVariant: "standard",
    relatedSlugs: [
      "revmatologi",
      "endokrinologi",
      "osteopati",
      "sexologi",
      "psykologi",
      "areknuter",
      "gastrokirurgi",
      "hudbehandlinger",
    ],
    reasons: [
      {
        titleNo: "Formålet",
        titleEn: "Purpose",
        descNo:
          "Målet er å hjelpe folk med å oppnå og beholde god helse ved å følge riktig kosthold og ernæringsprinsipper. Ernæringsfysiologer gir støtte og veiledning for å hjelpe enkeltpersoner med å nå sine ernæringsmål og forbedre generelt velvære. Hos oss jobber ernæringsfysiolog med andre spesialister i de tilfellene der det er nyttig for pasienten.",
        descEn:
          "The goal is to help people achieve and maintain good health through the right diet and nutritional principles. Clinical nutritionists provide support and guidance so individuals can reach their nutrition goals and improve overall wellbeing. At CMedical, our nutritionist works with other specialists whenever that benefits the patient.",
      },
    ],
  },

  hudhelse: {
    titleNo: "Hudhelse",
    titleEn: "Skin health",
    heroTitleNo: "Hudhelse",
    heroTitleEn: "Skin health",
    heroLeadNo:
      "Dermatologi og venerologi er et medisinsk fagfelt som omhandler hud, hår, negler og slimhinner, og hvordan ulike tilstander påvirker hudhelsen.",
    heroLeadEn:
      "Dermatology and venereology is the medical field concerned with the skin, hair, nails and mucous membranes, and with how different conditions affect skin health.",
    heroPriceNo: "fra 2.100 kr",
    heroPriceEn: "from NOK 2,100",
    heroPriceLabelNo: "Konsultasjon hos hudlege",
    heroPriceLabelEn: "Dermatology consultation",
    reasonsTitleNo: "Dette hjelper vi deg med",
    reasonsTitleEn: "How we can help",
    reasonsLeadNo:
      "Vi utreder og behandler et bredt spekter av hudlidelser og tilbyr faglig rådgivning for sunnere hud. Tilbudet finnes på CMedical Bekkestua.",
    reasonsLeadEn:
      "We assess and treat a wide range of skin conditions and provide expert advice for healthier skin. Services are available at CMedical Bekkestua.",
    midCtaNo: dermatologyCta.no,
    midCtaEn: dermatologyCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["hudbehandlinger", "behandlingsutstyr", "hudpleieprodukter"],
    reasons: [
      {
        titleNo: "Hudbehandlinger",
        titleEn: "Skin treatments",
        descNo:
          "Medisinsk forankrede hudbehandlinger utført av hudlege — pigment, rødhet, struktur, volum og føflekksjekk.",
        descEn:
          "Medically grounded treatments performed by a dermatologist for pigmentation, redness, texture, volume and mole checks.",
      },
      {
        titleNo: "Behandlingsutstyr",
        titleEn: "Treatment equipment",
        descNo:
          "IPL- og laserteknologi vi bruker — trygg behandling basert på dokumenterte metoder.",
        descEn:
          "The IPL and laser technology we use for safe treatment based on documented methods.",
      },
      {
        titleNo: "Hudpleieprodukter",
        titleEn: "Skincare products",
        descNo:
          "SkinCeuticals og medisinsk hudpleie anbefalt av hudlege — for daglig stell og oppfølging hjemme.",
        descEn:
          "SkinCeuticals and medical-grade skincare recommended by a dermatologist for daily care and follow-up at home.",
      },
    ],
  },

  hudbehandlinger: {
    titleNo: "Hudbehandlinger",
    titleEn: "Skin treatments",
    heroTitleNo: "Hudbehandlinger",
    heroTitleEn: "Skin treatments",
    heroLeadNo:
      "Hos CMedical på Bekkestua tilbyr vi et utvalg hudbehandlinger som utføres av hudlege — medisinsk forankret og tilpasset deg.",
    heroLeadEn:
      "At CMedical Bekkestua, we offer a selection of skin treatments performed by a dermatologist — medically grounded and tailored to you.",
    reasonsTitleNo: "Om hudbehandlinger",
    reasonsTitleEn: "About skin treatments",
    reasonsLeadNo:
      "Hos CMedical på Bekkestua tilbyr vi et utvalg hudbehandlinger som utføres av hudlege — medisinsk forankret og tilpasset deg.",
    reasonsLeadEn:
      "At CMedical Bekkestua, we offer a selection of skin treatments performed by a dermatologist — medically grounded and tailored to you.",
    midCtaNo: dermatologyCta.no,
    midCtaEn: dermatologyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "pigmentforandringer-og-solskader",
      "rodhet-og-synlige-blodkar",
      "forbedring-av-hudstruktur",
      "kosmetisk-dermatologi",
      "elastisitet-og-volum",
      "foflekksjekk",
    ],
    reasons: [
      {
        titleNo: "Om hudbehandlinger",
        titleEn: "About skin treatments",
        descNo:
          "Hos CMedical på Bekkestua tilbyr vi et utvalg hudbehandlinger som utføres av hudlege. Behandlingene er medisinsk forankret og tilpasses individuelt, med mål om å ivareta hudens helse samtidig som vi kan forbedre hudkvalitet og redusere synlige hudforandringer.\n\nVåre behandlinger tar utgangspunkt i medisinsk kunnskap om hud og utføres alltid etter en faglig vurdering hos hudlege. Hos oss møter du hudlege med erfaring innen både medisinsk og kosmetisk dermatologi.\n\nDersom du ønsker vurdering av hudforandringer eller informasjon om kosmetiske behandlinger, kan du bestille en konsultasjon hos hudlege. Under konsultasjonen vurderer vi hudens tilstand og gir råd om hvilke behandlinger som eventuelt kan være aktuelle. Behandlingene utføres ved vår klinikk på Bekkestua.\n\nVår tilnærming:\n\n- medisinsk vurdering før behandling\n- behandling utført av hudlege\n- naturlige og balanserte resultater\n- hudhelse på kort og lang sikt\n- trygg behandling basert på dokumenterte metoder",
        descEn:
          "At CMedical Bekkestua, we offer a selection of skin treatments performed by a dermatologist. Treatments are medically grounded and tailored individually, with the aim of safeguarding skin health while improving skin quality and reducing visible changes.\n\nOur treatments are based on medical knowledge of the skin and are always carried out after a professional assessment by a dermatologist. You will meet a dermatologist with experience in both medical and cosmetic dermatology.\n\nIf you would like an assessment of skin changes or information about cosmetic treatments, you can book a consultation with a dermatologist. During the consultation, we assess the condition of your skin and advise on which treatments may be appropriate. Treatments are performed at our clinic in Bekkestua.\n\nOur approach:\n\n- medical assessment before treatment\n- treatment performed by a dermatologist\n- natural and balanced results\n- skin health in the short and long term\n- safe treatment based on documented methods",
      },
      {
        titleNo: "Kosmetiske behandlinger",
        titleEn: "Cosmetic treatments",
        descNo:
          "Hos CMedical tilbyr vi kosmetiske hudbehandlinger utført av hudlege. Behandlingene tilpasses individuelt etter en medisinsk vurdering, og kan blant annet omfatte:\n\n- IPL-behandling av pigmentflekker og rødhet\n- microneedling og mesoterapi\n- rynkebehandling, Profhilo, Radiesse og Skin boosters\n- behandling av akne og aknearr\n- kjemisk peeling og skin boosters\n\nFør en kosmetisk behandling gjennomføres, gjør hudlegen en medisinsk vurdering av huden. I noen tilfeller kan hudforandringer skyldes en underliggende hudsykdom som bør behandles på annen måte. Dette skiller behandling hos hudlege fra rene estetiske klinikker.",
        descEn:
          "At CMedical, we offer cosmetic skin treatments performed by a dermatologist. Treatments are individually tailored after a medical assessment and may include:\n\n- IPL treatment for pigmentation and redness\n- microneedling and mesotherapy\n- wrinkle treatment, Profhilo, Radiesse and skin boosters\n- treatment of acne and acne scarring\n- chemical peels and skin boosters\n\nBefore a cosmetic treatment is carried out, the dermatologist performs a medical assessment of the skin. In some cases, skin changes may be caused by an underlying skin condition that should be treated differently. This distinguishes treatment by a dermatologist from purely aesthetic clinics.",
      },
    ],
  },

  gastrokirurgi: {
    titleNo: "Mage- og tarmlidelser (Gastrokirurgi)",
    titleEn: "Gastrointestinal disorders (Gastrointestinal surgery)",
    heroTitleNo: "Mage- og tarmlidelser (Gastrokirurgi)",
    heroTitleEn: "Gastrointestinal disorders (Gastrointestinal surgery)",
    heroLeadNo:
      "Mage og tarmkirurgi (gastrokirurgi) omhandler kirurgiske inngrep i fordøyelsessystemet. Hos oss møter du erfarne spesialister innen fagfeltet. Vi tilbyr et helhetlig og tverrfaglig tilbud, der avansert medisinsk teknologi møter tett oppfølging fra kirurger og klinisk ernæringsfysiolog.",
    heroLeadEn:
      "Gastrointestinal surgery covers surgical procedures involving the digestive system. You will meet experienced specialists in the field. We provide comprehensive, multidisciplinary care in which advanced medical technology is combined with close follow-up from surgeons and a clinical nutritionist.",
    heroPriceNo: "fra 1.500 kr",
    heroPriceEn: "from NOK 1,500",
    heroPriceLabelNo: "Konsultasjon gastrokirurg",
    heroPriceLabelEn: "Gastrointestinal surgery consultation",
    reasonsTitleNo: "Hva vi behandler hos oss",
    reasonsTitleEn: "What we treat",
    midCtaNo: gastroCta.no,
    midCtaEn: gastroCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "overvektskirurgi",
      "brokkoperasjon",
      "hemorroider",
      "ernaeringsfysiolog",
    ],
    reasons: [
      {
        titleNo: "Overvektskirurgi (slankeoperasjon)",
        titleEn: "Bariatric surgery (weight-loss surgery)",
        descNo: "Varig vektreduksjon med robotassistert presisjon.",
        descEn: "Lasting weight reduction with robot-assisted precision.",
      },
      {
        titleNo: "Brokkoperasjon",
        titleEn: "Hernia surgery",
        descNo:
          "Skånsom behandling av lyskebrokk, arrbrokk og navlebrokk med kikkhull/robot.",
        descEn:
          "Gentle keyhole or robot-assisted treatment of inguinal, incisional and umbilical hernias.",
      },
      {
        titleNo: "Hemorroider og endetarmsplager (rektocele)",
        titleEn: "Haemorrhoids and rectal conditions (rectocele)",
        descNo: "Spesialistkompetanse på plager i endetarm og bekkenbunn.",
        descEn: "Specialist expertise in rectal and pelvic-floor conditions.",
      },
    ],
  },

  plastikkirurgi: {
    titleNo: "Plastikkirurgi",
    titleEn: "Plastic surgery",
    heroTitleNo: "Plastikkirurgi",
    heroTitleEn: "Plastic surgery",
    heroLeadNo:
      "Plastisk kirurgi kan hjelpe til med å gjenopprette kroppens form og funksjon etter for eksempel kreftsykdom, brannskader, graviditet og fødsel. Dette inkluderer inngrep som bukplastikk, brystkirurgi og andre rekonstruktive behandlinger. Vår plastiske kirurg har lang erfaring med løsninger godt tilpasset den enkelte pasient. Med avanserte teknikker og et trygt medisinsk miljø er du i de beste hender. Bestill en konsultasjon for en personlig vurdering og profesjonell veiledning.",
    heroLeadEn:
      "Plastic surgery can help restore the body’s form and function after cancer, burns, pregnancy or childbirth. This includes procedures such as abdominoplasty, breast surgery and other reconstructive treatments. Our plastic surgeon has extensive experience in solutions tailored to each patient. With advanced techniques and a safe medical environment, you are in excellent hands. Book a consultation for a personal assessment and professional guidance.",
    reasonsTitleNo: "Dette hjelper vi deg med",
    reasonsTitleEn: "How we can help",
    midCtaNo: "Snakk med en av våre plastikkirurger",
    midCtaEn: "Talk to one of our plastic surgeons",
    promiseVariant: "standard",
    relatedSlugs: ["hudhelse", "robotkirurgi"],
    reasons: [
      {
        titleNo: "Bryst",
        titleEn: "Breast",
        descNo:
          "Brystkirurgi og individuelt tilpassede rekonstruktive behandlinger.",
        descEn: "Breast surgery and individually tailored reconstructive treatment.",
      },
      {
        titleNo: "Kropp",
        titleEn: "Body",
        descNo:
          "Blant annet bukplastikk og behandling som gjenoppretter form og funksjon.",
        descEn:
          "Including abdominoplasty and treatment that restores form and function.",
      },
      {
        titleNo: "Ansikt",
        titleEn: "Face",
        descNo:
          "Plastikkirurgiske vurderinger og behandlinger tilpasset ansiktet.",
        descEn: "Plastic-surgery assessment and treatment tailored to the face.",
      },
      {
        titleNo: "Rekonstruksjon",
        titleEn: "Reconstruction",
        descNo:
          "Rekonstruktiv kirurgi etter blant annet kreftsykdom, brannskader, graviditet og fødsel.",
        descEn:
          "Reconstructive surgery after cancer, burns, pregnancy or childbirth.",
      },
    ],
  },

  robotkirurgi: {
    titleNo: "Robotassistert kirurgi",
    titleEn: "Robot-assisted surgery",
    heroTitleNo: "Robotassistert kirurgi",
    heroTitleEn: "Robot-assisted surgery",
    heroLeadNo:
      "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden. Ved robotkirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde.",
    heroLeadEn:
      "Robot-assisted surgery is an advanced yet gentle form of treatment. As with conventional keyhole surgery, the operation is performed through small openings in the skin. The surgeon controls the instruments electronically from a console beside the patient. Robot-held instruments enable exceptionally precise movements, while a high-resolution stereoscopic 3D camera gives the surgeon an outstanding view.",
    reasonsTitleNo: "Om robotassistert kirurgi",
    reasonsTitleEn: "About robot-assisted surgery",
    midCtaNo: specialistCta.no,
    midCtaEn: specialistCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["gastrokirurgi", "overvektskirurgi", "brokkoperasjon"],
    reasons: [
      {
        titleNo: "Rask rehabilitering",
        titleEn: "Fast recovery",
        descNo:
          "Robotassistert kirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling. Mange pasienter kan reise hjem allerede dagen etter inngrepet. Avhengig av jobb og inngrep kan du forvente en sykemeldingsperiode på 2–6 uker.",
        descEn:
          "Robot-assisted surgery is a modern, gentle technique in which the surgeon operates through small incisions rather than one large wound. This means less discomfort and bleeding, fewer complications and faster healing. Many patients can go home the day after surgery. Depending on your work and procedure, sick leave is usually two to six weeks.",
      },
      {
        titleNo: "Presisjon som merkes",
        titleEn: "Precision you can feel",
        descNo:
          "Med høyoppløselig 3D-kamera og avanserte instrumenter med stor presisjon har kirurgen svært god kontroll. Dette bidrar til skånsomhet og høy kvalitet i hvert inngrep. Metoden er særlig verdifull ved nervesparende operasjoner og kirurgi nær ømfintlig vev.",
        descEn:
          "A high-resolution 3D camera and highly precise advanced instruments give the surgeon excellent control. This supports gentle, high-quality surgery and is particularly valuable for nerve-sparing procedures and surgery close to delicate tissue.",
      },
      {
        titleNo: "Safe Histology Surgery",
        titleEn: "Safe Histology Surgery",
        descNo:
          "Ved Safe Histology Surgery kombinerer vi skånsom robotassistert kirurgi med nøyaktig vevsdiagnostikk underveis i inngrepet. Det gir kirurgen mulighet til å tilpasse operasjonen presist til funnene, og bidrar til trygg og målrettet behandling.",
        descEn:
          "Safe Histology Surgery combines gentle robot-assisted surgery with accurate tissue diagnostics during the procedure. This allows the surgeon to tailor the operation precisely to the findings and supports safe, targeted treatment.",
      },
      {
        titleNo: "Gynekologisk robotkirurgi",
        titleEn: "Gynaecological robotic surgery",
        descNo:
          "Brukes blant annet ved muskelknuter, dyp endometriose, hysterektomi og enkelte krefttilfeller.",
        descEn:
          "Used for fibroids, deep endometriosis, hysterectomy and selected cancers, among other conditions.",
      },
      {
        titleNo: "Urologisk robotkirurgi",
        titleEn: "Urological robotic surgery",
        descNo:
          "Brukes blant annet ved godartet forstørret prostata, prostatakreft og nyrekirurgi.",
        descEn:
          "Used for benign prostate enlargement, prostate cancer and kidney surgery, among other conditions.",
      },
      {
        titleNo: "Gastrokirurgisk robotkirurgi",
        titleEn: "Gastrointestinal robotic surgery",
        descNo:
          "Brukes blant annet ved overvektskirurgi og brokkoperasjon.",
        descEn: "Used for bariatric and hernia surgery, among other procedures.",
      },
    ],
  },

  areknuter: {
    titleNo: "Åreknutebehandling",
    titleEn: "Varicose vein treatment",
    heroTitleNo: "Åreknutebehandling",
    heroTitleEn: "Varicose vein treatment",
    heroLeadNo:
      "Åreknuter er veldig vanlig, og nesten 30 % av alle over 30 år har det i varierende grad. Det er like vanlig med åreknuter hos menn som hos kvinner.",
    heroLeadEn:
      "Varicose veins are very common, affecting almost 30% of people over 30 to varying degrees. They are equally common in men and women.",
    heroPriceNo: "Pris fra 1.400 kr",
    heroPriceEn: "from NOK 1,400",
    heroPriceLabelNo: "Åreknutebehandling",
    heroPriceLabelEn: "Varicose vein treatment",
    reasonsTitleNo: "Om åreknuter",
    reasonsTitleEn: "About varicose veins",
    midCtaNo: "Snakk med en av våre karkirurger",
    midCtaEn: "Talk to one of our vascular surgeons",
    promiseVariant: "standard",
    relatedSlugs: ["hudhelse"],
    // Reference page has no Om-section on /areknuter.
    reasons: [],
  },

  osteopati: {
    titleNo: "Osteopati",
    titleEn: "Osteopathy",
    heroTitleNo: "Osteopati",
    heroTitleEn: "Osteopathy",
    heroLeadNo:
      "Osteopati er en manuell behandlingsform som betyr at hendene er osteopatens viktigste verktøy for diagnostisering og behandling. Osteopati komplementerer medisinsk utredning og behandling.\n\nOsteopatene er autorisert helsepersonell og følger lov for helsepersonell.",
    heroLeadEn:
      "Osteopathy is a form of manual therapy in which the osteopath’s hands are the primary tools for assessment and treatment. It complements medical assessment and care.\n\nOsteopaths are authorised healthcare professionals and practise in accordance with healthcare legislation.",
    heroPriceNo: "fra 950 kr",
    heroPriceEn: "from NOK 950",
    heroPriceLabelNo: "Osteopati",
    heroPriceLabelEn: "Osteopathy",
    reasonsTitleNo: "Om osteopati",
    reasonsTitleEn: "About osteopathy",
    midCtaNo: "Snakk med en av våre osteopater",
    midCtaEn: "Talk to one of our osteopaths",
    promiseVariant: "standard",
    relatedSlugs: ["psykologi", "sexologi", "ernaeringsfysiolog"],
    reasons: [
      {
        titleNo: "Kvinnehelse",
        titleEn: "Women’s health",
        descNo:
          "På det tverrfaglige behandlingsteamet hos oss har osteopaten en naturlig plass i behandlingsplanen innenfor vulvasmerter, bekkenbunnsdysfunksjon, smerter og nedsatt funksjon i muskelskjelettsystemet, i oppfølging av gravide kvinner og kvinner etter fødsel. Osteopatisk behandling kan også ha gunstig effekt ved smerter relatert til endometriose/adenomyose og stress.",
        descEn:
          "Within our multidisciplinary team, osteopathy has a natural role in care for vulval pain, pelvic-floor dysfunction, musculoskeletal pain and reduced function, and in follow-up during and after pregnancy. It may also help pain associated with endometriosis, adenomyosis and stress.",
      },
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo:
          "Manuell behandling, fysisk aktivitet og håndtering av en stressende hverdag er noe av det vanligste osteopater jobber med. Osteopater benytter seg av et bredt spekter av manuelle behandlingsteknikker i hele kroppen. Behandlingen tilpasses deg, syklus, dagsform og livssituasjon.",
        descEn:
          "Manual treatment, physical activity and managing a stressful everyday life are central to osteopathy. Osteopaths use a broad range of manual techniques throughout the body, tailored to you, your cycle, how you feel that day and your circumstances.",
      },
      {
        titleNo: "Tverrfaglig",
        titleEn: "Multidisciplinary care",
        descNo:
          "Det unike på CMedical er at osteopatene jobber tett i tverrfaglig team med gynekolog og urolog om ulike gynekologiske og urologiske problemstillinger. Vi holder tett dialog og skreddersyr din behandling.",
        descEn:
          "At CMedical, our osteopaths work closely with gynaecologists and urologists on a range of gynaecological and urological concerns. We maintain close communication and tailor your treatment.",
      },
      {
        titleNo: "Mål med behandling",
        titleEn: "Treatment goals",
        descNo:
          "Osteopaten er opptatt av å finne hva som er viktig for deg, og hvordan dere sammen kan skape en trygg arena der du kan bruke kroppen din på en god måte. En trygg arena for tillitsfull kommunikasjon og behandling er alltid et hovedmål.",
        descEn:
          "The osteopath seeks to understand what matters to you and to create a safe setting in which you can use your body well. A secure environment for trust, communication and treatment is always a primary goal.",
      },
    ],
  },

  revmatologi: {
    titleNo: "Revmatologi",
    titleEn: "Rheumatology",
    heroTitleNo: "Revmatologi",
    heroTitleEn: "Rheumatology",
    heroLeadNo:
      "Revmatologi er en spesialitet innen medisin som handler om å forstå og behandle problemer med ledd, muskler og bindevev i kroppen. Revmatologer utreder, behandler og følger opp pasienter med revmatisme. For å finne ut om du har revmatisme starter vi med grundig konsultasjon og undersøkelse, som ofte innebærer ultralyd og blodprøver.",
    heroLeadEn:
      "Rheumatology is a medical specialty concerned with understanding and treating problems affecting the joints, muscles and connective tissues. Rheumatologists assess, treat and follow up people with rheumatic disease. Assessment begins with a thorough consultation and examination, often including ultrasound and blood tests.",
    heroPriceNo: "fra 3.150 kr",
    heroPriceEn: "from NOK 3,150",
    heroPriceLabelNo: "Revmatologisk konsultasjon",
    heroPriceLabelEn: "Rheumatology consultation",
    reasonsTitleNo: "Om revmatologi",
    reasonsTitleEn: "About rheumatology",
    midCtaNo: "Snakk med en av våre revmatologer",
    midCtaEn: "Talk to one of our rheumatologists",
    promiseVariant: "standard",
    relatedSlugs: ["endokrinologi", "osteopati"],
    reasons: [
      {
        titleNo: "Leddgikt",
        titleEn: "Inflammatory arthritis",
        descNo:
          "Vi utreder og behandler betennelsessykdommer i ledd, blant annet revmatoid artritt.",
        descEn:
          "We assess and treat inflammatory joint diseases, including rheumatoid arthritis.",
      },
      {
        titleNo: "Artrose",
        titleEn: "Osteoarthritis",
        descNo:
          "Grundig vurdering av leddsmerter og funksjon, med behandling og råd tilpasset deg.",
        descEn:
          "Thorough assessment of joint pain and function, with treatment and advice tailored to you.",
      },
      {
        titleNo: "Bindevevssykdommer",
        titleEn: "Connective tissue diseases",
        descNo:
          "Utredning og oppfølging av autoimmune bindevevssykdommer, som systemisk lupus erythematosus.",
        descEn:
          "Assessment and follow-up of autoimmune connective tissue diseases such as systemic lupus erythematosus.",
      },
    ],
  },

  psykologi: {
    titleNo: "Psykologi",
    titleEn: "Psychology",
    heroTitleNo: "Psykologi",
    heroTitleEn: "Psychology",
    heroLeadNo:
      "Du trenger ikke å ha en psykisk lidelse eller diagnose for å gå til psykolog. Mange ønsker å ha en nøytral samtalepartner over kortere eller lengre tid for å sortere tanker og følelser, eller motta støtte gjennom en utfordrende periode med f.eks. endometriose-, vulvodyni- eller fertilitetsbehandling. Hos oss jobber våre spesialister i unike tverrfaglige team for å hjelpe deg best mulig.",
    heroLeadEn:
      "You do not need a mental health condition or diagnosis to see a psychologist. Many people value a neutral person to talk to, for a shorter or longer period, to process thoughts and feelings or receive support through challenging treatment for endometriosis, vulvodynia or fertility, for example. Our specialists work in distinctive multidisciplinary teams to support you as effectively as possible.",
    heroPriceNo: "fra 1.900 kr",
    heroPriceEn: "from NOK 1,900",
    heroPriceLabelNo: "Psykologtime",
    heroPriceLabelEn: "Psychology appointment",
    reasonsTitleNo: "Om psykologi",
    reasonsTitleEn: "About psychology",
    midCtaNo: "Snakk med en av våre psykologer",
    midCtaEn: "Talk to one of our psychologists",
    promiseVariant: "standard",
    relatedSlugs: ["sexologi", "osteopati"],
    reasons: [
      {
        titleNo: "Hva kan vi hjelpe med?",
        titleEn: "How can we help?",
        descNo:
          "Hos psykolog kan du få hjelp til å håndtere smerter, bearbeide vanskelige erfaringer, utforske identitet og seksualitet, og du kan bli utredet og behandlet for psykiske lidelser. Om det dukker opp andre plager som trenger videre oppfølging, kan en psykolog henvise deg til videre utredning og behandling.",
        descEn:
          "A psychologist can help you manage pain, process difficult experiences and explore identity and sexuality, as well as assess and treat mental health conditions. If other concerns emerge, the psychologist can refer you for further assessment and treatment.",
      },
      {
        titleNo: "Fertilitetsrådgivning",
        titleEn: "Fertility counselling",
        descNo:
          "Vi tilbyr støtte til kvinner, menn og par som opplever ufrivillig barnløshet. Samtalene tilpasses individuelle behov og gir hjelp til å uttrykke og bearbeide følelser, støtte hverandre og håndtere sorg ved mislykkede forsøk eller spontanaborter.",
        descEn:
          "We support women, men and couples experiencing involuntary childlessness. Sessions are tailored to individual needs and help people express and process emotions, support one another and manage grief after unsuccessful treatment or miscarriage.",
      },
      {
        titleNo: "Angst, depresjon og traumer",
        titleEn: "Anxiety, depression and trauma",
        descNo:
          "Utredning, behandling og støtte ved angst, depresjon, traumer og krevende livsperioder.",
        descEn:
          "Assessment, treatment and support for anxiety, depression, trauma and challenging periods in life.",
      },
    ],
  },

  sexologi: {
    titleNo: "Sexologi",
    titleEn: "Sexology",
    heroTitleNo: "Sexologi",
    heroTitleEn: "Sexology",
    heroLeadNo:
      "Når du rammes av sykdom eller helseutfordringer, enten fysiske eller psykiske, kan det også oppstå utfordringer knyttet til seksuell helse. Dette kan dreie seg om seksuell funksjon, lyst, tenning, selvbilde, kroppsbilde, seksuell glede, relasjoner eller identitet.",
    heroLeadEn:
      "When you are affected by illness or health challenges — physical or mental — challenges related to sexual health can also arise. This may involve sexual function, desire, arousal, self-image, body image, sexual pleasure, relationships or identity.",
    heroPriceNo: "fra 1.750 kr",
    heroPriceEn: "from NOK 1,750",
    heroPriceLabelNo: "Sexologisk rådgivning",
    heroPriceLabelEn: "Sexology counselling",
    reasonsTitleNo: "Om sexologi",
    reasonsTitleEn: "About sexology",
    reasonsLeadNo:
      "Når du rammes av sykdom eller helseutfordringer, enten fysiske eller psykiske, kan det også oppstå utfordringer knyttet til seksuell helse.",
    reasonsLeadEn:
      "When you are affected by illness or health challenges — physical or mental — challenges related to sexual health can also arise.",
    midCtaNo: "Snakk med en av våre sexologer",
    midCtaEn: "Talk to one of our sexologists",
    promiseVariant: "standard",
    relatedSlugs: [
      "revmatologi",
      "endokrinologi",
      "osteopati",
      "psykologi",
      "ernaeringsfysiolog",
      "areknuter",
      "gastrokirurgi",
      "hudbehandlinger",
    ],
    reasons: [
      {
        titleNo: "Skreddersydd veiledning",
        titleEn: "Tailored guidance",
        descNo:
          "Ved diagnoser assosiert med smerte og fysisk ubehag gir en sexolog tilpasset veiledning. Dette kan inkludere strategier for smertelindring, alternative former for seksuell nytelse og bedre kommunikasjon i parforholdet. Ved ufrivillig barnløshet kan rådgivning bidra til å bevare intimitet og redusere stress.",
        descEn:
          "For conditions associated with pain and physical discomfort, a sexologist offers tailored guidance on pain relief, alternative forms of sexual pleasure and communication within a relationship. During fertility difficulties, counselling can help preserve intimacy and reduce stress.",
      },
      {
        titleNo: "Kompetanseområder",
        titleEn: "Areas of expertise",
        descNo:
          "Vi hjelper blant annet med vulvasmerter, vaginisme, seksualitet etter overgrep og i overgangsalder, seksuell identitet og orientering, lyst- og funksjonsutfordringer, erektil dysfunksjon, hormonelle endringer og veiledning om seksuelle hjelpemidler.",
        descEn:
          "We help with vulval pain, vaginismus, sexuality after abuse and during menopause, sexual identity and orientation, desire and function, erectile dysfunction, hormonal changes and sexual aids.",
      },
    ],
  },

  brokkoperasjon: {
    titleNo: "Brokkoperasjon",
    titleEn: "Hernia surgery",
    heroTitleNo: "Brokkoperasjon",
    heroTitleEn: "Hernia surgery",
    heroLeadNo:
      "Lyskebrokk er en svært vanlig tilstand som skyldes en medfødt svakhet i bukveggen der sædlederen hos menn og det runde livmorsbåndet hos kvinner går gjennom bukveggen i lyskekanalen. Svakheten kan innebære at man utvikler et indirekte brokk der tarminnhold vandrer inn i lyskekanalen og noen ganger ned i pungen, eller et direkte brokk der tarminnhold lager seg en lomme ved siden av lyskekanalen. En sjelden gang kan også brokket ligge under lyskebåndet og ned mot øvre del av låret og kalles da for et lårbrokk. Hos CMedical opererer vi lyskebrokk med den nyeste og mest avanserte robotteknologien, noe som sikrer maksimal trygghet og et skånsomt forløp for deg.",
    heroLeadEn:
      "An inguinal hernia is a very common condition caused by an inborn weakness in the abdominal wall where the spermatic cord in men and the round ligament in women pass through the inguinal canal. This may result in an indirect hernia, where bowel enters the canal and sometimes the scrotum, or a direct hernia, where bowel forms a pocket beside the canal. More rarely, a femoral hernia develops below the inguinal ligament towards the upper thigh. At CMedical, we repair inguinal hernias using the latest advanced robotic technology for maximum safety and a gentle recovery.",
    reasonsTitleNo: "Om brokkoperasjon",
    reasonsTitleEn: "About hernia surgery",
    midCtaNo: gastroCta.no,
    midCtaEn: gastroCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["gastrokirurgi", "overvektskirurgi", "hemorroider"],
    reasons: [
      {
        titleNo: "Fordeler med robotassistert brokkoperasjon",
        titleEn: "Benefits of robot-assisted hernia surgery",
        descNo:
          "Robotkirurger kan utføre ekstremt presise bevegelser gjennom kun tre små hull i magen. Det gir minimal skade på omkringliggende vev, nerver og organer, mindre smerter og ubehag, raskere restitusjon og et penere kosmetisk resultat.",
        descEn:
          "Robotic surgery enables extremely precise movements through just three small abdominal openings. This minimises damage to nearby tissue, nerves and organs, reduces pain and discomfort, speeds recovery and gives a better cosmetic result.",
      },
      {
        titleNo: "Hvordan foregår operasjonen?",
        titleEn: "How is the operation performed?",
        descNo:
          "Inngrepet gjøres i full narkose og tar cirka 60–90 minutter. Kirurgen trekker brokksekken forsiktig tilbake på plass og legger et forsterkende nett over svakheten i bukveggen for å forhindre at brokket kommer tilbake. Lokalbedøvelse i de små sårene bidrar til lite smerter etterpå.",
        descEn:
          "The procedure is performed under general anaesthesia and takes about 60–90 minutes. The surgeon returns the hernia sac to its proper position and places reinforcing mesh over the weakness to prevent recurrence. Local anaesthetic in the small wounds helps minimise pain afterwards.",
      },
      {
        titleNo: "Før og etter operasjonen",
        titleEn: "Before and after surgery",
        descNo:
          "Du reiser vanligvis hjem samme dag og må ha en voksen hos deg det første døgnet. Oppblåsthet og skulderubehag de første dagene er normalt. Unngå tunge løft over 10 kilo de første 6 ukene; sykemelding er som regel 4 uker.",
        descEn:
          "You normally go home the same day and need an adult with you for the first 24 hours. Bloating and shoulder discomfort are normal for the first few days. Avoid lifting more than 10 kilograms for six weeks; sick leave is usually four weeks.",
      },
    ],
  },

  hemorroider: {
    titleNo: "Hemorroider og endetarmsplager (rektocele)",
    titleEn: "Haemorrhoids and rectal conditions (rectocele)",
    heroTitleNo: "Hemorroider og endetarmsplager (rektocele)",
    heroTitleEn: "Haemorrhoids and rectal conditions (rectocele)",
    heroLeadNo:
      "Hemorroider er utposninger av blodårer i endetarmen, og kan best beskrives som en slags åreknute. Marisker kan sitte på de samme stedene, men består av hud og bindevev uten store blodårer. Dette er svært vanlige og ufarlige tilstander, men de kan skape betydelig ubehag og smerte i hverdagen.",
    heroLeadEn:
      "Haemorrhoids are swollen blood vessels in the rectum and can be described as a type of varicose vein. Anal skin tags may occur in the same places but consist of skin and connective tissue without large blood vessels. These conditions are very common and harmless, but can cause substantial everyday discomfort and pain.",
    reasonsTitleNo: "Om hemorroider og endetarmsplager (rektocele)",
    reasonsTitleEn: "About haemorrhoids and rectal conditions (rectocele)",
    reasonsLeadNo:
      "Hemorroider er utposninger av blodårer i endetarmen, og kan best beskrives som en slags åreknute. Marisker kan sitte på de samme stedene, men består av hud og bindevev uten store blodårer.",
    reasonsLeadEn:
      "Haemorrhoids are swollen blood vessels in the rectum and can be described as a type of varicose vein. Anal skin tags may occur in the same places but consist of skin and connective tissue without large blood vessels.",
    reasonsLayout: "prose",
    midCtaNo: gastroCta.no,
    midCtaEn: gastroCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["gastrokirurgi", "brokkoperasjon", "overvektskirurgi"],
    reasons: [
      {
        titleNo: "Behandling av hemorroider og marisker",
        titleEn: "Treatment of haemorrhoids and skin tags",
        descNo:
          "Hemorroider er utposninger av blodårer i endetarmen, og kan best beskrives som en slags åreknute. Marisker kan sitte på de samme stedene, men består av hud og bindevev uten store blodårer. Dette er svært vanlige og ufarlige tilstander, men de kan skape betydelig ubehag og smerte i hverdagen. Når egenbehandling og reseptfrie salver ikke lenger hjelper, kan kirurgisk behandling være den beste løsningen for å bli helt kvitt plagene.",
        descEn:
          "Haemorrhoids are swollen blood vessels in the rectum and can be described as a type of varicose vein. Anal skin tags may occur in the same places but consist of skin and connective tissue without large blood vessels. These conditions are very common and harmless, but can cause substantial everyday discomfort and pain. When self-care and non-prescription ointments no longer help, surgery may be the best way to resolve the symptoms fully.",
      },
    ],
  },

  overvektskirurgi: {
    titleNo: "Overvektskirurgi (slankeoperasjon)",
    titleEn: "Bariatric surgery (weight-loss surgery)",
    heroTitleNo: "Overvektskirurgi (slankeoperasjon)",
    heroTitleEn: "Bariatric surgery (weight-loss surgery)",
    heroLeadNo:
      "Som den eneste private aktøren i Norden tilbyr vi robotassistert overvektskirurgi med høyeste presisjon og skånsomhet. Med avansert 3D-visualisering og mikrobevegelser styrt av erfarne kirurger, får du en trygg behandling som kan gi mindre smerter og raskere restitusjon.\n\nEtter ett år kan pasienter forvente et vekttap på 20–25 % av total kroppsvekt, samt en varig forbedring av helserelatert livskvalitet.",
    heroLeadEn:
      "As the only private provider in the Nordic region, we offer robot-assisted bariatric surgery with the highest levels of precision and gentleness. Advanced 3D visualisation and micro-movements controlled by experienced surgeons provide safe treatment that may mean less pain and faster recovery.\n\nAfter one year, patients can expect to lose 20–25% of their total body weight, together with a lasting improvement in health-related quality of life.",
    reasonsTitleNo: "Om overvektskirurgi",
    reasonsTitleEn: "About bariatric surgery",
    midCtaNo: gastroCta.no,
    midCtaEn: gastroCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "gastrokirurgi",
      "brokkoperasjon",
      "hemorroider",
      "ernaeringsfysiolog",
    ],
    reasons: [
      {
        titleNo: "Våre operasjonsmetoder",
        titleEn: "Our surgical methods",
        descNo:
          "Vi tilbyr robotassistert sleeve-gastrektomi (rSG), der 60–80 % av magesekken fjernes og resten formes til en «sleeve», og SASI robotassistert sleeve bypass, der det i tillegg lages en kobling til nedre del av tynntarmen uten at tarmen deles. Hele prosedyren styres av en erfaren kirurg.",
        descEn:
          "We offer robot-assisted sleeve gastrectomy (rSG), in which 60–80% of the stomach is removed and the remainder shaped into a sleeve, and SASI robot-assisted sleeve bypass, which also creates a connection to the lower small bowel without dividing the intestine. An experienced surgeon controls the entire procedure.",
      },
      {
        titleNo: "Fordeler med robotassistert kirurgi",
        titleEn: "Benefits of robot-assisted surgery",
        descNo:
          "Mindre smerter og kortere restitusjonstid, redusert blodtap og færre komplikasjoner, små skånsomme snitt og raskere retur til hverdagen. Mange reiser hjem dagen etter operasjonen, og sykemeldingen er vanligvis cirka fire uker.",
        descEn:
          "Benefits include less pain and faster recovery, reduced blood loss and fewer complications, small gentle incisions and a quicker return to everyday life. Many go home the next day, and sick leave is normally about four weeks.",
      },
      {
        titleNo: "Veien gjennom behandlingen",
        titleEn: "Your treatment pathway",
        descNo:
          "Før operasjonen møter du det tverrfaglige teamet og følger en medisinsk lavkaloridiett i tre uker. Inngrepet tar cirka 30–60 minutter, og du tilbringer én natt hos oss. Oppfølgingspakken varer ett år og inkluderer fire konsultasjoner hos klinisk ernæringsfysiolog.",
        descEn:
          "Before surgery, you meet the multidisciplinary team and follow a medically supervised low-calorie diet for three weeks. The operation takes about 30–60 minutes and you stay one night. The one-year follow-up package includes four consultations with a clinical nutritionist.",
      },
      {
        titleNo: "Trygg behandling hos erfarne spesialister",
        titleEn: "Safe treatment from experienced specialists",
        descNo:
          "Behandlingen utføres av spesialister med lang erfaring innen overvektskirurgi, gastrokirurgi, avansert endoskopi og robotassistert kirurgi.",
        descEn:
          "Treatment is provided by specialists with extensive experience in bariatric and gastrointestinal surgery, advanced endoscopy and robot-assisted surgery.",
      },
    ],
  },

  hudpleieprodukter: {
    titleNo: "Hudpleieprodukter — SkinCeuticals",
    titleEn: "Skincare products — SkinCeuticals",
    heroTitleNo: "Hudpleieprodukter — SkinCeuticals",
    heroTitleEn: "Skincare products — SkinCeuticals",
    heroLeadNo:
      "SkinCeuticals er et anerkjent medisinsk hudpleiemerke utviklet med utgangspunkt i avansert dermatologisk forskning. Produktene er formulert for å beskytte sunn hud, korrigere eksisterende hudskader og forebygge fremtidige hudproblemer — med dokumenterte resultater.",
    heroLeadEn:
      "SkinCeuticals is a recognised medical-grade skincare brand developed from advanced dermatological research. Its products are formulated to protect healthy skin, correct existing damage and prevent future skin problems, with documented results.",
    reasonsTitleNo: "Om hudpleieproduktene",
    reasonsTitleEn: "About the skincare products",
    midCtaNo: specialistCta.no,
    midCtaEn: specialistCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["hudbehandlinger", "behandlingsutstyr", "hudhelse"],
    reasons: [
      {
        titleNo: "Hudpleieprodukter med dokumentert effekt — oppdag SkinCeuticals",
        titleEn: "Skincare with documented results — discover SkinCeuticals",
        descNo:
          "Med høye konsentrasjoner av aktive ingredienser, som antioksidanter inkludert vitamin C, tilbyr SkinCeuticals målrettede løsninger for ulike hudtilstander. Serien passer både til daglig pleie og som et komplement til estetiske behandlinger. For best resultat anbefaler vi hjelp fra vår fagperson og dermatolog til å sette sammen en hudpleieplan. Produktene kan kjøpes på vår klinikk på Bekkestua.",
        descEn:
          "With high concentrations of active ingredients, including antioxidants such as vitamin C, SkinCeuticals offers targeted solutions for different skin concerns. The range suits both daily care and use alongside aesthetic treatments. For the best result, our skincare professional and dermatologist can create a tailored plan. Products are available at our Bekkestua clinic.",
      },
    ],
  },

  behandlingsutstyr: {
    titleNo: "Behandlingsutstyr (IPL)",
    titleEn: "Treatment equipment (IPL)",
    heroTitleNo: "Behandlingsutstyr (IPL)",
    heroTitleEn: "Treatment equipment (IPL)",
    heroLeadNo:
      "Hos CMedical Bekkestua tilbyr vi laserbehandling og IPL-behandling (Intense Pulsed Light) — en trygg og effektiv metode som bruker lysenergi til å behandle ulike hudplager. Mange oppsøker oss for å få hjelp med rødhet, synlige blodkar, pigmentforandringer eller solskadet hud. Behandlingen kan også bidra til en jevnere hudtone og bedre hudkvalitet over tid.",
    heroLeadEn:
      "At CMedical Bekkestua, we offer laser and IPL (Intense Pulsed Light) treatment — a safe and effective method that uses light energy for a range of skin concerns. Many people seek help for redness, visible blood vessels, pigmentation or sun-damaged skin. Treatment may also improve skin tone and quality over time.",
    reasonsTitleNo: "Om IPL-behandling",
    reasonsTitleEn: "About IPL treatment",
    midCtaNo: specialistCta.no,
    midCtaEn: specialistCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["hudbehandlinger", "hudpleieprodukter", "hudhelse"],
    reasons: [
      {
        titleNo: "En skånsom behandling for bedre hudhelse",
        titleEn: "A gentle treatment for better skin health",
        descNo:
          "For oss handler IPL om hudhelse og livskvalitet. Ujevn pigmentering, rosacea eller vedvarende rødhet kan være mer enn et kosmetisk problem — det kan påvirke både velvære og selvtillit. Vi møter deg med forståelse og medisinsk kompetanse, og vurderer alltid om IPL er riktig behandling for deg.",
        descEn:
          "For us, IPL is about skin health and quality of life. Uneven pigmentation, rosacea or persistent redness can be more than cosmetic and may affect wellbeing and confidence. We meet you with understanding and medical expertise and always assess whether IPL is right for you.",
      },
      {
        titleNo: "Trygghet, informasjon og realistiske forventninger",
        titleEn: "Safety, information and realistic expectations",
        descNo:
          "Behandlingen utføres av hudlege, og vi legger vekt på trygghet, informasjon og realistiske forventninger.",
        descEn:
          "Treatment is performed by a dermatologist, with an emphasis on safety, clear information and realistic expectations.",
      },
      {
        titleNo: "Bestill en uforpliktende vurdering",
        titleEn: "Book a no-obligation assessment",
        descNo:
          "Ønsker du å vite om IPL kan være et godt alternativ for deg? Ta kontakt med Linnea hos oss for en uforpliktende vurdering — vi hjelper deg gjerne.",
        descEn:
          "Would you like to know whether IPL may be suitable for you? Contact Linnea for a no-obligation assessment — we are happy to help.",
      },
    ],
  },

  foflekksjekk: {
    titleNo: "Føflekksjekk",
    titleEn: "Mole check",
    heroTitleNo: "Føflekksjekk",
    heroTitleEn: "Mole check",
    heroLeadNo:
      "Regelmessig kontroll av føflekker er viktig for å oppdage tidlige tegn på hudforandringer som kan kreve behandling.",
    heroLeadEn:
      "Regular mole checks are important for detecting early signs of skin changes that may require treatment.",
    reasonsTitleNo: "Om føflekksjekken",
    reasonsTitleEn: "About the mole check",
    midCtaNo: dermatologyCta.no,
    midCtaEn: dermatologyCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["hudbehandlinger", "hudhelse", "kosmetisk-dermatologi"],
    reasons: [
      {
        titleNo: "Om føflekksjekken",
        titleEn: "About the mole check",
        descNo:
          "Regelmessig kontroll av føflekker er viktig for å oppdage tidlige tegn på hudforandringer som kan kreve behandling. Hudlegen gjennomgår hele huden fra topp til tå og bruker et dermatoskop for et forstørret og detaljert innsyn i hudens strukturer. Hudlegen ser etter endringer i form, farge, grenser og struktur som kan tyde på malignitet eller andre tilstander som bør følges opp.",
        descEn:
          "Regular mole checks help detect early skin changes that may need treatment. The dermatologist examines your skin from head to toe and uses a dermatoscope for a magnified, detailed view. Changes in shape, colour, borders and structure are assessed for signs of malignancy or other conditions requiring follow-up.",
      },
      {
        titleNo: "Aktuelle indikasjoner for føflekksjekk",
        titleEn: "Reasons to have a mole check",
        descNo:
          "Kontroll av eksisterende føflekker og pigmentforandringer, vurdering av nye eller endrede hudlesjoner, screening ved høy soleksponering eller familiær hudkrefthistorikk og jevnlig oppfølging ved mange føflekker. Undersøkelsen er ikke-invasiv og gjennomføres i konsultasjonen.",
        descEn:
          "Reasons include checking existing moles and pigmentation, assessing new or changing lesions, screening after high sun exposure or with a family history of skin cancer, and regular follow-up when you have many moles. The examination is non-invasive and completed during the consultation.",
      },
    ],
  },

  "kosmetisk-dermatologi": {
    titleNo: "Hudhelse og kosmetisk dermatologi",
    titleEn: "Skin health and cosmetic dermatology",
    heroTitleNo: "Hudhelse og kosmetisk dermatologi",
    heroTitleEn: "Skin health and cosmetic dermatology",
    heroLeadNo:
      "Ved CMedical arbeider vi både med medisinske hudtilstander og kosmetisk dermatologi.",
    heroLeadEn:
      "At CMedical, we work with both medical skin conditions and cosmetic dermatology.",
    reasonsTitleNo: "Om behandlingen",
    reasonsTitleEn: "About the treatment",
    midCtaNo: dermatologyCta.no,
    midCtaEn: dermatologyCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["hudbehandlinger", "hudhelse", "forbedring-av-hudstruktur"],
    reasons: [
      {
        titleNo: "Om behandlingen",
        titleEn: "About the treatment",
        descNo:
          "Ved CMedical arbeider vi både med medisinske hudtilstander og kosmetisk dermatologi. Mange pasienter oppsøker oss for akne, perioral dermatitt, pigmentforandringer, solskadet hud og hudforandringer som bør vurderes av hudlege. Kosmetiske behandlinger kan i noen tilfeller være en del av en helhetlig behandling av huden.",
        descEn:
          "At CMedical, we work with both medical skin conditions and cosmetic dermatology. Patients commonly seek help for acne, perioral dermatitis, pigmentation, sun-damaged skin and changes that should be assessed by a dermatologist. Cosmetic procedures may sometimes form part of comprehensive skin treatment.",
      },
    ],
  },

  "elastisitet-og-volum": {
    titleNo: "Elastisitet og volum",
    titleEn: "Elasticity and volume",
    heroTitleNo: "Elastisitet og volum",
    heroTitleEn: "Elasticity and volume",
    heroLeadNo:
      "Med alderen reduseres hudens elastisitet og volum. Vi tilbyr behandlinger som kan bidra til å redusere synlige linjer og gi bedre hudstruktur.",
    heroLeadEn:
      "Skin loses elasticity and volume with age. We offer treatments that can help reduce visible lines and improve skin texture.",
    reasonsTitleNo: "Om behandlingen",
    reasonsTitleEn: "About the treatment",
    midCtaNo: dermatologyCta.no,
    midCtaEn: dermatologyCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["hudbehandlinger", "forbedring-av-hudstruktur", "kosmetisk-dermatologi"],
    reasons: [
      {
        titleNo: "Om behandlingen",
        titleEn: "About the treatment",
        descNo:
          "Med alderen reduseres hudens elastisitet og volum. Vi tilbyr behandlinger som kan bidra til å redusere synlige linjer og gi bedre hudstruktur. Aktuelle behandlinger kan inkludere rynkebehandling, Profhilo, Radiesse, behandling av slapp hud og Skin boosters. Behandlingen tilpasses individuelt etter hudtype, alder og ønsket resultat.",
        descEn:
          "Skin loses elasticity and volume with age. Treatments that may reduce visible lines and improve texture include wrinkle treatment, Profhilo, Radiesse, treatment for lax skin and skin boosters. Treatment is individually tailored to your skin type, age and desired result.",
      },
    ],
  },

  "forbedring-av-hudstruktur": {
    titleNo: "Forbedring av hudstruktur",
    titleEn: "Improving skin texture",
    heroTitleNo: "Forbedring av hudstruktur",
    heroTitleEn: "Improving skin texture",
    heroLeadNo:
      "Noen opplever ujevn hudtekstur, aknearr eller redusert glød i huden. I slike tilfeller kan behandlinger som stimulerer hudens egen fornyelse være aktuelt.",
    heroLeadEn:
      "Some people experience uneven skin texture, acne scarring or reduced radiance. Treatments that stimulate the skin’s own renewal may then be appropriate.",
    reasonsTitleNo: "Om behandlingen",
    reasonsTitleEn: "About the treatment",
    midCtaNo: dermatologyCta.no,
    midCtaEn: dermatologyCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["hudbehandlinger", "elastisitet-og-volum", "kosmetisk-dermatologi"],
    reasons: [
      {
        titleNo: "Om behandlingen",
        titleEn: "About the treatment",
        descNo:
          "Noen opplever ujevn hudtekstur, aknearr eller redusert glød i huden. I slike tilfeller kan behandlinger som stimulerer hudens egen fornyelse være aktuelt. Vi tilbyr blant annet microneedling, mesoterapi og behandling for jevnere hudtone.",
        descEn:
          "Uneven texture, acne scarring or reduced radiance may benefit from treatments that stimulate the skin’s own renewal. We offer microneedling, mesotherapy and treatment for a more even skin tone.",
      },
    ],
  },

  "pigmentforandringer-og-solskader": {
    titleNo: "Pigmentforandringer og solskader",
    titleEn: "Pigmentation changes and sun damage",
    heroTitleNo: "Pigmentforandringer og solskader",
    heroTitleEn: "Pigmentation changes and sun damage",
    heroLeadNo:
      "Pigmentflekker og ujevn hudtone er vanlig etter mange år med solpåvirkning. Hos hudlege kan slike hudforandringer vurderes og behandles.",
    heroLeadEn:
      "Pigmentation and uneven skin tone are common after many years of sun exposure. A dermatologist can assess and treat these changes.",
    reasonsTitleNo: "Om behandlingen",
    reasonsTitleEn: "About the treatment",
    midCtaNo: dermatologyCta.no,
    midCtaEn: dermatologyCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["hudbehandlinger", "rodhet-og-synlige-blodkar", "foflekksjekk"],
    reasons: [
      {
        titleNo: "Om behandlingen",
        titleEn: "About the treatment",
        descNo:
          "Pigmentflekker og ujevn hudtone er vanlig etter mange år med solpåvirkning. Hos hudlege kan slike hudforandringer vurderes og behandles. Vi tilbyr blant annet IPL-behandling av pigmentflekker, behandling av solskadet hud og vurdering av pigmentforandringer. Før behandling vurderer hudlegen alltid flekkene medisinsk.",
        descEn:
          "Pigmentation and uneven skin tone are common after years of sun exposure. A dermatologist can assess and treat these changes. We offer IPL for pigmentation, treatment of sun-damaged skin and medical assessment of pigment changes. The dermatologist always assesses marks medically before treatment.",
      },
    ],
  },

  "rodhet-og-synlige-blodkar": {
    titleNo: "Rødhet og synlige blodkar",
    titleEn: "Redness and visible blood vessels",
    heroTitleNo: "Rødhet og synlige blodkar",
    heroTitleEn: "Redness and visible blood vessels",
    heroLeadNo:
      "Diffus rødhet i huden og sprengte blodkar er vanlig i ansiktet. Dette kan blant annet skyldes rosacea eller solpåvirkning.",
    heroLeadEn:
      "Diffuse redness and broken blood vessels are common on the face and may be caused by rosacea or sun exposure, among other factors.",
    reasonsTitleNo: "Om behandlingen",
    reasonsTitleEn: "About the treatment",
    midCtaNo: dermatologyCta.no,
    midCtaEn: dermatologyCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["hudbehandlinger", "pigmentforandringer-og-solskader", "hudhelse"],
    reasons: [
      {
        titleNo: "Om behandlingen",
        titleEn: "About the treatment",
        descNo:
          "Diffus rødhet i huden og sprengte blodkar er vanlig i ansiktet. Dette kan blant annet skyldes rosacea eller solpåvirkning. Aktuelle behandlinger er IPL-behandling av rødhet, behandling av sprengte blodkar og behandling av diffus rødhet i ansiktet.",
        descEn:
          "Diffuse facial redness and broken blood vessels may be caused by rosacea or sun exposure. Options include IPL for redness, treatment of broken capillaries and treatment of diffuse facial redness.",
      },
    ],
  },
};
