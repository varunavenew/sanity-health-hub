/**
 * Migrate static category content into Sanity `treatmentCategory` documents.
 *
 * Source of truth: src/pages/treatments/categoryPageContent.ts
 * The data is inlined here (rather than imported) because the source file
 * pulls in React/Lucide/asset imports that can't load in a Node script.
 *
 * Idempotent: only writes fields that are currently missing on the document.
 * Pass FORCE=1 to overwrite existing values.
 *
 * After running, re-run translate-all-content.ts to generate `_en` parallel
 * fields via the Lovable AI Gateway.
 *
 * Usage:
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-static-category-content.ts
 *   FORCE=1 SANITY_TOKEN=<token> npx tsx sanity/migrate-static-category-content.ts
 *   DRY_RUN=1 SANITY_TOKEN=<token> npx tsx sanity/migrate-static-category-content.ts
 */

import { randomUUID } from 'node:crypto'
import { sanityClient } from './config'

const FORCE = process.env.FORCE === '1'
const DRY_RUN = process.env.DRY_RUN === '1'

const k = () => randomUUID().replace(/-/g, '').slice(0, 12)

interface CategoryData {
  subtitle: string
  servicesHeading: string
  servicesIntro: string
  serviceGroups: { label: string; serviceNames: string[] }[]
  journey: { icon: string; label: string; title: string; body: string }[]
  staticFaqs: { question: string; answer: string }[]
  closingTitle: string
  closingBody: string
  closingCta: string
  bookingPath: string
}

const STANDARD_FAQS = [
  {
    question: 'Henvisning',
    answer:
      'Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige.',
  },
  {
    question: 'Ventetid',
    answer:
      'Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Dette varierer selvfølgelig noe avhengig av hva du trenger hjelp med. Enkle konsultasjoner får du raskere bestilt sammenlignet med operasjoner for eksempel. Ta kontakt med oss så finner vi en tid som passer deg!',
  },
  {
    question: 'Sykemelding',
    answer:
      'I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer.',
  },
  {
    question: 'Utredning',
    answer:
      'Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter.',
  },
  {
    question: 'Selskapet',
    answer:
      'CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året, og sørger for å bruke vår spisskompetanse til å forstå våre pasienters helhetsbilde.',
  },
]

