/**
 * Authoritative «Om» section copy for gynekologi treatments (after hero).
 * Source: user dump from avenewdemo.online — Norwegian verbatim + EN translation.
 * Layout: accordion (collapsed) for every page with expandable points.
 */
export type OmReason = {
  titleNo: string;
  titleEn: string;
  descNo: string;
  descEn: string;
};

export type OmSection = {
  reasonsTitleNo: string;
  reasonsTitleEn: string;
  reasonsLeadNo: string;
  reasonsLeadEn: string;
  reasons: OmReason[];
};

export const GYN_OM_SECTIONS: Record<string, OmSection> = {
  tverrfaglig: {
    reasonsTitleNo: "Om tverrfaglig team: osteopat, sexolog, psykolog, ernæring",
    reasonsTitleEn: "About the multidisciplinary team: osteopathy, sexology, psychology, nutrition",
    reasonsLeadNo:
      "Manuell behandlingsform som komplementerer medisinsk utredning og behandling innenfor vulvasmerter, bekkenbunnsdysfunksjon og muskelskjelettplager.",
    reasonsLeadEn:
      "A manual treatment approach that complements medical assessment and care for vulval pain, pelvic floor dysfunction and musculoskeletal problems.",
    reasons: [
      {
        titleNo: "Osteopat",
        titleEn: "Osteopath",
        descNo:
          "Manuell behandling som supplerer medisinsk utredning ved vulvasmerter, bekkenbunnsdysfunksjon og muskel- og skjelettplager.",
        descEn:
          "Manual treatment that complements medical assessment for vulval pain, pelvic floor dysfunction and musculoskeletal problems.",
      },
      {
        titleNo: "Sexolog",
        titleEn: "Sexologist",
        descNo:
          "Terapeutiske samtaler og veiledning om seksuell helse, funksjon, lyst, selvbilde og intimitet.",
        descEn:
          "Therapeutic conversations and guidance on sexual health, function, desire, self-image and intimacy.",
      },
      {
        titleNo: "Psykolog",
        titleEn: "Psychologist",
        descNo:
          "Hjelp til å sortere tanker og følelser, håndtere smerter og få støtte gjennom krevende behandlingsforløp.",
        descEn:
          "Help with processing thoughts and emotions, managing pain and receiving support through demanding treatment.",
      },
      {
        titleNo: "Ernæringsfysiolog",
        titleEn: "Dietitian",
        descNo:
          "Individuell kostholdsveiledning med betydning for hormoner, fertilitet, overgangsalder og generell helse.",
        descEn:
          "Individual nutrition advice relevant to hormones, fertility, menopause and general health.",
      },
    ],
  },

  undersokelse: {
    reasonsTitleNo: "Om gynekologisk undersøkelse",
    reasonsTitleEn: "About a gynaecological examination",
    reasonsLeadNo:
      "Hos CMedical hjelper vi deg med alt innen gynekologiske problemstillinger – fra utredning til behandling. Vi har et bredt behandlingstilbud av høyeste kvalitet. Hos oss møter du engasjerte gynekologer som jobber med den kvinnesykdommen de kan best. Hos oss kan du bestille rutinesjekk eller konsultasjon til annen gynekologisk utredning.",
    reasonsLeadEn:
      "At CMedical we help with all types of gynaecological concerns — from assessment to treatment. We offer a broad range of high-quality care. You meet dedicated gynaecologists who focus on the area of women’s health they know best. You can book a routine check-up or a consultation for further gynaecological assessment.",
    reasons: [],
  },

  urinlekkasje: {
    reasonsTitleNo: "Om urinlekkasje",
    reasonsTitleEn: "About urinary incontinence",
    reasonsLeadNo:
      "Nesten 25 % av alle kvinner rammes av urinlekkasje i løpet av livet - noe som gir redusert livskvalitet. Hos oss møter du noen av landets fremste eksperter på urinlekkasje og du får effektiv behandling for alle typer urinveislekkasje, tilpasset deg.",
    reasonsLeadEn:
      "Almost 25% of all women experience urinary incontinence during their lifetime — something that reduces quality of life. With us you meet some of the country’s leading specialists in urinary incontinence, and you receive effective treatment for all types of urinary leakage, tailored to you.",
    reasons: [
      {
        titleNo: "Typer urinlekkasje",
        titleEn: "Types of urinary incontinence",
        descNo:
          "**Stressinkontinens**\nUrinlekkasje ved fysisk aktivitet, hoste eller latter skyldes oftest svekkelse i bindevev/muskulatur som holder urinrør og urinblære på plass. Stressinkontinens oppstår typisk grunnet skader som kommer etter fødsler eller tungt fysisk arbeid.\n\n**Tranginkontinens**\nEn plutselig sterk trang til å late vannet etterfulgt av lekkasje. Du er ofte plaget av hyppig toalettbesøk, hvor du ikke alltid når frem i tide. Dette skyldes feil i nervesignalene til blæremuskelaturen slik at denne trekker seg sammen ukontrollert og ofte.\n\n_Kronisk UVI eller betennelse i blæreveggen kan forveksles med trang, dette kan vi også behandle._\n\n**Blandingsinkontinens**\nKombinasjon av stress og trang, hvilken type som dominerer avhenger fra person til person.\n\nEr du plaget med dette anbefaler vi deg å ta kontakt med oss.",
        descEn:
          "**Stress incontinence**\nLeakage during physical activity, coughing or laughing is usually due to weakened connective tissue/muscles that support the urethra and bladder. It typically follows childbirth or heavy physical work.\n\n**Urge incontinence**\nA sudden strong urge to pass urine followed by leakage. You often need to visit the toilet frequently and may not always reach it in time. This is caused by faulty nerve signals to the bladder muscle so it contracts uncontrollably.\n\n_Chronic UTI or bladder-wall inflammation can be mistaken for urge symptoms; we can treat this too._\n\n**Mixed incontinence**\nA combination of stress and urge; which type dominates varies from person to person.\n\nIf you are affected, we recommend contacting us.",
      },
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo:
          "Hvilken behandling vi anbefaler deg avhenger av hvilken type lekkasje du har, hvor mye du lekker og dine risikofaktorer (BMI, tidligere kirurgi osv.).\n\nDet finnes trygge og effektive behandlinger, som for eksempel blæretrening, bekkenbunnstrening, medikamentell behandling eller ulike typer operasjoner.\n\nVed samtidig vaginale fremfall og stressurinlekkasje vil du bestandig operere det vaginale fremfallet først. Har du spørsmål om dette kan du alltid kontakte oss for en uforpliktende prat.",
        descEn:
          "The treatment we recommend depends on the type of leakage, how much you leak and your risk factors (BMI, previous surgery, etc.).\n\nThere are safe and effective options such as bladder training, pelvic floor training, medication or various operations.\n\nIf you also have vaginal prolapse and stress incontinence, the prolapse is always operated on first. Contact us anytime for an informal chat if you have questions.",
      },
    ],
  },

  endometriose: {
    reasonsTitleNo: "Om endometriose",
    reasonsTitleEn: "About endometriosis",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [
      {
        titleNo: "Symptomer",
        titleEn: "Symptoms",
        descNo:
          "Symptomene på endometriose er individuelle. Det vanligste symptomet er smerter ved menstruasjonen eller utenom. Smertene kan variere i styrke fra minimale menstruasjonssmerter til invalidiserende smerter. Andre symptomer kan være kvalme, diaré eller forstoppelse, økt trettbarhet, smerter ved vannlatning eller ved samleie. Omtrent 10% av kvinner rammes, og hele 30% av disse lider av underlivssmerter.",
        descEn:
          "Endometriosis symptoms are individual. The most common is pain with or between periods, ranging from mild period pain to disabling pain. Other symptoms can include nausea, diarrhoea or constipation, increased fatigue, and pain when passing urine or during intercourse. About 10% of women are affected, and 30% of these suffer from pelvic pain.",
      },
      {
        titleNo: "Kirurgi",
        titleEn: "Surgery",
        descNo:
          "Vi tilbyr både tradisjonell kikkhullskirurgi (laparoskopi) og robotkirurgi ved sanering av endometriose. CMedical er den eneste private aktøren i Norge som tilbyr operasjon med robot ved endometriose. Robotkirurgi er en presis og skånsom operasjonsmetode.\n\nVed kirurgi vil endometriose på bukhinnen, i bekkenet, arrvev og sammenvoksinger klippes bort. Roboten er spesielt egnet til finkirurgi der en vil unngå nærliggende nerver og blodkar.",
        descEn:
          "We offer both conventional keyhole surgery (laparoscopy) and robot-assisted surgery for excision of endometriosis. CMedical is the only private provider in Norway offering robot surgery for endometriosis. Robot surgery is a precise and gentle method.\n\nSurgery removes endometriosis on the peritoneum and in the pelvis, as well as scar tissue and adhesions. The robot is especially suited to fine surgery near nerves and blood vessels.",
      },
    ],
  },

  overgangsalder: {
    reasonsTitleNo: "Om overgangsalder",
    reasonsTitleEn: "About menopause",
    reasonsLeadNo:
      "Kostholdsrådgivning tilpasset hormonelle endringer og overgangsalder.",
    reasonsLeadEn:
      "Nutrition advice tailored to hormonal changes and menopause.",
    reasons: [
      {
        titleNo: "Symptomer",
        titleEn: "Symptoms",
        descNo:
          "Vanlige symptomer inkluderer:\n- Uregelmessig menstruasjon/blødningsforstyrrelser\n- Hetetokter og/eller nattesvette\n- Hjernetåke/konsentrasjonsvansker\n- Økt irritabilitet\n- Tar lettere til tårene/emosjonell\n- Redusert hukommelse\n- Søvnproblemer\n- Endringer i hud og hår\n- Smerter i ledd og muskler\n- Hyppigere hodepine\n- Redusert sexlyst\n- Urinveisinfeksjoner og tørrhet i skjeden\n\nPå lengre sikt øker risikoen for tilstander som beinskjørhet, hjerte- og karsykdommer, høyt kolesterol og blodtrykk, depresjon og muligens demens. Dette skyldes nedgang i østrogen-, progesteron- og testosteronproduksjonen. Heldigvis finnes trygge og effektive behandlingsalternativer som hjelper deg med å håndtere symptomene, gir økt livskvalitet og reduserer risiko for fremtidige helseproblemer.",
        descEn:
          "Common symptoms include:\n- Irregular periods / abnormal bleeding\n- Hot flushes and/or night sweats\n- Brain fog / concentration difficulties\n- Increased irritability\n- Tearfulness / emotional changes\n- Reduced memory\n- Sleep problems\n- Changes in skin and hair\n- Joint and muscle pain\n- More frequent headaches\n- Reduced sex drive\n- Urinary tract infections and vaginal dryness\n\nLonger term, risk increases for osteoporosis, cardiovascular disease, high cholesterol and blood pressure, depression and possibly dementia, due to falling oestrogen, progesterone and testosterone. Safe, effective treatments can help manage symptoms, improve quality of life and reduce future health risks.",
      },
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo:
          "En kartleggingssamtale er en personlig og grundig konsultasjon med en eller flere av våre spesialister. Målet er å forstå dine individuelle utfordringer og behov i forbindelse med overgangsalderen. Samtalen varer i omtrent 45 minutter og inkluderer:\n- En detaljert gjennomgang av sykdomshistorie og livssituasjon.\n- Gynekologisk undersøkelse og relevante blodprøver ved behov.\n- Utarbeidelse av en tilpasset behandlingsplan.\n\nI samråd med deg kan vi tilby tverrfaglig oppfølging for å styrke behandlingen. Dette kan inkludere samarbeid med ernæringsfysiolog, osteopat, sexolog eller psykolog, basert på dine ønsker og behov.\n\nEn oppfølgingstime må bestilles etter 6 måneder. Våre eksperter er tilgjengelige ved ytterligere behov.\n\nVårt mål er å tilby deg en helhetlig og tilpasset behandling som gir merkbare forbedringer i din helse og livskvalitet gjennom overgangsalderen.\n\nVi hjelper deg med å ta hverdagen tilbake. Hos oss møter du et kompetent og engasjert team som lytter, veileder og utvikler en behandlingsplan som er tilpasset dine utfordringer og behov.",
        descEn:
          "An initial assessment is a personal, thorough consultation with one or more of our specialists. The goal is to understand your individual challenges and needs in connection with menopause. The appointment lasts about 45 minutes and includes:\n- A detailed review of your medical history and life situation.\n- A gynaecological examination and relevant blood tests where needed.\n- An individually tailored treatment plan.\n\nTogether with you, we can offer multidisciplinary follow-up — dietitian, osteopath, sexologist or psychologist — based on your wishes and needs.\n\nA follow-up appointment should be booked after 6 months. Our experts remain available if you need further support.\n\nOur aim is holistic, tailored care that delivers noticeable improvements in your health and quality of life through menopause.\n\nWe help you take everyday life back with a competent, engaged team that listens, guides and builds a plan around you.",
      },
      {
        titleNo: "Fastlegeveiledning overgangsalder",
        titleEn: "GP guidance on menopause",
        descNo:
          "Vi har utarbeidet en egen veiledning for fastleger om utredning og behandling av peri- og menopausale kvinner. Veilederen baserer seg på Norsk gynekologisk veileder 2024, NICE NG23 (2024), British Menopause Society (BMS) retningslinjer og European Society of Endocrinology (ESE) kliniske retningslinjer 2025.\n\n[Les fastlegeveiledning for overgangsalder →](/fastlegeveiledning-overgangsalder)",
        descEn:
          "We have prepared dedicated guidance for GPs on assessment and treatment of peri- and postmenopausal women, based on the Norwegian gynaecology guideline 2024, NICE NG23 (2024), British Menopause Society (BMS) guidance and European Society of Endocrinology (ESE) clinical guidelines 2025.\n\n[Read GP guidance on menopause →](/en/fastlegeveiledning-overgangsalder)",
      },
    ],
  },

  "vaginale-fremfall": {
    reasonsTitleNo: "Om vaginale fremfall",
    reasonsTitleEn: "About vaginal prolapse",
    reasonsLeadNo:
      "Vaginalt fremfall, også kjent som prolaps, innebærer at skjedens fremre eller bakre vegg, eller livmor/livmorhals, buker ned i skjeden eller ut av skjedeinngangen. Dette skjer grunnet svekkelse og skader i bekkenbunnmuskulatur og støttevev etter graviditet, fødsel, aldring, økt buktrykk over lengre tid (forstoppelse, ubehandlet astma/kols) eller kirurgiske inngrep.",
    reasonsLeadEn:
      "Vaginal prolapse means the front or back vaginal wall, or the uterus/cervix, bulges down into the vagina or beyond the opening. It is caused by weakened pelvic floor muscles and support tissue after pregnancy, birth, ageing, long-term increased abdominal pressure (constipation, untreated asthma/COPD) or surgery.",
    reasons: [
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo:
          "Behandlingen avhenger av alvorlighetsgraden og symptomene, og kan inkludere bekkenbunnstrening, bruk av støtteinnretninger, eller i mer alvorlige tilfeller kirurgiske inngrep. Det er viktig å oppsøke helsepersonell for en grundig vurdering hvis du opplever symptomer på vaginalt fremfall. Hos oss møter du noen av Nordens fremste eksperter på fremfall.",
        descEn:
          "Treatment depends on severity and symptoms and may include pelvic floor training, support devices, or surgery in more severe cases. Seek a thorough assessment if you have symptoms of vaginal prolapse. With us you meet some of the Nordic region’s leading prolapse specialists.",
      },
    ],
  },

  blodningsforstyrrelser: {
    reasonsTitleNo: "Om blødningsforstyrrelser",
    reasonsTitleEn: "About abnormal uterine bleeding",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [
      {
        titleNo: "Vanlige årsaker",
        titleEn: "Common causes",
        descNo:
          "Vanlige årsaker til blødningsforstyrrelser kan være overgangsalder, seksuelt overførbare infeksjoner, polypper eller muskelknuter, graviditet eller hormonelle ubalanser.\n\nBlødningsforstyrrelser som kommer etter _overgangsalderen_ skal alltid utredes. Det gjøres gjerne med ultralyd og en vevsprøve fra livmorhulen. Videre oppfølging og behandling avhenger av dette prøvesvaret.",
        descEn:
          "Common causes include menopause, sexually transmitted infections, polyps or fibroids, pregnancy, or hormonal imbalances.\n\nBleeding that starts after _menopause_ must always be investigated, usually with ultrasound and a tissue sample from the uterine lining. Further follow-up depends on the result.",
      },
      {
        titleNo: "Prevensjon",
        titleEn: "Contraception",
        descNo:
          "Dersom du bruker prevensjon kan du få uregelmessige blødninger. Det kan ofte løses ved å bytte prevensjonsmiddel.",
        descEn:
          "If you use contraception, you may get irregular bleeding. Changing contraceptive method will often resolve it.",
      },
    ],
  },

  celleforandringer: {
    reasonsTitleNo: "Om celleforandringer",
    reasonsTitleEn: "About cervical cell changes",
    reasonsLeadNo:
      "Celleforandringer er forstadier til kreft og kalles dysplasier. Det finnes flere stadier i økende alvorlighetsgrad. Hvorvidt celleforandringene skal behandles avhenger av hvor alvorlige de er og hvilken type HPV du har.",
    reasonsLeadEn:
      "Cervical cell changes are precancerous changes known as dysplasia. There are several grades of increasing severity. Whether they should be treated depends on how severe they are and which type of HPV you have.",
    reasons: [
      {
        titleNo: "HPV og celleforandring",
        titleEn: "HPV and cell changes",
        descNo:
          "Over 25.000 kvinner får hvert år konstatert unormale celler ved undersøkelse av livmorhalsen. Av disse behandles cirka 3000 kvinner for celleforandringer. Samtidig får cirka 300 kvinner livmorhalskreft i året.\n\nUtviklingen av livmorhalskreft tar flere år.\n\nScreening med HPV-test hvert femte år redder liv. Hvis du har fått påvist og/eller er behandlet for HPV eller celleforandringer, følges du opp tettere. Ønsker du å ta en celleprøve eller snakke med en av våre gynekologer kan du alltid kontakte oss eller bestille time.",
        descEn:
          "Over 25,000 women each year are found to have abnormal cervical cells. About 3,000 are treated for cell changes, while about 300 are diagnosed with cervical cancer annually.\n\nCervical cancer usually develops over several years.\n\nHPV screening every five years saves lives. If HPV or cell changes are detected or treated, you will be followed more closely. Contact us or book an appointment for a smear or to speak with a gynaecologist.",
      },
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo:
          "Lavgradige celleforandringer i livmorhalsen går ofte tilbake av seg selv. De behandles kun hvis de vedvarer. Ved lavgradige celleforandringer anbefales det å ta en ny celleprøve om 12 måneder.\n\nHøygradige celleforandringer behandles individuelt. Her henvises du først til gynekolog som utfører kolposkopi. Det er en vanlig undersøkelse der gynekologen studerer livmorhalsen ved hjelp av et mikroskop. Samtidig tas det også en vevsprøve (biopsi) fra både livmorhalskanalen og livmortappen for å nærmere studere funnene fra celleprøven.\n\nDersom du trenger behandling gjøres det med et lite kirurgisk inngrep som kalles konisering.",
        descEn:
          "Low-grade cervical cell changes often regress on their own and are only treated if they persist. A repeat smear after 12 months is usually recommended.\n\nHigh-grade changes are managed individually. You are referred for colposcopy — examination of the cervix with a microscope — plus biopsies from the canal and the outer cervix.\n\nIf treatment is needed, it is done with a minor procedure called cone biopsy (konisering).",
      },
      {
        titleNo: "Konisering",
        titleEn: "Cone biopsy",
        descNo:
          "Konisering er et lite kirurgisk inngrep hvor en liten del av det ytterste laget på livmorhalsen fjernes. Inngrepet forhindrer celleforandringene fra å utvikle seg til livmorhalskreft.\n\nHos vår klinikk på Bekkestua tilbyr vi konisering i lokalbedøvelse, utført av vår erfarne gynekolog Birgitte Aspenes. Inngrepet tar vanligvis rundt 15 minutter, og du blir godt ivaretatt i rolige og trygge omgivelser. Inngrepet blir utført i narkose om du er veldig engstelig.",
        descEn:
          "Cone biopsy removes a small part of the outer layer of the cervix to prevent cell changes from developing into cervical cancer.\n\nAt our Bekkestua clinic we offer cone biopsy under local anaesthetic with experienced gynaecologist Birgitte Aspenes. It usually takes about 15 minutes in a calm, safe setting. General anaesthesia is available if you are very anxious.",
      },
    ],
  },

  cyster: {
    reasonsTitleNo: "Om cyster på eggstokkene",
    reasonsTitleEn: "About ovarian cysts",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [
      {
        titleNo: "Tegn",
        titleEn: "Signs",
        descNo:
          "- Smerter ved trykk i nedre del av magen\n- Oppblåsthet\n- Smerter ved samleie\n- Uregelmessige menstruasjoner\n- Akutte sterke smerter om en cyste sprekker eller vrir seg",
        descEn:
          "- Pain or pressure in the lower abdomen\n- Bloating\n- Pain during intercourse\n- Irregular periods\n- Sudden severe pain if a cyst ruptures or twists",
      },
      {
        titleNo: "Former for cyste",
        titleEn: "Types of cyst",
        descNo:
          "Andre typer cyster er dermoider, endometriomer eller cystadenomer. Disse ser litt annerledes ut på ultralyd, og derfor kan vi skille dem fra funksjonelle cyster. Dette er også godartede cyster, men disse blir ikke borte av seg selv og må noen ganger opereres bort, særlig hvis de blir store og gir plager.",
        descEn:
          "Other types include dermoids, endometriomas and cystadenomas. They look different on ultrasound, so we can distinguish them from functional cysts. They are also benign but do not resolve on their own and may need surgery if large or symptomatic.",
      },
      {
        titleNo: "Før og etter overgangsalder",
        titleEn: "Before and after menopause",
        descNo:
          "Hos kvinner før overgangsalder er de aller fleste cyster godartede. Hvis gynekologen finner en cyste ved ultralydundersøkelse, blir du fulgt opp videre med ultralyd, avhengig av hva slags cyste det er du har. Det er som oftest ikke nødvendig med blodprøve.\n\nEtter overgangsalder er det mindre vanlig med cyster og risikoen for at en cyste er ondartet er større. Her vil det være viktig med blodprøve, flere ultralydundersøkelser og andre bildeundersøkelser før du eventuelt opererer bort cysten.",
        descEn:
          "Before menopause most cysts are benign. If ultrasound finds a cyst, follow-up ultrasound is arranged depending on the type. Blood tests are usually not needed.\n\nAfter menopause cysts are less common and the risk of malignancy is higher. Blood tests, more ultrasound and other imaging are important before any surgery.",
      },
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo:
          "Cyster av en viss størrelse, som ikke blir borte av seg selv og som gir plager, anbefales operert bort. Dette gjøres vanligvis ved en kikkhullsoperasjon: du får narkose og kirurgen fjerner cysten gjennom 3–4 hull i magen. Inngrepet tar omtrent 45 minutter, avhengig av størrelsen.",
        descEn:
          "Cysts of a certain size that do not resolve and cause symptoms are usually removed by keyhole surgery under general anaesthetic through 3–4 small abdominal incisions. The procedure takes about 45 minutes depending on size.",
      },
    ],
  },

  "fjerne-livmor": {
    reasonsTitleNo: "Om fjerne livmor",
    reasonsTitleEn: "About hysterectomy",
    reasonsLeadNo:
      "Fjerning av livmor (hysterektomi) anbefales ved plagsomme muskelknuter (myomer), blødningsforstyrrelser, kreft i livmor eller livmorhals. Det kan også være aktuelt ved endometriose eller ved vedvarende celleforandringer i livmorhals. Ved operasjonen fjernes livmoren i sin helhet, eggstokker blir stående igjen dersom du ikke er kommet i overgangsalderen.",
    reasonsLeadEn:
      "Removal of the uterus (hysterectomy) is recommended for troublesome fibroids (myomas), abnormal bleeding, or cancer of the uterus or cervix. It may also be relevant for endometriosis or persistent cervical cell changes. The uterus is removed in full; the ovaries are usually left if you have not reached menopause.",
    reasons: [
      {
        titleNo: "Fjerning av livmor (hysterektomi)",
        titleEn: "Removal of the uterus (hysterectomy)",
        descNo:
          "Det finnes flere operasjonsmetoder for å fjerne livmoren. Vi fjerner livmoren skånsomt ved hjelp av kikkhullskirurgi eller robotassistert kirurgi. Vi er den eneste private aktøren som tilbyr robotassistert kirurgi - en mer skånsom og presis operasjonsmetode. En sjelden gang ved vanskelig anatomi kan det bli nødvendig å lage et lite snitt (litt mindre enn et keisersnitt) i bikinilinjen.\n\nEr du pasient hos oss får du detaljert informasjon om inngrepet, risiko for komplikasjoner og hvordan du skal forholde deg i tiden etter operasjon. Du vil også få telefonnummeret til kirurgen. Det er få bivirkninger av inngrepet og seksuelt kan du fungere som før.\n\nVåre kirurger er noen av Nordens ledende kirurger innen gynekologisk kikkhull og robotassistert kirurgi.\n\nVi sørger for at du blir trygt ivaretatt igjennom hele behandlingsforløpet.\n\n[Les mer om robotassistert kirurgi →](/gynekologi/robotkirurgi)",
        descEn:
          "There are several methods to remove the uterus. We use gentle keyhole or robot-assisted surgery. We are the only private provider offering robot-assisted surgery — a gentler, more precise method. Rarely, difficult anatomy may require a small bikini-line incision.\n\nAs our patient you receive detailed information about the procedure, risks and aftercare, plus your surgeon’s phone number. Side effects are few and sexual function can remain as before.\n\nOur surgeons are among the Nordic leaders in gynaecological keyhole and robot-assisted surgery.\n\nWe look after you safely throughout your care pathway.\n\n[Read more about robot-assisted surgery →](/en/gynecology/robotkirurgi)",
      },
      {
        titleNo: "Pasienthistorie",
        titleEn: "Patient story",
        descNo:
          "_Kine, 37 år:_\n\n«For et år siden fikk jeg et nytt liv takket være hjelp fra CMedical. Jeg hadde i flere år gått med en stor muskelknute i livmora mi og i og med at jeg ikke hadde fått barn var beskjeden jeg fikk fra det offentlige at jeg var for ung til å få fjernet livmora - jeg var jo tross alt enda fertil.\n\nEtter mye om og men ble jeg endelig hørt i mitt ønske om å få utført en full hysterektomi og gjennom helseforsikringen min kom jeg da i kontakt med CMedical. Her ble jeg møtt av et helt nydelig team, en fantastisk kirurg og sykepleiere med en enorm omsorg. Operasjonen gikk veldig bra og jeg følte meg trygg gjennom hele besøket.\n\nJeg ble godt ivaretatt fra jeg kom inn dørene på klinikken, videre inn på operasjonsstuen, på oppvåkningen og det neste døgnet som jeg tilbrakte der. Her er det profesjonalitet i alle ledd, hjerterom og mennesker som bryr seg om mennesker.\n\nTusen tusen takk for hjelpen!»",
        descEn:
          "_Kine, 37:_\n\n«A year ago I got a new life thanks to CMedical. For years I had a large fibroid, and because I had not had children the public system said I was too young for hysterectomy — I was still fertile.\n\nAfter much back and forth my wish for a full hysterectomy was finally heard, and through my health insurance I came to CMedical. I met a wonderful team, a fantastic surgeon and nurses with enormous care. The operation went very well and I felt safe throughout.\n\nI was looked after from the moment I arrived, through theatre, recovery and the next day I spent there. Professionalism at every step, and people who care about people.\n\nThank you so much for the help!»",
      },
    ],
  },

  kirurgi: {
    reasonsTitleNo: "Om gynekologisk kirurgi",
    reasonsTitleEn: "About gynaecological surgery",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [
      {
        titleNo: "Våre tjenester innen gynekologisk kirurgi",
        titleEn: "Our gynaecological surgery services",
        descNo:
          "- Fremfalloperasjoner: For prolaps i skjedevegger, livmorhals eller livmor. [Les mer →](/gynekologi/vaginale-fremfall)\n- Urinlekkasjeoperasjoner: Behandling av alle typer urinlekkasje. [Les mer →](/gynekologi/urinlekkasje)\n- Hysterektomi: Fjerning av livmor ved blødningsproblemer eller smerter. [Les mer →](/gynekologi/fjerne-livmor)\n- Polypper og muskelknuter: Fjerning ved hysteroskopi eller laparoskopi.\n- Endometriosebehandling: Avanserte inngrep utført av erfarne spesialister. [Les mer →](/gynekologi/endometriose)\n- Fjerning av eggstokkcyster, arrvev og celleforandringer.\n- Labiaplastikk/reduksjon av de små kjønnsleppene. [Les mer →](/gynekologi/labiaplastikk)",
        descEn:
          "- Prolapse surgery: for vaginal wall, cervix or uterine prolapse. [Read more →](/en/gynecology/vaginale-fremfall)\n- Incontinence surgery: all types of urinary leakage. [Read more →](/en/gynecology/urinlekkasje)\n- Hysterectomy: removal of the uterus for bleeding problems or pain. [Read more →](/en/gynecology/fjerne-livmor)\n- Polyps and fibroids: removal by hysteroscopy or laparoscopy.\n- Endometriosis treatment: advanced procedures by experienced specialists. [Read more →](/en/gynecology/endometriose)\n- Removal of ovarian cysts, scar tissue and cell changes.\n- Labiaplasty / reduction of the labia minora. [Read more →](/en/gynecology/labiaplastikk)",
      },
      {
        titleNo: "Robotassistert kirurgi",
        titleEn: "Robot-assisted surgery",
        descNo:
          "Som den eneste private aktøren i Norge tilbyr vi robotassistert gynekologisk kirurgi. Dette sikrer presisjon og skånsomhet, og reduserer risikoen for komplikasjoner. Metoden er særlig fordelaktig ved kompleks anatomi og ved endometriose.\n\nUnder inngrepet er kirurgen alltid til stede og styrer roboten direkte fra operasjonsstuen. Med en 180-graders rotasjonsdyktig «hånd» kan roboten nå frem på områder i buk og bekken som ellers er vanskelig tilgjengelige. Denne metoden reduserer risikoen for blødninger, nerveskader og skader på organer som tarm og blære, og gir kortere sykehusopphold etter operasjonen.\n\nRobotassistert kirurgi er spesielt fordelaktig ved kompliserte tilfeller som endometriose og vanskelig tilgjengelig anatomi, og våre erfarne kirurger er blant landets fremste på området.\n\n[Les mer om robotkirurgi →](/gynekologi/robotkirurgi)\n\nØnsker du mer informasjon, eller har du spørsmål om andre operasjoner? Ring oss gjerne – vi er her for å hjelpe deg.\n\n_Ikke aksepter å leve med plager vi kan hjelpe deg med._",
        descEn:
          "As the only private provider in Norway we offer robot-assisted gynaecological surgery for precision, gentleness and lower complication risk — especially valuable in complex anatomy and endometriosis.\n\nThe surgeon is always present and controls the robot from the operating theatre. A highly rotatable instrument arm reaches areas of the abdomen and pelvis that are otherwise hard to access, reducing risk to vessels, nerves, bowel and bladder, and often shortening the hospital stay.\n\nOur experienced surgeons are among the country’s leading specialists in this field.\n\n[Read more about robot surgery →](/en/gynecology/robotkirurgi)\n\nCall us if you want more information — we are here to help.\n\n_Do not accept living with problems we can help you with._",
      },
    ],
  },

  /** Alias URL /hormonforstyrrelser → poi document */
  poi: {
    reasonsTitleNo: "Om hormonforstyrrelser",
    reasonsTitleEn: "About hormonal disorders",
    reasonsLeadNo:
      "Hormonforstyrrelser refererer til unormale nivåer av hormoner i kroppen, enten det er for mye, for lite eller ujevn produksjon av visse hormoner. Les mer under om ulike sykdommer.",
    reasonsLeadEn:
      "Hormonal disorders refer to abnormal hormone levels — too much, too little or uneven production. Read more below about related conditions.",
    reasons: [
      {
        titleNo: "PMOS",
        titleEn: "PMOS",
        descNo:
          "Polyendokrint Metabolsk Ovarialsyndrom (PMOS) kjennetegnes ved at kjønnshormonene er i ubalanse. (Tidligere omtalt som Polycystisk ovariesyndrom (PMOS).)\n\nDiagnosen kan føre til at eggcellene ikke får modnet og at eggløsning uteblir, noe som igjen kan føre til at du mister eller får sjeldne menstruasjoner. Kvinner med PMOS kan oftere oppleve ufrivillig barnløshet og trenger hyppigere hjelp til å bli gravid. Kvinner med sjelden eller uteblitt menstruasjon bør benytte prevensjon, eller 2–4 ganger i året ta tabletter som gir blødning, for å unngå risiko for celleforandringer i livmorslimhinnen som på sikt kan forårsake endometriekreft.\n\nMange opplever også insulinresistens og har økt risiko for å utvikle diabetes mellitus type 2, samt høyt kolesterol og blodtrykk. Risikoen for hjerte- og karsykdommer øker også.\n\nPMOS er ikke en spesifikk endokrin sykdom, men et syndrom med forskjellige symptomer og tegn. Det finnes ingen spesiell test som gir diagnosen. Pasienten må oppfylle 2 av 3 kriterier for å få diagnosen:\n\n- Uregelmessige og sjeldne menstruasjoner\n- Polycystiske eggstokker\n- Hyperandrogenisme (økt behåring, akne og mannlig hårtap)\n\nDet finnes ingen kur, men det finnes medisiner og behandling som kan gjøre tilstanden bedre.",
        descEn:
          "Polyendocrine Metabolic Ovarian Syndrome (PMOS) is characterised by imbalance in sex hormones (previously known as polycystic ovary syndrome).\n\nIt can prevent eggs from maturing and stop ovulation, leading to absent or infrequent periods. Women with PMOS more often experience infertility. With infrequent or absent periods you should use contraception, or take tablets 2–4 times a year to induce a bleed, to reduce risk of endometrial cell changes that can lead to cancer.\n\nMany also have insulin resistance and higher risk of type 2 diabetes, high cholesterol, blood pressure and cardiovascular disease.\n\nPMOS is a syndrome, not a single endocrine disease. Diagnosis requires 2 of 3 criteria:\n\n- Irregular, infrequent periods\n- Polycystic ovaries\n- Hyperandrogenism (excess hair, acne, male-pattern hair loss)\n\nThere is no cure, but medicines and treatment can improve the condition.",
      },
      {
        titleNo: "PMS og PMDD",
        titleEn: "PMS and PMDD",
        descNo:
          "Premenstruelt syndrom omfatter plagsomme fysiske og psykiske symptomer som opptrer regelmessig siste halvdel av syklus (lutealfasen). PMS (premenstruelt syndrom) er den milde formen som rammer opptil 75 % av alle kvinner, mens den alvorligere formen, PMDD (premenstruell dysforisk forstyrrelse), rammer 3–8 %.\n\nDe vanligste fysiske plagene er ømme bryst, oppblåsthet, magesmerter, vektøkning, hodepine, økt appetitt og tap av energi. Psykiske symptomer omfatter irritabilitet, humørsvingninger, depresjon, angst og indre uro. Noen kvinner kan også få selvmordstanker disse dagene.\n\nÅrsaken er relatert til svingende hormoner. Det er mulig å få god hjelp – du skal slippe å lide hver måned.",
        descEn:
          "Premenstrual syndrome covers physical and psychological symptoms in the second half of the cycle. Mild PMS affects up to 75% of women; severe PMDD affects 3–8%.\n\nCommon physical symptoms include tender breasts, bloating, abdominal pain, weight gain, headache, increased appetite and low energy. Psychological symptoms include irritability, mood swings, depression, anxiety and inner unrest. Some women also experience suicidal thoughts in these days.\n\nThe cause relates to fluctuating hormones. Good help is available — you should not have to suffer every month.",
      },
    ],
  },

  hysteroskopi: {
    reasonsTitleNo: "Om hysteroskopi",
    reasonsTitleEn: "About hysteroscopy",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [
      {
        titleNo: "Office-hysteroskopi",
        titleEn: "Office hysteroscopy",
        descNo:
          "Vi tilbyr også office-hysteroskopi som kan gjennomføres uten narkose eller bedøvelse, og umiddelbart ved besøk hos gynekolog.",
        descEn:
          "We also offer office hysteroscopy that can be performed without general or local anaesthetic, immediately during a gynaecology visit.",
      },
    ],
  },

  labiaplastikk: {
    reasonsTitleNo: "Om labiaplastikk",
    reasonsTitleEn: "About labiaplasty",
    reasonsLeadNo:
      "Det er normalt med ulik størrelse og utseende på kjønnslepper. Noen ganger gir store kjønnslepper smerter ved fysisk aktivitet som sykling, ridning, eller er i veien ved samleie. Da kan kirurgisk reduksjon av kjønnsleppene være løsningen.",
    reasonsLeadEn:
      "It is normal for the labia to vary in size and appearance. Sometimes enlarged labia cause pain during activities such as cycling or horse riding, or get in the way during intercourse. Surgical reduction can then be the solution.",
    reasons: [
      {
        titleNo: "Hva er labiaplastikk?",
        titleEn: "What is labiaplasty?",
        descNo:
          "Labiaplastikk er en kirurgisk prosedyre som reduserer størrelsen på labia minora, de indre kjønnsleppene.\n\n**Teknisk prosedyre**\n\nInngrepet gjennomføres i narkose og tar ca. 20 min. Det utføres ved hjelp av fine kirurgiske teknikker med skalpell og lett diatermi. Suturer skal ikke fjernes i etterkant, de løses opp av seg selv. Forhåndsregler etter operasjon får du nøye instrukser om under utredningen og på operasjonsdagen.\n\n**Risiko og bivirkninger**\n\nRisikoene inkluderer blødning, infeksjon, arrdannelse og følelsesløshet. Det er viktig å velge en erfaren kirurg for å minimere disse risikoene.\n\n**Gjenopptakelse og resultater**\n\nGjenopptakelsen tar vanligvis noen uker, og fullstendig heling kan ta flere måneder. De fleste pasienter opplever forbedret komfort og økt selvtillit etter prosedyren.",
        descEn:
          "Labiaplasty reduces the size of the labia minora.\n\n**Procedure**\n\nPerformed under general anaesthesia in about 20 minutes using fine scalpel and light diathermy techniques. Dissolvable sutures do not need removal. You receive detailed aftercare instructions during assessment and on the day of surgery.\n\n**Risks**\n\nRisks include bleeding, infection, scarring and numbness. Choosing an experienced surgeon helps minimise these.\n\n**Recovery and results**\n\nInitial recovery usually takes a few weeks; full healing may take months. Most patients experience improved comfort and confidence.",
      },
    ],
  },

  robotkirurgi: {
    reasonsTitleNo: "Om robotassistert kirurgi – Gynekologi",
    reasonsTitleEn: "About robot-assisted gynaecological surgery",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [
      {
        titleNo: "Robotassistert kirurgi",
        titleEn: "Robot-assisted surgery",
        descNo:
          "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden. Ved robotassistert kirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde. Robotsystemet er et kraftig verktøy som gir kirurgen optimal oversikt og tilgang, slik at avanserte inngrep kan utføres med høy presisjon og minimal belastning. Robotassistert kirurgi er ofte foretrukket ved kompliserte operasjoner, spesielt når du kan unngå åpen kirurgi (laparotomi). Det gir raskere rekonvalesens og lavere risiko for komplikasjoner. De fleste pasientene kan reise hjem innen ett døgn. Ved enkelte krefttilfeller, som kreft i livmor, kan robotassistert kirurgi være et svært godt alternativ. Vi tilbyr robotassistert kirurgi innen blant annet: muskelknuter (fertilitetsbevarende kirurgi), dyp endometriose, hysterektomi (også ved forstørret livmor), brokk, godartet forstørret prostata (RASP) og prostatakreft (RALP). Rask rehabilitering: Robotassistert kirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling. En raskere vei til restitusjon: Mange pasienter kan reise hjem allerede dagen etter inngrepet. Allerede samme kveld er det mulig å spise, bevege seg og føle seg mer som seg selv igjen. Kortere sykemelding: Avhengig av jobb og inngrep kan du forvente en sykemeldingsperiode på 2–6 uker (kirurgen spesifiserer per pasient). Sammenlignet med tradisjonell åpen kirurgi gir robotassistert kirurgi en raskere vei tilbake til hverdagen. Presisjon som merkes: Med høyoppløselig 3D-kamera og avanserte instrumenter har kirurgen svært god kontroll. I bekkenet finnes ømfintlig vev som lett kan skades under kirurgi (f.eks. ved nervesparende operasjoner ved dyp endometriose eller fjerning av prostata). Robotassistert kirurgi gir bedre kontroll og lavere risiko ved slik nervedisseksjon. Ergonomi: Under robotassistert kirurgi sitter kirurgen i en ergonomisk og komfortabel arbeidsstilling, noe som bidrar til økt konsentrasjon og mindre utmattelse.",
        descEn:
          "Robot-assisted surgery is an advanced but gentle treatment performed through small skin openings like classic keyhole surgery. The surgeon controls instruments electronically from a console beside the patient. Machine-held instruments allow very precise movements, and a high-resolution stereoscopic 3D camera gives an exceptional view. It is often preferred for complex operations when open surgery can be avoided, with faster recovery and lower complication risk. Most patients go home within 24 hours. We offer robot-assisted surgery for fibroids (fertility-sparing), deep endometriosis, hysterectomy (including enlarged uterus), hernia, benign enlarged prostate (RASP) and prostate cancer (RALP), among others.",
      },
      {
        titleNo: "Safe Histology Surgery",
        titleEn: "Safe Histology Surgery",
        descNo:
          "Ved Safe Histology Surgery kombinerer vi skånsom robotassistert kirurgi med nøyaktig vevsdiagnostikk underveis i inngrepet. Det gir kirurgen mulighet til å tilpasse operasjonen presist til funnene, og bidrar til trygg og målrettet behandling.",
        descEn:
          "Safe Histology Surgery combines gentle robot-assisted surgery with accurate tissue diagnostics during the procedure, so the surgeon can adapt the operation precisely to the findings for safe, targeted treatment.",
      },
    ],
  },

  pmos: {
    reasonsTitleNo: "Om PMOS",
    reasonsTitleEn: "About PMOS",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [],
  },

  vulvalidelser: {
    reasonsTitleNo: "Om vulvalidelser",
    reasonsTitleEn: "About vulval conditions",
    reasonsLeadNo:
      "Kompliserte sykdommer som vulvasykdommer trenger en tverrfaglig tilnærming. Vårt multidisiplinære team består derfor av gynekolog, hudlege, sexolog, psykolog og bekkenbunnsfysioterapeut. Avhengig av vulvovaginal lidelse og diagnose, vil du få tilbud om videre konsultasjon med andre spesialister.",
    reasonsLeadEn:
      "Complex conditions such as vulval disease require a multidisciplinary approach. Our multidisciplinary team therefore includes a gynaecologist, dermatologist, sexologist, psychologist and pelvic floor physiotherapist. Depending on the vulvovaginal condition and diagnosis, you will be offered further consultation with other specialists.",
    reasons: [
      {
        titleNo: "Infeksjoner",
        titleEn: "Infections",
        descNo:
          "I en normal flora i skjeden er det bakterier som beskytter og er en del av immunforsvaret for kvinnen. Det er likevel mulig å få en infeksjon eller ubalanse i vaginal floraen. Noen bakterier overføres seksuelt kjent som kjønnsykdommer og omhandler Chlamydia, Gonore og Syfillis. Disse skal alltid behandles for å unngå komplikasjoner. Andre tilstander som soppinfeksjoner skal behandles når de gir plager. Enkelte kvinner kan også få en ubalanse i normal flora enten gjennom bakteriell vaginose eller aerobisk vaginitt. Dette kan være svært plagsomt. Du kan enkelt diagnostisere disse tilstandene ved å gjøre mikroskopi av utstryk av utflod. Behandling vil da kunne startes etter denne undersøkelsen.",
        descEn:
          "A healthy vagina contains protective bacteria that are part of the immune system. Infection or imbalance can still occur. Sexually transmitted infections such as chlamydia, gonorrhoea and syphilis must always be treated. Thrush is treated when symptomatic. Bacterial vaginosis or aerobic vaginitis can also cause imbalance and significant discomfort. Microscopy of a discharge smear can diagnose these quickly so treatment can start.",
      },
      {
        titleNo: "Vaginal tørrhet",
        titleEn: "Vaginal dryness",
        descNo:
          "Vaginal tørrhet er et symptom som plager mange kvinner. Vaginal tørrhet kan oppstå i ulike faser i løpet av livet, men hyppigst forekommer det i perimenopausen eller etter overgangsalder. Østrogen er viktig for å bevare elastisitet og fuktighet i skjeden. Ved mangel på østrogen kan mange oppleve tørrhet i skjeden som kan medføre hyppigere urinveisinfeksjoner, smerter ved samleie, sprekkdannelser i slimhinner, svie og kløe. Vulvaplager og vaginal tørrhet bør alltid undersøkes slik at du kan unngå de plager dette kan medføre.",
        descEn:
          "Vaginal dryness affects many women and is most common in perimenopause or after menopause. Oestrogen helps keep the vagina elastic and moist; deficiency can cause dryness, more UTIs, pain during intercourse, fissures, burning and itching. Vulval symptoms and dryness should always be assessed.",
      },
      {
        titleNo: "Vaginisme",
        titleEn: "Vaginismus",
        descNo:
          "Vaginisme beskriver smerter lokalisert i bekkenbunnsmuskulatur. Disse smertene kan forekomme ved provokasjon, for eksempel ved forsøk på samleie, bruk av tampong, fysisk aktivitet som sykling eller trange klær. Smertene oppstår grunnet ufrivillige sammentrekninger i bekkenbunnsmuskulaturen. Vi vet i dag lite om forekomst av denne tilstanden. Det finnes behandling. Vår vulvaklinikk ved CMedical tilbyr tverrfaglig behandling med gynekolog, hudlege, bekkenbunnsfysioterapeut/osteopat, sexolog og psykolog.",
        descEn:
          "Vaginismus is pain in the pelvic floor muscles, often triggered by attempted intercourse, tampon use, cycling or tight clothing, due to involuntary contractions. Treatment exists. Our vulva clinic offers multidisciplinary care with a gynaecologist, dermatologist, pelvic floor physiotherapist/osteopath, sexologist and psychologist.",
      },
      {
        titleNo: "Vulvodyni",
        titleEn: "Vulvodynia",
        descNo:
          "Vulvodyni er et samlebegrep på kroniske smerter i vulva. Vi anslår at 10–15 % av norske kvinner kan oppleve vulvasmerter i løpet av livet. Behandling må tilrettelegges den enkelte kvinne betinget i hennes mulige bakenforliggende årsak. Smertene kan være generalisert i vulva eller lokalisert, for eksempel kun over klitoris eller skjedeinngang. Noen kvinner beskriver disse smertene som brennende, stikkende, skjærende. Tverrfaglig behandling er viktig. Vulvaklinikken ved CMedical jobber tverrfaglig for å redusere smerter, øke livskvalitet og seksualfunksjon.",
        descEn:
          "Vulvodynia is an umbrella term for chronic vulval pain. An estimated 10–15% of Norwegian women experience vulval pain in their lifetime. Treatment is individualised. Pain may be generalised or localised (e.g. clitoris or vaginal entrance) and may feel burning, stabbing or cutting. Multidisciplinary care at our vulva clinic aims to reduce pain and improve quality of life and sexual function.",
      },
      {
        titleNo: "Botoxbehandling for vaginisme/vulvalidelser",
        titleEn: "Botox treatment for vaginismus / vulval conditions",
        descNo:
          "Hos CMedical tilbyr vi skånsom og målrettet Botoxbehandling for kvinner som opplever vaginisme eller andre smerter fra bekkenbunn og vulva. Behandlingen virker ved å redusere ufrivillige muskelspenninger, slik at smertene kan avta og samleie, undersøkelse eller tampongbruk blir mindre vondt.\n\nVurderingen gjøres av erfarne gynekologer, og behandlingen tilpasses alltid dine behov. Målet er å gi deg en trygg opplevelse og en bedre hverdag uten smerter.",
        descEn:
          "We offer gentle, targeted Botox treatment for vaginismus or other pelvic floor and vulval pain. It reduces involuntary muscle tension so intercourse, examination or tampon use can be less painful.\n\nAssessment is by experienced gynaecologists and treatment is tailored to you, aiming for a safer experience and everyday life with less pain.",
      },
    ],
  },

  // Newer-template pages — accordion Om / reason bands from dump
  adenomyose: {
    reasonsTitleNo: "Symptomer på adenomyose",
    reasonsTitleEn: "Symptoms of adenomyosis",
    reasonsLeadNo:
      "Symptomene overlapper med endometriose og blødningsforstyrrelser, og tilstanden blir ofte oversett. Disse tegnene fortjener utredning.",
    reasonsLeadEn:
      "Symptoms overlap with endometriosis and abnormal bleeding, and the condition is often overlooked. These signs deserve investigation.",
    reasons: [
      {
        titleNo: "Erfarne spesialister",
        titleEn: "Experienced specialists",
        descNo: "Du møter gynekologer som jobber tett med endometriose og adenomyose.",
        descEn: "You meet gynaecologists who work closely with endometriosis and adenomyosis.",
      },
      {
        titleNo: "Avansert ultralyd",
        titleEn: "Advanced ultrasound",
        descNo: "Vi bruker høyoppløselig ultralyd for å identifisere adenomyose presist.",
        descEn: "We use high-resolution ultrasound to identify adenomyosis precisely.",
      },
      {
        titleNo: "Individuell behandling",
        titleEn: "Individual treatment",
        descNo: "Fra hormonell behandling til kirurgi — tilpasset dine plager og dine mål.",
        descEn: "From hormonal treatment to surgery — tailored to your symptoms and goals.",
      },
      {
        titleNo: "Fertilitetskompetanse",
        titleEn: "Fertility expertise",
        descNo: "Adenomyose påvirker fertiliteten — vi jobber tverrfaglig med fertilitetsteamet.",
        descEn: "Adenomyosis affects fertility — we work across teams with our fertility specialists.",
      },
    ],
  },

  pcos: {
    reasonsTitleNo: "Tegn på PMOS",
    reasonsTitleEn: "Signs of PMOS",
    reasonsLeadNo:
      "PMOS gir svært ulike symptomer. Mange går udiagnostisert i årevis fordi tegnene tolkes hver for seg.",
    reasonsLeadEn:
      "PMOS causes very varied symptoms. Many go undiagnosed for years because signs are interpreted in isolation.",
    reasons: [
      {
        titleNo: "Helhetlig utredning",
        titleEn: "Holistic assessment",
        descNo: "Hormoner, ultralyd, metabolsk vurdering — vi kartlegger hele bildet.",
        descEn: "Hormones, ultrasound and metabolic assessment — we map the full picture.",
      },
      {
        titleNo: "Skreddersydd plan",
        titleEn: "Tailored plan",
        descNo: "Behandling tilpasset om du ønsker barn nå, senere — eller noe helt annet.",
        descEn: "Treatment tailored to whether you want children now, later — or something else entirely.",
      },
      {
        titleNo: "Tverrfaglig tilnærming",
        titleEn: "Multidisciplinary approach",
        descNo: "Tilgang til ernæring, fertilitetshjelp og psykologi når du trenger det.",
        descEn: "Access to nutrition, fertility support and psychology when you need it.",
      },
      {
        titleNo: "Langsiktig oppfølging",
        titleEn: "Long-term follow-up",
        descNo: "PMOS følger deg gjennom livet — vi gjør det også.",
        descEn: "PMOS follows you through life — so do we.",
      },
    ],
  },

  "pms-pmdd": {
    reasonsTitleNo: "Når er det mer enn 'bare PMS'?",
    reasonsTitleEn: "When is it more than 'just PMS'?",
    reasonsLeadNo:
      "Forskjellen mellom PMS og PMDD ligger i alvorlighetsgrad og hvordan symptomene påvirker livet ditt. Disse tegnene tilsier utredning.",
    reasonsLeadEn:
      "The difference between PMS and PMDD is severity and how symptoms affect your life. These signs warrant assessment.",
    reasons: [
      {
        titleNo: "Moderne diagnostikk",
        titleEn: "Modern diagnostics",
        descNo: "Vi bruker validerte verktøy for å skille PMS fra PMDD og annen psykisk sykdom.",
        descEn: "We use validated tools to distinguish PMS from PMDD and other mental health conditions.",
      },
      {
        titleNo: "Riktig behandling",
        titleEn: "The right treatment",
        descNo: "Hormonell, medikamentell og psykologisk behandling — i kombinasjon når det trengs.",
        descEn: "Hormonal, medical and psychological treatment — combined when needed.",
      },
      {
        titleNo: "Helhetlig vurdering",
        titleEn: "Holistic assessment",
        descNo: "Vi ser også på søvn, livsstil og andre faktorer som forsterker plagene.",
        descEn: "We also look at sleep, lifestyle and other factors that amplify symptoms.",
      },
      {
        titleNo: "Tverrfaglig støtte",
        titleEn: "Multidisciplinary support",
        descNo: "Tilgang til psykolog og ernæringsfysiolog når det er aktuelt.",
        descEn: "Access to a psychologist and dietitian when relevant.",
      },
    ],
  },

  vaginisme: {
    reasonsTitleNo: "Når bør du ta kontakt?",
    reasonsTitleEn: "When should you get in touch?",
    reasonsLeadNo:
      "Vaginisme rammer flere enn du tror, men blir sjelden snakket om. Disse situasjonene fortjener spesialistvurdering.",
    reasonsLeadEn:
      "Vaginismus affects more people than you think, but is rarely talked about. These situations deserve specialist assessment.",
    reasons: [
      {
        titleNo: "Egen vulvaklinikk",
        titleEn: "Dedicated vulva clinic",
        descNo:
          "Tverrfaglig team med gynekolog, hudlege, bekkenbunnsfysioterapeut, sexolog og psykolog.",
        descEn:
          "Multidisciplinary team with gynaecologist, dermatologist, pelvic floor physiotherapist, sexologist and psychologist.",
      },
      {
        titleNo: "Tid og trygghet",
        titleEn: "Time and safety",
        descNo: "Vi setter av lange konsultasjoner og går i ditt tempo — alltid.",
        descEn: "We schedule long consultations and always go at your pace.",
      },
      {
        titleNo: "Skånsom utredning",
        titleEn: "Gentle assessment",
        descNo: "Ingen undersøkelse gjøres mot din vilje. Vi tilpasser alt til det du er komfortabel med.",
        descEn: "No examination is done against your will. Everything is adapted to what you are comfortable with.",
      },
      {
        titleNo: "Målrettet behandling",
        titleEn: "Targeted treatment",
        descNo:
          "Fra fysioterapi og sexologisk oppfølging til Botoxbehandling ved vedvarende plager.",
        descEn:
          "From physiotherapy and sexological follow-up to Botox treatment for persistent symptoms.",
      },
    ],
  },

  urogynekologi: {
    reasonsTitleNo: "Hva er urogynekologi?",
    reasonsTitleEn: "What is urogynaecology?",
    reasonsLeadNo:
      "Urogynekologi er fagområdet som utreder og behandler plager i bekkenbunnen — først og fremst vaginale fremfall (prolaps) og urinlekkasje. Under finner du egne sider med utdypende informasjon om hver av tilstandene.",
    reasonsLeadEn:
      "Urogynaecology assesses and treats pelvic floor problems — primarily vaginal prolapse and urinary incontinence. Below you will find dedicated pages with more detail on each condition.",
    reasons: [
      {
        titleNo: "Samlet kompetanse",
        titleEn: "Combined expertise",
        descNo: "Fremfall og lekkasje vurderes sammen — ikke i hver sin silo.",
        descEn: "Prolapse and leakage are assessed together — not in separate silos.",
      },
      {
        titleNo: "Uavhengig av livsfase",
        titleEn: "Independent of life stage",
        descNo:
          "Du kan ha urogynekologiske plager uten å ha født — og uten å være i overgangsalderen.",
        descEn:
          "You can have urogynaecological problems without having given birth — and without being in menopause.",
      },
      {
        titleNo: "Erfarne spesialister",
        titleEn: "Experienced specialists",
        descNo: "Urogynekologi krever volum og rutine. Våre kirurger gjør dette ofte.",
        descEn: "Urogynaecology requires volume and routine. Our surgeons do this often.",
      },
    ],
  },
};
