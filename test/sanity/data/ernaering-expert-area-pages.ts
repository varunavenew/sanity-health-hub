/**
 * Nutrition (Ernæringsfysiolog) expert-area child pages + parent card copy.
 * Source: client-approved NO/EN copy (Oct 2026).
 */
import type { ReasonI18n } from "./flere-fagomrader-page-content";

export type ErnaeringChildPage = {
  id: string;
  slugNo: string;
  slugEn: string;
  titleNo: string;
  titleEn: string;
  heroTitleNo: string;
  heroTitleEn: string;
  heroLeadNo: string;
  heroLeadEn: string;
  reasonsTitleNo: string;
  reasonsTitleEn: string;
  reasonsLeadNo: string;
  reasonsLeadEn: string;
  reasons: ReasonI18n[];
  seoTitleNo: string;
  seoTitleEn: string;
  seoDescNo: string;
  seoDescEn: string;
  ogAltNo: string;
  ogAltEn: string;
  geoNo: string;
  geoEn: string;
  bookingService: string;
  cardPath: string;
  cardDescNo: string;
  cardDescEn: string;
};

function bullets(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

const FERTILITY_SOURCES = `Kellow NJ, Le Cerf J, Horta F, Dordevic AL, Bennett CJ. The Effect of Dietary Patterns on Clinical Pregnancy and Live Birth Outcomes in Men and Women Receiving Assisted Reproductive Technologies: A Systematic Review and Meta-Analysis. Adv Nutr. 2022 May 1.

Sun H, Lin Y, Lin D, Zou C, Zou X, Fu L, et al. Mediterranean diet improves embryo yield in IVF: A prospective cohort study. Reprod Biol Endocrinol. 2019.

Barrea L, Arnone A, Annunziata G, Muscogiuri G, Laudisio D, Salzano C, et al. Adherence to the Mediterranean diet, dietary patterns and body composition in women with polycystic ovary syndrome (PCOS). Nutrients. 2019.

Jurczewska J, Szostak-Węgierek D. The Influence of Diet on Ovulation Disorders in Women—A Narrative Review. Nutrients. 2022.

Karayiannis D, Kontogianni MD, Mendorou C, Douka L, Mastrominas M, Yiannakouris N. Association between adherence to the Mediterranean diet and semen quality parameters in male partners of couples attempting fertility. Hum Reprod. 2017.

Cao LL, Chang JJ, Wang SJ, Li YH, Yuan MY, Wang GF, et al. The effect of healthy dietary patterns on male semen quality: a systematic review and meta-analysis. Asian J Androl. 2022.

Gautam R, Maan P, Jyoti A, Kumar A, Malhotra N, Arora T. The Role of Lifestyle Interventions in PCOS Management: A Systematic Review. Nutrients. 2025 Jan 16;17(2):310.`;

export const ERNAERING_EXPERT_AREA_TITLE = {
  no: "Vi behandler blant annet:",
  en: "We treat, among other things:",
} as const;

export const ERNAERING_CHILD_PAGES: ErnaeringChildPage[] = [
  {
    id: "treatment-flere-fagomrader-ernaringsfysiolog-gravid",
    slugNo: "gravid",
    slugEn: "pregnancy-ernaering",
    titleNo: "Gravid",
    titleEn: "Pregnancy",
    heroTitleNo: "Ernæringsfysiolog for gravide",
    heroTitleEn: "Dietitian for pregnancy",
    heroLeadNo:
      "Er du gravid og skulle ønske du kunne snakke med en ernæringsfysiolog på helsestasjonen? Det skulle vi også, men dessverre finnes dette tilbudet bare noen få steder i landet. Derfor tilbyr vi timer både fysisk i Oslo og digitalt for gravide med ulike problemstillinger.",
    heroLeadEn:
      "Are you pregnant and wish you could talk to a dietitian at your maternity clinic? So do we, but unfortunately this service is only available in a few places in Norway. That's why we offer appointments both in person in Oslo and online for pregnant women with a range of needs.",
    reasonsTitleNo: "",
    reasonsTitleEn: "",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [
      {
        titleNo: "Store endringer på kort tid",
        titleEn: "Big changes in a short time",
        descNo:
          "Graviditet kan være en sårbar fase med store forandringer på kort tid. Kanskje har det tatt lang tid å bli gravid, kanskje har du med deg en historie med et vanskelig forhold til kropp og mat, eller kanskje er du bare usikker på om det du gjør er riktig. Ingen spørsmål er «feil» i denne sammenhengen, og det kan være mye å hente på å diskutere det du tenker på med en fagperson.",
        descEn:
          'Pregnancy can be a vulnerable time with big changes happening quickly. Perhaps it took a long time to conceive, perhaps you have a history of a difficult relationship with your body and food, or perhaps you\'re simply unsure whether what you\'re doing is right. No question is a "wrong" question here, and it can help to talk through what\'s on your mind with a professional.',
      },
      {
        titleNo: "Vår kompetanse",
        titleEn: "Our expertise",
        descNo:
          "Vår kliniske ernæringsfysiolog Mari Eskerud har nylig gjennomført kurset «Nutritional Management in Pregnancy» for ernæringsfysiologer, fra British Dietetic Association. Hun er oppdatert på temaer som vektendringer under graviditet, næringsstoffbehov, tolkning av blodprøver og body image.",
        descEn:
          'Our clinical dietitian Mari Eskerud has recently completed the course "Nutritional Management in Pregnancy" for dietitians from the British Dietetic Association. She is up to date on topics such as weight changes during pregnancy, nutrient requirements, interpreting blood tests and body image.',
      },
      {
        titleNo: "Hva kan en ernæringsfysiolog hjelpe med?",
        titleEn: "How can a dietitian help?",
        descNo: bullets([
          "Veiledning ved kvalme og nedsatt matlyst",
          "Sunn vektutvikling i graviditet",
          "Behov for og valg av kosttilskudd",
          "Råd om næringsrike matvalg",
          "Jernrik kost",
          "Trygg mat for gravide",
          "Gravidkost med begrensninger, f.eks. cøliaki, allergi eller IBS",
          "Råd om måltidsrytme og måltidsstørrelse når magen presser",
          "Samtale om stress rundt mat, og å sortere hva som er viktig og uviktig å fokusere på",
          "Svangerskapsdiabetes",
        ]),
        descEn: bullets([
          "Guidance on nausea and reduced appetite",
          "Healthy weight gain during pregnancy",
          "Whether you need supplements, and which to choose",
          "Advice on nutrient-rich food choices",
          "Iron-rich foods",
          "Food safety in pregnancy",
          "Eating in pregnancy with restrictions, e.g. coeliac disease, allergies or IBS",
          "Advice on meal rhythm and meal size when your bump is pressing on your stomach",
          "Talking through stress around food and sorting out what is and isn't important to focus on",
          "Gestational diabetes",
        ]),
      },
      {
        titleNo: "Individuelle råd",
        titleEn: "Individual advice",
        descNo:
          "Alle svangerskap er ulike og krever en individuell tilnærming. Derfor bruker vi god tid på å kartlegge hva som er viktig for deg som gravid. Våre ernæringsfysiologer samarbeider også tett med gynekologene og osteopatene våre hvis du ønsker annen oppfølging.",
        descEn:
          "Every pregnancy is different and calls for an individual approach. That's why we take the time to understand what matters to you. Our dietitians also work closely with our gynaecologists and osteopaths if you would like other follow-up.",
      },
    ],
    seoTitleNo: "Ernæringsfysiolog for gravide | CMedical",
    seoTitleEn: "Dietitian for pregnancy | CMedical",
    seoDescNo:
      "Ernæringsveiledning for gravide — fysisk i Oslo og digitalt. Mari Eskerud er oppdatert på kosthold, næringsstoffer og svangerskap. Book time hos CMedical.",
    seoDescEn:
      "Dietitian appointments for pregnancy — in person in Oslo and online. Mari Eskerud is up to date on diet, nutrients and pregnancy. Book at CMedical.",
    ogAltNo: "Ernæringsfysiolog for gravide — CMedical",
    ogAltEn: "Dietitian for pregnancy — CMedical",
    geoNo:
      "Ernæringsveiledning for gravide — fysisk i Oslo og digitalt hos CMedical.",
    geoEn:
      "Dietitian guidance for pregnancy — in person in Oslo and online at CMedical.",
    bookingService: "gravid",
    cardPath: "/ovrige/ernaeringsfysiolog/gravid",
    cardDescNo: "Ernæringsveiledning gjennom svangerskapet",
    cardDescEn: "Nutrition guidance throughout your pregnancy",
  },
  {
    id: "treatment-flere-fagomrader-ernaringsfysiolog-fertilitet-ernaering",
    slugNo: "fertilitet-ernaering",
    slugEn: "fertility-nutrition",
    titleNo: "Fertilitet",
    titleEn: "Fertility",
    heroTitleNo: "Ernæring når du skal bli gravid",
    heroTitleEn: "Nutrition when you're trying to conceive",
    heroLeadNo:
      "Tradisjonelt har ikke ernæring og kosthold hatt en stor plass i planleggingen av graviditet eller fertilitetsbehandling. Men stadig mer forskning viser at det kan være en viktig faktor å ta hensyn til. Våre ernæringsfysiologer er eksperter på dette.",
    heroLeadEn:
      "Traditionally, nutrition and diet have played a small part in planning a pregnancy or fertility treatment. But a growing body of research shows that they can be an important factor. Our dietitians are experts in this area.",
    reasonsTitleNo: "",
    reasonsTitleEn: "",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [
      {
        titleNo: "Hvordan kan ernæring påvirke fertiliteten?",
        titleEn: "How can nutrition affect fertility?",
        descNo:
          "Maten vi spiser er byggesteinene i kroppen vår, og det reproduktive systemet påvirkes av kostholdet, akkurat som alle andre organer. På samme måte som sunn mat kan redusere risikoen for sykdommer som hjerte- og karsykdom, kan det også redusere risikoen for infertilitet.\n\nHovedmekanismen antas å være redusert inflammasjon i kroppen. Dette går spesielt utover eggcellene, men også hos mannen er det vist at kosthold kan påvirke fertilitetsparametere. Hormonbalansen kan også påvirkes av matvarene vi spiser. Vi kan ikke forutsi hvor mye en kostholdsendring kan bety for den enkeltes mulighet til å bli gravid, men i studier ser man en effekt på gruppenivå.",
        descEn:
          "The food we eat provides the building blocks of our bodies, and the reproductive system is affected by diet just like every other organ. In the same way that healthy food can reduce the risk of conditions such as cardiovascular disease, it may also reduce the risk of infertility.\n\nThe main mechanism is thought to be reduced inflammation in the body. This particularly affects egg cells, but diet has also been shown to influence fertility parameters in men. Hormone balance can also be affected by the foods we eat. We can't predict how much a dietary change will affect any one person's chances of conceiving, but studies show an effect at group level.",
      },
      {
        titleNo: "Årsaker til fertilitetsutfordringer",
        titleEn: "Causes of fertility challenges",
        descNo:
          "Det er ulike grunner til at det kan ta tid å bli gravid. Ernæring kan ha betydning for flere av dem, for eksempel:\n\n" +
          bullets([
            "PMOS/PCOS",
            "Endometriose",
            "Lav vekt",
            "Høy vekt",
            "Amenorré (fravær av menstruasjon/eggløsning)",
            "Næringsstoffmangler",
            "Diabetes type 1 eller 2",
          ]),
        descEn:
          "There are many reasons why it can take time to conceive. Nutrition may play a role in several of them, for example:\n\n" +
          bullets([
            "PCOS (polycystic ovary syndrome)",
            "Endometriosis",
            "Low body weight",
            "High body weight",
            "Amenorrhoea (absence of periods/ovulation)",
            "Nutrient deficiencies",
            "Type 1 or type 2 diabetes",
          ]),
      },
      {
        titleNo: "Hva skal du spise for å bli gravid?",
        titleEn: "What should you eat to get pregnant?",
        descNo:
          "Et fertilitetsvennlig kosthold er ganske likt et sunt kosthold generelt. Men om du begynner å google dette, får du mange motstridende og til dels direkte feil råd. Det kan øke stress og bekymring for om du spiser riktig. Derfor kan det være en god investering å snakke med en fagperson for å få en vurdering av hva som er viktig akkurat for deg og ditt kosthold, enten du kommer alene eller sammen med partner.",
        descEn:
          "A fertility-friendly diet is quite similar to a healthy diet in general. But if you start googling it, you'll find plenty of conflicting and sometimes plainly wrong advice, which can add to stress and worry about whether you're eating the right things. Talking to a professional can be a good investment: they can assess what matters for you and your diet, whether you come alone or as a couple.",
      },
      {
        titleNo: "Vår kompetanse",
        titleEn: "Our expertise",
        descNo:
          "Klinisk ernæringsfysiolog Mari Eskerud er sertifisert innen ernæring og fertilitet. Hun har jobbet med kosthold og kvinnehelse i flere år og forelser også om emnet. Du kan møte Mari fysisk på Majorstuen eller via digital konsultasjon.",
        descEn:
          "Mari Eskerud, clinical dietitian at CMedical, is certified in nutrition and fertility. She has worked with diet and women's health for several years and also lectures on the subject. You can meet Mari in person at Majorstuen or through an online consultation.",
      },
      {
        titleNo: "Kilder",
        titleEn: "Sources",
        descNo: FERTILITY_SOURCES,
        descEn: FERTILITY_SOURCES,
      },
    ],
    seoTitleNo: "Ernæring når du skal bli gravid | CMedical",
    seoTitleEn: "Nutrition when you're trying to conceive | CMedical",
    seoDescNo:
      "Kosthold og fertilitet — individuell veiledning hos CMedical. Mari Eskerud er sertifisert innen ernæring og fertilitet. Majorstuen og digitalt.",
    seoDescEn:
      "Diet and fertility — individual guidance at CMedical. Mari Eskerud is certified in nutrition and fertility. Majorstuen and online.",
    ogAltNo: "Ernæring og fertilitet — CMedical",
    ogAltEn: "Nutrition and fertility — CMedical",
    geoNo:
      "Ernæringsveiledning når du skal bli gravid — fysisk på Majorstuen og digitalt hos CMedical.",
    geoEn:
      "Nutrition guidance when you're trying to conceive — in person at Majorstuen and online at CMedical.",
    bookingService: "fertilitet-ernaering",
    cardPath: "/ovrige/ernaeringsfysiolog/fertilitet-ernaering",
    cardDescNo: "Ernæring når du skal bli gravid",
    cardDescEn: "Nutrition when you're trying to conceive",
  },
  {
    id: "treatment-flere-fagomrader-ernaringsfysiolog-overgangsalder-ernaering",
    slugNo: "overgangsalder-ernaering",
    slugEn: "menopause-nutrition",
    titleNo: "Overgangsalder",
    titleEn: "Menopause",
    heroTitleNo: "Ernæring i perimenopause og menopause",
    heroTitleEn: "Nutrition in perimenopause and menopause",
    heroLeadNo:
      "Mange kvinner opplever store endringer i hvordan de føler seg og hvordan kroppen oppfører seg i denne fasen. Kosthold og ernæring har stor innvirkning på overskudd, søvn og helse på lang sikt. Individuell veiledning er viktig for å finne ut hva som kan hjelpe akkurat deg til å få det bedre.",
    heroLeadEn:
      "Many women experience big changes in how they feel and how their body behaves during this phase. Diet and nutrition have a major impact on energy, sleep and long-term health. Individual guidance is key to finding out what can help you feel better.",
    reasonsTitleNo: "",
    reasonsTitleEn: "",
    reasonsLeadNo: "",
    reasonsLeadEn: "",
    reasons: [
      {
        titleNo: "Forskningen henger etter",
        titleEn: "Research is lagging behind",
        descNo:
          "Det er godt kjent at forskning på kvinnehelse ligger langt bak annen forskning. Siden peri- og menopause er noe alle kvinner går gjennom, skulle man tro at det sto bedre til her, men dessverre er det skremmende lite som er godt dokumentert.\n\nVåre ernæringsfysiologer bruker derfor den kunnskapen som finnes, sammen med en grundig individuell kartlegging, når de rådgir kvinner i denne fasen. Mange opplever at det som tidligere fungerte for kosthold og vektregulering, ikke har samme effekt lenger, og har nytte av å sparre med en fagperson om nye rutiner og matvaner som kan være gunstige.",
        descEn:
          "It is well known that research into women's health lags far behind other research. Since perimenopause and menopause are something every woman goes through, you would expect the evidence base to be better, but unfortunately there is strikingly little that is well documented.\n\nOur dietitians therefore combine the knowledge that does exist with a thorough individual assessment when advising women in this phase. Many find that what used to work for their diet and weight no longer has the same effect, and benefit from talking to a professional about new routines and eating habits that may suit them better.",
      },
      {
        titleNo: "Vanlige utfordringer i overgangsalderen der kosthold kan påvirke",
        titleEn: "Common menopause challenges where diet can play a role",
        descNo: bullets([
          "Vektøkning",
          "Manglende overskudd",
          "Søvnproblemer",
          "Proteininntak",
          "Hjernetåke",
          "Mageplager",
          "Økt kolesterol/blodsukker",
        ]),
        descEn: bullets([
          "Weight gain",
          "Low energy",
          "Sleep problems",
          "Protein intake",
          "Brain fog",
          "Digestive issues",
          "Raised cholesterol/blood sugar",
        ]),
      },
      {
        titleNo: "Hva skjer i timen?",
        titleEn: "What happens during the appointment?",
        descNo:
          "En time hos ernæringsfysiolog går normalt med til å kartlegge helse og historikk. Så følger en grundig gjennomgang av kostholdet og hverdagen din. Deretter får du råd om endringer som kan være hensiktsmessige ut fra plagene og ønskene dine, for eksempel matvarevalg, drikke, måltidsrytme eller kosttilskudd. Du får også god tid til å stille spørsmål om sammenhengene mellom mat og helse.",
        descEn:
          "An appointment with a dietitian normally starts with a review of your health and history. This is followed by a thorough look at your diet and daily life. You then receive advice on dietary changes that may suit your symptoms and goals, such as food choices, drinks, meal rhythm or supplements. You'll also have plenty of time to ask questions about the links between food and health.",
      },
      {
        titleNo: "Tverrfaglig team",
        titleEn: "A multidisciplinary team",
        descNo:
          "På CMedical treffer du et team med spesialkompetanse på perimenopause og menopause. Gynekolog, sexolog, psykolog, osteopat og ernæringsfysiolog kan skreddersy opplegget som er riktig for deg.",
        descEn:
          "At CMedical you'll meet a team with specialist expertise in perimenopause and menopause. Gynaecologists, sexologists, psychologists, osteopaths and dietitians can tailor the right approach for you.",
      },
    ],
    seoTitleNo: "Ernæring i perimenopause og menopause | CMedical",
    seoTitleEn: "Nutrition in perimenopause and menopause | CMedical",
    seoDescNo:
      "Individuell kostholdsveiledning i overgangsalderen. CMedical — ernæringsfysiolog, gynekolog, psykolog og mer under samme tak.",
    seoDescEn:
      "Individual dietary guidance in menopause. CMedical — dietitian, gynaecologist, psychologist and more under one roof.",
    ogAltNo: "Ernæring i perimenopause og menopause — CMedical",
    ogAltEn: "Nutrition in perimenopause and menopause — CMedical",
    geoNo:
      "Ernæringsveiledning i perimenopause og menopause — individuell oppfølging hos CMedical.",
    geoEn:
      "Nutrition guidance in perimenopause and menopause — individual follow-up at CMedical.",
    bookingService: "overgangsalder-ernaering",
    cardPath: "/ovrige/ernaeringsfysiolog/overgangsalder-ernaering",
    cardDescNo: "Ernæring i perimenopause og menopause",
    cardDescEn: "Nutrition in perimenopause and menopause",
  },
];

export const PARENT_ID = "treatment-flere-fagomrader-ernaringsfysiolog";
export const CATEGORY_REF = "category-flere-fagomrader";
export const SPECIALIST_MARI = "specialist-mari-borge-eskerud";

export const DEFAULT_HERO_ASSET =
  "image-84776be3dd4715058d0fb05d2a8330a6073e9e30-1250x1080-jpg";
