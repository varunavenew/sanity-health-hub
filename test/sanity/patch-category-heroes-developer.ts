#!/usr/bin/env npx tsx
/**
 * Developer-only: treatment category hero copy (NO verbatim from avenewdemo + EN).
 * - Second heading line is plain (not italic) — styling is frontend.
 * - Tags: ✓ Ingen henvisning · ✓ Kort ventetid
 * - Fertility: full ingress + help text under buttons
 *
 *   cd test && npx tsx sanity/patch-category-heroes-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

function i18nString(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
}

function bullet(key: string, no: string, en: string) {
  return {
    _key: key,
    _type: "heroBulletItem",
    title: i18nString(no, en),
  };
}

const TAGS = [
  bullet("bullet-0", "Ingen henvisning", "No referral needed"),
  bullet("bullet-1", "Kort ventetid", "Short waiting time"),
];

type HeroPatch = {
  id: string;
  /** Optional category title used in breadcrumb */
  title?: ReturnType<typeof i18nString>;
  hero: Record<string, unknown>;
  unset?: string[];
};

const PATCHES: HeroPatch[] = [
  {
    id: "category-fertilitet",
    hero: {
      heading: i18nString("Noen ganger trenger kroppen", "Sometimes the body needs"),
      headingEmphasis: i18nString("litt hjelp på veien", "a little help along the way"),
      body: i18nText(
        "Å ville bli foreldre er noe av det sterkeste man kan kjenne på. For mange går det av seg selv. For andre tar det litt lenger tid — og noen trenger hjelp. Det er mer vanlig enn du tror, og det finnes svar. Du er ikke aleine.",
        "Wanting to become a parent is one of the strongest feelings there is. For many it happens naturally. For others it takes longer — and some need help. It is more common than you think, and there are answers. You are not alone.",
      ),
      bullets: TAGS,
      primaryCtaLabel: i18nString("Bestill time", "Book appointment"),
      secondaryCtaLabel: i18nString("Ring oss", "Call us"),
      helpText: i18nText(
        "Usikker på hvor man skal starte? Du er alltid velkommen til å ringe oss direkte så hjelper vi deg.",
        "Not sure where to start? You are always welcome to call us directly and we'll help you.",
      ),
      entryPriceLabel: i18nString(
        "Gratis uforpliktende samtale om fertilitet",
        "Free no-obligation fertility conversation",
      ),
      entryPriceValue: i18nString("Gratis", "Free"),
    },
  },
  {
    id: "category-gynekologi",
    hero: {
      heading: i18nString("Kvinnehelse", "Women's health"),
      headingEmphasis: i18nString("for livet", "for life"),
      body: i18nText(
        "Vi følger deg gjennom hele livet – fra de første spørsmålene i tenårene, gjennom barneønske og svangerskap, fødsel og barseltid, til tiden før, under og etter overgangsalder. Vi har gynekologer med ekspertise innen alle de vanligste kvinnelidelsene, ved behov får du hjelp fra andre spesialister som psykolog, osteopat eller sexolog. Hos oss får du helhetlig omsorg.",
        "We support you through every stage of life – from the first questions in your teens, through trying to conceive and pregnancy, birth and the postnatal period, to the time before, during and after menopause. Our gynecologists have expertise across the most common women's health conditions, and when needed you get help from other specialists such as a psychologist, osteopath or sexologist. With us you receive holistic care.",
      ),
      bullets: TAGS,
      primaryCtaLabel: i18nString(
        "Bestill gynekologisk undersøkelse",
        "Book gynecological examination",
      ),
      secondaryCtaLabel: i18nString("Ring oss", "Call us"),
      entryPriceLabel: i18nString("Generell undersøkelse", "General examination"),
      entryPriceValue: i18nString("Pris fra 2.100 kr", "From NOK 2,100"),
    },
    unset: ["landingPage.hero.helpText"],
  },
  {
    id: "category-urologi",
    hero: {
      heading: i18nString("Spesialister", "Specialists"),
      headingEmphasis: i18nString("du kan stole på", "you can trust"),
      body: i18nText(
        "Plager i underlivet er vanligere enn du tror — og enklere å hjelpe enn du kanskje frykter. CMedical er eneste private aktør i Norge som tilbyr robotassisterte operasjoner.",
        "Pelvic and genital symptoms are more common than you think — and easier to help with than you might fear. CMedical is the only private provider in Norway offering robot-assisted surgery.",
      ),
      bullets: TAGS,
      primaryCtaLabel: i18nString("Bestill urologtime", "Book urology appointment"),
      secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    },
    unset: [
      "landingPage.hero.helpText",
      "landingPage.hero.entryPriceLabel",
      "landingPage.hero.entryPriceValue",
    ],
  },
  {
    id: "category-ortopedi",
    hero: {
      heading: i18nString("Det gjør vondt.", "It hurts."),
      headingEmphasis: i18nString("La oss finne ut hvorfor.", "Let's find out why."),
      body: i18nText(
        "Våre ortopeder er eksperter på skader og sykdommer i muskler, bein, ledd og sener. Noen av landets fremste kirurger jobber hos oss — også med second opinion.",
        "Our orthopaedic specialists are experts in injuries and conditions affecting muscles, bones, joints and tendons. Some of the country's leading surgeons work with us — including for second opinions.",
      ),
      bullets: TAGS,
      primaryCtaLabel: i18nString("Bestill ortopedtime", "Book orthopaedic appointment"),
      secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    },
    unset: [
      "landingPage.hero.helpText",
      "landingPage.hero.entryPriceLabel",
      "landingPage.hero.entryPriceValue",
    ],
  },
  {
    id: "category-graviditet",
    title: i18nString("Graviditet", "Pregnancy"),
    hero: {
      heading: i18nString("Et svangerskap er noe av", "A pregnancy is one of"),
      headingEmphasis: i18nString(
        "det mest sårbare som finnes",
        "the most vulnerable experiences there is",
      ),
      body: i18nText(
        "Barneønske, svangerskapskontroll og tiden etter fødsel — vi følger deg gjennom hele forløpet.",
        "Trying to conceive, pregnancy check-ups and the time after birth — we follow you through the entire journey.",
      ),
      bullets: TAGS,
      primaryCtaLabel: i18nString("Bestill time", "Book appointment"),
      secondaryCtaLabel: i18nString("Ring oss", "Call us"),
      entryPriceLabel: i18nString("Kontroll etter fødsel", "Postpartum check-up"),
      entryPriceValue: i18nString("Pris fra 2.100 kr", "From NOK 2,100"),
    },
    unset: ["landingPage.hero.helpText"],
  },
  {
    id: "category-flere-fagomrader",
    hero: {
      heading: i18nString("Spesialister", "Specialists"),
      headingEmphasis: i18nString("i team", "in teams"),
      body: i18nText(
        "Vi har samlet noen av Nordens fremste spesialister innen hud, psykologi, sexologi, ernæring og kirurgi. Spesialistene jobber i tverrfaglige team — og utelukkende med det de kan aller best.",
        "We have brought together some of the Nordic region's leading specialists in dermatology, psychology, sexology, nutrition and surgery. They work in cross-disciplinary teams — and focus exclusively on what they do best.",
      ),
      bullets: TAGS,
      primaryCtaLabel: i18nString("Bestill time", "Book appointment"),
      secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    },
    unset: [
      "landingPage.hero.helpText",
      "landingPage.hero.entryPriceLabel",
      "landingPage.hero.entryPriceValue",
    ],
  },
];

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const summary: Record<string, unknown> = {};

  for (const patch of PATCHES) {
    const published = await sanityClient.getDocument(patch.id);
    if (!published) throw new Error(`Missing document ${patch.id}`);

    const setPayload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patch.hero)) {
      setPayload[`landingPage.hero.${key}`] = value;
    }
    if (patch.title) {
      setPayload.title = patch.title;
    }

    const draftId = `drafts.${patch.id}`;
    const targets = [patch.id, draftId];

    for (const targetId of targets) {
      const exists =
        targetId === patch.id
          ? true
          : Boolean(await sanityClient.getDocument(targetId));

      if (!exists) {
        // Seed a draft from published so Studio panes show the patched hero
        // instead of a stale in-browser form left open before the API patch.
        await sanityClient.createOrReplace({
          ...published,
          _id: draftId,
        });
      }

      let op = sanityClient.patch(targetId).set(setPayload);
      if (patch.unset?.length) {
        op = op.unset(patch.unset);
      }
      await op.commit({ autoGenerateArrayKeys: true });
    }

    summary[patch.id] = await sanityClient.fetch(
      `{
        "published": *[_id==$id][0]{
          "titleNo": title[language=="no"][0].value,
          "bodyNo": landingPage.hero.body[language=="no"][0].value,
          "helpNo": landingPage.hero.helpText[language=="no"][0].value,
          "heNo": landingPage.hero.headingEmphasis[language=="no"][0].value,
          "bulletsNo": landingPage.hero.bullets[].title[language=="no"][0].value
        },
        "draft": *[_id==$draftId][0]{
          "bodyNo": landingPage.hero.body[language=="no"][0].value,
          "helpNo": landingPage.hero.helpText[language=="no"][0].value
        }
      }`,
      { id: patch.id, draftId },
    );
    console.log(`✓ ${patch.id} (+ draft)`);
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