const CATEGORIES: Record<string, CategoryData> = {
  gynekologi: {
    subtitle: 'Ingen ventetid • Ingen henvisning',
    servicesHeading: 'Alt under samme tak',
    servicesIntro:
      'Hos oss møter du ledende gynekologer som utelukkende jobber med den kvinnesykdommen de kan aller best. Våre spesialister jobber innenfor disse områdene:',
    serviceGroups: [
      { label: 'Den vanlige timen', serviceNames: ['Gynekologisk undersøkelse', 'Celleforandringer'] },
      { label: 'Når noe ikke kjennes riktig', serviceNames: ['Endometriose', 'Blødningsforstyrrelser', 'Cyster på eggstokkene', 'PMS og PMDD', 'Vulvalidelser'] },
      { label: 'Livet skifter form', serviceNames: ['Urinlekkasje', 'Overgangsalder', 'Vaginale fremfall'] },
      { label: 'Når kirurgi er svaret', serviceNames: ['Fjerne livmor', 'Labiaplastikk', 'Gynekologisk kirurgi', 'Robotassistert kirurgi'] },
    ],
    journey: [
      { icon: 'Calendar', label: 'Steg 01', title: 'Bestill når det passer deg', body: 'Online booking døgnet rundt. Ingen henvisning. Vi har fra ingen til svært korte ventetider.' },
      { icon: 'MessageCircle', label: 'Steg 02', title: 'Samtalen som rekker', body: 'En gynekolog som utelukkende jobber med din kvinnesykdom. Vi går gjennom historikk, plager og hva du ønsker hjelp med.' },
      { icon: 'HeartHandshake', label: 'Steg 03', title: 'Utredning og plan', body: 'En vanlig utredning hos oss varer ca 30 minutter. Trygg klinisk undersøkelse og en konkret plan – på et språk du forstår.' },
      { icon: 'Clock', label: 'Steg 04', title: 'Tverrfaglig oppfølging', body: 'Ved behov tilbyr vi tverrfaglig behandling med fertilitetsspesialister, sexolog, urolog, ernæringsfysiologer, osteopat, fysioterapeuter, uroterapeut og psykologer.' },
    ],
    staticFaqs: STANDARD_FAQS,
    closingTitle: 'Klar når du er det',
    closingBody: 'Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.',
    closingCta: 'Bestill gynekologtime',
    bookingPath: '/booking?kategori=gynekologi',
  },
  urologi: {
    subtitle: 'Ingen ventetid • Ingen henvisning',
    servicesHeading: 'Urologispesialister',
    servicesIntro:
      'Våre spesialister jobber med de fagområdene de kan best. Vi har noen av Nordens ledende spesialister på følgende områder:',
    serviceGroups: [
      { label: 'Vannlating og blære', serviceNames: ['Blære og urinveier', 'Nyrer'] },
      { label: 'Mannlig helse', serviceNames: ['Forhud', 'Testikler og pung', 'Mannlig infertilitet'] },
      { label: 'Prostata', serviceNames: ['Prostata', 'Robotassistert kirurgi'] },
      { label: 'Familieplanlegging', serviceNames: ['Sterilisering', 'Refertilisering'] },
    ],
    journey: [
      { icon: 'Calendar', label: 'Steg 01', title: 'Bestill når det passer deg', body: 'Online booking døgnet rundt. Ingen henvisning. Vi har fra ingen til svært korte ventetider.' },
      { icon: 'MessageCircle', label: 'Steg 02', title: 'Konsultasjon med spesialist', body: 'En urolog som er spesialist på din plage. Vi går gjennom symptomer, historikk og hva du ønsker hjelp med.' },
      { icon: 'HeartHandshake', label: 'Steg 03', title: 'Utredning og plan', body: 'En vanlig utredning varer ca 30 minutter. Klinisk undersøkelse og en konkret behandlingsplan – på et språk du forstår.' },
      { icon: 'Clock', label: 'Steg 04', title: 'Behandling og oppfølging', body: 'Vi tilbyr alt fra konservativ behandling til avansert urologisk kirurgi, med tett oppfølging gjennom hele forløpet.' },
    ],
    staticFaqs: STANDARD_FAQS,
    closingTitle: 'Klar når du er det',
    closingBody: 'Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.',
    closingCta: 'Bestill urologtime',
    bookingPath: '/booking?kategori=urologi',
  },
  fertilitet: {
    subtitle: 'Uten henvisning • Ingen ventetid',
    servicesHeading: 'Fertilitetsspesialister',
    servicesIntro:
      'Hos CMedical fertilitet jobber vi i et tverrfaglig team. IVF-teamet består av gynekologer med subspesialisering innen fertilitet, IVF-sykepleiere og embryologer. Som pasient ved CMedical er du i trygge hender.',
    serviceGroups: [
      { label: 'Når graviditeten lar vente på seg', serviceNames: ['Infertilitet', 'Sædanalyse'] },
      { label: 'Assistert befruktning', serviceNames: ['IVF', 'Assistert befruktning', 'Assistert befruktning med donor'] },
      { label: 'For fremtiden', serviceNames: ['Eggfrys'] },
      { label: 'Utredning og inngrep', serviceNames: ['Hysteroskopi', 'Vårt team'] },
    ],
    journey: [
      { icon: 'Calendar', label: 'Steg 01', title: 'Uforpliktende kontakt', body: 'Bestill en kostnadsfri prat med en av våre IVF-sykepleiere, eller book konsultasjon direkte. Ingen henvisning.' },
      { icon: 'MessageCircle', label: 'Steg 02', title: 'Konsultasjon og utredning', body: 'Sammen med en fertilitetsspesialist går vi gjennom historikk, prøver og hva som kan være riktig vei videre for deg.' },
      { icon: 'HeartHandshake', label: 'Steg 03', title: 'Personlig behandlingsplan', body: 'Vi setter opp en plan tilpasset deg – fra hormonbehandling og inseminasjon til IVF, ICSI og donorbehandling.' },
      { icon: 'Clock', label: 'Steg 04', title: 'Tett oppfølging gjennom hele reisen', body: 'Vårt tverrfaglige team følger deg tett – med både medisinsk, psykologisk og praktisk støtte når du trenger det.' },
    ],
    staticFaqs: STANDARD_FAQS,
    closingTitle: 'Klar når du er det',
    closingBody: 'Snakk med en av våre IVF-sykepleiere eller book konsultasjon med en fertilitetsspesialist. Ingen henvisning.',
    closingCta: 'Bestill fertilitetstime',
    bookingPath: '/booking?kategori=fertilitet',
  },
  ortopedi: {
    subtitle: 'Ingen ventetid • Ingen henvisning',
    servicesHeading: 'Erfarne spesialister',
    servicesIntro:
      'Våre ortopeder er alle spesialister med høy kompetanse innen sine felt. På grunn av vår erfaring får vi ofte pasienter til såkalt second opinion. Hos oss får du tilgang på den samme ekspertisen som du får hos de store universitetssykehusene.',
    serviceGroups: [
      { label: 'Underekstremiteter', serviceNames: ['Fot og ankel', 'Kne'] },
      { label: 'Hofte og bekken', serviceNames: ['Hofte'] },
      { label: 'Overekstremiteter', serviceNames: ['Hånd og albue'] },
      { label: 'Avanserte caser', serviceNames: ['Hofte', 'Kne'] },
    ],
    journey: [
      { icon: 'Calendar', label: 'Steg 01', title: 'Bestill når det passer deg', body: 'Online booking døgnet rundt. Ingen henvisning. Korte ventetider, også for second opinion.' },
      { icon: 'MessageCircle', label: 'Steg 02', title: 'Klinisk undersøkelse', body: 'En erfaren ortoped går gjennom skaden eller plagen din, og setter sammen et godt bilde av hva som faktisk skjer.' },
      { icon: 'HeartHandshake', label: 'Steg 03', title: 'Diagnose og behandlingsplan', body: 'Med moderne bildediagnostikk og oppdaterte metoder lager vi en plan – fra konservativ behandling til kirurgi.' },
      { icon: 'Clock', label: 'Steg 04', title: 'Behandling og opptrening', body: 'Vi følger deg gjennom hele forløpet – fra inngrep til opptrening, med tett samarbeid med fysioterapeuter.' },
    ],
    staticFaqs: STANDARD_FAQS,
    closingTitle: 'Klar når du er det',
    closingBody: 'Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.',
    closingCta: 'Bestill ortopedtime',
    bookingPath: '/booking?kategori=ortopedi',
  },
  graviditet: {
    subtitle: 'Kort ventetid • Ingen henvisning',
    servicesHeading: 'Trygghet gjennom hele reisen',
    servicesIntro:
      'Våre tilbud dekker hele svangerskapet og tiden etter fødsel. Du kan komme til enkeltkonsultasjoner eller følges av oss gjennom hele forløpet.',
    serviceGroups: [
      { label: 'Tidlig i svangerskapet', serviceNames: ['Ultralyd', 'NIPT'] },
      { label: 'Utredning', serviceNames: ['Fosterdiagnostikk'] },
      { label: 'Helhetlig oppfølging', serviceNames: ['Svangerskapsteam'] },
    ],
    journey: [
      { icon: 'Calendar', label: 'Steg 01', title: 'Bestill den timen du trenger', body: 'Du kan komme til enkeltkonsultasjoner eller følges av oss gjennom hele svangerskapet. Ingen henvisning.' },
      { icon: 'MessageCircle', label: 'Steg 02', title: 'Trygg utredning og samtale', body: 'Erfarne fostermedisinere, gynekologer og jordmødre tar seg god tid – og forklarer alt på et språk du forstår.' },
      { icon: 'HeartHandshake', label: 'Steg 03', title: 'Plan tilpasset deg', body: 'Vi setter sammen en plan basert på dine ønsker, behov og hvor du er i svangerskapet.' },
      { icon: 'Clock', label: 'Steg 04', title: 'Helhetlig oppfølging', body: 'Ved behov samarbeider vi med psykologer, fysioterapeuter og barselomsorg – også for partneren din.' },
    ],
    staticFaqs: STANDARD_FAQS.slice(0, 3),
    closingTitle: 'Klar når du er det',
    closingBody: 'Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.',
    closingCta: 'Bestill time',
    bookingPath: '/booking?kategori=graviditet',
  },
  'flere-fagomrader': {
    subtitle: 'Kort ventetid • Ingen henvisning',
    servicesHeading: 'Spesialister på tvers',
    servicesIntro:
      'Ledende spesialister som utelukkende jobber med fagområdet de kan aller best, og vi har noen av Nordens ledende på disse områdene:',
    serviceGroups: [
      { label: 'Hud, hormoner og ernæring', serviceNames: ['Endokrinologi', 'Ernæringsfysiolog', 'Hudlege', 'Hudhelse'] },
      { label: 'Mage og kirurgi', serviceNames: ['Gastrokirurgi', 'Overvektskirurgi', 'Plastikkirurgi', 'Robotassistert kirurgi'] },
      { label: 'Kropp og bevegelse', serviceNames: ['Osteopati', 'Revmatologi', 'Åreknuter'] },
      { label: 'Mental helse og samliv', serviceNames: ['Psykologi', 'Sexologi'] },
    ],
    journey: [
      { icon: 'Calendar', label: 'Steg 01', title: 'Bestill når det passer deg', body: 'Online booking døgnet rundt. Ingen henvisning. Vi har fra ingen til svært korte ventetider.' },
      { icon: 'MessageCircle', label: 'Steg 02', title: 'Snakk med riktig spesialist', body: 'Du møter en spesialist som utelukkende jobber med fagområdet du trenger hjelp med.' },
      { icon: 'HeartHandshake', label: 'Steg 03', title: 'Utredning og plan', body: 'Vi setter sammen et helhetsbilde – og lager en konkret plan, ofte i samarbeid med flere fagfelt.' },
      { icon: 'Clock', label: 'Steg 04', title: 'Tverrfaglig oppfølging', body: 'Ved behov jobber vi i kryssdisiplinære team for å gi deg den beste, mest helhetlige behandlingen.' },
    ],
    staticFaqs: STANDARD_FAQS,
    closingTitle: 'Klar når du er det',
    closingBody: 'Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.',
    closingCta: 'Bestill time',
    bookingPath: '/booking?kategori=flere-fagomrader',
  },
}

