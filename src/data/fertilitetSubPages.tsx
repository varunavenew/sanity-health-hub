import { Link } from "@/lib/router";
import type { SubTreatmentContent } from "@/components/layout/SubTreatmentLayout";

const parent = { name: "Fertilitet", path: "/fertilitet" };
const baseBooking = { kategori: "fertilitet" as const };

const standardPromises = [
    {
        title: "Du bestemmer hva du er komfortabel med",
        desc: "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stille spørsmål underveis og ta med deg noen om du ønsker det.",
    },
    {
        title: "Spesialister med dybde",
        desc: "Hos oss møter du leger og embryologer med erfaring fra ledende fertilitetssentre — ikke en generalist på utplassering.",
    },
    {
        title: "Alt under samme tak",
        desc: "Konsultasjon, laboratorium og behandling i samme bygg. Vi koordinerer hele forløpet — ingenting forsvinner mellom sprekker.",
    },
];

export const fertilitetSubPages: Record<string, Partial<SubTreatmentContent>> = {
    /* ───────────────────────── INFERTILITET ───────────────────────── */
    infertilitet: {
        seoTitle: "Infertilitet | CMedical — utredning og veien videre",
        seoDescription:
            "Infertilitet rammer omtrent 1 av 6. Grundig utredning, tydelige svar og en plan tilpasset deg — uten henvisning og uten ventetid.",
        canonical: "/behandlinger/fertilitet/infertilitet",
        parent,
        title: "Infertilitet",
        heroTitle: <>Ufrivillig <span className="italic">barnløshet</span></>,
        heroDescription:
            "Mange opplever at det tar lengre tid enn forventet å bli gravid. Verdens helseorganisasjon (WHO) anslår at omtrent 1 av 6 mennesker vil oppleve infertilitet i løpet av livet. Du er ikke alene — og det finnes hjelp.",
        heroPoints: [
            { title: "12 måneders regelen", desc: "Infertilitet defineres vanligvis som manglende graviditet etter 12 måneder med regelmessig samleie uten prevensjon." },
            { title: "Tidligere utredning fra 35 år", desc: "For kvinner over 35 år anbefales utredning etter 6 måneder, ettersom fertiliteten naturlig avtar med alderen." },
            { title: "Rammer både kvinner og menn", desc: "Mannlig faktor alene eller i kombinasjon bidrar hos omtrent 40–50 % av par som utredes." },
            { title: "En vanlig medisinsk tilstand", desc: "Ufrivillig barnløshet er ikke noe galt med deg. Vi behandler infertilitet hver dag." },
        ],
        rating: "1 av 6 opplever infertilitet — du er ikke alene",
        booking: { ...baseBooking, tjeneste: "fertilitetsutredning" },
        primaryCtaLabel: "Bestill fertilitetsutredning",
        flowTitle: "Når bør du kontakte en fertilitetsklinikk?",
        flow: [
            { n: "≤ 35 år", title: "Etter 12 måneder uten graviditet", desc: "Vurder fertilitetsutredning dersom du ikke har oppnådd graviditet etter 12 måneder med regelmessige forsøk." },
            { n: "≤ 35 år", title: "Uregelmessig menstruasjon", desc: "Sjeldne eller uregelmessige menstruasjoner kan tyde på eggløsningsforstyrrelser." },
            { n: "≤ 35 år", title: "Kjente medisinske forhold", desc: "Endometriose, tidligere underlivsinfeksjoner eller andre forhold som kan påvirke fertiliteten." },
            { n: "> 35 år", title: "Etter 6 måneder uten graviditet", desc: "Kontakt fertilitetsklinikk eller gynekolog dersom du ikke har oppnådd graviditet etter 6 måneder med regelmessige forsøk." },
            { n: "> 35 år", title: "Kjente forhold som kan påvirke fertiliteten", desc: "Ta tidlig kontakt dersom du har kjente forhold som kan påvirke fertiliteten." },
        ],
        reasonsTitle: "Hva kan være årsaken til infertilitet?",
        reasonsLead:
            "Årsakene er ofte sammensatte. Hos noen finner man én tydelig årsak, mens flere faktorer kan bidra samtidig. Utfordringene deles vanligvis inn i fire hovedgrupper — og infertilitet rammer kvinner og menn omtrent like ofte.",
        reasons: [
            { n: "01", title: "Kvinnelige årsaker", desc: "Kvinner fødes med et begrenset antall egg. Antallet og kvaliteten reduseres gradvis gjennom livet, særlig etter 35-årsalderen. Vanlige årsaker: eggløsningsforstyrrelser, PMOS, endometriose, skader eller blokkeringer i egglederne, muskelknuter (myomer) eller adenomyose, tidligere kirurgi i underlivet, cellegift, og økende alder." },
            { n: "02", title: "Mannlige årsaker", desc: "Menn produserer sædceller kontinuerlig, men antall, kvalitet og funksjon kan påvirkes. Vanlige årsaker: nedsatt eller manglende sædproduksjon, genetiske tilstander, hormonelle forstyrrelser, blokkeringer i sædveiene, tidligere infeksjoner eller operasjoner, problemer med ereksjon eller utløsning, legemidler eller anabole steroider, og testikkelsykdommer (inkludert tidligere testikkelkreft)." },
            { n: "03", title: "Kombinerte årsaker", desc: "Hos mange par finner vi bidrag fra begge parter. Begge bør derfor utredes samtidig — det gir det fulle bildet." },
            { n: "04", title: "Uforklarlig infertilitet", desc: "Hos omtrent 20–30 % av par finner man ingen tydelig medisinsk forklaring. Selv om alle undersøkelser ser normale ut, kan det finnes biologiske forhold dagens tester ikke fanger opp." },
            { n: "05", title: "Livsstilsfaktorer", desc: "Røyking reduserer fertiliteten hos både kvinner og menn. Høyt alkoholforbruk og overvekt kan påvirke fruktbarheten negativt. Enkelte legemidler kan påvirke eggløsning, sædkvalitet eller muligheten for graviditet — faste medisiner bør vurderes som del av utredningen." },
        ],
        promises: standardPromises,
        related: [
            { title: "Fertilitetsutredning", desc: "Det naturlige første steget — vi finner årsaken før vi behandler.", href: "/behandlinger/fertilitet/fertilitetsutredning" },
            { title: "Assistert befruktning", desc: "IVF, ICSI og inseminasjon — vi forklarer hva som passer for deg.", href: "/behandlinger/fertilitet/assistert-befruktning" },
            { title: "Sædanalyse", desc: "En enkel sædprøve gir konkrete svar om mannlig faktor.", href: "/behandlinger/fertilitet/saedanalyse" },
        ],
        ctaTitle: "Du er ikke alene — vi hjelper deg videre",
        ctaDescription:
            "Bestill fertilitetsutredning direkte, eller ta en uforpliktende prat med oss. Ingen henvisning, ingen ventetid.",
        specialistCategory: "fertilitet",
        specialistCtaLabel: "Se alle fertilitetsspesialister",
        specialistCtaHref: "/spesialister?kategori=fertilitet",
    },

    /* ───────────────────────── ASSISTERT BEFRUKTNING ───────────────────────── */
    "assistert-befruktning": {
        seoTitle: "Assistert befruktning | CMedical — IVF, ICSI og inseminasjon",
        seoDescription:
            "Vi tilbyr IVF, ICSI og inseminasjon (IUI) — også med donor. Behandlingsplanen tilpasses din situasjon etter grundig fertilitetsutredning.",
        canonical: "/behandlinger/fertilitet/assistert-befruktning",
        parent,
        title: "Assistert befruktning",
        heroTitle: <>Behandling tilpasset <span className="italic">din</span> situasjon</>,
        heroDescription:
            "Det finnes flere ulike behandlingsmetoder ved assistert befruktning. Hvilken som anbefales avhenger av årsaken til fertilitetsutfordringene, alder, tidligere sykehistorie og individuelle ønsker og behov. Før oppstart gjennomfører vi en grundig fertilitetsutredning og lager en behandlingsplan tilpasset deg.",
        heroPoints: [
            { title: "IVF — prøverørsbehandling", desc: "Den vanligste formen for assistert befruktning." },
            { title: "ICSI ved nedsatt sædkvalitet", desc: "Mikroinjeksjon av én sædcelle direkte inn i egget." },
            { title: "Inseminasjon (IUI)", desc: "Enklere behandling med partnersæd eller donorsæd." },
            { title: "Behandling med donor", desc: "Donorsæd og eggdonasjon i henhold til norsk lovgivning." },
        ],
        rating: "Norges eldste private fertilitetsklinikk",
        booking: { ...baseBooking, tjeneste: "ivf" },
        primaryCtaLabel: "Bestill konsultasjon",
        flowTitle: "Behandlingsmetoder ved assistert befruktning",
        flow: [
            { n: "Metode", title: "IVF — In vitro-fertilisering", desc: "IVF («prøverørsbehandling») er den vanligste formen for assistert befruktning. Eggstokkene stimuleres med hormoner slik at flere egg modnes samtidig. Eggene hentes ut ved et mindre inngrep, vanligvis i lokalbedøvelse, befruktes i laboratoriet, og ett embryo settes tilbake i livmoren noen dager senere. Overskuddsembryoer av god kvalitet kan fryses ned for senere bruk." },
            { n: "Metode", title: "ICSI — Intracytoplasmatisk spermieinjeksjon", desc: "ICSI er en videreutvikling av IVF og brukes ofte ved nedsatt sædkvalitet eller tidligere befruktningsproblemer. Embryologen injiserer én sædcelle direkte inn i egget. For kvinnen er forløpet det samme som ved IVF; forskjellen ligger i hvordan befruktningen gjennomføres i laboratoriet." },
            { n: "Metode", title: "Inseminasjon (IUI)", desc: "Intrauterin inseminasjon er en enklere form for behandling der sædceller (partners sæd eller donorsæd) føres gjennom et tynt kateter inn i livmoren ved eggløsning. Kan være aktuelt ved enkelte former for infertilitet, ved bruk av donorsæd, eller når det ikke er behov for IVF." },
            { n: "Metode", title: "Assistert befruktning med donor", desc: "For noen er bruk av donor en nødvendig del av veien til å få barn. Vi tilbyr behandling med donorsæd og eggdonasjon i henhold til norsk lovgivning. Donorbehandling kan være aktuelt for single kvinner, likekjønnede par eller par der egne egg/sædceller ikke kan benyttes. Vi gir grundig informasjon og veiledning gjennom hele prosessen." },
        ],
        reasonsTitle: "Hvilken metode passer for deg?",
        reasonsLead:
            "Behandlingsmetoden velges sammen med deg etter en grundig fertilitetsutredning. Vi vurderer alltid det enkleste alternativet først, og forklarer fordeler og forutsetninger for hver metode.",
        reasons: [
            { n: "01", title: "Tette eller skadede eggledere", desc: "Når egget ikke kan møte sæden naturlig, er IVF løsningen." },
            { n: "02", title: "Nedsatt sædkvalitet", desc: "Kombinert med ICSI gir IVF gode muligheter også ved få og lite bevegelige sædceller." },
            { n: "03", title: "Mild årsak eller donorsæd", desc: "IUI er ofte førstevalget når egglederne er åpne — og et naturlig steg ved bruk av donorsæd." },
            { n: "04", title: "Egne egg eller sæd ikke et alternativ", desc: "Behandling med donoregg eller donorsæd kan være riktig vei videre." },
            { n: "05", title: "Single eller likekjønnede par", desc: "Vi følger deg trygt fra første samtale til graviditetstest." },
        ],
        promises: standardPromises,
        related: [
            { title: "Infertilitet", desc: "Forstå årsakene og når du bør ta kontakt.", href: "/behandlinger/fertilitet/infertilitet" },
            { title: "Donorbehandling", desc: "Donorsæd, donoregg og partnerdonasjon — etter norsk lov.", href: "/behandlinger/fertilitet/donorbehandling" },
            { title: "Nedfrysning av egg", desc: "Overskuddsembryo og egg kan fryses ned for senere bruk.", href: "/behandlinger/fertilitet/eggfrys" },
        ],
        ctaTitle: "Bestill konsultasjon",
        ctaDescription:
            "Vi tar deg gjennom alle alternativer — uten henvisning og uten ventetid. Du betaler ikke for samtalen før du vet hva som er riktig for deg.",
        specialistCategory: "fertilitet",
        specialistCtaLabel: "Se alle fertilitetsspesialister",
        specialistCtaHref: "/spesialister?kategori=fertilitet",
    },

    /* ───────────────────────── NEDFRYSING ───────────────────────── */
    eggfrys: {
        seoTitle: "Nedfrysning av egg | CMedical",
        seoDescription:
            "Nedfrysning av egg gir deg tid. Vi forklarer hva det innebærer, hva det koster og når det er riktig for deg.",
        canonical: "/behandlinger/fertilitet/eggfrys",
        parent,
        title: "Nedfrysning av egg",
        heroTitle: <>Litt mer <span className="italic">tid</span> når du trenger det</>,
        heroDescription:
            "Nedfrysing av egg lar deg ta vare på fertiliteten din nå — uten å måtte ta valget om barn i dag. Vi tilbyr også nedfrysing av sæd og embryo, som del av eller utenfor en IVF-behandling.",
        heroPoints: [
            { title: "Egg, sæd og embryo", desc: "Vi fryser ned alt som kan være relevant for fremtiden din." },
            { title: "Moderne vitrifikasjonsmetode", desc: "Skånsom rask nedfrysing som beskytter cellene best mulig." },
            { title: "Trygg lagring i Norge", desc: "Lagring under streng kvalitetskontroll på vår klinikk." },
            { title: "Riktig informasjon før du velger", desc: "Vi forklarer realistiske sjanser, kostnader og tidsperspektiv." },
        ],
        rating: "4,7 — Norges eldste private fertilitetsklinikk",
        booking: { ...baseBooking, tjeneste: "nedfrysing" },
        primaryCtaLabel: "Bestill samtale om nedfrysing",
        flowTitle: "Slik foregår nedfrysing av egg",
        flow: [
            { n: "Steg 01", title: "Samtale og fertilitetssjekk", desc: "Vi vurderer eggstokkreserven din og om nedfrysing gir mening i din situasjon." },
            { n: "Steg 02", title: "Hormonstimulering", desc: "Daglige sprøyter i 10–14 dager for å modne flere egg samtidig." },
            { n: "Steg 03", title: "Egguthenting", desc: "Et kort dagkirurgisk inngrep i lett narkose. Hjem samme dag." },
            { n: "Steg 04", title: "Nedfrysing og lagring", desc: "Eggene fryses ned med vitrifikasjon og lagres trygt på klinikken." },
            { n: "Steg 05", title: "Bruk når du er klar", desc: "Når du ønsker å bli gravid, tiner vi eggene og gjennomfører IVF." },
        ],
        reasonsTitle: "Nedfrysning av egg",
        reasonsLead:
            "Dersom du ønsker å utsette graviditet, kan nedfrysning av egg være et alternativ. Ved å fryse ned egg mens fertiliteten er god, bevarer du muligheten til å bruke disse senere. Eggene hentes ut og fryses ned ubefruktet ved vitrifisering. De kan senere tines, befruktes (ICSI) med sæd fra partner eller donor, og dyrkes til blastocyst. Nedfrysning er ingen garanti for fremtidig graviditet, men kan øke muligheten for å få barn senere.",
        reasonsLayout: "accordion",
        reasons: [
            {
                n: "01",
                title: "Hvem kan fryse ned egg?",
                desc: (
                    <>
                        <p>Mange velger det fordi de ønsker å utsette graviditet (livssituasjon, mangel på partner, utdanning, karriere m.m.). Det kan også være aktuelt av medisinske årsaker, for eksempel:</p>
                        <ul>
                            <li>endometriose</li>
                            <li>planlagt behandling med cellegift eller strålebehandling</li>
                            <li>genetiske tilstander som kan gi tidlig redusert eggstokkfunksjon</li>
                            <li>andre medisinske tilstander som kan påvirke fertiliteten</li>
                        </ul>
                        <p>Om behandlingen er aktuell vurderes individuelt etter en fertilitetsutredning.</p>
                    </>
                ),
            },
            {
                n: "02",
                title: "Når er det best å fryse ned egg?",
                desc: "Alder er den viktigste faktoren. Både antall og kvalitet på eggene reduseres med alderen, og de beste resultatene oppnås før fertiliteten avtar betydelig – for mange før 35–37-årsalderen. Vi gjør alltid en individuell vurdering basert på alder, eggstokkreserve og øvrige forhold.",
            },
            {
                n: "03",
                title: "Slik foregår behandlingen",
                desc: (
                    <>
                        <p>Nedfrysning følger de samme første stegene som IVF:</p>
                        <ul>
                            <li>hormonstimulering med daglige sprøyter i omtrent 10–12 dager</li>
                            <li>ultralydkontroller for å følge utviklingen av folliklene</li>
                            <li>eggløsningssprøyte når eggene er modne</li>
                            <li>egguttak gjennom skjeden i lokalbedøvelse</li>
                            <li>vurdering av eggene i laboratoriet</li>
                            <li>modne egg fryses ned ved vitrifisering</li>
                        </ul>
                        <p>Eggene kan oppbevares i henhold til norsk lovgivning inntil kvinnen er 46 år.</p>
                    </>
                ),
            },
            {
                n: "04",
                title: "Hvor mange egg bør fryses ned?",
                desc: "Antallet varierer og avhenger særlig av alder ved nedfrysning. Generelt gir flere nedfryste egg større sannsynlighet for graviditet og fødsel senere. Under konsultasjonen gir vi en individuell vurdering ut fra alder og eggstokkreserve.",
            },
        ],
        promises: standardPromises,
        related: [
            { title: "Fertilitetsutredning", desc: "Sjekken viser om du er i et godt vindu for nedfrysing.", href: "/behandlinger/fertilitet/fertilitetsutredning" },
            { title: "IVF", desc: "Når du vil bruke eggene dine, går de inn i en IVF-prosess.", href: "/behandlinger/fertilitet/assistert-befruktning" },
            { title: "Mannlig fertilitet", desc: "Vi fryser også ned sæd — før kreftbehandling eller annen indikasjon.", href: "/behandlinger/fertilitet/saedanalyse" },
        ],
        ctaTitle: "Snakk med oss om nedfrysing",
        ctaDescription:
            "Vi forklarer realistiske sjanser, hva prosessen innebærer og hva det koster — uten press, og uten ventetid.",
        specialistCategory: "fertilitet",
        specialistCtaLabel: "Se alle fertilitetsspesialister",
        specialistCtaHref: "/spesialister?kategori=fertilitet",
    },

    /* (PGT-side fjernet — innholdet håndteres under Assistert befruktning / individuell vurdering) */


    /* ───────────────────────── SÆDANALYSE ───────────────────────── */
    saedanalyse: {
        seoTitle: "Sædanalyse | CMedical — mannlig fertilitet",
        seoDescription:
            "Halvparten av forklaringen ligger ofte hos mannen. Sædanalyse, hormonprøver og mikro-TESE hos spesialister — diskret og raskt.",
        canonical: "/behandlinger/fertilitet/saedanalyse",
        parent,
        title: "Sædanalyse",
        heroTitle: <>Halvparten av <span className="italic">svaret</span> ligger ofte her</>,
        heroDescription:
            "Når et par ikke blir gravide, er årsaken hos mannen i omtrent halvparten av tilfellene. En enkel sædanalyse gir deg svar — og er det naturlige første steget.",
        heroPoints: [
            { title: "Sædanalyse", desc: "Antall, bevegelighet og form — analysert av vårt eget laboratorium." },
            { title: "Hormonstatus", desc: "Blodprøver for testosteron, FSH, LH og andre relevante hormoner." },
            { title: "Mikro-TESE", desc: "Henting av sædceller fra testikkelen ved azoospermi (ingen sædceller i sæd)." },
            { title: "Diskret og rask prosess", desc: "Du får svar raskt — uten unødvendige besøk." },
        ],
        rating: "4,7 — Spesialister på mannlig fertilitet",
        booking: { ...baseBooking, tjeneste: "sedanalyse" },
        primaryCtaLabel: "Bestill sædanalyse",
        flowTitle: "Slik utreder vi mannlig fertilitet",
        flow: [
            { n: "Steg 01", title: "Sædanalyse", desc: "Du leverer en prøve — analysen gjøres samme dag av vårt laboratorium." },
            { n: "Steg 02", title: "Konsultasjon", desc: "Vi går gjennom resultatet, hormonprøver og din helsehistorie." },
            { n: "Steg 03", title: "Eventuell videre utredning", desc: "Ultralyd, hormonprøver eller henvisning til urolog ved behov." },
            { n: "Steg 04", title: "Behandlingsplan", desc: "Vi vurderer alt fra livsstilsendringer til IVF/ICSI eller mikro-TESE." },
        ],
        reasonsTitle: "Sædanalyse",
        reasonsLead:
            "En sædanalyse er en enkel og viktig undersøkelse som gir informasjon om mannens fertilitet (antall sædceller, bevegelighet og form), og er ofte en del av den første fertilitetsutredningen. Prøven tas ved utløsning og analyseres i laboratoriet. Sædanalyse kan også være aktuelt dersom du ønsker å fryse ned sæd for fremtidig bruk.",
        reasonsLayout: "accordion",
        reasons: [
            {
                n: "01",
                title: "Enkel sædanalyse",
                desc: (
                    <>
                        <p>Gir en grunnleggende vurdering av sædkvaliteten, blant annet:</p>
                        <ul>
                            <li>sædvolum</li>
                            <li>konsentrasjon av sædceller</li>
                            <li>totalt antall sædceller</li>
                            <li>bevegelighet</li>
                            <li>morfologi (sædcellenes form)</li>
                        </ul>
                        <p>Sædkvaliteten kan variere over tid; ved enkelte funn kan det være aktuelt å gjenta undersøkelsen.</p>
                        <p><strong>Forberedelser:</strong></p>
                        <ul>
                            <li>omtrent 2 dagers seksuell avholdenhet før prøvetaking</li>
                            <li>vask penis med såpe og vann kvelden før</li>
                            <li>vask penis med vann på prøvedagen</li>
                            <li>unngå kremer, oljer, glidemiddel og spytt ved prøvetaking</li>
                        </ul>
                        <p>Prøven kan tas på klinikken eller hjemme. Tas den hjemme, må den leveres innen én time og oppbevares nær kroppstemperatur under transport.</p>
                    </>
                ),
            },
            {
                n: "02",
                title: "Utvidet sædanalyse",
                desc: (
                    <>
                        <p>Gir mer detaljert informasjon om sædkvaliteten. Kan være aktuelt ved vedvarende redusert sædkvalitet, ved gjentatte mislykkede fertilitetsbehandlinger, ved gjentatte spontanaborter, eller ved behov for nærmere utredning av mannlig infertilitet.</p>
                        <p><strong>Forberedelser:</strong> samme hygienerutiner som ved vanlig sædanalyse. Prøven tas på klinikken og må avtales på forhånd.</p>
                    </>
                ),
            },
            {
                n: "03",
                title: "Sædanalyse etter vasektomi eller refertilisering",
                desc: "Etter vasektomi eller refertilisering anbefales kontrollprøve for å dokumentere resultatet, vanligvis omtrent tre måneder etter inngrepet. Er inngrepet utført hos CMedical, er kontrollprøven kostnadsfri.",
            },
            {
                n: "04",
                title: "Nedfrysning av sæd",
                desc: (
                    <>
                        <p>Sæd kan fryses ned og oppbevares for fremtidig bruk, for eksempel før kreftbehandling eller annen medisinsk behandling som kan påvirke fertiliteten, før sterilisering, i forbindelse med kjønnsbekreftende behandling, eller ved andre forhold som kan påvirke fremtidig fertilitet.</p>
                        <p><strong>Forberedelser:</strong> Før nedfrysning tas blodprøver (HIV, Hepatitt B, Hepatitt C, Syfilis). Du får rekvisisjon og informasjon fra klinikken. Vanligvis 1–2 dagers seksuell avholdenhet før prøvetaking. Prøven tas på klinikken, og timen må avtales på forhånd.</p>
                        <p>Skal sædcellene brukes for å oppnå graviditet, må paret godkjennes for assistert befruktning og kvinnen gjennomgå IVF-behandling.</p>
                    </>
                ),
            },
        ],
        promises: standardPromises,
        related: [
            { title: "IVF med ICSI", desc: "Ved nedsatt sædkvalitet er IVF med ICSI ofte løsningen.", href: "/behandlinger/fertilitet/assistert-befruktning" },
            { title: "Nedfrysing av sæd", desc: "Frys ned sæd før behandling eller for fremtiden.", href: "/behandlinger/fertilitet/eggfrys" },
            { title: "Fertilitetsutredning (par)", desc: "Vi anbefaler at begge tar en sjekk samtidig.", href: "/behandlinger/fertilitet/fertilitetsutredning" },
        ],
        ctaTitle: "Bestill sædanalyse",
        ctaDescription:
            "Diskret og raskt — du har svar i hånden samme dag. Vi tar imot deg uten henvisning og uten ventetid.",
        specialistCategory: "fertilitet",
        specialistCtaLabel: "Se alle fertilitetsspesialister",
        specialistCtaHref: "/spesialister?kategori=fertilitet",
    },

    /* (Psykisk helsehjelp-side fjernet — psykologstøtte tilbys som del av forløpet) */


    /* ───────────────────────── DONORBEHANDLING ───────────────────────── */
    donorbehandling: {
        seoTitle: "Donorbehandling | CMedical — donorsæd, donoregg og partnerdonasjon",
        seoDescription:
            "Donorbehandling hos CMedical — donorsæd, donoregg og partnerdonasjon. Vi følger Bioteknologiloven og veileder deg gjennom alle valg.",
        canonical: "/behandlinger/fertilitet/donorbehandling",
        parent,
        title: "Donorbehandling",
        heroTitle: <>Donorbehandling <span className="italic">— mange veier til foreldreskap</span></>,
        heroDescription:
            "Behandling med donorsæd eller donerte egg kan være aktuelt for mange. I Norge er det ikke tillatt med samtidig donasjon av egg og sæd (såkalt dobbeldonasjon), og single kvinner får ikke tilbud om eggdonasjon i henhold til Bioteknologiloven. Et unntak er likekjønnede par der den ene kvinnen kan gi befruktet egg til den andre — såkalt partnerdonasjon.",
        heroPoints: [
            { title: "Partnerdonasjon", desc: "For likekjønnede par — den ene gir egg som settes tilbake hos partner." },
            { title: "Donorsæd fra kvalitetssikrede banker", desc: "Livio Sperm Bank, Cryos og European Sperm Bank — med god tilgang på norsk donorsæd." },
            { title: "Donoregg ved medisinsk indikasjon", desc: "Tilbys heterofile par der kvinnen ikke kan bruke egne egg." },
            { title: "Tett oppfølging og veiledning", desc: "Vi forklarer Bioteknologiloven og hva som gjelder i din situasjon." },
        ],
        rating: "4,8 — Trygg og åpen prosess",
        booking: { ...baseBooking, tjeneste: "donorbehandling" },
        primaryCtaLabel: "Bestill samtale om donorbehandling",
        flowTitle: "Slik foregår donorbehandling hos oss",
        flow: [
            { n: "Steg 01", title: "Førstegangssamtale", desc: "Vi går gjennom situasjonen, hva loven sier og hvilke muligheter som er aktuelle for deg eller dere." },
            { n: "Steg 02", title: "Medisinsk utredning", desc: "Vi sikrer at kroppen er klar for behandling og graviditet." },
            { n: "Steg 03", title: "Donorvalg", desc: "Vi hjelper deg med valg av donorsæd eller donoregg fra kvalitetssikrede banker." },
            { n: "Steg 04", title: "Behandling", desc: "Inseminasjon, IVF eller partnerdonasjon — avhengig av hva som passer best." },
            { n: "Steg 05", title: "Oppfølging", desc: "Tett medisinsk og psykologisk oppfølging gjennom hele forløpet — også etter graviditetstest." },
        ],
        reasonsTitle: "Donorbehandling",
        reasonsLead:
            "Behandling med donor: For noen er behandling med donorsæd, donoregg eller partnerdonasjon en nødvendig del av veien til å få barn. Vi tilbyr behandling i henhold til norsk lovgivning og gir grundig informasjon og veiledning gjennom hele prosessen. Det norske regelverket kan oppleves komplisert – er du usikker, er du velkommen til å kontakte oss.",
        reasonsLayout: "accordion",
        reasons: [
            {
                n: "01",
                title: "Viktig å vite",
                desc: "Norsk lov tillater behandling med enten donerte egg eller donorsæd. Samtidig bruk av både donerte egg og donorsæd (dobbeltdonasjon) er ikke tillatt. Dette innebærer blant annet at single kvinner ikke kan motta behandling med donoregg i Norge.",
            },
            {
                n: "02",
                title: "Partnerdonasjon",
                desc: "Kan være aktuelt for kvinnelige par. Egg hentes fra den ene kvinnen, befruktes med donorsæd, dyrkes til blastocyst og fryses ned. Det befruktede egget kan senere settes inn i den andre kvinnens livmor. Partnerdonasjon ble tillatt i Norge fra 2021 og kan gjennomføres både på medisinsk og sosial indikasjon. Kun aktuelt for kvinner som er gift eller samboere i et stabilt parforhold.",
            },
            {
                n: "03",
                title: "Donorsæd",
                desc: "Vi tilbyr behandling med donorsæd fra vår egen sædbank samt Cryos og European Sperm Bank. I Norge benyttes kun ikke-anonyme sæddonorer: donoren er anonym for mottakerne, men barnet har rett til opplysninger om donorens identitet fra fylte 15 år. Ved ønske om flere barn fra samme donor kan det være mulig å reservere sæd til framtidige søskenforsøk. Valg av donor gjennomgås med lege og sykepleier før behandlingsstart, og donorsæden må være mottatt ved klinikken før oppstart.",
            },
            {
                n: "04",
                title: "Donoregg",
                desc: (
                    <>
                        <p>Eggdonasjon kan være aktuelt når graviditet med egne egg ikke er mulig eller sannsynligheten er svært lav. Vanlige årsaker:</p>
                        <ul>
                            <li>tidlig overgangsalder</li>
                            <li>svært redusert eggstokkreserve</li>
                            <li>manglende eggproduksjon</li>
                            <li>gjentatte IVF-forsøk uten tilfredsstillende resultat</li>
                            <li>arvelige tilstander som ikke ønskes videreført</li>
                        </ul>
                        <p>Ved eggdonasjon kommer eggene fra en donor, mens sædcellene kommer fra partner eller medmor. Barnet vil ikke være genetisk beslektet med kvinnen som mottar behandlingen, men hun gjennomgår selv graviditet og fødsel. I Norge kan eggdonasjon tilbys heterofile par, i tråd med bioteknologiloven og etter individuell vurdering.</p>
                    </>
                ),
            },
        ],
        promises: standardPromises,
        expertAreas: {
            title: "Hva passer for deg?",
            description:
                "Vi tilbyr ulike former for donorbehandling, regulert av norsk Bioteknologilov. Her er en oversikt over hva som er aktuelt — og når.",
            items: [
                {
                    title: "Partnerdonasjon",
                    desc: "Partnerdonasjon ble tillatt i Norge 01.01.2021 og er aktuelt for to kvinner i et parforhold. Egget hentes fra den ene kvinnen, befruktes med donorsæd, og embryoet settes tilbake hos partneren. Tillatt på både medisinsk og sosialt grunnlag — kun for gift eller samboende kvinner i ekteskapslignende forhold.",
                    href: "/behandlinger/fertilitet/donorbehandling#partnerdonasjon",
                    image: "",
                },
                {
                    title: "Donorsæd",
                    desc: "Vi benytter donorsæd fra Livio Sperm Bank, Cryos og European Sperm Bank, og har god tilgang på norsk donorsæd. Etter norske retningslinjer bruker vi sæd fra ikke-anonym donor — barnet har rett til informasjon om donors identitet ved fylte 15 år. Donorsæd kan reserveres til søskenforsøk.",
                    href: "/behandlinger/fertilitet/donorbehandling#donorsed",
                    image: "",
                },
                {
                    title: "Donoregg",
                    desc: "I følge Bioteknologiloven er behandling med donoregg tillatt kun til heterofile par. Det tilbys i situasjoner der kvinnen ikke kan bruke egne egg på grunn av eggmangel eller svært redusert eggkvalitet. Vi følger retningslinjene i Bioteknologiloven.",
                    href: "/behandlinger/fertilitet/donorbehandling#donoregg",
                    image: "",
                },
            ],
        },
        related: [
            { title: "Assistert befruktning", desc: "Donorbehandling kombineres ofte med IVF eller IUI.", href: "/behandlinger/fertilitet/assistert-befruktning" },
            { title: "Fertilitetsutredning", desc: "Grundig kartlegging før vi legger en plan sammen.", href: "/behandlinger/fertilitet/fertilitetsutredning" },
            { title: "Nedfrysning av egg", desc: "Bevar mulighetene dine for senere bruk.", href: "/behandlinger/fertilitet/eggfrys" },
        ],
        ctaTitle: "Snakk med oss om donorbehandling",
        ctaDescription:
            "Synes du det er vanskelig å forstå alt? Du er ikke alene. Vi tar tiden som trengs — og du er aldri alene i prosessen.",
        specialistCategory: "fertilitet",
        specialistCtaLabel: "Se alle fertilitetsspesialister",
        specialistCtaHref: "/spesialister?kategori=fertilitet",
    },

    /* ───────────────────────── HYSTEROSKOPI (fertilitet) ───────────────────────── */
    hysteroskopi: {
        seoTitle: "Hysteroskopi | CMedical — vurdering av livmorhulen",
        seoDescription:
            "Hysteroskopi som del av fertilitetsutredning. Skånsom undersøkelse av livmorhulen — polypper, myomer og sammenvoksinger kan ofte behandles samtidig.",
        canonical: "/behandlinger/fertilitet/hysteroskopi",
        parent,
        title: "Hysteroskopi",
        heroTitle: <>Inn i livmoren — <span className="italic">uten snitt</span></>,
        heroDescription:
            "Hysteroskopi er en skånsom teknikk der vi ser direkte inn i livmoren med et tynt kamera. I et fertilitetsforløp brukes den til å vurdere livmorhulen og fjerne det som kan stå i veien for graviditet — ofte i samme inngrep.",
        heroPoints: [
            { title: "Ingen snitt", desc: "Inngrepet gjøres gjennom skjeden — ingen ytre arr." },
            { title: "Diagnose og behandling samtidig", desc: "Polypper og små myomer kan ofte fjernes i samme seanse." },
            { title: "Kort restitusjon", desc: "De fleste reiser hjem samme dag og er raskt tilbake i hverdagen." },
            { title: "Del av fertilitetsutredning", desc: "Funn fra hysteroskopi inngår direkte i den videre behandlingsplanen." },
        ],
        rating: "4,8 — Norges eldste private fertilitetsklinikk",
        booking: { ...baseBooking, tjeneste: "hysteroskopi" },
        primaryCtaLabel: "Bestill konsultasjon",
        flowTitle: "Slik gjennomføres hysteroskopi",
        flow: [
            { n: "01", title: "Konsultasjon", desc: "Fertilitetsspesialist vurderer indikasjon og forklarer inngrepet i detalj." },
            { n: "02", title: "Forberedelser", desc: "Enkle forberedelser og smertelindring tilpasset deg." },
            { n: "03", title: "Inngrepet", desc: "Hysteroskopi i lokalbedøvelse eller kort narkose. Vanligvis 15–30 minutter." },
            { n: "04", title: "Veien videre", desc: "Funn og prøvesvar gjennomgås — og kobles til neste steg i fertilitetsplanen." },
        ],
        reasonsTitle: "Hysteroskopi",
        reasonsLead:
            "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen. Undersøkelsen gir en grundig oversikt og gjør det mulig å oppdage årsaker til plager som ellers kan være vanskelig å finne. Fordelen for deg som pasient er at vi ofte kan stille diagnose og eventuelt behandle i samme prosedyre.",
        reasonsLayout: "prose",
        reasons: [
            {
                n: "01",
                title: "Hva kan hysteroskopi kartlegge?",
                desc: (
                    <>
                        <p>Hysteroskopi er et effektivt verktøy for å kartlegge:</p>
                        <ul>
                            <li>uregelmessige blødninger</li>
                            <li>mistanke om polypper eller muskelknuter i livmoren</li>
                            <li>vanskeligheter med å bli gravid</li>
                        </ul>
                    </>
                ),
            },
            {
                n: "02",
                title: "Forandringer i livmorslimhinnen",
                desc: "Gjennom moderne teknologi og skånsomt utviklede instrumenter legger vi vekt på å gi deg en trygg opplevelse med minst mulig ubehag under undersøkelsen.",
            },
            {
                n: "03",
                title: "Office-hysteroskopi",
                desc: "Vi tilbyr også office-hysteroskopi som kan gjennomføres uten narkose eller bedøvelse, og umiddelbart ved besøk hos gynekolog.",
            },
        ],
        promises: standardPromises,
        related: [
            { title: "Fertilitetsutredning", desc: "Hysteroskopi kan være neste steg etter en grundig fertilitetssjekk.", href: "/behandlinger/fertilitet/fertilitetsutredning" },
            { title: "IVF", desc: "Optimalisering av livmorhulen før IVF gir bedre odds for innfesting.", href: "/behandlinger/fertilitet/assistert-befruktning" },
            { title: "Fertilitetsutredning", desc: "Strukturelle årsaker i livmoren er én av flere ting vi utreder.", href: "/behandlinger/fertilitet/fertilitetsutredning" },
        ],
        ctaTitle: "Bestill vurdering for hysteroskopi",
        ctaDescription:
            "Et lite inngrep med store muligheter — vi gir deg en konkret plan etter første konsultasjon.",
    },

    /* ───────────────────────── FERTILITETSUTREDNING ───────────────────────── */
    fertilitetsutredning: {
        seoTitle: "Fertilitetsutredning | CMedical — et trygt første steg",
        seoDescription:
            "Fertilitetsutredning hos CMedical. Blodprøver, ultralyd og sædanalyse — en grundig kartlegging som gir deg trygghet og oversikt over veien videre.",
        canonical: "/behandlinger/fertilitet/fertilitetsutredning",
        parent,
        title: "Fertilitetsutredning",
        heroTitle: <>Et trygt <span className="italic">første steg</span></>,
        heroDescription:
            "Å ta det første steget kan føles stort – enten du kommer alene eller sammen med en partner, og enten du vet hva du ønsker eller fortsatt er i en utforskende fase. Hos oss møter du et fagmiljø som tar seg tid til å lytte, forstå og veilede deg videre. Denne første fasen handler ikke om å ha alle svarene – men om å begynne et sted.",
        heroPoints: [
            { title: "En uforpliktende start", desc: "Mange begynner med en samtale — vi tilpasser tempoet etter deg." },
            { title: "Grundig kartlegging", desc: "Blodprøver, ultralyd og sædanalyse gir et helhetlig bilde." },
            { title: "Felles plan videre", desc: "Sammen går vi gjennom resultatene og snakker om alternativene." },
            { title: "Samme team hele veien", desc: "Du møter de samme fagpersonene — kontinuitet skaper trygghet." },
        ],
        rating: "4,8 — Norges eldste private fertilitetsklinikk",
        booking: { ...baseBooking, tjeneste: "fertilitetsutredning" },
        primaryCtaLabel: "Bestill fertilitetsutredning",
        flowTitle: "Slik foregår en fertilitetsutredning",
        flow: [
            { n: "Steg 01", title: "Uforpliktende samtale", desc: "Du forteller om din situasjon, stiller spørsmål og blir kjent med mulighetene som finnes." },
            { n: "Steg 02", title: "Vi blir kjent med deg", desc: "Vi går gjennom livssituasjon, ønsker, forventninger og eventuell tidligere sykehistorie." },
            { n: "Steg 03", title: "Medisinske undersøkelser", desc: "Blodprøver og ultralyd av livmor og eggstokker for kvinner — sædanalyse for menn." },
            { n: "Steg 04", title: "Gjennomgang av resultater", desc: "Sammen ser vi på funnene og snakker om hva de betyr for deg." },
            { n: "Steg 05", title: "Veien videre — i ditt tempo", desc: "Egen plan: fortsette på egen hånd, starte behandling, eller ta deg mer tid." },
        ],
        reasonsTitle: "Alt du trenger å vite — steg for steg",
        reasonsLead:
            "Vi har samlet hele innholdet i utredningen i en oversikt du kan utforske i ditt eget tempo. Trykk på hvert tema for å lese mer.",
        reasons: [
            {
                n: "01",
                title: "En uforpliktende start",
                desc: (
                    <>
                        <p>Mange velger å starte med en samtale. Her får du mulighet til å fortelle om din situasjon, stille spørsmål og bli kjent med hvilke muligheter som finnes. For noen er dette nok i første omgang. For andre er det naturlig å gå videre med en medisinsk utredning. Vi tilpasser tempoet etter deg.</p>
                        <p className="font-normal text-foreground">Vi blir kjent med deg – eller dere</p>
                        <p>I første konsultasjon ønsker vi å forstå helheten – din eller deres livssituasjon, ønsker og forventninger, eventuell tidligere sykehistorie, og hvor dere er i prosessen. Dette gir oss et godt grunnlag for å gi råd som er relevante og trygge.</p>
                        <p className="font-normal text-foreground">Undersøkelser som gir oversikt</p>
                        <p>En fertilitetsutredning kan bestå av – for kvinner: blodprøver for hormonnivå, ultralyd av livmor og eggstokker; for menn: sædanalyse. Undersøkelsene gir oss innsikt i fertiliteten og kan avdekke forhold som har betydning for veien videre.</p>
                    </>
                ),
            },
            {
                n: "02",
                title: "Hva skjer etter utredningen?",
                desc: (
                    <>
                        <p>For noen gir utredningen trygghet og bekreftelse på at alt ser normalt ut. For andre kan den avdekke årsaker som gjør at behandling anbefales.</p>
                        <p>Sammen går vi gjennom resultatene og snakker om aktuelle alternativer – enten det er å fortsette på egen hånd, starte behandling, eller ta seg litt mer tid.</p>
                    </>
                ),
            },
            {
                n: "03",
                title: "Ingen beslutninger må tas med én gang",
                desc: "Det er helt vanlig å bruke tid på å kjenne etter hva som føles riktig. Noen er klare for neste steg raskt, mens andre trenger flere samtaler før de bestemmer seg.",
            },
            {
                n: "04",
                title: "Individuell oppfølging — hele veien",
                desc: (
                    <>
                        <p>Vi tilpasser utredning, behandling og oppfølging til deg og din situasjon. Samtidig vet vi at dette ofte er en følelsesmessig prosess – og vi er her for å støtte deg, uansett hvor du er i løpet.</p>
                    </>
                ),
            },
            {
                n: "05",
                title: "Det første møtet og fertilitetsutredning",
                desc: "Hos oss skal du føle deg trygg og godt ivaretatt fra første møte. Vi vil skape rom for en god samtale om dine tanker og ønsker for behandlingen. Etter den første samtalen er neste steg en grundig fertilitetssjekk av deg, og/eller din partner. Deretter finner vi sammen veien videre.",
            },
            {
                n: "06",
                title: "Før utredning",
                desc: "Vi anbefaler at du eller dere tar blodprøver i forkant av timen. Kontakt oss gjerne, så er vi behjelpelige med rekvirering av blodprøver.",
            },
            {
                n: "07",
                title: "Det første møte",
                desc: (
                    <>
                        <p>Fordi infertilitet oppleves likt for kvinner og menn, anbefaler vi at dere begge stiller på den første samtalen. Samtalen vil i stor grad dreie seg om hvem du er, hvilke ønsker og mål du har, hvem dere eventuelt er som par, og ikke minst medisinsk historie. Her får du muligheten til å stille de spørsmål du måtte ha om både behandling og veien videre. Vårt mål er at du går fra den første samtalen med all informasjon du trenger.</p>
                    </>
                ),
            },
            {
                n: "08",
                title: "Fertilitetsutredning",
                desc: (
                    <>
                        <p>I tillegg til samtalen vil det være nødvendig å gjøre en fertilitetsutredning av deg, og eventuelt partner. Vi tilpasser behandlingen til deg, enten du er singel eller i et parforhold.</p>
                        <p>– Kvinner: En grundig gynekologisk undersøkelse med innvendig ultralyd. Her sjekker vi at alt ser bra ut i livmoren og eggstokkene. Fertilitetslegen oppdaterer deg underveis.</p>
                        <p>– Menn: En sædanalyse – en sjekk av sædcellene, som det er ønskelig at mannen avlegger hos oss. Vi sjekker blant annet antall spermier, konsentrasjon og bevegelighet.</p>
                    </>
                ),
            },
            {
                n: "09",
                title: "Under fertilitetsutredningen",
                desc: "Du vil få vite alle eventuelle funn som blir gjort. Her får du igjen muligheten til å stille spørsmål om funn, mulig behandling og veien videre.",
            },
            {
                n: "10",
                title: "En emosjonell prosess",
                desc: (
                    <>
                        <p>Fertilitetsbehandling handler ikke bare om det medisinske – det er også en personlig og følelsesmessig reise. Mange opplever et spenn av følelser underveis: håp, usikkerhet, sårbarhet, forventning – og noen ganger skuffelse. Uansett hvordan du eller dere har det, er det rom for alle reaksjoner hos oss. Vi ønsker å være en trygg støttespiller gjennom hele prosessen. For å skape trygghet og kontinuitet sørger vi så langt det er mulig for at du møter de samme fagpersonene underveis.</p>
                    </>
                ),
            },
            {
                n: "11",
                title: "Rådgivning: Fertilitetsbehandling og parforholdet",
                desc: (
                    <>
                        <p>En lang periode med forsøk på å bli gravide kan påvirke både nærhet og seksualitet i parforholdet. Mange beskriver prosessen som en følelsesmessig berg-og-dalbane. Også i tiden under og etter en graviditet kan hormonelle endringer påvirke både overskudd og seksuell lyst. Hos CMedical møter vi dette med en helhetlig tilnærming, der både fysiske, psykiske og relasjonelle sider ivaretas. Sexologisk rådgivning er en del av tilbudet, og kan bidra til økt trygghet og støtte i en periode som ofte oppleves som uforutsigbar.</p>
                    </>
                ),
            },
        ],
        promises: standardPromises,
        related: [
            { title: "Fertilitetsutredning", desc: "Den raske kartleggingen av hvor du står — uten henvisning.", href: "/behandlinger/fertilitet/fertilitetsutredning" },
            { title: "IVF", desc: "Når utredningen viser at dere trenger hjelp på veien.", href: "/behandlinger/fertilitet/assistert-befruktning" },
            { title: "IVF — prøverørsbehandling", desc: "Den mest effektive fertilitetsbehandlingen som finnes.", href: "/behandlinger/fertilitet/assistert-befruktning" },
        ],
        ctaTitle: "Klar for å ta det første steget?",
        ctaDescription:
            "Bestill en fertilitetsutredning eller en uforpliktende samtale — vi tilpasser tempoet etter deg, og du bestemmer veien videre.",
        specialistCategory: "fertilitet",
        specialistCtaLabel: "Se alle fertilitetsspesialister",
        specialistCtaHref: "/spesialister?kategori=fertilitet",
    },

    /* ───────────────────────── FERTILITETSUTREDNING I JULI ───────────────────────── */
    "fertilitetsutredning-i-juli": {
        seoTitle: "Fertilitetsutredning i juli | CMedical",
        seoDescription:
            "CMedical Fertilitet holder åpent for fertilitetsutredning i juli — fysisk utredning for enkeltpersoner og par, eller telefonsamtale.",
        canonical: "/behandlinger/fertilitet/fertilitetsutredning-i-juli",
        parent,
        title: "Fertilitetsutredning i juli",
        heroTitle: <>Fertilitetsutredning <span className="italic">i juli</span></>,
        heroDescription:
            "CMedical Fertilitet holder åpent for fertilitetsutredning i juli. Vi er tilgjengelig for fysisk utredning for enkeltpersoner og par, eller ved telefonsamtale.",
        heroPoints: [
            { title: "Åpent i juli", desc: "Vi tar imot for utredning gjennom hele sommeren." },
            { title: "Enkeltpersoner og par", desc: "Fysisk konsultasjon på klinikken." },
            { title: "Telefonsamtale", desc: "Alternativ til oppmøte når det passer best for deg." },
        ],
        rating: "4,8 — Norges eldste private fertilitetsklinikk",
        booking: { ...baseBooking, tjeneste: "fertilitetsutredning" },
        primaryCtaLabel: "Bestill fertilitetsutredning",
        flowTitle: "Slik kommer du i gang i juli",
        flow: [
            { n: "Steg 01", title: "Ta kontakt", desc: "Bestill en tid på nett eller ring oss — vi finner en time som passer i juli." },
            { n: "Steg 02", title: "Konsultasjon", desc: "Fysisk på klinikken eller på telefon, alene eller sammen som par." },
            { n: "Steg 03", title: "Veien videre", desc: "Vi legger en plan tilpasset deg eller dere — i ditt tempo." },
        ],
        reasonsTitle: "Fertilitetsutredning i juli",
        reasonsLead:
            "CMedical Fertilitet holder åpent for fertilitetsutredning i juli. Vi er tilgjengelig for fysisk utredning for enkeltpersoner og par, eller ved telefonsamtale.",
        reasonsLayout: "prose",
        reasons: [
            {
                n: "01",
                title: "Les mer om vår fertilitetsutredning",
                desc: (
                    <p>
                        <Link to="/behandlinger/fertilitet/fertilitetsutredning" className="underline">
                            Les mer om vår fertilitetsutredning.
                        </Link>
                    </p>
                ),
            },
        ],
        promises: standardPromises,
        related: [
            { title: "Fertilitetsutredning", desc: "Grundig kartlegging av fertiliteten — et trygt første steg.", href: "/behandlinger/fertilitet/fertilitetsutredning" },
            { title: "Assistert befruktning", desc: "IVF, ICSI og IUI — også med donor.", href: "/behandlinger/fertilitet/assistert-befruktning" },
            { title: "Sædanalyse", desc: "Et enkelt og viktig steg i utredningen.", href: "/behandlinger/fertilitet/saedanalyse" },
        ],
        ctaTitle: "Bestill fertilitetsutredning i juli",
        ctaDescription:
            "Vi tar imot deg eller dere på klinikken eller på telefon — fortell oss hva som passer best.",
        specialistCategory: "fertilitet",
        specialistCtaLabel: "Se alle fertilitetsspesialister",
        specialistCtaHref: "/spesialister?kategori=fertilitet",
    },
};