async function migrate() {
  const allDocs = await sanityClient.fetch<any[]>(
    `*[_type == "treatmentCategory"]{ _id, categoryId, subtitle, servicesHeading, servicesIntro, serviceGroups, journey, staticFaqs, closingTitle, closingBody, closingCta, bookingPath }`,
  )
  const byId = new Map(allDocs.map((d) => [d.categoryId, d]))

  let updated = 0
  let skipped = 0
  let missing = 0

  for (const [slug, content] of Object.entries(CATEGORIES)) {
    const doc = byId.get(slug)
    if (!doc) {
      console.log(`⚠️  No Sanity document for categoryId="${slug}" — skipping`)
      missing++
      continue
    }

    const patch: Record<string, any> = {}
    const setIfMissing = (field: string, value: any) => {
      if (value == null || value === '') return
      const cur = doc[field]
      const hasValue =
        cur != null && cur !== '' && (!Array.isArray(cur) || cur.length > 0)
      if (!FORCE && hasValue) return
      patch[field] = value
    }

    setIfMissing('subtitle', content.subtitle)
    setIfMissing('servicesHeading', content.servicesHeading)
    setIfMissing('servicesIntro', content.servicesIntro)
    setIfMissing('closingTitle', content.closingTitle)
    setIfMissing('closingBody', content.closingBody)
    setIfMissing('closingCta', content.closingCta)
    setIfMissing('bookingPath', content.bookingPath)

    setIfMissing(
      'serviceGroups',
      content.serviceGroups.map((g) => ({
        _key: k(),
        _type: 'object',
        label: g.label,
        serviceNames: g.serviceNames,
      })),
    )

    setIfMissing(
      'journey',
      content.journey.map((j) => ({
        _key: k(),
        _type: 'object',
        icon: j.icon,
        label: j.label,
        title: j.title,
        body: j.body,
      })),
    )

    setIfMissing(
      'staticFaqs',
      content.staticFaqs.map((f) => ({
        _key: k(),
        _type: 'object',
        question: f.question,
        answer: f.answer,
      })),
    )

    if (Object.keys(patch).length === 0) {
      console.log(`✓ ${slug} — already up to date`)
      skipped++
      continue
    }

    console.log(`✎ ${slug} — patching: ${Object.keys(patch).join(', ')}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit()
    }
    updated++
  }

  console.log('')
  console.log(
    `Done. Updated: ${updated}, skipped: ${skipped}, missing docs: ${missing}${
      DRY_RUN ? ' (DRY RUN — nothing written)' : ''
    }`,
  )
  console.log('')
  if (updated > 0 && !DRY_RUN) {
    console.log('Next step: re-run translate-all-content.ts to generate _en fields:')
    console.log('  SANITY_TOKEN=<token> npx tsx sanity/translate-all-content.ts')
  }
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
