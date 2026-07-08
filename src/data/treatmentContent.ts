// Hero images - using existing assets
import gynekologiImgAsset from "@/assets/categories/gynekologi.jpg";
const gynekologiImg = typeof gynekologiImgAsset === "string" ? gynekologiImgAsset : (gynekologiImgAsset as any).src;

import urologiHeroAsset from "@/assets/services/urologi-hero.jpg.asset.json";
const urologiImg = urologiHeroAsset.url;

import fertilitetImgAsset from "@/assets/categories/fertilitet.jpg";
const fertilitetImg = typeof fertilitetImgAsset === "string" ? fertilitetImgAsset : (fertilitetImgAsset as any).src;

import ortopediImgAsset from "@/assets/categories/ortopedi.jpg";
const ortopediImg = typeof ortopediImgAsset === "string" ? ortopediImgAsset : (ortopediImgAsset as any).src;

import flereFagImgAsset from "@/assets/categories/flere-fagomrader.jpg";
const flereFagImg = typeof flereFagImgAsset === "string" ? flereFagImgAsset : (flereFagImgAsset as any).src;

import heroTreatmentAsset from "@/assets/hero/hero-treatment.jpg";
const heroTreatment = typeof heroTreatmentAsset === "string" ? heroTreatmentAsset : (heroTreatmentAsset as any).src;

import heroFamilyAsset from "@/assets/hero/hero-family.jpg";
const heroFamily = typeof heroFamilyAsset === "string" ? heroFamilyAsset : (heroFamilyAsset as any).src;

import heroPregnancyAsset from "@/assets/hero/hero-pregnancy.jpg";
const heroPregnancy = typeof heroPregnancyAsset === "string" ? heroPregnancyAsset : (heroPregnancyAsset as any).src;

import heroClinicAsset from "@/assets/hero/cmedical-clinic.jpg";
const heroClinic = typeof heroClinicAsset === "string" ? heroClinicAsset : (heroClinicAsset as any).src;

import heroTechAsset from "@/assets/hero/hero-technology.jpg";
const heroTech = typeof heroTechAsset === "string" ? heroTechAsset : (heroTechAsset as any).src;

import tverrfagligTeamVideo from "@/assets/hero/tverrfaglig-hero.mp4.asset.json";
import robotkirurgiHeroImg from "@/assets/hero/robotkirurgi-hero-dropbox.jpg.asset.json";
import overvektskirurgiHero from "@/assets/hero/overvektskirurgi-hero.jpg.asset.json";
import gastrokirurgiCardImg from "@/assets/services/flere-gastrokirurgi.jpg.asset.json";

export interface ContentSection {
    id?: string; // anchor id for scroll-to
    heading: string;
    content: string; // supports \n for paragraphs, **bold**, _italic_, - list items
}

export interface LinkedService {
    label: string;
    description: string;
    path: string;
    /** Optional override image. When provided, used as the card image instead of the dedicated service image lookup. */
    image?: string;
}

export interface TreatmentData {
    title: string;
    subtitle: string;
    parentCategory: string;
    heroImage: string;
    heroVideo?: string;
    description: string;
    sections?: ContentSection[];
    benefits?: string[];
    benefitsTitle?: string;
    process?: { title: string; description: string }[];
    faqs?: { question: string; answer: string }[];
    linkedServices?: LinkedService[];
    /** Override the auto-generated heading for the related/linked services section. */
    relatedTitleOverride?: string;
    /** Optional ingress/lead paragraph rendered next to the related-section heading. */
    relatedLead?: string;
    /** Force the related/linked services section to render as section 2 (right under hero). */
    relatedAsIntroOverride?: boolean;
    /** Force the related/linked services section to render as section 3 (after reasons, before flow). */
    relatedAsServicesOverride?: boolean;
    relatedSpecialists?: string[]; // slugs referencing specialists
    /** Non-clickable theme chips shown on the category page (e.g. "Vi behandler blant annet: ..."). Use for sub-topics that are NOT real pages. */
    themes?: string[];
}

// Key: "categoryId/subId" matching the route /behandlinger/:categoryId/:subId
export const treatmentContent: Record<string, TreatmentData> = {
    // ==========================================
    // GYNEKOLOGI
    // ==========================================
    "gynekologi/tverrfaglig": {
        title: "Tverrfaglig team: Osteopat, Sexolog, Psykolog, Ernæring",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        heroVideo: tverrfagligTeamVideo.url,
        description: "Våre gynekologer jobber kun med den kvinnesykdommen de kan aller best, og ved behov jobber vi i unike ekspert team med psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut. Denne tverrfagligheten er helt unik!\n\nVi tilbyr alt innen gynekologisk kirurgi, og vi er den første private aktøren som tilbyr robotkirurgi. Vår klinikk er den første private klinikken i Norden med IVF-behandling og kirurgi samlet under samme tak. Dette gir deg som gjennomgår fertilitetsbehandling en ro og trygghet om at vi kan løse de fleste utfordringer på et sted, her hos oss.\n\nVi har et svangerskapsteam som følger deg trygt igjennom graviditeten helt til fødsel, og våre eksperter på barsel står klare til å veilede deg videre på «6 ukers kontrollen». Dersom du skulle oppleve plager senere i livet er vi her for å hjelpe deg. Vi har kompetanse på alle gynekologiske tilstander - fra utredning, behandling og oppfølging i etterkant.",
        relatedTitleOverride: "Vårt tverrfaglige team",
        relatedLead: "Våre gynekologer jobber kun med den kvinnesykdommen de kan aller best, og ved behov jobber vi i unike ekspert team med psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut. Denne tverrfagligheten er helt unik!",
        relatedAsIntroOverride: true,
        linkedServices: [
            {
                label: "Osteopat",
                description: "Manuell behandlingsform som komplementerer medisinsk utredning og behandling innenfor vulvasmerter, bekkenbunnsdysfunksjon og muskelskjelettplager.",
                path: "/behandlinger/flere-fagomrader/osteopati",
            },
            {
                label: "Sexolog",
                description: "Terapeutiske samtaler for støtte, veiledning og råd knyttet til seksuell helse, funksjon, lyst, selvbilde og intimitet.",
                path: "/behandlinger/flere-fagomrader/sexologi",
            },
            {
                label: "Psykolog",
                description: "Samtalepartner for å sortere tanker og følelser, håndtere smerter, og motta støtte gjennom utfordrende behandlingsforløp.",
                path: "/behandlinger/flere-fagomrader/psykologi",
            },
            {
                label: "Ernæringsfysiolog",
                description: "Individuelt tilpasset kostholdsrådgivning med betydning for hormoner, fertilitet, overgangsalder og generell helse.",
                path: "/behandlinger/flere-fagomrader/ernaringsfysiolog",
            },
        ],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/undersokelse": {
        title: "Gynekologisk undersøkelse",
        subtitle: "Trygg og grundig undersøkelse hos erfarne gynekologer.",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Hos CMedical hjelper vi deg med alt innen gynekologiske problemstillinger – fra utredning til behandling. Vi har et bredt behandlingstilbud av høyeste kvalitet. Hos oss møter du engasjerte gynekologer som jobber med den kvinnesykdommen de kan best. Hos oss kan du bestille rutinesjekk eller konsultasjon til annen gynekologisk utredning.",
        benefits: [
            "Erfarne gynekologer med lang klinisk erfaring",
            "Moderne utstyr og fasiliteter",
            "Tid til grundig samtale og undersøkelse",
            "Rask oppfølging ved eventuelle funn",
            "Kort ventetid – de fleste får time innen 1-3 dager",
        ],
        process: [
            { title: "Samtale", description: "Vi starter med en grundig samtale om din helse, eventuelle symptomer og bekymringer." },
            { title: "Undersøkelse", description: "Gynekologisk undersøkelse tilpasset dine behov, inkludert ultralyd ved behov." },
            { title: "Vurdering og plan", description: "Din gynekolog gjennomgår funnene med deg og lager en eventuell videre plan." },
        ],
        faqs: [
            { question: "Hva koster en gynekologisk undersøkelse?", answer: "En standard gynekologisk undersøkelse koster fra 2100,-. Se vår prisliste for fullstendig oversikt." },
            { question: "Hvor lang tid tar undersøkelsen?", answer: "En vanlig undersøkelse tar 30-45 minutter, inkludert samtale." },
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/urinlekkasje": {
        title: "Urinlekkasje",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Nesten 25 % av alle kvinner rammes av urinlekkasje i løpet av livet - noe som gir redusert livskvalitet. Hos oss møter du noen av landets fremste eksperter på urinlekkasje og du får effektiv behandling for alle typer urinveislekkasje, tilpasset deg.",
        sections: [
            {
                id: "stressinkontinens",
                heading: "Typer urinlekkasje",
                content: "**Stressinkontinens**\nUrinlekkasje ved fysisk aktivitet, hoste eller latter skyldes oftest svekkelse i bindevev/muskulatur som holder urinrør og urinblære på plass. Stressinkontinens oppstår typisk grunnet skader som kommer etter fødsler eller tungt fysisk arbeid.\n\n**Tranginkontinens**\nEn plutselig sterk trang til å late vannet etterfulgt av lekkasje. Man er ofte plaget av hyppig toalettbesøk, hvor man ikke alltid når frem i tide. Dette skyldes feil i nervesignalene til blæremuskelaturen slik at denne trekker seg sammen ukontrollert og ofte.\n\n_Kronisk UVI eller betennelse i blæreveggen kan forveksles med trang, dette kan vi også behandle._\n\n**Blandingsinkontinens**\nKombinasjon av stress og trang, hvilken type som dominerer avhenger fra person til person.\n\nEr du plaget med dette anbefaler vi deg å ta kontakt med oss.",
            },
            {
                id: "behandling",
                heading: "Behandling",
                content: "Hvilken behandling vi anbefaler deg avhenger av hvilken type lekkasje du har, hvor mye du lekker og dine risikofaktorer (BMI, tidligere kirurgi osv.).\n\nDet finnes trygge og effektive behandlinger, som for eksempel blæretrening, bekkenbunnstrening, medikamentell behandling eller ulike typer operasjoner.\n\nVed samtidig vaginale fremfall og stressurinlekkasje vil man bestandig operere det vaginale fremfallet først. Har du spørsmål om dette kan du alltid kontakte oss for en uforpliktende prat.",
            },
        ],
        relatedSpecialists: ["madeleine-engen", "birgitte-aspenes"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/endometriose": {
        title: "Endometriose",
        subtitle: "Spesialisert diagnostikk og behandling av endometriose og adenomyose.",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Endometriet = slimhinnen i livmoren.\n\nHver måned vokser slimhinnen i takt med hormonsyklus, og den blir avstøtt ved mens før den bygges opp igjen. Ved endometriose vokser vev som ligner livmorslimhinnen utenfor livmorhulen. Endometriose rammer oftest kvinner i fertil alder.\n\nDet tar i gjennomsnitt syv år å bli diagnostisert i Norge – **dette vil vi endre.**\n\nVi har unik ekspertise og lang erfaring med endometriose.",
        sections: [
            {
                id: "symptomer",
                heading: "Symptomer",
                content: "Symptomene på endometriose er individuelle. Det vanligste symptomet er smerter ved menstruasjon eller utenom. Smertene kan variere i styrke fra minimale menstruasjonssmerter til invalidiserende smerter. Andre symptomer kan være kvalme, diaré eller forstoppelse, økt trettbarhet, smerter ved vannlatning eller ved samleie. Omtrent 10% av kvinner rammes, og hele 30% av disse lider av underlivssmerter.",
            },
            {
                id: "kirurgi",
                heading: "Kirurgi",
                content: "Vi tilbyr både tradisjonell kikkhullskirurgi (laparoskopi) og robotkirurgi ved sanering av endometriose. CMedical er den eneste private aktøren i Norge som tilbyr operasjon med robot ved endometriose. Robotkirurgi er en presis og skånsom operasjonsmetode.\n\nVed kirurgi vil endometriose på bukhinnen, i bekkenet, arrvev og sammenvoksinger klippes bort. Roboten er spesielt egnet til finkirurgi der en vil unngå nærliggende nerver og blodkar.",
            },
        ],
        faqs: [
            { question: "Hva er symptomene på endometriose?", answer: "Vanlige symptomer er sterke menssmerter, kroniske bekkensmerter, smerter ved samleie og i noen tilfeller redusert fertilitet." },
            { question: "Kan endometriose påvirke fertiliteten?", answer: "Ja, endometriose kan påvirke fertiliteten. Vi har tett samarbeid med fertilitetsklinikken for å gi best mulig hjelp." },
            { question: "Hva er robotkirurgi?", answer: "Robotassistert kirurgi gir kirurgen bedre presisjon og oversikt, noe som er spesielt viktig ved dyp endometriose nær vitale organer." },
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/overgangsalder": {
        title: "Overgangsalder",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Symptomer på overgangsalderen starter ofte i første halvdel av 40-årene, opplevelsene kan variere mye fra kvinne til kvinne. For noen er overgangen knapt merkbar, mens andre opplever så store utfordringer at det påvirker hverdagen deres betydelig.\n\nHos CMedical møter du et dedikert ekspert-team av spesialister på overgangsalder. Våre eksperter er medlemmer av British Menopause Society og samarbeider tett med Newson Health i Storbritannia, som er verdens ledende klinikk innen overgangsalder. Behandlingsmetodikken vår bygger på «de fire søylene» – hormoner, relasjoner, ernæring og fysisk form – som sammen sikrer en helhetlig tilnærming til dine behov.",
        sections: [
            {
                id: "symptomer",
                heading: "Symptomer",
                content: "Overgangsalderen kan først merkes gjennom uregelmessige menstruasjoner og hetetokter, endringer i humør og en generell reduksjon i energinivå. Etter hvert kan symptomene øke, og de kan oppleves både fysisk og psykisk vanskelige.\n\nVanlige symptomer inkluderer:\n- Blødningsforstyrrelser\n- Hetetokter\n- Hjernetåke/konsentrasjonsvansker\n- Redusert hukommelse\n- Ta lettere til tårene/emosjonell\n- Søvnproblemer\n- Endringer i hud og hår\n- Smerter i ledd og muskler\n- Hyppigere hodepine\n- Redusert sexlyst\n- Økt irritabilitet\n- Urinveisinfeksjoner og tørrhet i skjeden\n\nMenopausen er egentlig bare en dato i kvinners liv, definert som uteblitt menstruasjon i 12 måneder. Tiden før dette med symptomer kalles perimenopausal, tiden etter for postmenopausal. På lengre sikt øker risikoen for tilstander som beinskjørhet, hjerte- og karsykdommer, høyt kolesterol, høyt blodtrykk, depresjon og demens. Dette skyldes nedgang i østrogen-, progesteron- og testosteronproduksjonen. Heldigvis finnes trygge og effektive behandlingsalternativer som hjelper deg med å håndtere symptomene, gir økt livskvalitet og reduserer risiko for fremtidige helseproblemer.",
            },
            {
                id: "behandling",
                heading: "Behandling",
                content: "En kartleggingssamtale er en personlig og grundig konsultasjon med en eller flere av våre spesialister. Målet er å forstå dine individuelle utfordringer og behov i forbindelse med overgangsalderen. Samtalen varer i omtrent 45 minutter og inkluderer:\n- En detaljert gjennomgang av sykdomshistorie og livssituasjon.\n- Gynekologisk undersøkelse og relevante blodprøver ved behov.\n- Utarbeidelse av en tilpasset behandlingsplan.\n\nI samråd med deg kan vi tilby tverrfaglig oppfølging for å styrke behandlingen. Dette kan inkludere samarbeid med ernæringsfysiolog, osteopat, sexolog eller psykolog, basert på dine ønsker og behov.\n\nEn oppfølgingstime må bestilles etter 6 måneder. Våre eksperter er tilgjengelige ved ytterligere behov.\n\nVårt mål er å tilby deg en helhetlig og tilpasset behandling som gir merkbare forbedringer i din helse og livskvalitet gjennom overgangsalderen.\n\nVi hjelper deg med å ta hverdagen tilbake. Hos oss møter du et kompetent og engasjert team som lytter, veileder og utvikler en behandlingsplan som er tilpasset dine utfordringer og behov.",
            },
            {
                id: "fastlegeveiledning",
                heading: "Fastlegeveiledning overgangsalder",
                content: "Vi har utarbeidet en egen veiledning for fastleger om utredning og behandling av peri- og menopausale kvinner. Veilederen baserer seg på Norsk gynekologisk veileder 2024, NICE NG23 (2024), British Menopause Society (BMS) retningslinjer og European Society of Endocrinology (ESE) kliniske retningslinjer 2025.\n\n[Les fastlegeveiledning for overgangsalder →](/fastlegeveiledning-overgangsalder)",
            },
        ],
        linkedServices: [
            {
                label: "Ernæringsfysiolog",
                description: "Kostholdsrådgivning tilpasset hormonelle endringer og overgangsalder.",
                path: "/behandlinger/flere-fagomrader/ernaringsfysiolog",
            },
            {
                label: "Osteopat",
                description: "Manuell behandling for smerter i ledd og muskler knyttet til hormonelle endringer.",
                path: "/behandlinger/flere-fagomrader/osteopati",
            },
            {
                label: "Sexolog",
                description: "Støtte og veiledning ved endringer i seksuell helse gjennom overgangsalderen.",
                path: "/behandlinger/flere-fagomrader/sexologi",
            },
            {
                label: "Psykolog",
                description: "Samtaleterapi for å håndtere emosjonelle utfordringer i overgangsalderen.",
                path: "/behandlinger/flere-fagomrader/psykologi",
            },
        ],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/vaginale-fremfall": {
        title: "Vaginale fremfall",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Vaginalt fremfall, også kjent som prolaps, innebærer at skjedens fremre eller bakre vegg, eller livmor/livmorhals, buker ned i skjeden eller ut av skjedeinngangen. Dette skjer grunnet svekkelse og skader i bekkenbunnmuskulatur og støttevev etter graviditet, fødsel, aldring, økt buktrykk over lengre tid (forstoppelse, ubehandlet astma/kols) eller kirurgiske inngrep.",
        sections: [
            {
                id: "behandling",
                heading: "Behandling",
                content: "Behandlingen avhenger av alvorlighetsgraden og symptomene, og kan inkludere bekkenbunnstrening, bruk av støtteinnretninger, eller i mer alvorlige tilfeller kirurgiske inngrep. Det er viktig å oppsøke helsepersonell for en grundig vurdering hvis man opplever symptomer på vaginalt fremfall. Hos oss møter du noen av Nordens fremste eksperter på fremfall.",
            },
        ],
        relatedSpecialists: ["madeleine-engen"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/blodningsforstyrrelser": {
        title: "Blødningsforstyrrelser",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Blødningsforstyrrelser kan være at intervallet mellom menstruasjonene endrer seg, at de blir hyppigere eller sjeldnere. Det kan være at mengden blod som kommer hver gang øker eller minker, eller det kan være blødninger som kommer mellom menstruasjoner.\n\nHvis man opplever mensen som plagsomt stor, uregelmessig eller smertefull, bør dette undersøkes hos gynekolog. Da vil vi gjøre ultralyd og ta ulike prøver for å finne ut av hvorfor du har blødningsforstyrrelser.",
        sections: [
            {
                id: "vanlige-arsaker",
                heading: "Vanlige årsaker",
                content: "Vanlige årsaker til blødningsforstyrrelser kan være overgangsalder, seksuelt overførbare infeksjoner, polypper eller muskelknuter, graviditet eller hormonelle ubalanser.\n\nBlødningsforstyrrelser som kommer etter _overgangsalderen_ skal alltid utredes. Det gjøres gjerne med ultralyd og en vevsprøve fra livmorhulen. Videre oppfølging og behandling avhenger av dette prøvesvaret.",
            },
            {
                id: "prevensjon",
                heading: "Prevensjon",
                content: "Dersom man bruker prevensjon kan man få uregelmessige blødninger på grunn av det. Det er sjelden farlig, og som oftest er det bare å bytte prevensjonsmiddel så blir det bedre. Opplever du plager kan du alltid ta kontakt med oss eller bestille time.",
            },
        ],
        relatedSpecialists: ["birgitte-mitlid-mork", "birgitte-aspenes"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/celleforandringer": {
        title: "Celleforandringer",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Celleforandringer er forstadier til kreft og kalles dysplasier. Det finnes flere stadier i økende alvorlighetsgrad. Hvorvidt celleforandringene skal behandles avhenger av hvor alvorlige de er og hvilken type HPV du har.",
        sections: [
            {
                id: "hpv",
                heading: "HPV og celleforandring",
                content: "Over 25.000 kvinner får hvert år konstatert unormale celler ved undersøkelse av livmorhalsen. Av disse behandles cirka 3000 kvinner for celleforandringer. Samtidig får cirka 300 kvinner livmorhalskreft i året.\n\nUtviklingen av livmorhalskreft tar flere år.\n\nScreening med HPV-test hvert femte år redder liv. Hvis du har fått påvist og/eller er behandlet for HPV eller celleforandringer, følges du opp tettere. Ønsker du å ta en celleprøve eller snakke med en av våre gynekologer kan du alltid kontakte oss eller bestille time.",
            },
            {
                id: "behandling",
                heading: "Behandling",
                content: "Lavgradige celleforandringer i livmorhalsen går ofte tilbake av seg selv. De behandles kun hvis de vedvarer. Ved lavgradige celleforandringer anbefales det å ta en ny celleprøve om 12 måneder.\n\nHøygradige celleforandringer behandles individuelt. Her henvises man først til gynekolog som utfører kolposkopi. Det er en vanlig undersøkelse der gynekologen studerer livmorhalsen ved hjelp av et mikroskop. Samtidig tas det også en vevsprøve (biopsi) fra både livmorhalskanalen og livmortappen for å nærmere studere funnene fra celleprøven.\n\nDersom man trenger behandling gjøres det med et lite kirurgisk inngrep som kalles konisering.",
            },
            {
                id: "konisering",
                heading: "Konisering",
                content: "Konisering er et lite kirurgisk inngrep hvor en liten del av det ytterste laget på livmorhalsen fjernes. Inngrepet forhindrer celleforandringene fra å utvikle seg til livmorhalskreft.\n\nHos vår klinikk på Bekkestua tilbyr vi konisering i lokalbedøvelse, utført av vår erfarne gynekolog Birgitte Aspenes. Inngrepet tar vanligvis rundt 15 minutter, og du blir godt ivaretatt i rolige og trygge omgivelser. Inngrepet blir utført i narkose om du er veldig engstelig.",
            },
        ],
        relatedSpecialists: ["birgitte-aspenes", "ane-gerda-z-eriksson", "siri-klokstad"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/cyster": {
        title: "Cyster på eggstokkene",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Cyster på eggstokkene er veldig vanlig og i de fleste tilfeller helt ufarlig.\n\nHver måned modnes ett egg i en av eggstokkene. Dette ligger inni i en vannpose som blir ca 2 cm stor før den sprekker. Av og til kan det dannes flere slike vannposer eller cyster som ikke sprekker, men som får vokse videre. Disse kan iblant bli ganske store og gi smerter og ubehag nederst i magen, særlig ved samleie og bevegelse. Disse cystene kalles funksjonelle cyster og blir som oftest borte av seg selv etter omtrent tre menstruasjonssykluser.\n\nHar du spørsmål knyttet til dette kan du alltid kontakte oss.",
        sections: [
            {
                id: "former-for-cyste",
                heading: "Former for cyste",
                content: "Andre typer cyster er dermoider, endometriomer eller cystadenomer. Disse ser litt annerledes ut på ultralyd, og derfor kan vi skille dem fra funksjonelle cyster. Dette er også godartede cyster, men disse blir ikke borte av seg selv og må noen ganger opereres bort, særlig hvis de blir store og gir plager.",
            },
            {
                id: "for-og-etter-overgangsalder",
                heading: "Før og etter overgangsalder",
                content: "Hos kvinner før overgangsalder er de aller fleste cyster godartede. Hvis gynekologen finner en cyste ved ultralydundersøkelse, blir du fulgt opp videre med ultralyd, avhengig av hva slags cyste det er du har. Det er som oftest ikke nødvendig med blodprøve.\n\nEtter overgangsalder er det mindre vanlig med cyster og risikoen for at en cyste er ondartet er større. Her vil det være viktig med blodprøve, flere ultralydundersøkelser og andre bildeundersøkelser før man eventuelt opererer bort cysten.",
            },
            {
                id: "behandling",
                heading: "Behandling",
                content: "Cyster av en viss størrelse, som ikke blir borte av seg selv og som gir plager, anbefales operert bort. Dette gjøres vanligvis ved en kikkhullsoperasjon: du får narkose og kirurgen fjerner cysten gjennom 3–4 hull i magen. Inngrepet tar omtrent 45 minutter, avhengig av størrelsen.",
            },
        ],
        relatedSpecialists: ["ane-gerda-z-eriksson", "birgitte-aspenes", "henrik-michelsen-wahl"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/fjerne-livmor": {
        title: "Fjerne livmor",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Fjerning av livmor (hysterektomi) anbefales ved plagsomme muskelknuter (myomer), blødningsforstyrrelser, kreft i livmor eller livmorhals. Det kan også være aktuelt ved endometriose eller ved vedvarende celleforandringer i livmorhals. Ved operasjonen fjernes livmoren i sin helhet, eggstokker blir stående igjen dersom man ikke er kommet i overgangsalderen.",
        sections: [
            {
                id: "hysterektomi",
                heading: "Fjerning av livmor (hysterektomi)",
                content: "Det finnes flere operasjonsmetoder for å fjerne livmoren. Vi fjerner livmoren skånsomt ved hjelp av kikkhullskirurgi eller robotassistert kirurgi. Vi er den eneste private aktøren som tilbyr robotassistert kirurgi - en mer skånsom og presis operasjonsmetode. En sjelden gang ved vanskelig anatomi kan det bli nødvendig å lage et lite snitt (litt mindre enn et keisersnitt) i bikinilinjen.\n\nEr du pasient hos oss får du detaljert informasjon om inngrepet, risiko for komplikasjoner og hvordan du skal forholde deg i tiden etter operasjon. Du vil også få telefonnummeret til kirurgen. Det er få bivirkninger av inngrepet og seksuelt kan du fungere som før.\n\nVåre kirurger er noen av Nordens ledende kirurger innen gynekologisk kikkhull og robotassistert kirurgi.\n\nVi sørger for at du blir trygt ivaretatt igjennom hele behandlingsforløpet.\n\n[Les mer om robotassistert kirurgi →](/robotassistert-kirurgi)",
            },
            {
                id: "pasienthistorie",
                heading: "Pasienthistorie",
                content: "_Kine, 37 år:_\n\n«For et år siden fikk jeg et nytt liv takket være hjelp fra CMedical. Jeg hadde i flere år gått med en stor muskelknute i livmora mi og i og med at jeg ikke hadde fått barn var beskjeden jeg fikk fra det offentlige at jeg var for ung til å få fjernet livmora - jeg var jo tross alt enda fertil.\n\nEtter mye om og men ble jeg endelig hørt i mitt ønske om å få utført en full hysterektomi og gjennom helseforsikringen min kom jeg da i kontakt med CMedical. Her ble jeg møtt av et helt nydelig team, en fantastisk kirurg og sykepleiere med en enorm omsorg. Operasjonen gikk veldig bra og jeg følte meg trygg gjennom hele besøket.\n\nJeg ble godt ivaretatt fra jeg kom inn dørene på klinikken, videre inn på operasjonsstuen, på oppvåkningen og det neste døgnet som jeg tilbrakte der. Her er det profesjonalitet i alle ledd, hjerterom og mennesker som bryr seg om mennesker.\n\nTusen tusen takk for hjelpen!»",
            },
        ],
        relatedSpecialists: ["ane-gerda-z-eriksson", "henrik-michelsen-wahl", "thomas-fredrik-thaulow"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/graviditet": {
        title: "Graviditet",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: heroPregnancy,
        description: "Vi ønsker deg velkommen til oppfølging gjennom hele svangerskapet. Vi tilbyr fosterdiagnostikk, som NIPT og tidlig ultralyd. Hos oss jobber fødselsleger, gynekologspesialister og fostermedisinere. Deres kompetanse er din trygghet.",
        sections: [
            {
                id: "ultralyd",
                heading: "Ultralyd",
                content: "Vi skiller mellom tidlig ultralyd uke 6–10, uke 11–14, og ultralyd fra uke 14+0. Tidlig ultralyd uke 6-10 utføres ved hjelp av en innvendig probe. Dette er helt ufarlig og smertefritt for både barnet og deg. Fra uke 11 utføres ultralyd med utvendig (abdominal) ultralydprobe.\n\nOm undersøkelsen viser tegn på alvorlig sykdom eller skader hos fostret, vil du få veiledning og samtale med lege, og eventuelt henvisning til fostermedisinsk avdeling ved sykehuset.\n\nDersom du ønsker, er det fullt mulig å ta med seg en partner eller en støttespiller til ultralydtimen. Ved tidlig ultralydundersøkelse vil du få være avskjermet. Hos oss er det viktig at du føler deg komfortabel og trygg.\n\nHos oss møter du høyt kompetente, erfarne og dedikerte gynekologer med spesialisering innen fostermedisin, også kalt fostermedisinere.",
            },
            {
                id: "nipt",
                heading: "NIPT",
                content: "Fra og med svangerskapsuke 10 kan du ta NIPT-test og tidlig ultralyd hos oss. NIPT er en forkortelse for Non-Invasive Prenatal Test. Ved hjelp av en blodprøve fra armen til mor, kombinert med en ultralydundersøkelse, kan man undersøke om fosteret har trisomi 13, 18 eller 21, også kjent som kromosomavvik. Da vi kun trenger en blodprøve fra mor, er det derfor ingen økt risiko for abort som for eksempel ved morkakeprøve eller fostervannsprøve.\n\n[Dr. Ashi Ahmad](/spesialister/ashi-ahmad) hos oss har fått virksomhetsgodkjenning for å tilby fosterdiagnostikk til gravide kvinner. Ashi Ahmad er spesialist i gynekologi og fødselshjelp og har doktorgrad i epidemiologi og fødselshjelp.\n\nBestill konsultasjon eller ta kontakt hvis du lurer på noe.",
            },
            {
                id: "6-ukerskontroll",
                heading: "6-ukerskontroll",
                content: "Ved 6-ukerskontrollen vil du treffe medgründer og gynekolog [Madeleine Engen](/spesialister/madeleine-engen). Hun har særlig erfaring med fødselsskader som kan føre til [vaginale fremfall](/behandlinger/gynekologi/vaginale-fremfall) eller [urinlekkasje](/behandlinger/gynekologi/urinlekkasje). Ta gjerne med deg epikrisen fra oppholdet på sykehuset til konsultasjonen.\n\nPå denne kontrollen vil hovedfokuset være mors bekken. Dersom du ønsker så forklarer Madeleine endringer i underlivet ved hjelp av speil eller tegninger. Hun sjekker også hvor god kontroll og kontakt du har med bekkenbunnsmuskulaturen. Videre forklares eventuelle skader du har, hvordan man kan forebygge disse videre og hva man kan forvente i fremtiden.\n\n- Kort om svangerskap og fødsel\n- Renselse, amming\n- Mors psykiske helse\n- Sex og samliv\n- Prevensjon/prevensjonsveiledning\n- På indikasjon tar vi BT, puls eller blodprøver",
            },
            {
                id: "traumatisk-fodsel",
                heading: "Traumatisk fødsel",
                content: "En av tre opplever fødselen sin som traumatisk og rundt 4 % har en så vanskelig fødselsopplevelse at det går utover hverdagen. Søvn, relasjon til barnet og partner og ikke minst en fødselsdepresjon kan gjøre livet ekstra vanskelig. Da er det viktig å kunne snakke seg gjennom og finne frem til løsninger i hverdagen.\n\nVanskelige fødselsopplevelser kan også påvirke tankene negativt med tanke på å tørre og bli gravid på nytt eller skape en sterk angst for forestående fødsel ved ny graviditet.",
            },
            {
                id: "fodselsangst",
                heading: "Fødselsangst",
                content: "En av fem sliter med mentale helseplager i svangerskapet. Dessverre føler mange gravide at de ikke får den hjelpen de trenger. Fødselsangst kan være vanskelig å definere og det levde livet er ofte med å påvirke tankene negativt.\n\nHos oss møter du erfaren fødselslege som vil både hjelpe deg med å besvare spørsmålene du har og finne frem til en trygghet rundt det du skal gjennom.",
            },
            {
                id: "for-partnere",
                heading: "For partnere",
                content: "Partnere kan også ha det tungt i graviditeten, under og etter fødsel. Dette blir snakket lite om og partner får sjeldent fokus på helsestasjonen eller på fødestuen. Rundt 8 % av partnere får PTSD etter fødsel og kan kjenne seg hjelpeløse i forhold til det og den nye tilværelsen som forelder. Det er også mange partnere som har fødselsangst og fødselsdepresjon.",
            },
        ],
        relatedSpecialists: ["ashi-ahmad", "madeleine-engen"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/kirurgi": {
        title: "Gynekologisk kirurgi",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: heroTech,
        description: "CMedical tilbyr vi en rekke gynekologiske operasjoner utført av håndplukkede kirurger, som er ledende innen sine felt. Hos oss er både trygghet og god kommunikasjon viktig, og vi sørger for at du føler deg godt ivaretatt gjennom hele behandlingsforløpet.\n\nNår en operasjon er den beste løsningen for deg, vil vår operasjonskoordinator hjelpe deg med å finne en passende dato. Du får grundig informasjon om inngrepet og oppfølgingen, og kirurgen vil være tilgjengelig for deg også etter operasjonen.",
        sections: [
            {
                id: "tjenester",
                heading: "Våre tjenester innen gynekologisk kirurgi",
                content: "- Fremfalloperasjoner: For prolaps i skjedevegger, livmorhals eller livmor. [Les mer →](/behandlinger/gynekologi/vaginale-fremfall)\n- Urinlekkasjeoperasjoner: Behandling av alle typer urinlekkasje. [Les mer →](/behandlinger/gynekologi/urinlekkasje)\n- Hysterektomi: Fjerning av livmor ved blødningsproblemer eller smerter. [Les mer →](/behandlinger/gynekologi/fjerne-livmor)\n- Polypper og muskelknuter: Fjerning ved hysteroskopi eller laparoskopi.\n- Endometriosebehandling: Avanserte inngrep utført av erfarne spesialister. [Les mer →](/behandlinger/gynekologi/endometriose)\n- Fjerning av eggstokkcyster, arrvev og celleforandringer.\n- Labiaplastikk/reduksjon av de små kjønnsleppene. [Les mer →](/behandlinger/gynekologi/labiaplastikk)",
            },
            {
                id: "robotkirurgi",
                heading: "Robotassistert kirurgi",
                content: "Som den eneste private aktøren i Norge tilbyr vi robotassistert gynekologisk kirurgi. Dette sikrer presisjon og skånsomhet, og reduserer risikoen for komplikasjoner. Metoden er særlig fordelaktig ved kompleks anatomi og ved endometriose.\n\nUnder inngrepet er kirurgen alltid til stede og styrer roboten direkte fra operasjonsstuen. Med en 180-graders rotasjonsdyktig «hånd» kan roboten nå frem på områder i buk og bekken som ellers er vanskelig tilgjengelige. Denne metoden reduserer risikoen for blødninger, nerveskader og skader på organer som tarm og blære, og gir kortere sykehusopphold etter operasjonen.\n\nRobotassistert kirurgi er spesielt fordelaktig ved kompliserte tilfeller som endometriose og vanskelig tilgjengelig anatomi, og våre erfarne kirurger er blant landets fremste på området.\n\n[Les mer om robotkirurgi →](/robotassistert-kirurgi)\n\nØnsker du mer informasjon, eller har du spørsmål om andre operasjoner? Ring oss gjerne – vi er her for å hjelpe deg.\n\n_Ikke aksepter å leve med plager vi kan hjelpe deg med._",
            },
        ],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/hormonforstyrrelser": {
        title: "Hormonforstyrrelser",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Hormonforstyrrelser refererer til unormale nivåer av hormoner i kroppen, enten det er for mye, for lite eller ujevn produksjon av visse hormoner. Les mer under om ulike sykdommer.",
        sections: [
            {
                id: "pcos",
                heading: "PMOS",
                content: "Polyendokrint Metabolsk Ovarialsyndrom (PMOS) kjennetegnes ved at kjønnshormonene er i ubalanse. (Tidligere omtalt som Polycystisk ovariesyndrom (PMOS).)\n\nDiagnosen kan føre til at eggcellene ikke får modnet og at eggløsning uteblir, noe som igjen kan føre til at man mister eller får sjeldne menstruasjoner. Kvinner med PMOS kan oftere oppleve ufrivillig barnløshet og trenger hyppigere hjelp til å bli gravid. Kvinner med sjelden eller uteblitt menstruasjon bør benytte prevensjon, eller 2–4 ganger i året ta tabletter som gir blødning, for å unngå risiko for celleforandringer i livmorslimhinnen som på sikt kan forårsake endometriekreft.\n\nMange opplever også insulinresistens og har økt risiko for å utvikle diabetes mellitus type 2, samt høyt kolesterol og blodtrykk. Risikoen for hjerte- og karsykdommer øker også.\n\nPMOS er ikke en spesifikk endokrin sykdom, men et syndrom med forskjellige symptomer og tegn. Det finnes ingen spesiell test som gir diagnosen. Pasienten må oppfylle 2 av 3 kriterier for å få diagnosen:\n\n- Uregelmessige og sjeldne menstruasjoner\n- Polycystiske eggstokker\n- Hyperandrogenisme (økt behåring, akne og mannlig hårtap)\n\nDet finnes ingen kur, men det finnes medisiner og behandling som kan gjøre tilstanden bedre.",
            },
            {
                id: "pms-pmdd",
                heading: "PMS og PMDD",
                content: "Premenstruelt syndrom omfatter plagsomme fysiske og psykiske symptomer som opptrer regelmessig siste halvdel av syklus (lutealfasen). PMS (premenstruelt syndrom) er den milde formen som rammer opptil 75 % av alle kvinner, mens den alvorligere formen, PMDD (premenstruell dysforisk forstyrrelse), rammer 3–8 %.\n\nDe vanligste fysiske plagene er ømme bryst, oppblåsthet, magesmerter, vektøkning, hodepine, økt appetitt og tap av energi. Psykiske symptomer omfatter irritabilitet, humørsvingninger, depresjon, angst og indre uro. Noen kvinner kan også få selvmordstanker disse dagene.\n\nÅrsaken er relatert til svingende hormoner. Det er mulig å få god hjelp – du skal slippe å lide hver måned.",
            },
        ],
        relatedSpecialists: ["birgitte-mitlid-mork", "birgitte-aspenes", "siri-klokstad"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/hysteroskopi": {
        title: "Hysteroskopi",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen. Undersøkelsen gir en grundig oversikt og gjør det mulig å oppdage årsaker til plager som ellers kan være vanskelig å finne.\n\nFordelen for deg som pasient er at vi ofte kan stille diagnose og eventuelt behandle i samme prosedyre. Hysteroskopi er et effektivt verktøy for å kartlegge:\n- Uregelmessige blødninger\n- Mistanke om polypper eller muskelknuter i livmoren\n- Vanskeligheter med å bli gravid\n- Forandringer i livmorslimhinnen\n\nGjennom moderne teknologi og skånsomt utviklede instrumenter legger vi vekt på å gi deg en trygg opplevelse med minst mulig ubehag under undersøkelsen hos oss i CMedical.",
        sections: [
            {
                id: "office-hysteroskopi",
                heading: "Office-hysteroskopi",
                content: "Vi tilbyr også office-hysteroskopi som kan gjennomføres uten narkose eller bedøvelse, og umiddelbart ved besøk hos gynekolog.",
            },
        ],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/labiaplastikk": {
        title: "Labiaplastikk",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Det er normalt med ulik størrelse og utseende på kjønnslepper. Noen ganger gir store kjønnslepper smerter ved fysisk aktivitet som sykling, ridning, eller er i veien ved samleie. Da kan kirurgisk reduksjon av kjønnsleppene være løsningen.",
        sections: [
            {
                id: "labiaplastikk",
                heading: "Hva er labiaplastikk?",
                content: "Labiaplastikk er en kirurgisk prosedyre som reduserer størrelsen på labia minora, de indre kjønnsleppene.\n\n**Teknisk prosedyre**\n\nInngrepet gjennomføres i narkose og tar ca. 20 min. Det utføres ved hjelp av fine kirurgiske teknikker med skalpell og lett diatermi. Suturer skal ikke fjernes i etterkant, de løses opp av seg selv. Forhåndsregler etter operasjon får du nøye instrukser om under utredningen og på operasjonsdagen.\n\n**Risiko og bivirkninger**\n\nRisikoene inkluderer blødning, infeksjon, arrdannelse og følelsesløshet. Det er viktig å velge en erfaren kirurg for å minimere disse risikoene.\n\n**Gjenopptakelse og resultater**\n\nGjenopptakelsen tar vanligvis noen uker, og fullstendig heling kan ta flere måneder. De fleste pasienter opplever forbedret komfort og økt selvtillit etter prosedyren.",
            },
        ],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/robotkirurgi": {
        title: "Robotassistert kirurgi – Gynekologi",
        subtitle: "Nordens mest erfarne team innen robotassistert gynekologisk kirurgi.",
        parentCategory: "Gynekologi",
        heroImage: heroTech,
        description: "CMedical er den eneste private aktøren i Norge som tilbyr robotassistert kirurgi innen gynekologi. Med da Vinci-systemet utfører vi avanserte inngrep med minimalt invasiv teknikk.\n\nRobotassistert kirurgi gir bedre presisjon, mindre blødning, kortere sykehusopphold og raskere rekonvalesens sammenlignet med tradisjonell åpen kirurgi.",
        benefits: [
            "Eneste private tilbyder av robotassistert kirurgi i gynekologi i Norge",
            "da Vinci-systemet for maksimal presisjon",
            "Behandling av muskelknuter, dyp endometriose og hysterektomi",
            "Mindre smerter og kortere rekonvalesens",
            "Høyt volum – erfarne kirurger med dokumentert kvalitet",
        ],
        sections: [
            {
                id: "robotassistert-kirurgi",
                heading: "Robotassistert kirurgi",
                content: "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden. Ved robotassistert kirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde. Robotsystemet er et kraftig verktøy som gir kirurgen optimal oversikt og tilgang, slik at avanserte inngrep kan utføres med høy presisjon og minimal belastning. Robotassistert kirurgi er ofte foretrukket ved kompliserte operasjoner, spesielt når man kan unngå åpen kirurgi (laparotomi). Det gir raskere rekonvalesens og lavere risiko for komplikasjoner. De fleste pasientene kan reise hjem innen ett døgn. Ved enkelte krefttilfeller, som kreft i livmor, kan robotassistert kirurgi være et svært godt alternativ. Vi tilbyr robotassistert kirurgi innen blant annet: muskelknuter (fertilitetsbevarende kirurgi), dyp endometriose, hysterektomi (også ved forstørret livmor), brokk, godartet forstørret prostata (RASP) og prostatakreft (RALP). Rask rehabilitering: Robotassistert kirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling. En raskere vei til restitusjon: Mange pasienter kan reise hjem allerede dagen etter inngrepet. Allerede samme kveld er det mulig å spise, bevege seg og føle seg mer som seg selv igjen. Kortere sykemelding: Avhengig av jobb og inngrep kan du forvente en sykemeldingsperiode på 2–6 uker (kirurgen spesifiserer per pasient). Sammenlignet med tradisjonell åpen kirurgi gir robotassistert kirurgi en raskere vei tilbake til hverdagen. Presisjon som merkes: Med høyoppløselig 3D-kamera og avanserte instrumenter har kirurgen svært god kontroll. I bekkenet finnes ømfintlig vev som lett kan skades under kirurgi (f.eks. ved nervesparende operasjoner ved dyp endometriose eller fjerning av prostata). Robotassistert kirurgi gir bedre kontroll og lavere risiko ved slik nervedisseksjon. Ergonomi: Under robotassistert kirurgi sitter kirurgen i en ergonomisk og komfortabel arbeidsstilling, noe som bidrar til økt konsentrasjon og mindre utmattelse.",
            },
            {
                id: "safe-histology-surgery",
                heading: "Safe Histology Surgery",
                content: "Ved Safe Histology Surgery kombinerer vi skånsom robotassistert kirurgi med nøyaktig vevsdiagnostikk underveis i inngrepet. Det gir kirurgen mulighet til å tilpasse operasjonen presist til funnene, og bidrar til trygg og målrettet behandling.",
            },
        ],
        relatedSpecialists: ["thomas-fredrik-thaulow"],
        faqs: [
            { question: "Hvilke inngrep utføres med robot?", answer: "Vi bruker robot til fjerning av muskelknuter, dyp endometriose, hysterektomi og enkelte andre komplekse inngrep." },
            { question: "Er robotassistert kirurgi trygt?", answer: "Ja, robotassistert kirurgi er vel dokumentert internasjonalt og gir ofte bedre resultater enn tradisjonelle metoder." },
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/spontanabort": {
        title: "Spontanabort",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "I følge internasjonale retningslinjer blir dessverre ikke kvinner med spontanabort fulgt opp tilstrekkelig i Norge. Spontanabort oppleves for de aller fleste som et tap og da hjelper det lite å høre at det er naturens gang. Uavhengig om dere har barn fra før, om dere har forsøkt lenge eller kort å bli gravid er det viktig å bli tatt på alvor med de tankene dere har.\n\nSelve aborten kan også ha vært en tung og smertefull opplevelse og mange kjenner seg utrygge på om alt er ute av kroppen. Med både ultralyd og samtale vil vi klargjøre og berolige.\n\nI dag vil de fleste få beskjed om å vente til opp mot tre spontanaborter før det utredes om alt er som det skal. Det skal du slippe hos oss. Vi gjør en vurdering om det ligger noen bakgrunn for at du har abortert.\n\nKun en prosent av alle gravide ender med en uønsket senabort, men det er ganske mange par som tar vanskelige valg etter tidlig fosterdiagnostisering og NIPT-test. Det å ha noen å snakke med rundt disse valgene kan være med å gjøre prosessen lettere. Hos CMedical kan du snakke med våre spesialister om vanskelige tanker.\n\nGjennom mange år har vi fulgt par som har mistet barnet i mors liv, under eller etter fødsel. Vi vil veilede dere som par både i den livskrisen dere er i, også vurdere andre tiltak ved eventuelt neste svangerskap og følge deg eller dere tett opp.",
        relatedSpecialists: ["birgitte-mitlid-mork", "ashi-ahmad"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "gynekologi/fodselsskader": {
        title: "Fødselsskader",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Fødselsskader er en samlebetegnelse på plager som kan oppstå etter en fødsel. Det kan være bristninger og arrvev, svekket bekkenbunn, diastase i magemuskulaturen, vaginale fremfall, urin- eller avføringslekkasje, eller smerter ved samleie. De fleste av disse plagene kan utredes og behandles. Plager etter fødsel bør undersøkes hos gynekolog. Det gjelder enten fødselen var nylig eller for flere år siden.",
        sections: [
            { heading: "Bristninger og arrvev", content: "Under fødselen kan det oppstå rifter i skjeden, mellomkjøttet (perineum) eller lukkemuskelen rundt endetarmen. Rifter graderes fra grad 1 til grad 4. Ved grad 3 og 4 er lukkemuskelen skadet, og dette kalles sfinkterskader. De fleste rifter leger seg godt. Noen kan likevel gi langvarige plager som smerter, stramme arr, nedsatt følsomhet eller ubehag ved samleie." },
            { heading: "Svekket bekkenbunn", content: "Bekkenbunnen er muskulaturen som holder underlivsorganene på plass. Under graviditet og fødsel strekkes og belastes den, og hos noen blir den varig svekket. Det kan gi urinlekkasje, tyngdefølelse i underlivet, fremfall eller problemer med avføring. Målrettet bekkenbunnstrening hos fysioterapeut er ofte første behandlingsvalg. I noen tilfeller kan kirurgi være aktuelt." },
            { heading: "Diastase (delte magemuskler)", content: "Diastase betyr at de rette magemusklene har delt seg på grunn av strekk under graviditeten. Det er vanlig etter fødsel, og hos mange går det gradvis tilbake av seg selv. Noen opplever likevel vedvarende svakhet i mage og kjerne, ryggsmerter eller en følelse av at magen henger ut. Da kan målrettet trening hjelpe, og i enkelte tilfeller kirurgi." },
            { heading: "Vaginalt fremfall", content: "Fremfall vil si at livmoren, blæren eller endetarmen faller ned i eller ut av skjeden på grunn av svekket støttevev. Dette er vanlig etter fødsel, særlig flere år senere, og kan gi tyngdefølelse, ubehag eller lekkasje." },
            { heading: "Urinlekkasje", content: "Lekkasje av urin ved hosting, nysing, trening eller trang er en av de vanligste fødselsrelaterte plagene. Den er godt behandlingsbar, og de fleste blir betydelig bedre med riktig utredning og oppfølging." },
            { heading: "Avføringslekkasje", content: "Vansker med å holde på avføring eller luft kan være en følge av sfinkterskader under fødsel. Plagen er utredbar, og det finnes behandling." },
            { heading: "Samleiesmerter og seksuelle plager", content: "Smerter ved samleie etter fødsel kan ha flere årsaker. Det kan være arrvev, stram bekkenbunn, tørre slimhinner (særlig i ammeperioden) eller psykiske faktorer. Vårt tverrfaglige team av gynekolog, sexolog, fysioterapeut og psykolog jobber sammen for å finne riktig behandling for deg." },
            { heading: "Tverrfaglig tilnærming", content: "Fødselsskader handler sjelden om én enkelt plage. Mange har flere symptomer samtidig, og den beste behandlingen krever at flere fagpersoner jobber sammen. Hos CMedical har du tilgang til gynekolog, uroterapeut, fysioterapeut, sexolog, osteopat og psykolog under samme tak. Sammen skreddersyr vi utredning og behandling tilpasset deg." },
        ],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
        ],
    },
    "gynekologi/fostermedisin": {
        title: "Fostermedisin",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Hos oss møter du høyt kompetente, erfarne og dedikerte gynekologer med spesialisering innen fostermedisin, også kalt fostermedisinere. Deres kompetanse er din trygghet. Fostermedisin handler om fosterets helse og utvikling gjennom svangerskapet, og hos oss innebærer det tidlig ultralyd, NIPT og fosterdiagnostikk hos spesialist.",
        sections: [
            { heading: "Tidlig ultralyd", content: "Vi skiller mellom tidlig ultralyd uke 6-10, uke 11-14, og ultralyd fra uke 14+0. Tidlig ultralyd uke 6-10 utføres ved hjelp av en innvendig probe. Dette er helt ufarlig og smertefritt for både barnet og deg." },
            { heading: "Fosterdiagnostikk", content: "Dr. Ashi Ahmad har fått virksomhetsgodkjenning for å tilby fosterdiagnostikk til gravide kvinner. Ashi Ahmad er spesialist i gynekologi og fødselshjelp og har doktorgrad i epidemiologi og fødselshjelp." },
        ],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
        ],
    },
    "gynekologi/pmos": {
        title: "PMOS",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Polyendokrint Metabolsk Ovarialsyndrom (PMOS) kjennetegnes ved at kjønnshormonene er i ubalanse. (Tidligere ble dette omtalt som Polycystisk ovariesyndrom (PMOS), men endret diagnosenavn 12. mai 2026.)\n\nDenne diagnosen kan føre til at eggcellene ikke får modnet og at eggløsning uteblir. Det kan igjen føre til at man mister eller får sjeldne menstruasjoner. Kvinner med PMOS kan oftere oppleve ufrivillig barnløshet og trenger hyppigere hjelp til å bli gravid. Kvinner med sjelden eller uteblitt menstruasjon bør benytte prevensjon eller 2-4 ganger i året ta tabletter som gir blødning. Dette for å unngå risiko for celleforandringer i livmorslimhinnen og som på sikt kan forårsake endometriekreft.\n\nMange opplever også insulinresistens, og de har økt risiko for å utvikle diabetesmellitus type 2, samt høyt kolesterol og blodtrykk. Risikoen for hjerte- og karsykdommer øker også.\n\nPMOS er ikke en spesifikk endokrin sykdom, men et syndrom med forskjellige symptomer og tegn. Det finnes ikke en spesiell test som gir diagnosen. Ikke overraskende, har det vært utfordrende og kontroversielt å etablere diagnostiske kriterier.\n\nI dag har man landet på at pasienten må oppfylle 2 av 3 kriterier for å få diagnosen: Uregelmessige og sjeldne menstruasjoner; Polycystiske eggstokker; Hyperandrogenisme (økt behåring, akne og mannlig hårtap).\n\nDet finnes ingen kur mot PMOS, men det finnes medisiner og behandling som kan gjøre tilstanden bedre. Har du spørsmål knyttet til dette kan du snakke med en av våre sekretærer eller bestille en konsultasjon.",
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
        ],
    },
    "gynekologi/vulvalidelser": {
        title: "Vulvalidelser",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Gynekologi",
        heroImage: gynekologiImg,
        description: "Kompliserte sykdommer som vulvasykdommer trenger en tverrfaglig tilnærming. Vårt multidisiplinære team består derfor av gynekolog, hudlege, sexolog, psykolog og bekkenbunnsfysioterapeut. Avhengig av vulvovaginal lidelse og diagnose, vil man få tilbud om videre konsultasjon med andre spesialister.",
        sections: [
            {
                id: "infeksjoner",
                heading: "Infeksjoner",
                content: "I en normal flora i skjeden er det bakterier som beskytter og er en del av immunforsvaret for kvinnen. Det er likevel mulig å få en infeksjon eller ubalanse i vaginal floraen. Noen bakterier overføres seksuelt kjent som kjønnsykdommer og omhandler Chlamydia, Gonore og Syfillis. Disse skal alltid behandles for å unngå komplikasjoner. Andre tilstander som soppinfeksjoner skal behandles når de gir plager. Enkelte kvinner kan også få en ubalanse i normal flora enten gjennom bakteriell vaginose eller aerobisk vaginitt. Dette kan være svært plagsomt. Man kan enkelt diagnostisere disse tilstandene ved å gjøre mikroskopi av utstryk av utflod. Behandling vil da kunne startes etter denne undersøkelsen.",
            },
            {
                id: "vaginal-torrhet",
                heading: "Vaginal tørrhet",
                content: "Vaginal tørrhet er et symptom som plager mange kvinner. Vaginal tørrhet kan oppstå i ulike faser i løpet av livet, men hyppigst forekommer det i perimenopausen eller etter overgangsalder. Østrogen er viktig for å bevare elastisitet og fuktighet i skjeden. Ved mangel på østrogen kan mange oppleve tørrhet i skjeden som kan medføre hyppigere urinveisinfeksjoner, smerter ved samleie, sprekkdannelser i slimhinner, svie og kløe. Vulvaplager og vaginal tørrhet bør alltid undersøkes slik at man kan unngå de plager dette kan medføre.",
            },
            {
                id: "vaginisme",
                heading: "Vaginisme",
                content: "Vaginisme beskriver smerter lokalisert i bekkenbunnsmuskulatur. Disse smertene kan forekomme ved provokasjon, for eksempel ved forsøk på samleie, bruk av tampong, fysisk aktivitet som sykling eller trange klær. Smertene oppstår grunnet ufrivillige sammentrekninger i bekkenbunnsmuskulaturen. Vi vet i dag lite om forekomst av denne tilstanden. Det finnes behandling. Vår vulvaklinikk ved CMedical tilbyr tverrfaglig behandling med gynekolog, hudlege, bekkenbunnsfysioterapeut/osteopat, sexolog og psykolog.",
            },
            {
                id: "vulvodyni",
                heading: "Vulvodyni",
                content: "Vulvodyni er et samlebegrep på kroniske smerter i vulva. Vi anslår at 10–15 % av norske kvinner kan oppleve vulvasmerter i løpet av livet. Behandling må tilrettelegges den enkelte kvinne betinget i hennes mulige bakenforliggende årsak. Smertene kan være generalisert i vulva eller lokalisert, for eksempel kun over klitoris eller skjedeinngang. Noen kvinner beskriver disse smertene som brennende, stikkende, skjærende. Tverrfaglig behandling er viktig. Vulvaklinikken ved CMedical jobber tverrfaglig for å redusere smerter, øke livskvalitet og seksualfunksjon.",
            },
            {
                id: "botox",
                heading: "Botoxbehandling for vaginisme/vulvalidelser",
                content: "Hos CMedical tilbyr vi skånsom og målrettet Botoxbehandling for kvinner som opplever vaginisme eller andre smerter fra bekkenbunn og vulva. Behandlingen virker ved å redusere ufrivillige muskelspenninger, slik at smertene kan avta og samleie, undersøkelse eller tampongbruk blir mindre vondt.\n\nVurderingen gjøres av erfarne gynekologer, og behandlingen tilpasses alltid dine behov. Målet er å gi deg en trygg opplevelse og en bedre hverdag uten smerter.",
            },
        ],
        relatedSpecialists: ["ida-waagsbo-bjorntvedt"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },

    // ==========================================
    // UROLOGI
    // ==========================================
    "urologi/blaere": {
        title: "Blære og urinveier",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Urologi",
        heroImage: urologiImg,
        description: "Blæren er en hul muskel som lagrer urin, et avfallsstoff som kroppen skiller ut fra nyrene. Urinen produseres i nyrene, filtreres fra blodet, og sendes deretter til blæren gjennom urinlederne. Når blæren er full, gir den signal til hjernen om at vi må urinere. Blærefunksjonen er viktig for at kroppen skal opprettholde riktig væskebalanse og kvitte seg med avfallsstoffer. Når dette ikke fungerer, bør man kontakte en urolog.\n\nVed problemer med vannlating, som at blæren ikke blir tømt helt eller at trykket på urinstrålen er dårlig, kan dette være symptomer på både forstyrrelser i blæren og prostata. Blod i urinen kan også være et tegn på slike problemer. Hvis man opplever noen av disse symptomene, er det viktig å oppsøke en urolog for videre undersøkelse.",
        sections: [
            {
                id: "blod-i-urinen",
                heading: "Blod i urinen",
                content: "Synlig blod i urinen er ofte et tegn på potensielle urinveisproblemer eller sykdom. Det er derfor viktig å oppsøke en erfaren urolog for undersøkelse og rådgivning.\n\nVåre nyrer spiller en sentral rolle i å filtrere avfall og væske fra blodet for å produsere urin. Urinen blir skilt ut fra nyrene, sendes via urinlederne til urinblæren, før den skilles ut via urinrøret. Blod i urinen kan derfor stamme fra ulike deler av urinveissystemet. Det er flere mulige årsaker til blod i urinen. Blant annet kan det være indikasjon på urinveisinfeksjoner, mulig kreft, medisinbruk, nyreinfeksjoner og forstørret prostata.\n\nOpplever du blod i urinen, ta kontakt med oss eller bestill konsultasjon hos våre urologer.",
            },
            {
                id: "vannlatningsproblemer",
                heading: "Vannlatningsproblemer",
                content: "Vannlatingsproblemer hos menn kan omfatte symptomer som plutselig sterk vannlatingstrang, hyppig vannlating, vanskeligheter med å starte vannlating, svak urinstråle og avbrutt vannlating. Problemene kan ha en rekke årsaker og det er derfor viktig å sjekke det hvis man har symptomer.\n\nUrineringsproblemer kan deles inn i **lagringssymptomer** og **tømningssymptomer**. Lagringssymptomer inkluderer plutselig sterk vannlatingstrang, hyppig vannlating, små urinmengder, nattlig vannlating, ubehag ved blærefylling og urinlekkasje. Tømningssymptomer innebærer vanskeligheter med å starte vannlating, svak urinstråle, følelse av ufullstendig tømming, avbrutt vannlating, behov for å anstrenge seg, etterskvetting, svie eller smerte under vannlating, og tidligere opphør av vannlating. Hvis du har slike problemer er det viktig at du kontakter lege. Våre urologer er spesialister på dette og hjelper deg gjerne.",
            },
            {
                id: "tur-p-tur-b",
                heading: "TUR-P og TUR-B",
                content: "**TUR-P** (Transuretral Reseksjon av Prostata) for forstørret prostata:\n\nTUR-P er en kirurgisk behandling for forstørret prostata. Ved dette inngrepet bruker kirurgen et urinrørskop for å skånsomt fjerne overflødig prostatavev. Pasienter som gjennomgår prosedyren ligger i narkose og kan normalt reise hjem dagen etter inngrepet.\n\n**TUR-B** (Transuretral Reseksjon av Blære) for blærekreft:\n\nTUR-B er en kirurgisk metode som brukes for å fjerne svulster i blæren. Kirurgen fjerner vevet gjennom urinrøret og sender det til analyse for å avgjøre behandlingsbehovet. Blærekreft kan manifestere seg som synlig blod i urinen, og derfor er det nødvendig med en grundig undersøkelse hos urolog. Dette inkluderer diagnostiske prosedyrer som cystoskopi og bildediagnostikk.\n\nØnsker du mer informasjon om dette, ikke nøl med å kontakte oss.",
            },
            {
                id: "innsnevring-urinroret",
                heading: "Innsnevring i urinrøret",
                content: "Innsnevring i urinrøret, også kjent som uretrastriktur, kan forårsake problemer i nedre urinveier hos menn. Dette kan inkludere hyppige urinveisinfeksjoner og plutselige vannlatningsvansker.\n\nDiagnosen stilles ved å vurdere symptomer og utføre spesifikke medisinske undersøkelser som røntgen eller cystoskopi. Typiske symptomer inkluderer gradvis økende vanskeligheter med vannlating over tid. Urologiske undersøkelser er viktige for å bekrefte diagnosen.\n\nHvis du opplever slike symptomer, anbefales det å kontakte en lege eller en urolog for vurdering og behandling. Våre urologspesialister er her for å hjelpe deg.",
            },
        ],
        relatedSpecialists: ["trond-jorgensen"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "urologi/forhud": {
        title: "Forhud",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Urologi",
        heroImage: urologiImg,
        description: "Forhuden er den hudfolden som dekker penishodet hos menn. Hos CMedical har vi urologer som kan hjelpe deg med plager knyttet til forhuden, som trang forhud og sårhet. Etter en konsultasjon med urolog kan vi diskutere ulike behandlingsalternativer basert på dine symptomer og behov.",
        sections: [
            {
                id: "trang-forhud",
                heading: "Trang forhud",
                content: "Trang forhud, også kjent som fimose, kan være ubehagelig og skape problemer i hverdagen. Våre urologer i CMedical tilbyr skånsom behandling for denne tilstanden.\n\nNår forhuden ikke kan trekkes tilbake over penishodet, kan et mindre plastikkirurgisk inngrep være løsningen. I mer alvorlige tilfeller kan en omskjæring være nødvendig, der deler av eller hele forhuden fjernes.\n\nKontakt oss i dag for å lære mer om våre behandlingsalternativer for trang forhud og hvordan vi kan hjelpe deg med å få bedre livskvalitet.",
            },
        ],
        relatedSpecialists: ["trond-jorgensen"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "urologi/infertilitet": {
        title: "Mannlig infertilitet",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Urologi",
        heroImage: urologiImg,
        description: "Når par opplever problemer med å få barn, er det verdt å merke seg at i omtrent 1/3 av tilfellene er årsaken ofte mannens sædkvalitet. De siste 50 årene har menns sædkvalitet blitt redusert med over 50 %. Dette skyldes flere faktorer, som arv, miljø og livsstil. Ønsker du å ta en sædtest for å sjekke kvaliteten eller få en fertilitetsutredning, så kan vi hjelpe deg. Vi samarbeider med urologer som er spesialister innen mannlig infertilitet for å gi deg den beste oppfølgingen.",
        sections: [
            {
                id: "saedanalyse",
                heading: "Sædanalyse",
                content: "Ønsker du å sjekke sædkvaliteten din? Vi tilbyr rask og enkel sædanalyse, hvor du får resultatet samme dag.\n\nFor å få best mulig resultat fra sædprøven, anbefaler vi følgende:\n\n- Bruk det sterile plastbegeret med lokk som du får fra oss. Du kan også kjøpe det på apoteket hvis du tar prøven hjemme. Viktig: Hvis du tar prøven hjemme, må den leveres til oss innen én time og oppbevares ved kroppstemperatur.\n- Sørg for å samle all sæden i beholderen.\n- Prøv å ha sædutløsning 2–3 dager før prøvetakingen.\n- Hvis du har hatt høy feber i løpet av de siste tre ukene, kan dette påvirke resultatet.\n\nHos oss kan du bestille time til sædprøve eller komme på drop-in. Vi gir deg svaret på sædprøven senere samme dag. Hvis det er behov for videre undersøkelser, vil vi gi deg mer informasjon.",
            },
        ],
        relatedSpecialists: ["trond-jorgensen"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "urologi/nyrer": {
        title: "Nyrer",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Urologi",
        heroImage: urologiImg,
        description: "Nyrene er et organ i kroppen som renser blodet ved å fjerne avfallsstoffer, overflødig væske og salter. Slik dannes det urin. I tillegg produserer nyrene hormoner som styrer blodtrykket og produksjonen av røde blodlegemer. Nyrene spiller derfor en viktig rolle for å holde kroppen sunn. Hos CMedical kan nyrene også opereres med robotassistert kirurgi, noe som gir større presisjon og bedre resultater ved kirurgiske inngrep – inkludert nefrektomi (fjerning av nyre).",
        sections: [
            {
                id: "nyrecyster",
                heading: "Nyrecyster",
                content: "Nyrecyster er væskefylte hulrom som kan utvikle seg på nyrene. De er vanligvis godartede og oppdages ofte ved medisinske undersøkelser. Behandlingen avhenger av cystens størrelse, symptomer og mistanke om ondartethet:\n\n- **Overvåkning:** Små, asymptomatiske cyster overvåkes regelmessig.\n- **Drenasje:** Store eller symptomatiske cyster kan tømmes med en nål.\n- **Kirurgi:** Kirurgisk fjerning kan være nødvendig for store, symptomatiske eller potensielt ondartede cyster.\n- **Behandling av underliggende årsak:** Hvis cyster er relatert til en annen sykdom, behandles den underliggende tilstanden.\n\nFor mer informasjon om nyrecyster, ta kontakt med oss eller bestill en konsultasjon.",
            },
            {
                id: "tumor",
                heading: "Tumor",
                content: "En nyretumor er en unormal vekst av celler i nyrene. De kan være enten godartede eller ondartede. Ondartede nyretumorer, som nyrekreft eller nyrekarsinom, utgjør en alvorlig helsefare. Nyretumorer kan utvikle seg i en eller begge nyrer og oppdages vanligvis ved bildeundersøkelser som røntgen eller ultralyd.\n\nBehandlingen av nyretumorer avhenger av flere faktorer, inkludert tumorstørrelse, type og utbredelse. Vanlige behandlingsalternativer inkluderer kirurgisk fjerning av tumoren, strålebehandling, kjemoterapi, målrettet terapi og immunterapi.\n\nDet er viktig å kontakte lege ved mistanke om en nyretumor for å få riktig diagnose og behandlingsplan. Tidlig påvisning og behandling kan være avgjørende for prognosen.",
            },
            {
                id: "nefrektomi",
                heading: "Nefrektomi – fjerning av nyre",
                content: "Nefrektomi betyr kirurgisk fjerning av hele eller deler av en nyre. Inngrepet er ikke nødvendigvis knyttet til nyrekreft – det kan også være aktuelt ved blant annet store eller symptomgivende nyrecyster, alvorlig skade på nyren, gjentatte infeksjoner, hydronefrose med tap av nyrefunksjon, eller godartede tumorer som krever fjerning.\n\nHos oss utføres nefrektomi i hovedsak med robotassistert kirurgi. Det gir presisjon, små snitt, mindre blødning og raskere rekonvalesens enn tradisjonell åpen kirurgi. Ved enkelte tilfeller kan kirurgen velge å bevare så mye friskt nyrevev som mulig (partiell nefrektomi).\n\nHar du spørsmål rundt nefrektomi eller ønsker en vurdering, ta kontakt med oss.",
            },
            {
                id: "robotassistert-kirurgi-nyrekreft",
                heading: "Robotassistert kirurgi for nyrekreft",
                content: "Robotassistert kirurgi har revolusjonert behandlingen av nyrekreft. Denne avanserte teknologien gir kirurger en nøyaktig og minimalt invasiv måte å fjerne nyretumorer.\n\nUnder robotassistert kirurgi for nyrekreft bruker kirurgen et spesialdesignet robotisk kirurgisystem som gir høy presisjon og økt manøvrerbarhet. Dette tillater kirurgen å utføre inngrepet gjennom små snitt i stedet for store åpne snitt, noe som reduserer smerter, blødning og rekonvalesenstid for pasienten.\n\nRobotassistert kirurgi gir også fordelen av forstørret 3D-visning, som gir kirurgen en detaljert oversikt over tumoren og omkringliggende vev. Dette gjør det mulig å fjerne kreftvevet mer presist og bevare så mye friskt vev som mulig.\n\nFordeler inkluderer kortere sykehusopphold og raskere rehabilitering for pasientene. Det er viktig å merke seg at ikke alle pasienter er kandidater for robotassistert kirurgi, og kirurgen vil vurdere den beste tilnærmingen basert på pasientens individuelle forhold.\n\nHar du spørsmål knyttet til dette kan du kontakte oss på telefon.",
            },
            {
                id: "blaerestein",
                heading: "Blærestein",
                content: "CMedical behandler ikke nyrestein, men vi tilbyr utredning og behandling av blærestein. Blærestein er harde formasjoner som dannes i urinblæren, ofte som følge av at urin blir stående og at avfallsstoffer krystalliseres. Tilstanden ses oftere hos menn, og henger gjerne sammen med forstørret prostata, dårlig blæretømming eller gjentatte urinveisinfeksjoner.\n\nVanlige symptomer kan være smerter eller svie ved vannlating, hyppig vannlating, plutselig avbrutt urinstråle, blod i urinen og smerter nederst i magen.\n\nUtredning gjøres med urinprøve, ultralyd og eventuelt cystoskopi (kikkertundersøkelse av blæren). Behandlingen avhenger av størrelse og årsak – små steiner kan av og til passere av seg selv, mens større steiner fjernes ved et kirurgisk inngrep gjennom urinrøret. Samtidig er det viktig å behandle den underliggende årsaken, for eksempel forstørret prostata, for å unngå nye steiner.\n\nMistenker du blærestein, ta kontakt med oss for en vurdering hos urolog.",
            },
        ],
        relatedSpecialists: ["nabeel-yousaf-khan"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "urologi/prostata": {
        title: "Prostata",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Urologi",
        heroImage: urologiImg,
        description: "Prostata er en liten kjertel som ligger under urinblæren. Den produserer væske som blandes med sperm for å danne sæd, og er med på å transportere og beskytte spermcellene under ejakulasjon. Regelmessig kontroll er viktig for å oppdage og behandle eventuelle problemer knyttet til prostata tidlig.\n\nProstata vokser når du blir eldre, og er du i 50–60 årene oppfordrer vi deg til å sjekke prostata jevnlig. Våre spesialister anbefaler én prostatakontroll og en årlig blodprøve for å overvåke utviklingen over tid.",
        sections: [
            {
                id: "prostataundersokelse",
                heading: "Hvordan foregår en prostataundersøkelse?",
                content: "En prostataundersøkelse består av PSA-blodprøve og ultralyd av prostata. Det er også nødvendig å kjenne på prostata gjennom endetarmen. Denne undersøkelsen kalles også for rektal prostataeksaminasjon (DRE). Legen eller urologen kjenner etter følgende:\n\n- Knudrete prostatakjertel\n- Asymmetri\n- Uregelmessigheter i prostatakjertel\n\nDet er mulig å få gjennomført prostataundersøkelser hos fastlegen. Stadig flere menn velger imidlertid å oppsøke privat urolog direkte for å sjekke prostata og stille spørsmål rundt prostatakreft. Dersom årlig prostata-sjekk gir indikasjon på prostatakreft, forstørret prostata eller betennelser, er det nødvendig med videre undersøkelser.\n\nVi har noen av landets fremste eksperter på prostata. Har du spørsmål kan du kontakte oss eller bestille time til konsultasjon.",
            },
            {
                id: "naar-sjekke",
                heading: "Når skal man begynne å sjekke prostata?",
                content: "«Jeg anbefaler alle menn i 50-årsalderen å ta en PSA-test hvert år. Menn under 50 år som tilhører en risikogruppe bør også ha sjekke prostata jevnlig», oppfordrer Dr. Jørgensen.\n\n«Med risikogrupper mener jeg menn som har ett eller flere tilfeller av prostatakreft i familien. Risikogrupper inkluderer også menn som har kvinnelige slektninger med tilfeller av brystkreft eller eggstokkreft i ung alder.»\n\nDr. Trond Jørgensen er tydelig på at jevnlig prostatakontroll og sjekk av PSA-verdier er viktig i kampen mot prostatakreft. Grunnet mye oppmerksomhet rundt prostatakreft de senere år, oppdages de fleste prostatakrefttilfellene i dag i et tidlig stadium. Derfor har de fleste menn ikke nevneverdige symptomer som kan lede en frem til diagnosen.\n\n«Det er 12,5 % sannsynlighet for at en mann får diagnosen prostatakreft frem til han er 75 år, med andre ord vil mer enn 1 av 10 menn få diagnosen før eller siden i sitt voksne liv. Risikoen øker med alder, men menn ned i 40-årsalder får diagnosen hvert eneste år», forteller Dr. Jørgensen.",
            },
            {
                id: "robotkirurgi",
                heading: "Robotassistert kirurgi",
                content: "Robotassistert laparoskopisk prostatektomi (RALP), det vil si kirurgisk fjerning av prostata med kikkhullsoperasjon, er et av våre spesialområder. Som eneste private helsespesialist siden 2018 tilbyr vi kort ventetid på ledende robotkirurger og eksperter innen prostata og urologi.\n\nVi har Norges mest erfarne team innen robotkirurgi, med over 20 års erfaring, og det største volumet av robotassisterte inngrep i landet. Vårt team består av svært erfarne kirurger, leger, anestesipersonell og sykepleiere, noe som sikrer en stille og rolig atmosfære i alle ledd.\n\nVi behandler både prostatakreft og godartede prostataforstørrelser, og har det mest moderne utstyret tilgjengelig i Norge. Ønsker du en second opinion ved prostatakreft, eller vurderer behandling, kan vi hjelpe. Ta kontakt med oss for mer informasjon eller bestill time.",
            },
        ],
        relatedSpecialists: ["trond-jorgensen"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "urologi/refertilisering": {
        title: "Refertilisering",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Urologi",
        heroImage: urologiImg,
        description: "Sterilisering er en enkel og vanlig prevensjonsmetode for menn. Metoden innebærer at man kutter sædlederen som transporterer sædceller fra testiklene til sædblæren.\n\nAngrer du på steriliseringen, kan sædlederne sys sammen igjen. Dette kalles refertilisering.",
        sections: [
            {
                id: "resultat",
                heading: "Resultatet av refertilisering",
                content: "Det er flere faktorer som kan avgjøre om en refertilisering blir vellykket eller ikke. Viktige faktorer er blant annet alder, samt hvor lenge det er siden du ble sterilisert.\n\nGenerelt kan man si at 70–80 % av pasientene kan regne med å få spermier i sæduttømmingen etter inngrepet. Muligheten for graviditet vil også påvirkes av forhold hos din partner.",
            },
            {
                id: "for-under-etter",
                heading: "Før, under og etter operasjonen",
                content: "Reversering av sterilisering gjøres i lett narkose og du kan reise hjem samme dag. Du kan oppleve litt smerter og det kan være behov for noe smertestillende. For å redusere blødning og smerter bør du unngå stor fysisk aktivitet de første dagene etter inngrepet.\n\nDu kan oppleve noe hevelse og blåfarging av huden omkring der huden er åpnet.\n\nSeksuell aktivitet kan gjenopptas etter 2–3 uker.\n\nHar du fysisk krevende arbeide? Snakk med kirurgen om eventuelt behov for sykemelding.\n\nKontroll avtales med kirurgen.",
            },
            {
                id: "saedkontroll",
                heading: "Sædkontroll etter refertilisering",
                content: "En kontroll med sædprøve 2–3 måneder etter inngrepet vil avdekke om refertiliseringen var vellykket. Denne analysen avdekker sædens kvalitet, vitalitet og eventuelt andre tilstander som kan påvirke sædkvaliteten. Kontroll avtales med legen.",
            },
        ],
        relatedSpecialists: ["nabeel-yousaf-khan"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "urologi/robotkirurgi": {
        title: "Robotassistert kirurgi",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Urologi",
        heroImage: robotkirurgiHeroImg.url,
        description: "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden.",
        sections: [
            {
                id: "om-robotassistert-kirurgi",
                heading: "Slik fungerer robotassistert kirurgi",
                content: "Ved robotassistert kirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde.\n\nRobotsystemet er et kraftig verktøy som gir kirurgen optimal oversikt og tilgang, slik at avanserte inngrep kan utføres med høy presisjon og minimal belastning.\n\nRobotassistert kirurgi har mange fordeler, og er ofte foretrukket ved kompliserte operasjoner, spesielt når man kan unngå åpen kirurgi (laparotomi). Det gir raskere rekonvalesens og lavere risiko for komplikasjoner, både under og etter operasjonen. De fleste pasientene kan reise hjem innen ett døgn etter behandlingen. Ved enkelte krefttilfeller, som kreft i livmor, kan robotassistert kirurgi være et svært godt alternativ – nettopp fordi presisjon og skånsomhet er så viktig.\n\nVi tilbyr robotassistert kirurgi innen blant annet:\n\n- Muskelknuter (fertilitetsbevarende kirurgi)\n- Dyp endometriose\n- Hysterektomi, også ved forstørret livmor\n- Brokk\n- Godartet forstørret prostata (RASP)\n- Prostatakreft (RALP)\n\nHos oss i CMedical setter vi alltid pasienten i sentrum. Vårt mål er å tilby moderne, trygg og skreddersydd behandling – med minst mulig smerte, lav risiko og en rask vei tilbake til hverdagen.\n\nLurer du på om robotassistert kirurgi er riktig for deg? Vi hjelper deg gjerne, kontakt oss på telefon 22 60 00 50.",
            },
            {
                id: "rask-rehabilitering",
                heading: "Rask rehabilitering",
                content: "Robotassistert kirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling, slik at du kommer deg trygt og godt gjennom hele operasjonsforløpet.",
            },
            {
                id: "raskere-restitusjon",
                heading: "En raskere vei til restitusjon",
                content: "Mange pasienter kan reise hjem allerede dagen etter inngrepet. Allerede samme kveld er det mulig å spise, bevege seg og føle seg mer som seg selv igjen. Det gir en roligere og mer forutsigbar opplevelse etter operasjonen.",
            },
            {
                id: "kortere-sykemelding",
                heading: "Kortere sykemelding – raskere tilbake til hverdagen",
                content: "Avhengig av hvilken type jobb og hvilket inngrep du har gjennomgått, kan du forvente en sykemeldingsperiode på 2–6 uker. Kirurgen spesifiserer perioden per pasient. Sammenlignet med tradisjonell åpen kirurgi gir robotassistert kirurgi en raskere vei tilbake til hverdagen. Noen studier indikerer også mindre smerter etter robotassistert kirurgi sammenlignet med vanlig kikkehullskirurgi (laparoskopi).",
            },
            {
                id: "presisjon",
                heading: "Presisjon som merkes",
                content: "Med høyoppløselig 3D-kamera og avanserte instrumenter med stor presisjon har kirurgen svært god kontroll. Dette bidrar til skånsomhet og høy kvalitet i hvert inngrep. I bekkenet finnes det ømfintlig vev som lett kan skades under kirurgi, som ved nervesparende operasjoner ved dyp endometriose eller ved fjerning av prostata. Nerveskader i bekkenet kan gi seksuelle dysfunksjoner og problemer med blæretømming, både hos kvinner og menn. Robotassistert kirurgi gir bedre kontroll og er et effektivt verktøy for å gjennomføre slik nervedisseksjon med lavere risiko.",
            },
            {
                id: "ergonomi",
                heading: "Ergonomi – også for kirurgen",
                content: "Under robotassistert kirurgi sitter kirurgen i en ergonomisk og komfortabel arbeidsstilling. Dette bidrar til økt konsentrasjon og mindre utmattelse, noe som igjen reduserer risikoen for feil.",
            },
            {
                id: "safe-histology-surgery",
                heading: "Safe Histology Surgery",
                content: "Ved Safe Histology Surgery kombinerer vi skånsom robotassistert kirurgi med nøyaktig vevsdiagnostikk underveis i inngrepet. Det gir kirurgen mulighet til å tilpasse operasjonen presist til funnene, og bidrar til trygg og målrettet behandling.",
            },
        ],

        relatedSpecialists: ["bjorn-brennhovd", "nicolai-wessel", "thomas-fredrik-thaulow"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "urologi/sterilisering": {
        title: "Sterilisering",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Urologi",
        heroImage: urologiImg,
        description: "Sterilisering (vasektomi) er en enkel, trygg og effektiv behandling for permanent prevensjon. Hvis du er helt sikker på at du ikke ønsker flere barn i fremtiden, kan sterilisering være et alternativ.",
        sections: [
            {
                id: "behandling",
                heading: "Behandling",
                content: "Sterilisering av menn foregår i lokalbedøvelse. Kirurgen legger et lite snitt på pungen, lokaliserer sædlederen som deretter hentes frem og deles. Det fjernes en bit av lederen og endene sys tett for å hindre at de gror sammen.\n\nSamme prosedyre gjentas på den andre sædlederen. Dersom det ikke har vært noen form for kirurgi i pungen tidligere, er operasjonen som oftest enkel og utført i løpet av en halvtime. Vevsbitene sendes til laboratoriet for undersøkelse slik at vi får en bekreftelse på at sædlederen er delt.",
            },
            {
                id: "for-og-etter",
                heading: "Før og etter inngrepet",
                content: "**Slik forbereder du deg til sterilisering:** Barber testiklene dagen før operasjonen. Dette er for å hindre at hår kommer i operasjonssårene, noe som kan føre til infeksjon. Før inngrepet må du informere oss om du bruker blodfortynnende medisiner. Du må undertegne et egenerklæringsskjema. Du kan kjøre bil både før og etter operasjon.\n\n**Dette tar du hensyn til etter inngrepet:** Dagen etter steriliseringen skal du dusje med bandasjen som ble satt på etter inngrepet. Etter dusjen skifter du den våte bandasjen til en ny bandasje som du får med deg fra oss. Hevelse og misfarging er normalt, og dette vil gå over av seg selv. Stingene løser seg opp og faller av etter cirka 2–3 uker.\n\nEjakulering og orgasme vil foregå helt likt etter sterilisering, men ejakulasjonen vil se noe klarere ut da den ikke lenger inneholder sædceller. Det er viktig å gjennomføre en sædanalyse etter 3 måneder før man slutter med andre prevensjonsmidler.",
            },
        ],
        relatedSpecialists: ["trond-jorgensen", "nabeel-yousaf-khan"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "urologi/testikler": {
        title: "Testikler og pung",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Urologi",
        heroImage: urologiImg,
        description: "Testikler er mannens reproduktive organ og som produserer sædceller og mannlige hormoner, inkludert testosteron. Testiklene er plassert i pungen og pungen sørger for en litt lavere temperatur enn kroppen for å beskytte spermiene. Opplever du plager i testikler eller pung kan du ta kontakt med oss.",
        sections: [
            {
                id: "testikkelkreft",
                heading: "Testikkelkreft",
                content: "Selv om årsaken til testikkelkreft ikke er fullstendig kjent, er det flere mulige risikofaktorer. Disse inkluderer forsinket nedstigning av testiklene i pungen før fødselen, familiehistorie av testikkelkreft, underutviklede testikler, sterilitet, HIV-infeksjon, og miljømessige faktorer.\n\nVanligvis oppdages tilstanden med en kul i testikkelen eller følelse av ubehag i en testikkel. Hvis du opplever slike symptomer, er det viktig å oppsøke en urolog for en undersøkelse. Undersøkelsen inkluderer en ultralyd av testiklene.\n\n**Behandling av testikkelkreft**\n\nValg av behandlingsmetode for testikkelkreft avhenger av krefttypen og hvor avansert sykdommen er. Vanligvis inkluderer behandlingen kirurgi, der testikkelen fjernes, etterfulgt av cellegift.\n\nStrålebehandling kan også vurderes, men brukes ikke lenger som standardbehandling. Dette er kun aktuelt i visse tilfeller og stadier av testikkelkreft.\n\n**Livet etter behandling**\n\nGenerelt blir de fleste som har hatt testikkelkreft friske uten langsiktige komplikasjoner.\n\nSelv om en testikkel fjernes, påvirker det sjelden seksuell funksjon negativt. Hvis cellegiftbehandling er nødvendig, kan reproduksjonsevnen bli svekket i opptil to år, før den normaliserer seg.\n\nNoen kan oppleve det som utfordrende å ha bare én testikkel etter behandlingen, og i slike tilfeller kan man vurdere å få satt inn en testikkelprotese.",
            },
            {
                id: "kul-i-pungen",
                heading: "Kul i pungen",
                content: "Har du oppdaget en hevelse i testiklene dine? Vanligvis er slike hevelser ufarlige, men det er klokt å konsultere en urolog for en grundig undersøkelse, for å utelukke mer alvorlige tilstander.\n\n**Hva kan en testikkelhevelse være?** Ofte kan dette skyldes en tilstand som hydrocele (vannbrokk) eller inguinalhernie (sædbrokk), selv om disse tilstandene generelt er ufarlige, kan de av og til vokse til en størrelse som forårsaker ubehag i testiklene og pungen. Våre urologer tilbyr enkle kirurgiske inngrep for å behandle slike tilstander.",
            },
        ],
        relatedSpecialists: ["nabeel-yousaf-khan"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },

    // ==========================================
    // FERTILITET
    // ==========================================
    "fertilitet/infertilitet": {
        title: "Infertilitet",
        subtitle: "Uten henvisning • Ingen ventetid",
        parentCategory: "Fertilitet",
        heroImage: fertilitetImg,
        description: "Svært mange opplever at det er vanskelig å bli gravid på egenhånd. Så mange som 1 av 6 gjennomlever infertilitet, altså at graviditet ikke har lykkes til tross for gjentatte forsøk i ett år eller mer. Det finnes flere årsaker til ufrivillig barnløshet, og du skal vite at du er ikke alene.",
        sections: [
            {
                id: "du-er-ikke-alene",
                heading: "Du er ikke alene",
                content: "Dessverre er det flere som kan fortelle at de kjenner på en skam knyttet til infertilitet. Dette er nok også årsaken for at mange velger å utsette å oppsøke gynekolog. Opplever du ufrivillig barnløshet, anbefaler vi at du tar kontakt for en fertilitetssjekk dersom du befinner deg i en av disse to situasjonene:\n\n- **Kvinne 35 år, eller yngre:** Er du en kvinne på 35 år eller yngre bør du ta kontakt for en fertilitetssjekk om du ikke har lykkes med å oppnå graviditet i løpet av 12 måneder. Ta også kontakt dersom du opplever problemer med eggløsning eller sjeldne/uregelmessige menstruasjoner.\n- **Kvinne 36 år, eller eldre:** Er du en kvinne på 36 år eller eldre bør du ta kontakt for en fertilitetssjekk dersom du ikke har lykkes med å oppnå graviditet i løpet av seks måneder.\n\nÅrsakene til ufrivillig barnløshet kan være mange, og trenger nødvendigvis ikke være knyttet til alder.\n\n**Vi kan dele utfordringene inn i fire kategorier:**\n- Kvinnelig faktor\n- Mannlig faktor\n- En blanding av de to\n- Uforklarlige årsaker\n\nDet er viktig å huske på at infertilitet rammer like mange menn som det rammer kvinner.",
            },
            {
                id: "kvinnelig-faktor",
                heading: "Kvinnelig faktor til infertilitet",
                content: "Kvinner fødes med ett bestemt antall egg, så den kvinnelige kroppen produserer derfor ikke flere. Ved hver menstruasjon utvikles ett eller flere egg til modning. Antall egg synker med årene, og i tillegg reduseres kvaliteten på eggene. Gjennom både erfaring og ulike studier er det avdekket en rekke forhold som kan påvirke den kvinnelige fertiliteten:\n\n- Eggløsningsproblemer som skyldes hormoner\n- PMOS (polyscystiske eggstokker) – Eggposene modnes ikke slik at man får sjelden eller ingen eggløsning\n- Skade på eggleder: for eksempel etter klamydiainfeksjon eller blindtarmoperasjon\n- Utfordringer med livmor: for eksempel muskelknuter eller adenomyose\n- Endometriose\n- Medisinske årsaker knyttet til medikamentbruk, som for eksempel cellegift\n- Alder",
            },
            {
                id: "mannlig-faktor",
                heading: "Mannlig faktor til infertilitet",
                content: "Menn produserer spermier kontinuerlig, og det er derfor ingen fare for at det «går tomt». Det er gjort en rekke studier som viser at omtrent 4 av 10 par som ikke lykkes med å bli gravide på egen hånd har en mannlig faktor som hovedårsak.\n\n- Nedsatt eller fraværende sædproduksjon (infeksjon eller genetiske tilstander)\n- Hormonelle årsaker\n- Transportfeil av sædceller\n- Vanskelig å få utløsning som følger av en operasjon eller infeksjon\n- Nedsatt evne til ereksjon eller utløsning\n- Ulike legemidler eller anabole steroider\n- Testikkelkreft",
            },
            {
                id: "uforklarlige-arsaker",
                heading: "Uforklarlige årsaker til infertilitet",
                content: "I ca 30 % av alle infertile tilfeller finner vi ingen årsak til hvorfor man ikke lykkes med å bli gravid. Vi forstår at det kan være en frustrerende beskjed å få etter å ha prøvd en lang stund. Om alle prøvene fra fertilitetssjekken ser fine ut, kan én eller flere av årsakene nedenfor være med på å minske sjansene for en graviditet:\n\n- Røyking og alkohol har en negativ påvirkning på mannlig og kvinnelig fertilitet\n- Overvekt kan ha en negativ påvirkning for både mannlig og kvinnelig fertilitet\n- Overforbruk av ulike legemidler som Naproxen, Voltaren, Ibux og andre smertestillende har dokumentert negativ effekt på sannsynligheten for å bli gravid",
            },
        ],
        relatedSpecialists: ["jackson-tok", "birgitte-mitlid-mork", "kjersti-brenden"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "fertilitet/assistert-befruktning": {
        title: "Assistert befruktning",
        subtitle: "Uten henvisning • Ingen ventetid",
        parentCategory: "Fertilitet",
        heroImage: fertilitetImg,
        description: "Det finnes flere ulike behandlingsmetoder ved assistert befruktning. Vi utarbeider behandlingsmetoden slik at den er tilpasset nettopp deg og dine behov. Du kan være trygg på at vi gjør grundige undersøkelser med ett mål for øyet – å hjelpe deg med å oppfylle drømmen om et barn.",
        sections: [
            {
                id: "ivf",
                heading: "IVF - In Vitro Fertilisering",
                content: "In Vitro Fertilisering betyr «befruktning utenfor kroppen», også ofte omtalt som prøverørsbehandling. I praksis betyr det at vi ved et lite inngrep, som gjøres med lokalbedøvelse, henter ut modne egg hos kvinnen. Deretter vil eggene bli befruktet i et prøverør, for så bli satt tilbake i kvinnens livmor.\n\nMålet er å gi deg som kvinne størst mulig sjanse for å få et barn, på en så trygg måte som mulig. Hver IVF-behandling tilpasses ut fra individuelle forutsetninger. Det er derfor viktig at det gjøres en grundig fertilitetssjekk før du går i gang med behandling.",
            },
            {
                id: "icsi",
                heading: "ICSI - Intracytoplasmatisk spermieinjeksjon",
                content: "ICSI er en behandlingsmetode som benyttes ved nedsatt sperm-funksjon. ICSI blir også ofte kalt for mikroinjeksjon. Metoden likner delvis på IVF men istedenfor at egget og spermien blir lagt sammen, blir egget injisert med sperm og deretter plassert i en inkubator. Denne behandlingen benyttes hos IVF-pasienter der det er mannlig faktor til uteblitt graviditet.",
            },
            {
                id: "inseminasjon",
                heading: "Inseminasjon (AIH)",
                content: "Inseminasjon er en behandlingsmetode hvor vi injiserer preparert sperm rett inn i livmorhulen. Inseminasjon med donorsæd er førstevalget for single kvinner eller par der det er behov for donorsæd. Inseminasjon kan også brukes med mannens sperm dersom paret ønsker å forsøke å bli gravid før IVF.",
            },
            {
                id: "donor",
                heading: "Assistert befruktning med donor",
                content: "Vi tilbyr assistert befruktning med donor, både egg- og sæddonasjon. Ta kontakt med oss om du ønsker å vite mer.",
            },
            {
                id: "tesa-pesa",
                heading: "TESA/PESA",
                content: "TESA/PESA er en vanlig behandlingsmetode for å hente ut sperm fra pungen. Uthentingen gjøres med lokalbedøvelse.\n\nTESA/PESA er en metode vi benytter dersom mannen er sterilisert eller har en annen medisinsk tilstand som forårsaker alvorlig avvik eller ingen spermier i sædanalysen.\n\nTESA er et kirurgisk inngrep hvor vi går inn i testikkel for å hente sædceller. PESA er en metode hvor sædcellene suges ut av bitestikkelen via en tynn nål.\n\nEtter TESA/PESA må det benyttes ICSI som befruktningsmetode. Kvinnen gjennomgår IVF-behandling for å hente ut egg som kan befruktes i laboratoriet.",
            },
            {
                id: "micro-tese",
                heading: "Micro-TESE",
                content: "Vi tilbyr avanserte behandlinger for menn med fertilitetsproblemer. Micro-TESE (microdissection testicular sperm extraction) er en mikrokirurgisk prosedyre som utføres under mikroskopisk veiledning for å identifisere og ekstrahere sædceller direkte fra testiklene. Dette er en effektiv metode for menn med azoospermi, hvor sædceller ikke finnes i sædprøver.\n\nStudier har vist at micro-TESE har en høyere suksessrate sammenlignet med tradisjonell TESE-prosedyre, spesielt for menn med ikke-obstruktiv azoospermi. Vår fertilitetsspesialist Jackson Tok er sertifisert for Micro-TESE ved Center for Male Reproductive Medicine og Microsurgery ved Weill Cornell University i New York City.",
            },
        ],
        relatedSpecialists: ["kristian-ophaug"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    // "fertilitet/ivf" fjernet — IVF er nå et avsnitt inne på "Assistert befruktning".
    "fertilitet/eggfrys": {
        title: "Eggfrys",
        subtitle: "Uten henvisning • Ingen ventetid",
        parentCategory: "Fertilitet",
        heroImage: fertilitetImg,
        description: "Om du ønsker å vente med en eventuell graviditet, vil kanskje det å fryse ned egg være riktig for deg. På denne måten kan fremtidige deg, selv om fruktbarheten er redusert eller borte, kunne bli gravid. Ved nedfrysning av egg henter vi ut flere modne egg som legges på frys ubefruktet.\n\nEtter opptining vil egget befruktes med donorsæd, eller sæd fra partner, før det settes tilbake i livmoren. Denne prosedyren kalles for IVF, også populært kalt prøverørsbehandling.",
        sections: [
            {
                id: "hvem-kan-fryse",
                heading: "Hvem kan fryse ned egg?",
                content: "Alle kvinner kan i utgangspunktet fryse ned egg. De vanligste årsakene er forholdet til partner, økonomi, utdanning og jobbsituasjon. I juli 2020 ble det også tillatt å fryse ned egne egg for eget bruk. Å fryse ned egg på denne måten kalles for «social freezing».\n\nDersom du vet at du har en genetisk tilstand som reduserer eggstokkreservene, eller om du er plaget med endometriose, anbefaler vi at du benytter muligheten for å fryse ned egg.",
            },
            {
                id: "aldersgrense",
                heading: "Hva er aldersgrensen for nedfrysning av egg?",
                content: "Studier viser at eggstokkreservene reduseres etter fylte 30 år, både når det gjelder kvalitet og antall. Dette i kombinasjon med at vi vet at fertiliteten reduseres etter fylte 35 år, anbefaler vi at du ikke er eldre enn 36 år når du fryser ned eggene. Det er store variasjoner oss kvinner imellom, så vi gjør individuelle vurderinger hos dere som er mellom 35–38 år.",
            },
            {
                id: "slik-foregaar",
                heading: "Slik foregår nedfrysning av egg",
                content: "En syklus med uttak og nedfrysning av egg er svært lik de første trinnene i en IVF-behandling. I hovedtrekk kan vi dele nedfrysning av egg inn i åtte ulike faser:\n\n1. Hormonstimulering ved hjelp av hormonsprøyter\n2. Sjekk av follikler for å sikre ønsket vekst\n3. Eggløsningssprøyte ca. en og en halv dag før uttaket\n4. Uttaket skjer gjennom skjeden etter lokalbedøvelse og smertestillende\n5. Laboratoriet sjekker kvaliteten på eggene, og godkjente egg fryses ned\n6. De aller fleste kan dra tilbake på jobb etter en dag eller to\n7. Eggene kan oppbevares og benyttes inntil du fyller 46 år\n8. Ved opptining befruktes eggene før de dyrkes videre i 2–5 dager, for så å settes tilbake i livmoren",
            },
            {
                id: "hvor-mange-egg",
                heading: "Hvor mange egg kan jeg få på frys?",
                content: "Fordi det ikke finnes noen garanti for at modne egg kan befruktes og dele seg slik vi ønsker, anbefaler vi at du fryser ned minimum 20 egg. Da har du best mulig odds for en graviditet.\n\nAntall modne egg ved hver behandling varierer, og det er derfor variasjoner i hvor mange behandlinger hver enkelt bør gjennomføre. De fleste må regne med to til tre omganger med stimulering og uttak.",
            },
            {
                id: "risiko",
                heading: "Hva er risiko ved nedfrysning av egg?",
                content: "Som ved all medisinsk behandling vil det alltid være en viss risiko knyttet til behandlingen.\n\n- **Overstimulering:** I noen tilfeller kan bruk av fertilitetsmedisin føre til at eggstokkene hovner opp. Du vil da kunne oppleve smerter og stinn mage under hormonbehandlingen eller etter uttaket.\n- **Komplikasjoner ved egguttak:** Alvorlige komplikasjoner skjer svært sjelden, men det kan forekomme blødninger, infeksjon i bekkenet eller skader på tarm.\n- **Emosjonell reaksjon:** Å bestemme seg for å fryse ned egg kan oppleves som en trygghet. Det er viktig at nedfrysning ikke gir noen garanti for graviditet, men at mulighetene er større enn dersom man velger det bort.",
            },
        ],
        relatedSpecialists: ["kristian-ophaug"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "fertilitet/donorbehandling": {
        title: "Donorbehandling",
        subtitle: "Uten henvisning • Ingen ventetid",
        parentCategory: "Fertilitet",
        heroImage: fertilitetImg,
        description: "Behandling med donorsæd eller donerte egg kan være aktuelt for mange. I Norge er det ikke tillatt med samtidig donasjon av egg og sæd (såkalt dobbeldonasjon) og single kvinner i Norge får derfor ikke tilbud om eggdonasjon i henhold til bioteknologiloven. Unntak fra dette er i et likekjønnet par der den ene kvinnen kan få sine egg befruktet med donorsæd og gi befruktet egg til den andre kvinne for å oppnå graviditet (såkalt partnerdonasjon).\n\nSynes du det er vanskelig å forstå alt? Du er ikke alene. Har du spørsmål er du velkommen til å ringe oss.",
        sections: [
            {
                id: "partnerdonasjon",
                heading: "Partnerdonasjon",
                content: "Partnerdonasjon ble tillatt i Norge 01.01.2021 og kan være aktuelt for to kvinner i et parforhold.\n\nI den nye Bioteknologiloven som kom i 2020 ble det tillat med partnerdonasjon, men det måtte da begrunnes medisinsk. Imidlertid kom det en endring og presisering i 2021, slik at begrunnelsen nå også kan være kun sosial. Dette betyr at kvinner i likekjønnet par selv kan bestemme hvem som skal gå gravid.\n\nNoen kvinner har medisinske utfordringer knyttet til sin fertilitet, eggstokker som produserer lite eller ingen egg, tidlig overgangsalder eller på andre måter har redusert eggkvalitet. Sjansen for å lykkes med reproduksjon kan da være minimale. Da kan man ha mulighet til å få egg fra en annen kvinne. Dersom eggene som brukes er av god kvalitet har man en god sjanse for å lykkes med behandling. Eggene vil da befruktes med donorsperm.\n\nPartnerdonasjon er kun aktuelt for to kvinner som er gift eller samboer i ekteskapslignende forhold.\n\nFremgangsmåte ved partnerdonasjon er ganske lik IVF-behandling. Egget hentes ut fra den ene kvinnen (giver) og befruktes med donorsæd. Embryoet fryses ned og tines, for så å settes tilbake i partners livmor (mottaker) ved et fryseforsøk. Behandlingen er tillatt der det foreligger en sosial eller medisinsk grunn til at partner (mottaker) ikke kan bli gravid med egne egg."
            },
            {
                id: "donorsaed",
                heading: "Donorsæd",
                content: "Vi benytter donorsæd fra Livio Sperm Bank, Cryos og European Sperm Bank. Vi har god tilgang på norsk donorsæd fra Livio Sperm Bank.\n\nEtter norske retningslinjer bruker vi sæd fra ikke-anonym donor. Donor forblir anonym for kvinnen/paret, men barnet har rett til informasjon om donors identitet når han eller hun fyller 15 år. Fram til 2019 var denne aldersgrensen 18 år.\n\nOm det ønskes flere barn fra samme donor kan donorsæd reserveres til søskenforsøk hos sædbanken og/eller lagres ved klinikken vår.\n\nUnder den første samtalen med gynekolog gjennomgås rutiner for utvelgelse av sæddonor. Før behandling kan igangsettes er det viktig at donorsæd er på plass på klinikken. Kontakt oss dersom du er usikker på om klinikken har mottatt donorsæd til behandlingen.\n\nVi tilbyr behandling med norsk donorsæd – som har vært donert hos Livio Oslo og som nå er en del av CMedical sitt tilbud."
            },
            {
                id: "donoregg",
                heading: "Donoregg",
                content: "I følge Bioteknologiloven i Norge er behandling med donoregg tillatt kun til heterofile par. Denne type behandling tilbys i situasjoner der kvinnen ikke har mulighet til å bruke egne egg på grunn av enten eggmangel eller svært redusert eggkvalitet.\n\nVi i CMedical følger disse retningslinjene i Bioteknologiloven."
            },
        ],
        relatedSpecialists: ["kristian-ophaug"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "fertilitet/hysteroskopi": {
        title: "Hysteroskopi",
        subtitle: "Uten henvisning • Ingen ventetid",
        parentCategory: "Fertilitet",
        heroImage: fertilitetImg,
        description: "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen. Undersøkelsen gir en grundig oversikt og gjør det mulig å oppdage årsaker til plager som ellers kan være vanskelig å finne.\n\nFordelen for deg som pasient er at vi ofte kan stille diagnose og eventuelt behandle i samme prosedyre.",
        benefits: [
            "Uregelmessige blødninger",
            "Mistanke om polypper eller muskelknuter i livmoren",
            "Vanskeligheter med å bli gravid",
            "Forandringer i livmorslimhinnen",
        ],
        sections: [
            {
                id: "office-hysteroskopi",
                heading: "Office-hysteroskopi",
                content: "Vi tilbyr også office-hysteroskopi som kan gjennomføres uten narkose eller bedøvelse, og umiddelbart ved besøk hos gynekolog."
            },
        ],
        relatedSpecialists: ["kristian-ophaug"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "fertilitet/saedanalyse": {
        title: "Sædanalyse",
        subtitle: "Uten henvisning • Ingen ventetid",
        parentCategory: "Fertilitet",
        heroImage: fertilitetImg,
        description: "En sædanalyse er en trygg og enkel måte å kartlegge mannens sædkvalitet på. Prøven gir viktig informasjon om antall, bevegelighet og utseende på spermiene, og brukes ofte som første steg når man ønsker å undersøke fertilitet eller planlegger assistert befruktning.\n\nPrøven tas ved utløsning og kan leveres på klinikken. Analysen gir et tydelig bilde av sædkvaliteten og kan bidra til å avgjøre om videre utredning eller behandling er nødvendig.\n\nSædanalyse kan også være første steg dersom man ønsker å fryse ned spermier for fremtidig bruk – for eksempel før medisinsk behandling eller andre inngrep som kan påvirke fertiliteten.",
        sections: [
            {
                id: "enkel-saedprove",
                heading: "Enkel sædprøve",
                content: "En enkel sædprøve gir en grunnleggende vurdering av mannens sædkvalitet, inkludert antall sædceller, konsentrasjon, bevegelighet og utseende. Dette gir viktig informasjon om fertilitet og kan være første steg i kartleggingen av fruktbarhet.\n\n**Forberedelser:**\n- Det anbefales 2 dagers abstinens siden siste utløsning\n- Kvelden før prøven: vask penis med såpe og vann\n- På prøvedagen: vask kun med vann, unngå kremer eller oljer\n- Prøven kan tas på klinikken eller hjemme. Ved hjemmeprøve: lever den innen én time og hold den kroppstemperert. Ikke bruk glidemiddel eller spytt\n\nAnalysen gjøres i laboratoriet, og resultatene gir oss et klart bilde av sædkvaliteten, slik at vi kan vurdere om videre undersøkelser eller behandling er nødvendig."
            },
            {
                id: "utvidet-saedprove",
                heading: "Utvidet sædprøve",
                content: "En utvidet sædprøve gir en mer detaljert vurdering, inkludert morfologi og DNA-fragmentering. Dette kan være aktuelt ved redusert sædkvalitet eller for å kartlegge årsaker til infertilitet, inkludert gjentatte aborter.\n\n**Når kan den være nødvendig?**\n- Vedvarende redusert sædkvalitet\n- Gjentatte aborter\n\n**Forberedelser:**\n- Samme hygieneregler som for enkel prøve\n- Det anbefales 1 dags abstinens\n- Prøven tas kun på klinikken og må avtales på forhånd\n\nVed behov kan sæd også fryses ned for fremtidig bruk, for eksempel før medisinsk behandling som kan påvirke fertiliteten, sterilisering eller kjønnsbekreftende behandling."
            },
            {
                id: "etter-vasektomi",
                heading: "Sædprøve etter vasektomi/refertilisering",
                content: "Vi anbefaler sædprøve tre måneder etter inngrepet. Dersom inngrepet er utført hos CMedical, er denne prøven kostnadsfri."
            },
            {
                id: "nedfrysning",
                heading: "Nedfrysning av sæd",
                content: "Sæd kan fryses ned for fremtidig bruk, for eksempel før medisinsk behandling som kan påvirke fertiliteten, ved sterilisering eller i forbindelse med kjønnsbekreftende behandling.\n\n**Forberedelser:**\nFør nedfrysning må du ta lovpålagte blodprøver for HIV, hepatitt B og hepatitt C. Rekvisisjoner til prøvene får du av oss.\n\nSamme hygieneregler gjelder som ved vanlig sædprøve, og vi anbefaler 1–2 dagers avhold før prøvetaking. Prøven tas på klinikken, og timen må avtales på forhånd."
            },
        ],
        relatedSpecialists: ["kristian-ophaug"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "fertilitet/teamet": {
        title: "Fertilitetsteamet",
        subtitle: "Møt teamet som hjelper deg med å oppfylle barneønsket.",
        parentCategory: "Fertilitet",
        heroImage: heroFamily,
        description: "Vårt fertilitetsteam består av erfarne reproduksjonsmedisinere, gynekologer, embryologer, sykepleiere og psykologer som alle er dedikert til å hjelpe deg.\n\nVi legger stor vekt på personlig oppfølging og tett kommunikasjon gjennom hele behandlingsforløpet. Du skal føle deg trygg og ivaretatt hos oss.",
        benefits: [
            "Erfarne reproduksjonsmedisinere og gynekologer",
            "Spesialiserte embryologer med internasjonal erfaring",
            "Dedikerte fertilitets-sykepleiere for daglig oppfølging",
            "Psykolog for emosjonell støtte under behandlingen",
            "Tverrfaglig samarbeid for best mulig resultat",
        ],
        faqs: [
            { question: "Hvem er min kontaktperson?", answer: "Du får en dedikert fertilitets-sykepleier som er din hovedkontaktperson gjennom hele behandlingen." },
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },

    // ==========================================
    // ORTOPEDI
    // ==========================================
    "ortopedi/fot-ankel": {
        title: "Fot og ankel",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Ortopedi",
        heroImage: ortopediImg,
        description: "Vi tilbyr alle subspesialiteter innen ortopedisk fot- og ankelkirurgi, og våre spesialister kan utføre alle typer inngrep. Ved flere diagnoser benytter vi avanserte minimalt invasive operasjonsmetoder kalt **MIS (Minimally Invasive Surgery)** og **MICA (Minimally Invasive Chevron-Akin)**. Dette er operasjonsmetoder — ikke diagnoser — som lar oss korrigere feilstillinger og senerelaterte plager gjennom svært små snitt, med mindre vevsskade, mindre smerte og raskere rehabilitering. Hvilken metode som er aktuell for deg avhenger av diagnosen og funn ved undersøkelse.",
        sections: [
            {
                id: "hallux-valgus",
                heading: "Hallux valgus (skjev stortå)",
                content: "Hallux valgus er en feilstilling der stortåen vinkles mot de andre tærne, samtidig som det dannes en kul (knyst) på innsiden av foten. Tilstanden gir ofte smerter ved bruk av sko, hevelse og gnagsår, og kan over tid endre belastningen av hele forfoten.\n\n**Behandling:** Ved milde plager kan brede sko, innleggssåler og fysioterapi være tilstrekkelig. Når plagene vedvarer er kirurgi aktuelt.\n\n**Operasjonsmetode — MIS / MICA:** Hos oss utfører vi inngrepet med minimalt invasiv teknikk (MIS / MICA — Minimally Invasive Chevron-Akin). Korrigeringen av stortåen gjøres gjennom svært små snitt, med presise beinkutt og fiksering med skruer. Sammenlignet med åpen kirurgi gir metoden generelt mindre hevelse, mindre arrdannelse og raskere mobilisering. MIS og MICA er operasjonsmetoder vi velger ut fra diagnose og funn, ikke egne diagnoser i seg selv."
            },
            {
                id: "kompartment-syndrom",
                heading: "Kompartment-syndrom",
                content: "Muskelhinnen er ikke ettergivende og tøyes ikke i forhold til muskulaturen. Dette fører til økt trykk i muskulaturen og redusert blodsirkulasjon som resulterer i smerter (manglende blodtilstrømning gir smerter på grunn av oksygenmangel). Dette skjer oftest i fremre ytre leggmuskelkompartment. Smertene varer kun i aktivitet og forsvinner som regel etter trening og i hvile.\n\n**Behandling:** Behandling av kronisk kompartment-syndrom er i første omgang å unngå provoserende belastning samt alternativ trening i en periode på 3 måneder. Deretter gjenopptas treningen gradvis med tilpasset skotøy og god støtdempning. Dersom plagene kommer tilbake, er det grunn til å vurdere operasjon.\n\n**Operasjon:** Operasjon av kronisk kompartment-syndrom foregår i narkose. Muskelhinnene spaltes gjennom to små snitt i huden."
            },
            {
                id: "ballettankel",
                heading: "Ballettankel",
                content: "I ankelen kan trange forhold baktil gi bakre impingement eller innklemming av strukturer med påfølgende huggende smerter. Tilstanden er vanlig hos ballettdansere grunnet tåspissposisjonen, men den forekommer også hos turnere og fotballspillere.\n\nMan kan se beinpåleiringer baktil i leddet ved ballettankel. Disse kan løsne og gi frie legemer som kommer i beknip. Hos 10% av befolkningen finnes det en beinkjerne baktil for ankelleddet som ikke er vokst sammen med skinnebeinet.\n\n**Symptomer og utredning:** Smerter baktil i leddet når ankelen belastes med strak vrist. Røntgenundersøkelse, MR eller ultralyd kan verifisere funnene.\n\n**Operasjon:** Operasjonen gjøres i narkose og lokalbedøvelse. Artroskop og instrumenter brukes bakfra gjennom 7 mm åpninger for å komme inn til leddet. Deretter fjernes beinpåleiringer eller løst ben."
            },
            {
                id: "haglunds-hael",
                heading: "Haglunds hæl",
                content: "Mellom hælbeinet og achillessenen finnes en slimpose. Denne kan bli betent på grunn av kronisk irritasjon og trange sko. Etter hvert kan denne irritasjonen føre til bein- og bruskdannelse bak på hælbeinet – det vokser frem en kul på en allerede prominent knokkel. Røntgen med skråbilder viser som regel denne kulen (Haglunds hæl). I første omgang må man bygge opp under hælen for å avlaste trykket.\n\n**Operasjonen:** Ved langvarige plager og betydelig kul kan det bli nødvendig å fjerne kulen kirurgisk. Operasjonen gjøres i lokalbedøvelse og med avslappende medisin. Det legges på en gipsskinne som pasienten beholder i to uker. Deretter starter et opptreningsprogram. Man må minst regne med åtte uker før man gjenopptar vanlig trening."
            },
            {
                id: "achilles-tendinalgi",
                heading: "Achilles tendinalgi",
                content: "Achilles tendinalgi er egentlig flere tilstander som benevnes med samme navn:\n\n- Seneskjedebetennelse, det vil si betennelse i hinnen rundt senen (paratendinitis)\n- Skadet senevev (seneavrivning (akutt) eller slitasje (kronisk))\n\nDet er ikke alltid betennelse i selve seneskjeden som forårsaker smerten, men det kan være små mikrorifter i senen som dannes ved overbelastning. Disse skadene repareres dårlig, sannsynligvis på grunn av relativt dårlig blodsirkulasjon i området.\n\n**Behandling:** I første omgang forsøk på å få senevevet til å hele normalt med eksentrisk trening hos fysioterapeut. Sjokkbølgebehandling (ESWT) kan supplere treningen. Feilstilling i foten (pronasjon) disponerer for achillesseneplager og må korrigeres med såler og riktig skotøy.\n\nEn liten dose kortisoninjeksjon med ultralydveiledning kan forsøkes mot seneskjedebetennelse. Operasjon kan være nødvendig dersom ingen av behandlingene fører frem."
            },
        ],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "ortopedi/hofte": {
        title: "Hofte",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Ortopedi",
        heroImage: ortopediImg,
        description: "Hos CMedical tilbyr vi både standard hofteartroskopi og mer avanserte inngrep i hoften. I tillegg til behandling av labrumskader, FAI (femoroacetabulær impingement) og bruskskader, gjør vi avanserte prosedyrer som tenodese av psoas- og iliopsoassenen, reinsertering av leddleppen og rekonstruksjon ved komplekse senerelaterte plager.\n\nVi opererer i hovedsak yngre, aktive pasienter med idrettsrelaterte hofteskader, der målet er å bevare leddet lengst mulig og få deg trygt tilbake til aktivitet. Med moderne kikkhullsteknikk kan skader i mange tilfeller repareres med små snitt og rask rehabilitering.\n\nHofteskopi utføres under narkose og tar vanligvis 1–2 timer. Etter operasjonen overvåkes du før du kan reise hjem, vanligvis etter 1–2 timer. Kontrolltime avtales ca. 6–8 uker etter operasjonen. Sykmeldingens lengde varierer fra 4–6 uker, avhengig av inngrepet og arbeidsoppgaver.",
        sections: [
            {
                id: "hofteskopi",
                heading: "Hofteskopi — kikkhullsoperasjon av hofteleddet",
                content: "Behandling av skader i selve hofteleddet kan med moderne teknikk utføres som kikkhullsoperasjon. Ved hofteskopi kan skader i mange tilfelle repareres slik at leddet kan bevares lengst mulig. Jo mer skadet leddet er, desto mindre sikkert er det at leddet blir helt smertefritt. Mindre skader kan også føre til behov for hofteprotese på sikt. De fleste pasienter opplever betydelig lindring etter ca. 3 måneder.\n\nHofteskopi utføres ved hjelp av små snitt (kikkhull) som gir kirurgen tilgang til hofteleddet. Operasjonen gjøres under narkose og tar vanligvis 1–2 timer. Etter operasjonen overvåkes du før du kan reise hjem, vanligvis etter 1–2 timer. Kontrolltime på poliklinikken avtales ca. 6–8 uker etter operasjonen. Sykemeldingens lengde avhenger av operasjonen og arbeidsoppgaver, og varierer fra 4–6 uker."
            },
        ],
        relatedSpecialists: ["kristian-marstrand-warholm"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "ortopedi/hand-albue": {
        title: "Hånd og albue",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Ortopedi",
        heroImage: ortopediImg,
        description: "Hånd- og albuekirurgi er et område der vi har samlet noen av landets mest erfarne spesialister. Ved avansert kirurgi jobber kirurgene våre ofte to og to — i såkalte «to-spann» — slik at to spesialister står sammen ved operasjonsbordet. Dette gir ekstra trygghet, presisjon og kvalitet i kompliserte inngrep, og er en arbeidsform vi mener pasienten fortjener.\n\nVi tilbyr utredning og behandling av blant annet karpaltunnelsyndrom, tennisalbue, håndleddsplager, senebetennelser, nerveskader og artroskopisk hånd- og albuekirurgi. Etter avanserte inngrep får du tett oppfølging av håndterapeut.",
        // Hånd/albue-spesialister: navn ikke bekreftet ennå – «Vår spesialist»-boks står klar uten navn.
        relatedSpecialists: [],
        sections: [
            {
                id: "tennisalbue",
                heading: "Tennisalbue",
                content: "Diagnosen stilles ved vanlig undersøkelse og eventuelt ultralyd. Ved milde og begynnende symptomer kan smertestillende og betennelsesdempende medisin være nok. Injeksjon med PRP (platerikt blodplasma) eller lav dose kortison kan forsøkes. En periode i ro kan være nødvendig. Når plagene er større og vedvarer er operasjon indisert.\n\n**Operasjonen:** Utføres i lokalbedøvelse. Det legges et snitt på utsiden av albuen og det ødelagte senevevet fjernes, og knokkelen er stimulert for blødning for å øke tilhelingspotensialet."
            },
            {
                id: "handleddsartroskopi",
                heading: "Håndleddsartroskopi",
                content: "Artroskopi (kikkhullsoperasjon) av håndleddet er brukt for å stille en riktig diagnose hvis du har uforklarlige smerter i håndleddet, og samtidig for å behandle eller operere en eventuell skade.\n\n**Operasjon ved smerter i håndledd:** Håndleddsartroskopi gjøres i narkose og lokalbedøvelse. Kirurgen setter inn en optikk/et lite kamera (skop) gjennom små hull i huden, samt små instrumenter gjennom andre hull. Bildet ses på en skjerm og kirurgen arbeider ut fra denne.\n\nHos oss får pasienter oppfølging av håndterapeut etter avanserte håndoperasjoner."
            },
            {
                id: "carpal-tunnel",
                heading: "Carpal tunnel syndrom",
                content: "Carpal tunnel syndrom er en vanlig årsak til smerter og nummenhet i hånd og fingre. Tilstanden er hyppigere hos kvinner og forekommer hos 10% av befolkningen. Hos de fleste er årsaken ukjent. Reumatikere, diabetikere, stoffskiftesyke, eldre og personer med tidligere håndleddsbrudd er disponerte.\n\n**Symptomer:** Typiske symptomer er smerter og nummenhet i tommel, pekefinger og langfinger, og halve ringfinger. Ofte våkner pasientene på nattestid og må riste på hånda for å minske smerten. I langtkomne tilfeller kan den store tommelmuskelen svinne og svekkes.\n\nPlagene forårsakes av press på en nerve (nervus medianus) i en kanal i håndleddet.\n\n**Operasjon og behandling:** Inngrepet kan gjøres med kikkhullskirurgi/endoskopisk carpal tunnel. Endoskopisk operasjon fører til kortere sykmelding og raskere rehabilitering sammenlignet med åpen operasjon. Den gjøres i kortvarig narkose eller lokalbedøvelse. Båndet som danner taket av tunnelen deles for å gjøre plass for nerven."
            },
        ],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "ortopedi/kne": {
        title: "Kne",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Ortopedi",
        heroImage: ortopediImg,
        description: "Hos CMedical er korsbånd- og meniskskader hovedområdene innen knekirurgi. Vi tilbyr utredning, kirurgi og oppfølging av idrettsrelaterte og degenerative skader i menisk, korsbånd og leddbånd. Vi utfører ikke protesekirurgi.\n\nVåre knekirurger har lang erfaring med avansert artroskopisk teknikk, korsbåndsrekonstruksjon og meniskreparasjon. Målet er å bevare leddet, gjenopprette stabilitet og få deg trygt tilbake til aktivitet.",
        sections: [
            {
                id: "om-knebehandling",
                heading: "Om knebehandling hos CMedical",
                content: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi, og våre spesialister kan utføre alle typer ortopediske operasjoner. Bestill time hos en erfaren ortoped med kort ventetid."
            },
            {
                id: "bruskskader",
                heading: "Bruskskader i kneet",
                content: "Artrose, eller slitasjegikt, er en progressiv degenererende sykdom der leddbrusken slites ned og meniskene kan bli utslitte. Leddspalten forsnevres og beinpåleiringer dannes rundt leddet. Artrose er delvis en genetisk sykdom, delvis aldersrelatert, og blir forverret ved mye belastning over tid. 40–50-åringer begynner som regel å kjenne til leddsmertene, men tilstanden kan oppstå i yngre alder etter skader som meniskskader, korsbåndskader eller beinbrudd."
            },
            {
                id: "symptomer",
                heading: "Symptomer og problemer",
                content: "Sliter du med bruskskader i kneet? Symptomer inkluderer smerter ved aktivitet, hevelse og stivhet (dette skyldes ofte økt væske i kneet). Problemer med god sovestilling for knærne, morgenstivhet, startvansker og forverring ved kulde er også vanlig. Muskulaturen i benet blir svakere og man begynner å halte. I senere faser kan kneet få en skjevstilling grunnet mer slitasje på en av sidene."
            },
        ],
        relatedSpecialists: ["marc-jacob-strauss"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "ortopedi/skulder": {
        title: "Skulder",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Ortopedi",
        heroImage: ortopediImg,
        description: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi, og våre spesialister kan utføre alle typer ortopediske operasjoner. Bestill time hos en erfaren ortoped med kort ventetid.",
        sections: [
            {
                id: "kalkskulder",
                heading: "Skulderperitendinitt eller kalkskulder",
                content: "Årsaken til kalkskulder er kalk i senen. Kalken oppstår som et resultat av senebetennelser under skulderbuen. Det gir smerter ved bruk av armen. Ofte er tilstanden til stede sammen med impingementsyndrom og må behandles samtidig. Operasjon av kalkskulder kan være nødvendig dersom plagene ikke kan reduseres med trykkbølger, medikamenter og fysioterapi.\n\n**Operasjon og behandling:** Operasjon av kalkskulder foregår ved at man legger et snitt i senen og fjerner kalkmassene. Som regel gjøres en subacromiell dekompresjonsoperasjon samtidig, hvor skulderbladkantens underside jevnes for å unngå innklemming av senen når armen løftes."
            },
            {
                id: "slap",
                heading: "Hva er SLAP-lesjon og SLAP-skader?",
                content: "SLAP (Superior Labrum Anterior to Posterior) er øvre leddleppe (labrum)-skade i skulderbladskålen (glenoid) og indikerer en skadetype hvor øvre del av leddleppen i skulderen med feste for bicepssenen er løs.\n\n**Symptomer på SLAP-lesjon og skader:** Smerter og av og til kneppfølelse i skulderen, spesielt ved kasting. Diagnosen stilles med legeundersøkelse, MR og artroskopi.\n\n**Operasjon av SLAP-lesjon:** Med leddkikkert og mikrokirurgisk teknikk sys leddleppen og bicepssenefestet på plass mot leddskålen. Alternativt løsnes bicepssenen fra leddleppen og slippes ut i seneskjeden (bicepstenotomi)."
            },
            {
                id: "frozen-shoulder",
                heading: "Frozen shoulder",
                content: "En betennelse i leddhinnen i skulderleddet. En smertefull tilstand med smerter og nedsatt funksjon i skulder og ofte arm. Både kvinner og menn kan få frozen shoulder, men de som rammes hyppigst er kvinner i aldersgruppen 40–60 år.\n\n**Operasjonen:** Kapselløsning gjøres i narkose med artroskopi (kikkhullsoperasjon) av skulderleddet, og man oppnår full bevegelse med en gang etter operasjonen. Hensikten er å bedre bevegeligheten ved å løsne kontrollert på den stive skulderkapselen og tøye skulderen til full bevegelighet."
            },
        ],
        relatedSpecialists: ["tom-henry-sundoen"],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },

    // ==========================================
    // FLERE FAGOMRÅDER
    // ==========================================
    "flere-fagomrader/endokrinologi": {
        title: "Endokrinologi",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Endokrinologi er en medisinsk spesialitet som handler om hormonsystemet og sykdommer knyttet til kjertler som produserer hormoner, som for eksempel skjoldbruskkjertelen, binyrene, hypofysen og biskjoldkjertlene. Endokrinologer utreder, behandler og følger opp pasienter med hormonelle forstyrrelser. For å finne ut om du har en hormonell sykdom starter vi med en grundig konsultasjon og undersøkelse, som ofte inkluderer blodprøver og eventuelt bildeundersøkelser. Har du plager knyttet til hormoner, stoffskifte, diabetes eller andre endokrine tilstander, anbefaler vi deg å ta kontakt med oss eller bestille en konsultasjon.",
        themes: ["Stoffskifte", "Diabetes", "Binyrer og hormoner"],
        benefits: [
            "Erfarne endokrinologer med spisskompetanse",
            "Grundig hormonutredning med blodprøver og bildeundersøkelser",
            "Individuelt tilpasset behandling og oppfølging",
            "Tverrfaglig samarbeid med ernæringsfysiolog",
        ],
        relatedSpecialists: ["ersan-krckov"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "flere-fagomrader/ernaringsfysiolog": {
        title: "Ernæringsfysiolog",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Ernæringsfysiologi er et felt som ser på hvordan mat påvirker kroppen og helsen. Ernæringsfysiologer studerer næringsstoffer i mat, vurderer ernæringsbehov, og gir råd for å oppmuntre til en sunn livsstil.\n\nVår kliniske ernæringsfysiolog gir deg veiledning innen kosthold og livsstil, skreddersydd til deg og dine behov.",
        themes: ["Vekt og kosthold", "Matintoleranser", "Sykdomsernæring"],
        sections: [
            {
                id: "formalet",
                heading: "Formålet",
                content: "Målet er å hjelpe folk med å oppnå og beholde god helse ved å følge riktig kosthold og ernæringsprinsipper. Ernæringsfysiologer gir støtte og veiledning for å hjelpe enkeltpersoner med å nå sine ernæringsmål og forbedre generelt velvære. Hos oss jobber ernæringsfysiolog med andre spesialister i de tilfellene der det er nyttig for pasienten."
            },
            {
                id: "spesialisering",
                heading: "Spesialisering",
                content: "Vår kliniske ernæringsfysiolog Mari Borge Eskerud har spesialisering innen IBS og lavFODMAP-dietten. Hun har tidligere jobbet ved Lovisenberg Diakonale Sykehus, hvor hun har hjulpet pasienter med irritabel tarm-syndrom (IBS) gjennom evidensbasert kostholdsveiledning. Mari er sertifisert i lavFODMAP-dietten av Monash University.\n\nI tillegg til sin spesialisering innen mage- og tarmhelse, har hun særlig kompetanse innen ernæring relatert til fertilitet, overgangsalder, Polycystisk ovariesyndrom (PMOS) og graviditet. Hun jobber også med generell ernæringsveiledning for god helse og velvære.\n\nMari er medforfatter av boken «Sunn og frisk med sensitiv mage – en fullstendig guide til kosthold og mestring» (2018), sammen med Cecilie Hauge Ågotnes."
            },
        ],
        benefits: [
            "Spesialisering innen IBS og lavFODMAP-dietten",
            "Sertifisert av Monash University",
            "Kompetanse innen ernæring ved fertilitet, PMOS og graviditet",
            "Individuelt tilpasset kostholdsveiledning",
            "Tverrfaglig samarbeid med andre spesialister",
        ],
        relatedSpecialists: ["mari-borge-eskerud"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
            { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
        ],
    },
    "flere-fagomrader/gastrokirurgi": {
        title: "Mage- og tarmlidelser (Gastrokirurgi)",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Mage og tarmkirurgi (gastrokirurgi) omhandler kirurgiske inngrep i fordøyelsessystemet. Hos oss møter du erfarne spesialister innen fagfeltet. Vi tilbyr et helhetlig og tverrfaglig tilbud, der avansert medisinsk teknologi møter tett oppfølging fra kirurger og klinisk ernæringsfysiolog.",
        sections: [
            {
                id: "hva-vi-behandler",
                heading: "Hva vi behandler hos oss",
                content: "**Overvektskirurgi (slankeoperasjon):** Varig vektreduksjon med robotassistert presisjon.\n\n**Brokkoperasjon:** Skånsom behandling av lyskebrokk, arrbrokk og navlebrokk med kikkhull/robot.\n\n**Hemorroider og endetarmsplager (rektocele):** Spesialistkompetanse på plager i endetarm og bekkenbunn."
            },
        ],
        linkedServices: [
            { label: "Overvektskirurgi (slankeoperasjon)", description: "Varig vektreduksjon med robotassistert presisjon.", path: "/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi" },
            { label: "Brokkoperasjon", description: "Skånsom behandling av lyskebrokk, arrbrokk og navlebrokk med kikkhull/robot.", path: "/behandlinger/flere-fagomrader/gastrokirurgi/brokkoperasjon" },
            { label: "Hemorroider og endetarmsplager (rektocele)", description: "Spesialistkompetanse på plager i endetarm og bekkenbunn.", path: "/behandlinger/flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager" },
        ],
        relatedSpecialists: ["jan-roland-lambrecht", "andreas-edenberg"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },

    "flere-fagomrader/osteopati": {
        title: "Osteopati",
        subtitle: "Kort ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Osteopati er en manuell behandlingsform som betyr at hendene er osteopatens viktigste verktøy for diagnostisering og behandling. Osteopati komplementerer medisinsk utredning og behandling.\n\nOsteopatene er autorisert helsepersonell og følger lov for helsepersonell.",
        themes: ["Nakke og rygg", "Kroniske smerter", "Bekkenrelaterte plager"],
        sections: [
            {
                id: "kvinnehelse",
                heading: "Kvinnehelse",
                content: "På det tverrfaglige behandlingsteamet hos oss har osteopaten en naturlig plass i behandlingsplanen innenfor vulvasmerter, bekkenbunnsdysfunksjon, smerter og nedsatt funksjon i muskelskjelettsystemet, i oppfølging av gravide kvinner og kvinner etter fødsel.\n\nI tillegg vil osteopatisk behandling kunne ha gunstig effekt ved smerter relatert til endometriose/adenomyose og stress.",
            },
            {
                id: "behandling",
                heading: "Behandling",
                content: "Manuell behandling, fysisk aktivitet og håndtering av en stressende hverdag er noe av det vanligste osteopater jobber med. Osteopater benytter seg av et bredt spekter av manuelle behandlingsteknikker i hele kroppen. Teknikkene kan oppleves både lette og mer kraftfulle men det er viktig at behandlingene tilpasses deg og der du befinner deg i syklus, dagsform og i livet.",
            },
            {
                id: "tverrfaglig",
                heading: "Tverrfaglig",
                content: "Det unike på CMedical er at osteopatene jobber tett i tverrfaglig team med gynekolog og urolog om ulike gynekologiske og urologiske problemstillinger.\n\nVi holder tett dialog og skreddersyr din behandling.\n\nVi vurderer bekkenbunnsfunksjon som en del av oppfølgingen av kvinnen etter fødsel, mannen før / etter prostataoperasjon eller ved inkontinens, fremfall eller smerteproblematikk.",
            },
            {
                id: "mal-med-behandling",
                heading: "Mål med behandling",
                content: "Osteopaten er opptatt av å finne hva som er viktig for deg, og hvordan dere sammen kan skape en trygg arena der du kan bruke kroppen din på en god måte. Å skape en trygg arena for tillitsfull kommunikasjon og behandling er nødvendig for et godt resultat av behandlingen. Det er alltid et hovedmål ved hvert pasientmøte.",
            },
        ],
        relatedSpecialists: ["ingvild-skarpas-aannerud"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
            { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
        ],
    },
    "flere-fagomrader/plastikkirurgi": {
        title: "Plastikkirurgi",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Plastisk kirurgi kan hjelpe til med å gjenopprette kroppens form og funksjon etter for eksempel kreftsykdom, brannskader, graviditet og fødsel. Dette inkluderer inngrep som bukplastikk, brystkirurgi og andre rekonstruktive behandlinger. Vår plastiske kirurg har lang erfaring med løsninger godt tilpasset den enkelte pasient. Med avanserte teknikker og et trygt medisinsk miljø er du i de beste hender. Bestill en konsultasjon for en personlig vurdering og profesjonell veiledning.",
        themes: ["Bryst", "Kropp", "Ansikt", "Rekonstruksjon"],
        benefits: [
            "Bukplastikk og brystkirurgi",
            "Rekonstruktive behandlinger etter kreftsykdom",
            "Erfaren plastisk kirurg med individuelt tilpassede løsninger",
            "Avanserte teknikker i trygt medisinsk miljø",
        ],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
            { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
        ],
    },
    "flere-fagomrader/psykologi": {
        title: "Psykologi",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Du trenger ikke å ha en psykisk lidelse eller diagnose for å gå til psykolog. Mange ønsker å ha en nøytral samtalepartner over kortere eller lengre tid for å sortere tanker og følelser, eller motta støtte gjennom en utfordrende periode med f.eks. endometriose-, vulvodyni- eller fertilitetsbehandling. Hos oss jobber våre spesialister i unike tverrfaglige team for å hjelpe deg best mulig.",
        themes: ["Angst og depresjon", "Traumer", "Parterapi og relasjoner"],
        sections: [
            {
                id: "hva-kan-vi-hjelpe-med",
                heading: "Hva kan vi hjelpe med?",
                content: "Hos psykolog kan du få hjelp til å håndtere smerter, bearbeide vanskelige erfaringer, utforske identitet og seksualitet, og du kan bli utredet og behandlet for psykiske lidelser. Om det dukker opp andre plager som trenger videre oppfølging, kan en psykolog henvise deg til videre utredning og behandling."
            },
            {
                id: "fertilitetsradgivning",
                heading: "Fertilitetsrådgivning",
                content: "Kristian Ophaug har over 20 års erfaring som terapeut i spesialisthelsetjenesten, og har siden 2022 jobbet ved Kvinneklinikken på Rikshospitalet. Han er utdannet klinisk sosionom og familieterapeut, og spesialiserer seg innen psykisk helse i svangerskap og barsel.\n\nSiden 2018 har han jobbet med par som opplever ufrivillig barnløshet og har vært fertilitetsrådgiver ved IVF-avdelingen på Oslo Universitetssykehus. Som Norges eneste mannlige fertilitetsrådgiver gir han støtte til ufrivillig barnløse menn, og fokuserer på begge parter for å lette utfordringene i behandlingsprosessen.\n\nKristian hjelper kvinner og menn med å uttrykke og bearbeide følelser rundt ufrivillig barnløshet, og tilbyr verktøy for å håndtere de følelsesmessige utfordringene. Han gir også råd om hvordan par kan støtte hverandre gjennom prosessen, eller til enkeltpersoner som går gjennom det alene.\n\nSamtalene tilpasses individuelle behov, og Kristian gir veiledning for å normalisere tanker og følelser, samt verktøy for å håndtere sorg ved mislykkede forsøk eller spontanaborter."
            },
        ],
        relatedSpecialists: ["kristian-ophaug"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
            { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
        ],
    },
    "flere-fagomrader/revmatologi": {
        title: "Revmatologi",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Revmatologi er en spesialitet innen medisin som handler om å forstå og behandle problemer med ledd, muskler og bindevev i kroppen. Revmatologer utreder, behandler og følger opp pasienter med revmatisme. For å finne ut om du har revmatisme starter vi med grundig konsultasjon og undersøkelse, som ofte innebærer ultralyd og blodprøver. Har du plager, anbefaler vi deg å ta kontakt med oss eller bestille en konsultasjon. Diagnoser: Dette kan inkludere sykdommer der kroppens eget forsvarssystem angriper disse områdene, som for eksempel revmatoid artritt eller systemisk lupus erythematosus. Revmatologer (spesialleger) bruker forskjellige metoder som medisiner, fysisk terapi og livsstilsråd for å hjelpe mennesker med slike problemer og forbedre livskvaliteten. Vi tilbyr rask tilgang til ledende revmatologer for utredning og behandling av revmatisme.",
        themes: ["Leddgikt", "Artrose", "Bindevevssykdommer"],
        benefits: [
            "Erfarne revmatologer med spesialkompetanse",
            "Grundig utredning med ultralyd og blodprøver",
            "Behandling av revmatoid artritt og lupus",
            "Medisiner, fysisk terapi og livsstilsråd",
        ],
        relatedSpecialists: ["birgir-gudbrandsson"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
            { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
        ],
    },
    "flere-fagomrader/robotkirurgi": {
        title: "Robotassistert kirurgi",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: heroTech,
        description: "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden. Ved robotkirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde.\n\nVi tilbyr robotassistert kirurgi innen blant annet:\n- Muskelknuter (fertilitetsbevarende kirurgi)\n- Dyp endometriose\n- Hysterektomi, også ved forstørret livmor\n- Brokk\n- Godartet forstørret prostata (RASP)\n- Prostatakreft (RALP)",
        themes: ["Gynekologisk robotkirurgi", "Urologisk robotkirurgi", "Gastrokirurgisk robotkirurgi"],
        sections: [
            {
                id: "rask-rehabilitering",
                heading: "Rask rehabilitering",
                content: "Robotassistert kirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling.\n\n**En raskere vei til restitusjon:** Mange pasienter kan reise hjem allerede dagen etter inngrepet. Allerede samme kveld er det mulig å spise, bevege seg og føle seg mer som seg selv igjen.\n\n**Kortere sykemelding:** Avhengig av hvilken type jobb og hvilket inngrep du har gjennomgått, kan du forvente en sykemeldingsperiode på 2–6 uker. Kirurgen spesifiserer perioden per pasient. Sammenlignet med tradisjonell åpen kirurgi gir robotassistert kirurgi en raskere vei tilbake til hverdagen."
            },
            {
                id: "presisjon",
                heading: "Presisjon som merkes",
                content: "Med høyoppløselig 3D-kamera og avanserte instrumenter med stor presisjon har kirurgen svært god kontroll. Dette bidrar til skånsomhet og høy kvalitet i hvert inngrep. I bekkenet finnes det ømfintlig vev som lett kan skades under kirurgi, som ved nervesparende operasjoner ved dyp endometriose eller ved fjerning av prostata.\n\n**Ergonomi – også for kirurgen:** Under robotassistert kirurgi sitter kirurgen i en ergonomisk og komfortabel arbeidsstilling. Dette bidrar til økt konsentrasjon og mindre utmattelse, noe som igjen reduserer risikoen for feil.\n\n**Erfarne spesialister – trygg behandling:** Robotassistert kirurgi hos oss utføres av spesialister innen urologi og gynekologi. Målet er alltid det samme: å gi deg den tryggeste behandlingen og den best mulige opplevelsen både før, under og etter operasjonen."
            },
            {
                id: "safe-histology-surgery",
                heading: "Safe Histology Surgery",
                content: "Ved Safe Histology Surgery kombinerer vi skånsom robotassistert kirurgi med nøyaktig vevsdiagnostikk underveis i inngrepet. Det gir kirurgen mulighet til å tilpasse operasjonen presist til funnene, og bidrar til trygg og målrettet behandling.",
            },
        ],
        benefits: [
            "Eneste private aktør med robotassistert kirurgi i Norge",
            "da Vinci-systemet for maksimal presisjon",
            "Brukes innen gynekologi, urologi og gastrokirurgi",
            "Kortere sykehusopphold – hjem innen ett døgn",
            "Sykemeldingsperiode på 2–6 uker (kirurgen spesifiserer per pasient)",
            "Erfarne kirurger med høyt volum",
        ],
        relatedTitleOverride: "Vi behandler blant annet:",
        relatedAsServicesOverride: true,
        linkedServices: [
            {
                label: "Gynekologisk robotkirurgi",
                description: "Brukes blant annet ved muskelknuter (fertilitetsbevarende kirurgi), dyp endometriose, hysterektomi (også ved forstørret livmor), og enkelte krefttilfeller som kreft i livmor.",
                path: "/behandlinger/gynekologi/robotkirurgi",
                image: gynekologiImg,
            },
            {
                label: "Urologisk robotkirurgi",
                description: "Brukes blant annet ved godartet forstørret prostata (RASP), prostatakreft (RALP), og nyrekirurgi (f.eks. nefrektomi).",
                path: "/behandlinger/urologi/robotkirurgi",
                image: urologiImg,
            },
            {
                label: "Gastrokirurgisk robotkirurgi",
                description: "Brukes blant annet ved overvektskirurgi (slankeoperasjon med rSG og SASI) og brokkoperasjon (bl.a. lyskebrokk).",
                path: "/behandlinger/flere-fagomrader/gastrokirurgi",
                image: gastrokirurgiCardImg.url,
            },
        ],
        relatedSpecialists: ["bjorn-brennhovd", "nicolai-wessel", "thomas-fredrik-thaulow"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
            { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
        ],
    },
    "flere-fagomrader/sexologi": {
        title: "Sexologi",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Når man rammes av sykdom eller helseutfordringer, enten fysiske eller psykiske, kan det også oppstå utfordringer knyttet til seksuell helse. Dette kan dreie seg om seksuell funksjon, lyst, tenning, selvbilde, kroppsbilde, seksuell glede, relasjoner eller identitet. Seksualitetsrelaterte utfordringer påvirker ofte den generelle livskvaliteten.\n\nEn sexolog kan gjennom terapeutiske samtaler gi støtte, veiledning og råd til enkeltpersoner eller par som opplever vanskeligheter knyttet til seksuell trivsel og intimitet. Samtalene kan bidra til å utforske og håndtere det som oppleves som utfordrende, eller gi veiledning om seksualtekniske hjelpemidler.",
        themes: ["Samliv og relasjoner", "Seksuelle funksjonsplager", "Identitet og legning"],
        sections: [
            {
                id: "skreddersydd-veiledning",
                heading: "Skreddersydd veiledning",
                content: "Ved diagnoser som er assosiert med smerte og fysisk ubehag, gir en sexolog tilpasset veiledning for å håndtere disse utfordringene. Dette kan inkludere strategier for smertelindring, utforsking av alternative former for seksuell nytelse og styrking av kommunikasjonen om man er i et parforhold.\n\nFor par som opplever ufrivillig barnløshet, kan en sexologisk rådgiver hjelpe dem med å navigere gjennom det som er følelsesmessig utfordrende slik at intimiteten opprettholdes og stress reduseres."
            },
            {
                id: "kompetanseomrader",
                heading: "Kompetanseområder",
                content: "Vår sexolog Kjersti Margrete Finsrud er sykepleier med videreutdanning som helsesykepleier, og spesialist i sexologisk rådgivning gjennom NACS (Nordic Association of Clinical Sexology). Hun har særlig kompetanse innen:\n\n- Kvinnehelse: vulvasmerter, vaginisme, seksualitet etter overgrep og i overgangsalder\n- Seksuell identitet og orientering\n- Seksuell lyst og funksjonsutfordringer\n- Erektil dysfunksjon og prestasjonsrelaterte utfordringer\n- Hormonelle endringer gjennom ulike livsfaser\n- Veiledning om seksuelle hjelpemidler og NAV-refusjon\n- Prevensjon og seksuell helse hos unge og voksne\n\nKjersti har en helhetlig tilnærming til seksuell helse, der kropp, psyke og relasjoner ses i sammenheng. Hun er opptatt av å skape en trygg og åpen samtale, der det er rom for å dele også det som kan være vanskelig – uten skam eller tabu."
            },
        ],
        relatedSpecialists: ["kjersti-margrete-finsrud"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
            { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
        ],
    },
    "flere-fagomrader/areknuter": {
        title: "Åreknutebehandling",
        subtitle: "Ingen ventetid • Ingen henvisning",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Åreknuter er veldig vanlig, og nesten 30 % av alle over 30 år har det i varierende grad. Det er like vanlig med åreknuter hos menn som hos kvinner. Risikofaktorer for utvikling av åreknuter er for eksempel arv (genetisk), graviditet, overvekt, alder eller yrker som medfører ekstra belastninger (stående og sittende) på beina. Åreknuter oppstår i de overfladiske venene grunnet svikt i klaffene. Synlige åreknuter på forsiden og på innsiden av leggen/låret tyder på at årsaken kommer fra lysken (70 %). Åreknuter foran og/eller bak på leggen tyder på at årsaken kommer fra knehasen (20 %). I tillegg finnes det flere årsaker til utvikling av åreknuter (10 %). Noen få har flere årsaker eller en kombinasjon. Det vanligste er å ha åreknuter i bare ett bein, men 1/3 av alle med åreknuter har det i begge beina. En god undersøkelse med ultralyd vil avdekke årsakene, og du vil få tilpasset en moderne og effektiv behandling.\n\nSymptomer: Symptomer varierer fra person til person. Mange andre tilstander kan gi tilsvarende symptomer, og derfor er det vanskelig å garantere at alle symptomer forsvinner etter behandling. De vanligste symptomene er: smerter, tunge eller trøtte bein, prikkende ubehag, kløe, nattekramper i leggene. Hevelse: Lindres symptomene dine ved bruk av støttestrømper, gir det en bedre prognose for lindring. Hvis du ikke ønsker behandling etter konsultasjon, anbefaler vi støttestrømper – men disse vil kun lindre symptomer, aldri fjerne åreknutene. Støttestrømper (klasse 2) kjøpes hos ulike apotek, men vi anbefaler personlig oppmøte hos bandagist.",
        themes: ["Sklerosering", "Laserbehandling", "Kirurgisk fjerning"],
        benefits: [
            "En av Norges mest erfarne kar- og åreknutekirurger",
            "Over 2000 pasienter operert",
            "Grundig ultralydundersøkelse",
            "Moderne, skånsomme behandlingsmetoder",
            "Kort rekonvalesens",
        ],
        relatedSpecialists: ["einar-andre-brevik"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
            { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
            { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
        ],
    },

    // ==========================================
    // GRAVIDITET
    // ==========================================
    "graviditet/ultralyd": {
        title: "Ultralyd i svangerskapet",
        subtitle: "Tidlig ultralyd, terminbekreftelse og organrettet ultralyd.",
        parentCategory: "Graviditet",
        heroImage: heroPregnancy,
        description: "Vi tilbyr ultralydundersøkelser gjennom hele svangerskapet, fra tidlig ultralyd i uke 7 til organrettet ultralyd i uke 18-20. Våre fostermedisinere bruker det nyeste utstyret for best mulig bildekvalitet og diagnostikk.\n\nTidlig ultralyd bekrefter svangerskapet, daterer terminen og vurderer fosterets utvikling. Ved organrettet ultralyd gjennomgås fosterets organer systematisk for å avdekke eventuelle avvik.",
        benefits: [
            "Tidlig ultralyd fra uke 7 for å bekrefte svangerskap og termin",
            "Organrettet ultralyd uke 18-20 med detaljert gjennomgang",
            "Erfarne fostermedisinere med spisskompetanse",
            "Moderne utstyr for best mulig bildekvalitet",
            "Kort ventetid – time innen få dager",
        ],
        sections: [
            {
                heading: "Slik foregår ultralydundersøkelsen",
                content: "Vi skiller mellom tidlig ultralyd uke 6–10, uke 11–14, og ultralyd fra uke 14+0. Tidlig ultralyd uke 6–10 utføres ved hjelp av en innvendig probe. Dette er helt ufarlig og smertefritt for både barnet og deg. Fra uke 11 utføres ultralyd med utvendig (abdominal) ultralydprobe.",
            },
            {
                heading: "Hvis undersøkelsen viser noe uventet",
                content: "Om undersøkelsen viser tegn på alvorlig sykdom eller skader hos fostret, vil du få veiledning og samtale med lege, og eventuelt henvisning til fostermedisinsk avdeling ved sykehuset.",
            },
            {
                heading: "Du bestemmer hva du er komfortabel med",
                content: "Dersom du ønsker, er det fullt mulig å ta med seg en partner eller en støttespiller til ultralydtimen. Ved tidlig ultralydundersøkelse vil du få være avskjermet. Hos oss er det viktig at du føler deg komfortabel og trygg.",
            },
            {
                heading: "Erfarne fostermedisinere",
                content: "Hos oss møter du høyt kompetente, erfarne og dedikerte gynekologer med spesialisering innen fostermedisin, også kalt fostermedisinere.",
            },
        ],
        process: [
            { title: "Tidlig ultralyd (uke 6–10)", description: "Bekreftelse av svangerskap, datering av termin, antall fostre og hjerteaktivitet. Utføres med innvendig probe." },
            { title: "Ultralyd uke 11–14", description: "Vurdering av fosterets utvikling, kan kombineres med nakketranslusensmåling og blodprøve." },
            { title: "Organrettet ultralyd (uke 18–20)", description: "Systematisk gjennomgang av fosterets organer, vekst og fostervannsvolum med utvendig probe." },
        ],
        faqs: [
            { question: "Når kan jeg ta første ultralyd?", answer: "Tidlig ultralyd kan utføres fra uke 7. Da kan vi se fosterets hjerteaktivitet og beregne termin." },
            { question: "Hva koster ultralyd i svangerskapet?", answer: "Se vår prisliste for oppdaterte priser. Kontakt oss gjerne for mer informasjon." },
            { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte uten henvisning." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "graviditet/nipt": {
        title: "NIPT",
        subtitle: "Non-Invasive Prenatal Test fra svangerskapsuke 10.",
        parentCategory: "Graviditet",
        heroImage: heroPregnancy,
        description: "Fra og med svangerskapsuke 10 kan du ta NIPT-test og tidlig ultralyd hos oss. NIPT er en forkortelse for Non-Invasive Prenatal Test. Ved hjelp av en blodprøve fra armen til mor, kombinert med en ultralydundersøkelse, kan man undersøke om fosteret har trisomi 13, 18 eller 21, også kjent som kromosomavvik. Da vi kun trenger en blodprøve fra mor, er det ingen økt risiko for abort, slik det for eksempel kan være ved morkakeprøve eller fostervannsprøve.\n\n[Dr. Ashi Ahmad](/spesialister/ashi-ahmad) hos oss har fått virksomhetsgodkjenning for å tilby fosterdiagnostikk til gravide kvinner. Ashi Ahmad er spesialist i gynekologi og fødselshjelp og har doktorgrad i epidemiologi og fødselshjelp.\n\nNIPT er en del av vårt tilbud innen fostermedisin.\n\nBestill konsultasjon eller ta kontakt hvis du lurer på noe.",
        sections: [
            {
                heading: "Hva undersøker NIPT?",
                content: "Ved hjelp av en blodprøve fra armen til mor, kombinert med en ultralydundersøkelse, kan man undersøke om fosteret har trisomi 13, 18 eller 21, også kjent som kromosomavvik.",
            },
            {
                heading: "Er NIPT trygt?",
                content: "Da vi kun trenger en blodprøve fra mor, er det ingen økt risiko for abort, slik det for eksempel kan være ved morkakeprøve eller fostervannsprøve.",
            },
            {
                heading: "Fosterdiagnostikk hos spesialist",
                content: "Dr. Ashi Ahmad hos oss har fått virksomhetsgodkjenning for å tilby fosterdiagnostikk til gravide kvinner. Ashi Ahmad er spesialist i gynekologi og fødselshjelp og har doktorgrad i epidemiologi og fødselshjelp.",
            },
        ],
    },


    "graviditet/svangerskapsteam": {
        title: "Svangerskapsteam",
        subtitle: "Tverrfaglig oppfølging gjennom svangerskapet.",
        parentCategory: "Graviditet",
        heroImage: heroPregnancy,
        description: "Vårt svangerskapsteam gir deg helhetlig oppfølging gjennom hele svangerskapet. Teamet består av erfarne fostermedisinere, jordmødre og gynekologer som samarbeider for å gi deg den tryggeste oppfølgingen.\n\nVi tilbyr skreddersydd svangerskapskontroll tilpasset dine behov, enten du ønsker ekstra oppfølging eller har en risikograviditet.",
        benefits: [
            "Erfarne fostermedisinere og jordmødre",
            "Skreddersydd oppfølging tilpasset dine behov",
            "Oppfølging av risikosvangersskap",
            "Tilgjengelig for spørsmål gjennom hele svangerskapet",
            "Samarbeid med fødeavdeling ved behov",
        ],
        faqs: [
            { question: "Hva inkluderer svangerskapsoppfølging?", answer: "Regelmessige kontroller med blodprøver, blodtrykk, urinprøve, ultralyd og samtale om trivsel og forberedelse til fødsel." },
            { question: "Kan jeg velge dere i stedet for fastlegen?", answer: "Ja, du kan velge privat svangerskapsoppfølging hos oss som supplement eller alternativ til oppfølging hos fastlege/jordmor." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "graviditet/fosterdiagnostikk": {
        title: "Fosterdiagnostikk",
        subtitle: "Avansert diagnostikk for trygt svangerskap.",
        parentCategory: "Graviditet",
        heroImage: heroPregnancy,
        description: "Fosterdiagnostikk omfatter ulike undersøkelser for å vurdere fosterets helse og utvikling. Vi tilbyr et bredt spekter av diagnostiske metoder, fra ultralydundersøkelser og blodprøver til mer avanserte tester.\n\nVåre fostermedisinere har lang erfaring og spisskompetanse innen prenatal diagnostikk og kan gi deg trygg veiledning basert på dine resultater.",
        benefits: [
            "Erfarne fostermedisinere med spisskompetanse",
            "KUB-test (kombinert ultralyd og blodprøve)",
            "NIPT for høy-presisjons screening",
            "Detaljert ultralyd med moderne utstyr",
            "Grundig veiledning og rådgivning",
        ],
        faqs: [
            { question: "Hva er KUB-test?", answer: "KUB (Kombinert Ultralyd og Blodprøve) er en screeningtest i uke 11-14 som vurderer risiko for kromosomavvik basert på nakketranslusensmåling og blodprøver." },
            { question: "Er fosterdiagnostikk frivillig?", answer: "Ja, all fosterdiagnostikk er frivillig. Vi gir deg grundig informasjon slik at du kan ta et informert valg." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },

    // ==========================================
    // FLERE FAGOMRÅDER - tillegg
    // ==========================================
    "flere-fagomrader/hudhelse": {
        title: "Hudhelse",
        subtitle: "Hudpleie, hudforyngelse og dermatologisk rådgivning.",
        parentCategory: "Flere fagområder",
        heroImage: flereFagImg,
        description: "Dermatologi og venerologi er et medisinsk fagfelt som omhandler hud, hår, negler og slimhinner, og hvordan ulike tilstander påvirker hudhelsen. Vi utreder og behandler et bredt spekter av hudlidelser, fra vanlige tilstander som akne, eksem, rosacea, perioral dermatitt og psoriasis, til mer komplekse diagnoser som hudkreft og autoimmune tilstander i huden.\n\nI tillegg tilbys behandling av vorter, overdreven svette og solskader, samt føflekksjekk og fjerning ved behov. Vi tilbyr en grundig vurdering og behandling tilpasset din hud og dine behov, enten du søker medisinsk hjelp eller ønsker faglig rådgivning for sunnere hud.\n\nHudhelse, rådgivning og ulike former for hudbehandling tilbys kun på CMedical Bekkestua.",
        benefits: [
            "Erfarne hudleger (dermatologer) med bred kompetanse",
            "Behandling av akne, eksem, rosacea og psoriasis",
            "Føflekksjekk og hudkreftscreening",
            "Hudpleierådgivning tilpasset dine behov",
            "Tilbys på CMedical Bekkestua",
        ],
        linkedServices: [
            { label: "Hudbehandlinger", description: "Medisinsk forankrede hudbehandlinger utført av hudlege — pigment, rødhet, struktur, volum og føflekksjekk.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" },
            { label: "Behandlingsutstyr", description: "IPL- og laserteknologi vi bruker — trygg behandling basert på dokumenterte metoder.", path: "/behandlinger/flere-fagomrader/behandlingsutstyr" },
            { label: "Hudpleieprodukter", description: "SkinCeuticals og medisinsk hudpleie anbefalt av hudlege — for daglig stell og oppfølging hjemme.", path: "/behandlinger/flere-fagomrader/hudpleieprodukter" },
        ],
        faqs: [
            { question: "Hvor tilbys hudhelse?", answer: "Hudhelse, rådgivning og ulike former for hudbehandling tilbys kun på CMedical Bekkestua." },
            { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte uten henvisning." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },
    "flere-fagomrader/overvektskirurgi": {
        title: "Overvektskirurgi (slankeoperasjon)",
        subtitle: "Presisjon, trygghet og varige resultater",
        parentCategory: "Flere fagområder",
        heroImage: overvektskirurgiHero.url,
        description: "Som den eneste private aktøren i Norden tilbyr vi robotassistert overvektskirurgi med høyeste presisjon og skånsomhet. Med avansert 3D-visualisering og mikrobevegelser styrt av erfarne kirurger, får du en trygg behandling som kan gi mindre smerter og raskere restitusjon.\n\nEtter ett år kan pasienter forvente et vekttap på 20–25 % av total kroppsvekt, samt en varig forbedring av helserelatert livskvalitet.",
        sections: [
            {
                id: "operasjonsmetoder",
                heading: "Våre operasjonsmetoder",
                content: "Vi tilbyr to ulike typer robotassistert overvektskirurgi.\n\n**1. Robotassistert Sleeve-gastrektomi (rSG)**\n\nDette er en moderne form for kikkhullskirurgi der 60–80 % av magesekken fjernes. Den gjenværende delen formes til en bananformet «sleeve» (slange) som begrenser matinntaket. Dette gir mindre sultfølelse og fører til betydelig vektreduksjon, uten å gå på kompromiss med kroppens evne til å ta opp næringsstoffer.\n\n**2. SASI – Robotassistert Sleeve Bypass**\n\nSASI står for Single Anastomosis Sleeve Ileal Bypass. Her formes også magesekken til en «sleeve», men i tillegg lages det en kobling direkte til den nedre delen av tynntarmen, uten at tarmen deles. Maten kan dermed følge to ulike løp ut av magesekken. At deler av maten følger den normale veien utgjør en stor fordel sammenlignet med en standard gastric bypass.\n\n**Viktig å understreke:** Det er ikke en robot som opererer deg selvstendig. Hele prosedyren styres av en erfaren kirurg som sitter ved en konsoll med høyoppløselig 3D-bilde. Den nyeste teknologien oversetter kirurgens hånd-, håndledd- og fingerbevegelser til mikrobevegelser i instrumentene, noe som gir enestående kontroll og nøyaktighet.",
            },
            {
                id: "fordeler",
                heading: "Fordeler med robotassistert kirurgi",
                content: "- Mindre smerter og kortere restitusjonstid enn ved tradisjonell kirurgi.\n- Redusert blodtap og færre komplikasjoner.\n- Bedre kosmetisk resultat gjennom små, skånsomme snitt i bukveggen.\n- Raskere tilbake i hverdagen – mange reiser hjem allerede dagen etter operasjonen.\n- Kortere sykemelding – cirka fire uker (men for noen kortere).",
            },
            {
                id: "veien-gjennom-behandlingen",
                heading: "Veien gjennom behandlingen: Forberedelser og oppfølging",
                content: "Godt forarbeid og tett oppfølging gir de beste resultatene.\n\n**Før operasjonen:** Du møter vårt erfarne, tverrfaglige team for en grundig poliklinisk samtale. Du følger en medisinsk lavkaloridiétt i tre uker før operasjonsdagen.\n\n**Selve operasjonsdagen:** Inngrepet gjøres skånsomt via kikkhullskirurgi og tar ca. 30–60 minutter. Du tilbringer én natt hos oss til observasjon og reiser hjem neste formiddag.\n\n**Etter operasjonen:** Du får tett oppfølging. Inkludert i operasjonsprisen er en omfattende oppfølgingspakke på ett år med 4 konsultasjoner hos klinisk ernæringsfysiolog.",
            },
            {
                id: "trygg-behandling",
                heading: "Trygg behandling hos erfarne spesialister",
                content: "**Dr. Jan Roland Lambrecht:** Over 25 års erfaring fra Norge og Danmark. En anerkjent ekspert innen overvektskirurgi, brokkirurgi og robotassistert kirurgi, som også utdanner neste generasjons kirurger.\n\n**Dr. Andreas Edenberg:** Spesialist i generell- og gastrokirurgi med særlig kompetanse på fedmebehandling og avansert endoskopi.",
            },
            {
                id: "bestill",
                heading: "Bestill konsultasjon",
                content: "Bestill en gratis digital førstekonsultasjon her.",
            },
        ],
        linkedServices: [
            { label: "Mage- og tarmlidelser (Gastrokirurgi)", description: "Bredere oversikt over kirurgi i fordøyelsessystemet.", path: "/behandlinger/flere-fagomrader/gastrokirurgi" },
            { label: "Brokkoperasjon", description: "Skånsom behandling av lyskebrokk, arrbrokk og navlebrokk med kikkhull/robot.", path: "/behandlinger/flere-fagomrader/gastrokirurgi/brokkoperasjon" },
            { label: "Hemorroider og endetarmsplager (rektocele)", description: "Spesialistkompetanse på plager i endetarm og bekkenbunn.", path: "/behandlinger/flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager" },
            { label: "Ernæringsfysiolog", description: "Tverrfaglig kostholdsoppfølging før og etter operasjon.", path: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
        ],
        relatedSpecialists: ["jan-roland-lambrecht", "andreas-edenberg"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
            { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer. Etter overvektskirurgi er du vanligvis sykemeldt i ca. 4 uker (kortere for noen)." },
            { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
            { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
        ],
    },



    // ==========================================
    // FERTILITET — Assistert befruktning for par og single (Prompt 2)
    // ==========================================
    "fertilitet/assistert-befruktning-for-par-og-single": {
        title: "Assistert befruktning for par og single",
        subtitle: "For par, to kvinner, single kvinner og menn",
        parentCategory: "Fertilitet",
        heroImage: fertilitetImg,
        description: "Hos oss er det plass til ulike veier til det samme ønsket – å få barn. Assistert befruktning kan benyttes av mann og kvinne i parforhold, to kvinner i parforhold, og kvinner som ønsker å bli mor på egen hånd nå eller bevare mulighetene for å bli gravid i fremtiden. Uansett livssituasjon møter vi deg eller dere med respekt, trygghet og forståelse.",
        sections: [
            {
                heading: "Hvem kan få hjelp hos oss?",
                content: "Hos oss er det plass til ulike veier til det samme ønsket – å få barn. Assistert befruktning kan benyttes av mann og kvinne i parforhold, to kvinner i parforhold, og kvinner som ønsker å bli mor på egen hånd nå eller bevare mulighetene for å bli gravid i fremtiden. Uansett livssituasjon møter vi deg eller dere med respekt, trygghet og forståelse. Noen har prøvd lenge uten å lykkes. Andre er helt i startfasen og ønsker å vite mer om mulighetene. For mange kan det være et stort steg å ta kontakt – derfor er vi opptatt av å gjøre veien inn så trygg og forutsigbar som mulig. Rammene for behandling er regulert av Bioteknologiloven. For kvinner er øvre aldersgrense ved inseminasjon eller innsetting av befruktet egg satt til 46 år. I forkant av behandling må alle testes for hepatitt B og C samt HIV. Blodprøvene må være tatt i løpet av de siste 24 månedene før oppstart av IVF-behandling.",
            },
            {
                heading: "Mann og kvinne i parforhold — Har dere prøvd en stund uten å lykkes?",
                content: "Mange av parene som kommer til oss har forsøkt å bli gravide over tid. Uansett hvor dere er i prosessen, møter vi dere med forståelse og respekt. Et trygt første steg: Noen ønsker å starte med en uforpliktende samtale, mens andre er klare for fertilitetsutredning. Første gang setter vi av god tid, så dere kan senke skuldrene og bli godt ivaretatt. Vi blir kjent med dere som par: I første konsultasjon ønsker vi å forstå helheten – hvor lenge dere har prøvd, om dere har barn fra før, hva dere håper på, og hvordan dere opplever situasjonen. Undersøkelser som gir svar: For kvinnen ofte blodprøver for hormonnivå + gynekologisk undersøkelse og ultralyd. For mannen: sædprøve for vurdering av sædkvalitet. Veien videre – tilpasset dere: Noen ganger finner vi ingen konkret årsak, og det kan i seg selv gi trygghet til å fortsette på egen hånd. Andre ganger anbefaler vi behandling. Mulige alternativer: hormonstimulering, inseminasjon, IVF (prøverørsbehandling), donorsæd (ved behov). Vi tilpasser behandlingen til dere som par, basert på behov og situasjon, og er her for å støtte dere begge hele veien.",
            },
            {
                heading: "To kvinner i parforhold — Flere og flere kvinner velger å få barn sammen som par.",
                content: "Hos oss møter dere et fagmiljø med erfaring, trygghet og forståelse. Når dere tar kontakt, starter vi med en samtale hvor vi blir kjent med dere og deres ønsker. Sammen finner vi ut hvilken behandling som passer best og hvordan prosessen kan tilpasses deres liv. Donorsæd – trygt og oversiktlig: Vi hjelper dere gjennom hele prosessen – valg av donor i tråd med gjeldende lovverk, bestilling, transport og trygg oppbevaring av donorsæd, og oppfølging underveis. Behandlingsalternativer: Inseminasjon – ofte førstevalg, skånsom behandling, kan gjøres i naturlig syklus. IVF (prøverørsbehandling) – aktuelt dersom inseminasjon ikke gir ønsket resultat, høyere sannsynlighet per forsøk, mulighet for å fryse befruktede egg. En prosess på deres premisser: Vi tilpasser behandlingen til dere og deres livssituasjon – og er samtidig en trygg støtte gjennom en prosess som kan romme både forventning, sårbarhet og håp.",
            },
            {
                heading: "Singel kvinne — Ønsker du å få barn på egen hånd, eller bevare muligheten for senere?",
                content: "Å velge å få barn alene er et stort og viktig valg. Mange kvinner kommer til oss for å utforske mulighetene – enten de er klare for behandling, ønsker mer kunnskap, eller vurderer å fryse ned egg for fremtiden. Vi møter deg med respekt og trygghet, og tilpasser behandling og oppfølging til din situasjon.",
            },
        ],
        linkedServices: [
            { label: "Fertilitetsutredning", description: "Grundig kartlegging av fertiliteten — et trygt første steg.", path: "/behandlinger/fertilitet/fertilitetsutredning" },
            { label: "Assistert befruktning", description: "IVF, ICSI og IUI — vår hovedside om assistert befruktning.", path: "/behandlinger/fertilitet/assistert-befruktning" },
            { label: "Eggfrys", description: "Bevar muligheten for graviditet senere i livet.", path: "/behandlinger/fertilitet/eggfrys" },
        ],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
            { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Ta kontakt med oss så finner vi en tid som passer deg." },
            { question: "Aldersgrense", answer: "Øvre aldersgrense for kvinner ved inseminasjon eller innsetting av befruktet egg er 46 år, jf. Bioteknologiloven." },
            { question: "Donorsæd", answer: "Behandlingen skjer med donorsæd fra godkjente sædbanker. Etter norsk lov er donor ikke anonym, og barnet har rett til informasjon senere i livet." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },

    // ==========================================
    // HUDHELSE — Hudbehandlinger (Prompt 4)
    // ==========================================
    "flere-fagomrader/hudbehandlinger": {
        title: "Hudbehandlinger",
        subtitle: "Medisinsk forankrede hudbehandlinger utført av hudlege",
        parentCategory: "Hudhelse",
        heroImage: flereFagImg,
        description: "Hos CMedical på Bekkestua tilbyr vi et utvalg hudbehandlinger som utføres av hudlege — medisinsk forankret og tilpasset deg.",
        sections: [
            {
                id: "om-hudbehandlinger",
                heading: "Om hudbehandlinger",
                content: "Hos CMedical på Bekkestua tilbyr vi et utvalg hudbehandlinger som utføres av hudlege. Behandlingene er medisinsk forankret og tilpasses individuelt, med mål om å ivareta hudens helse samtidig som vi kan forbedre hudkvalitet og redusere synlige hudforandringer.\n\nVåre behandlinger tar utgangspunkt i medisinsk kunnskap om hud og utføres alltid etter en faglig vurdering hos hudlege. Hos oss møter du hudlege med erfaring innen både medisinsk og kosmetisk dermatologi.\n\nDersom du ønsker vurdering av hudforandringer eller informasjon om kosmetiske behandlinger, kan du bestille en konsultasjon hos hudlege. Under konsultasjonen vurderer vi hudens tilstand og gir råd om hvilke behandlinger som eventuelt kan være aktuelle. Behandlingene utføres ved vår klinikk på Bekkestua.\n\nVår tilnærming:\n\n- medisinsk vurdering før behandling\n- behandling utført av hudlege\n- naturlige og balanserte resultater\n- hudhelse på kort og lang sikt\n- trygg behandling basert på dokumenterte metoder\n\nFør en kosmetisk behandling gjennomføres, gjør hudlegen en medisinsk vurdering av huden. I noen tilfeller kan hudforandringer skyldes en underliggende hudsykdom som bør behandles på annen måte. Dette skiller behandling hos hudlege fra rene estetiske klinikker.",
            },
        ],
        linkedServices: [
            { label: "Pigmentforandringer og solskader", description: "Vurdering og behandling av pigmentflekker og solskadet hud — inkludert IPL.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/pigmentforandringer-og-solskader" },
            { label: "Rødhet og synlige blodkar", description: "Behandling av rosacea-relatert rødhet og sprengte blodkar i ansiktet.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/rodhet-og-synlige-blodkar" },
            { label: "Forbedring av hudstruktur", description: "Microneedling, mesoterapi og behandlinger som stimulerer hudens egen fornyelse.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/forbedring-av-hudstruktur" },
            { label: "Hudhelse og kosmetisk dermatologi", description: "Medisinske hudtilstander og kosmetisk dermatologi — vurdert av hudlege.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/kosmetisk-dermatologi" },
            { label: "Elastisitet og volum", description: "Rynkebehandling, Profhilo, Radiesse og Skin boosters tilpasset deg.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/elastisitet-og-volum" },
            { label: "Føflekksjekk", description: "Grundig dermatoskopisk vurdering av føflekker og hudforandringer.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/foflekksjekk" },
        ],
        faqs: [
            { question: "Hvor utføres behandlingene?", answer: "Alle hudbehandlinger utføres ved vår klinikk på Bekkestua." },
            { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte uten henvisning." },
            { question: "Vurderes huden alltid medisinsk først?", answer: "Ja. Før en kosmetisk behandling gjennomføres, gjør hudlegen en medisinsk vurdering av huden." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." },
        ],
    },

    // ─── Hudbehandlinger-undersider (egne sider under Hudhelse › Hudbehandlinger) ───
    "flere-fagomrader/hudbehandlinger/pigmentforandringer-og-solskader": {
        title: "Pigmentforandringer og solskader",
        subtitle: "Vurdering og behandling hos hudlege",
        parentCategory: "Hudbehandlinger",
        heroImage: flereFagImg,
        description: "Pigmentflekker og ujevn hudtone er vanlig etter mange år med solpåvirkning. Hos hudlege kan slike hudforandringer vurderes og behandles.",
        sections: [
            {
                id: "om",
                heading: "Om behandlingen",
                content: "Pigmentflekker og ujevn hudtone er vanlig etter mange år med solpåvirkning. Hos hudlege kan slike hudforandringer vurderes og behandles. Vi tilbyr blant annet:\n\n- IPL-behandling av pigmentflekker\n- behandling av solskadet hud\n- vurdering av pigmentforandringer\n\nFør behandling vurderer hudlegen alltid flekkene medisinsk.",
            },
        ],
        linkedServices: [
            { label: "Hudbehandlinger", description: "Tilbake til oversikten over alle hudbehandlinger.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" },
        ],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte uten henvisning." },
            { question: "Vurderes flekkene først?", answer: "Ja, hudlegen vurderer alltid pigmentforandringer medisinsk før behandling." },
        ],
    },

    "flere-fagomrader/hudbehandlinger/rodhet-og-synlige-blodkar": {
        title: "Rødhet og synlige blodkar",
        subtitle: "Behandling hos hudlege på Bekkestua",
        parentCategory: "Hudbehandlinger",
        heroImage: flereFagImg,
        description: "Diffus rødhet i huden og sprengte blodkar er vanlig i ansiktet. Dette kan blant annet skyldes rosacea eller solpåvirkning.",
        sections: [
            {
                id: "om",
                heading: "Om behandlingen",
                content: "Diffus rødhet i huden og sprengte blodkar er vanlig i ansiktet. Dette kan blant annet skyldes rosacea eller solpåvirkning. Aktuelle behandlinger:\n\n- IPL-behandling av rødhet\n- behandling av sprengte blodkar\n- behandling av diffus rødhet i ansiktet",
            },
        ],
        linkedServices: [
            { label: "Hudbehandlinger", description: "Tilbake til oversikten over alle hudbehandlinger.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" },
        ],
        faqs: [
            { question: "Hvor utføres behandlingen?", answer: "På CMedical Bekkestua, av hudlege." },
            { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille en uforpliktende vurdering direkte." },
        ],
    },

    "flere-fagomrader/hudbehandlinger/forbedring-av-hudstruktur": {
        title: "Forbedring av hudstruktur",
        subtitle: "Microneedling, mesoterapi og målrettede behandlinger",
        parentCategory: "Hudbehandlinger",
        heroImage: flereFagImg,
        description: "Noen opplever ujevn hudtekstur, aknearr eller redusert glød i huden. I slike tilfeller kan behandlinger som stimulerer hudens egen fornyelse være aktuelt.",
        sections: [
            {
                id: "om",
                heading: "Om behandlingen",
                content: "Noen opplever ujevn hudtekstur, aknearr eller redusert glød i huden. I slike tilfeller kan behandlinger som stimulerer hudens egen fornyelse være aktuelt. Vi tilbyr blant annet:\n\n- microneedling\n- mesoterapi\n- behandling for jevnere hudtone",
            },
        ],
        linkedServices: [
            { label: "Hudbehandlinger", description: "Tilbake til oversikten over alle hudbehandlinger.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" },
        ],
        faqs: [
            { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte." },
            { question: "Hvem utfører behandlingen?", answer: "Behandlingen utføres av hudlege ved vår klinikk på Bekkestua." },
        ],
    },

    "flere-fagomrader/hudbehandlinger/kosmetisk-dermatologi": {
        title: "Hudhelse og kosmetisk dermatologi",
        subtitle: "Medisinske hudtilstander og kosmetisk dermatologi",
        parentCategory: "Hudbehandlinger",
        heroImage: flereFagImg,
        description: "Ved CMedical arbeider vi både med medisinske hudtilstander og kosmetisk dermatologi.",
        sections: [
            {
                id: "om",
                heading: "Om behandlingen",
                content: "Ved CMedical arbeider vi både med medisinske hudtilstander og kosmetisk dermatologi. Mange pasienter oppsøker oss for tilstander som:\n\n- akne\n- perioral dermatitt\n- pigmentforandringer\n- solskadet hud\n- hudforandringer som bør vurderes av hudlege\n\nKosmetiske behandlinger kan i noen tilfeller være en del av en helhetlig behandling av huden.",
            },
        ],
        linkedServices: [
            { label: "Hudbehandlinger", description: "Tilbake til oversikten over alle hudbehandlinger.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" },
        ],
        faqs: [
            { question: "Hvem behandler meg?", answer: "Du møter hudlege med erfaring innen både medisinsk og kosmetisk dermatologi." },
            { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte uten henvisning." },
        ],
    },

    "flere-fagomrader/hudbehandlinger/elastisitet-og-volum": {
        title: "Elastisitet og volum",
        subtitle: "Individuelt tilpassede behandlinger hos hudlege",
        parentCategory: "Hudbehandlinger",
        heroImage: flereFagImg,
        description: "Med alderen reduseres hudens elastisitet og volum. Vi tilbyr behandlinger som kan bidra til å redusere synlige linjer og gi bedre hudstruktur.",
        sections: [
            {
                id: "om",
                heading: "Om behandlingen",
                content: "Med alderen reduseres hudens elastisitet og volum. Vi tilbyr behandlinger som kan bidra til å redusere synlige linjer og gi bedre hudstruktur. Aktuelle behandlinger kan inkludere:\n\n- rynkebehandling\n- Profhilo\n- Radiesse\n- behandling av slapp hud\n- Skin boosters\n\nBehandlingen tilpasses individuelt etter hudtype, alder og ønsket resultat.",
            },
        ],
        linkedServices: [
            { label: "Hudbehandlinger", description: "Tilbake til oversikten over alle hudbehandlinger.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" },
        ],
        faqs: [
            { question: "Hvem utfører behandlingen?", answer: "Behandlingen utføres av hudlege ved vår klinikk på Bekkestua." },
            { question: "Tilpasses behandlingen?", answer: "Ja, behandlingen tilpasses individuelt etter hudtype, alder og ønsket resultat." },
        ],
    },

    "flere-fagomrader/hudbehandlinger/foflekksjekk": {
        title: "Føflekksjekk",
        subtitle: "Grundig dermatoskopisk vurdering hos hudlege",
        parentCategory: "Hudbehandlinger",
        heroImage: flereFagImg,
        description: "Regelmessig kontroll av føflekker er viktig for å oppdage tidlige tegn på hudforandringer som kan kreve behandling.",
        sections: [
            {
                id: "om",
                heading: "Om føflekksjekken",
                content: "Regelmessig kontroll av føflekker er viktig for å oppdage tidlige tegn på hudforandringer som kan kreve behandling. Hos CMedical utfører hudlegen en grundig gjennomgang av hele huden, fra topp til tå.\n\nUnder en føflekksjekk bruker hudlegen et dermatoskop – et spesialisert optisk verktøy som gir forstørret og detaljert innsyn i hudens strukturer. Dette gjør det mulig å vurdere føflekker og andre hudforandringer med langt større nøyaktighet enn ved vanlig øyeundersøkelse.\n\nHudlegen ser etter spesifikke endringer i form, farge, grenser og struktur som kan tyde på malignitet eller andre tilstander som bør følges opp.",
            },
            {
                id: "indikasjoner",
                heading: "Aktuelle indikasjoner for føflekksjekk",
                content: "- kontroll av eksisterende føflekker og pigmentforandringer\n- vurdering av nye eller endrede hudlesjoner\n- screening ved høy soleksponering eller familiær hudkrefthistorikk\n- jevnlig oppfølging for pasienter med mange føflekker\n\nUndersøkelsen er ikke-invasiv og gjennomføres i løpet av konsultasjonen. Dersom hudlegen finner forandringer som bør utredes videre eller fjernes, vil du få råd om neste steg.",
            },
        ],
        linkedServices: [
            { label: "Hudbehandlinger", description: "Tilbake til oversikten over alle hudbehandlinger.", path: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger" },
        ],
        faqs: [
            { question: "Er undersøkelsen invasiv?", answer: "Nei, føflekksjekken er ikke-invasiv og gjennomføres i løpet av konsultasjonen." },
            { question: "Hva skjer hvis det oppdages noe?", answer: "Dersom hudlegen finner forandringer som bør utredes videre eller fjernes, får du råd om neste steg." },
            { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte." },
        ],
    },

    // ==========================================
    // HUDHELSE — Behandlingsutstyr (Prompt 5)
    // ==========================================
    "flere-fagomrader/behandlingsutstyr": {
        title: "Behandlingsutstyr (IPL)",
        subtitle: "Laser- og IPL-behandling utført av hudlege",
        parentCategory: "Hudhelse",
        heroImage: flereFagImg,
        description: "Hos CMedical Bekkestua tilbyr vi laserbehandling og IPL-behandling (Intense Pulsed Light) — en trygg og effektiv metode som bruker lysenergi til å behandle ulike hudplager. Mange oppsøker oss for å få hjelp med rødhet, synlige blodkar, pigmentforandringer eller solskadet hud. Behandlingen kan også bidra til en jevnere hudtone og bedre hudkvalitet over tid.",
        sections: [
            {
                heading: "En skånsom behandling for bedre hudhelse",
                content: "For oss handler IPL om hudhelse og livskvalitet. Ujevn pigmentering, rosacea eller vedvarende rødhet kan være mer enn et kosmetisk problem — det kan påvirke både velvære og selvtillit. Vi møter deg med forståelse og medisinsk kompetanse, og vurderer alltid om IPL er riktig behandling for deg.",
            },
            {
                heading: "Trygghet, informasjon og realistiske forventninger",
                content: "Behandlingen utføres av hudlege, og vi legger vekt på trygghet, informasjon og realistiske forventninger.",
            },
            {
                heading: "Bestill en uforpliktende vurdering",
                content: "Ønsker du å vite om IPL kan være et godt alternativ for deg? Ta kontakt med Linnea hos oss for en uforpliktende vurdering — vi hjelper deg gjerne.",
            },
        ],
        linkedServices: [
            { label: "Hudbehandlinger", description: "Oversikt over alle våre hudbehandlinger.", path: "/behandlinger/flere-fagomrader/hudbehandlinger" },
            { label: "Hudpleieprodukter", description: "SkinCeuticals — medisinsk hudpleie.", path: "/behandlinger/flere-fagomrader/hudpleieprodukter" },
        ],
        faqs: [
            { question: "Hvor utføres IPL?", answer: "På CMedical Bekkestua, av hudlege." },
            { question: "Hva kan IPL behandle?", answer: "Rødhet, synlige blodkar, pigmentforandringer og solskadet hud — for bedre hudhelse og jevnere hudtone over tid." },
            { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille en uforpliktende vurdering direkte." },
        ],
    },

    // ==========================================
    // HUDHELSE — Hudpleieprodukter (Prompt 6)
    // ==========================================
    "flere-fagomrader/hudpleieprodukter": {
        title: "Hudpleieprodukter — SkinCeuticals",
        subtitle: "Medisinsk hudpleie med dokumentert effekt",
        parentCategory: "Hudhelse",
        heroImage: flereFagImg,
        description: "SkinCeuticals er et anerkjent medisinsk hudpleiemerke utviklet med utgangspunkt i avansert dermatologisk forskning. Produktene er formulert for å beskytte sunn hud, korrigere eksisterende hudskader og forebygge fremtidige hudproblemer — med dokumenterte resultater.",
        sections: [
            {
                heading: "Hudpleieprodukter med dokumentert effekt — oppdag SkinCeuticals",
                content: "Med høye konsentrasjoner av aktive ingredienser, som antioksidanter inkludert vitamin C, tilbyr SkinCeuticals målrettede løsninger for ulike hudtilstander. Serien passer både til daglig pleie og som et komplement til estetiske behandlinger, og produktene er ofte anbefalt av hudleger verden over.\n\nEnten du ønsker å redusere fine linjer, forbedre hudtekstur, jevne ut pigmentering eller styrke hudbarrieren, finnes det en SkinCeuticals-rutine tilpasset dine behov. Alle produkter er utviklet med fokus på effektivitet, sikkerhet og hudens naturlige balanse.\n\nFor best resultat anbefaler vi at du får hjelp av vår fagperson og dermatolog til å sette sammen en hudpleieplan som passer din hud og dine mål.\n\nProduktene kan kjøpes på vår klinikk på Bekkestua.",
            },
        ],
        linkedServices: [
            { label: "Hudbehandlinger", description: "Medisinsk forankrede behandlinger hos hudlege.", path: "/behandlinger/flere-fagomrader/hudbehandlinger" },
            { label: "Behandlingsutstyr (IPL)", description: "IPL- og laserbehandling.", path: "/behandlinger/flere-fagomrader/behandlingsutstyr" },
        ],
        faqs: [
            { question: "Hvor får jeg kjøpt produktene?", answer: "På vår klinikk på Bekkestua." },
            { question: "Får jeg veiledning av fagperson?", answer: "Ja — vår dermatolog hjelper deg å sette sammen en hudpleieplan tilpasset din hud." },
        ],
    },

    // ─── Gastrokirurgi-undersider ───

    "flere-fagomrader/gastrokirurgi/brokkoperasjon": {
        title: "Brokkoperasjon",
        subtitle: "Skånsom behandling av lyskebrokk med kikkhull/robot",
        parentCategory: "Gastrokirurgi",
        heroImage: flereFagImg,
        description: "Lyskebrokk er en svært vanlig tilstand som skyldes en medfødt svakhet i bukveggen der sædlederen hos menn og det runde livmorsbåndet hos kvinner går gjennom bukveggen i lyskekanalen. Svakheten kan innebære at man utvikler et indirekte brokk der tarminnhold vandrer inn i lyskekanalen og noen ganger ned i pungen, eller et direkte brokk der tarminnhold lager seg en lomme ved siden av lyskekanalen. En sjelden gang kan også brokket ligge under lyskebåndet og ned mot øvre del av låret og kalles da for et lårbrokk. Hos CMedical opererer vi lyskebrokk med den nyeste og mest avanserte robotteknologien, noe som sikrer maksimal trygghet og et skånsomt forløp for deg.",
        sections: [
            {
                id: "fordeler",
                heading: "Fordeler med robotassistert brokkoperasjon",
                content: "Robotkirurger kan utføre ekstremt presise bevegelser gjennom kun tre små hull i magen. For deg som pasient gir denne moderne kikkhullsteknikken store fordeler:\n\n- Minimal skade på omkringliggende vev, nerver og organer.\n- Mindre smerter og ubehag etter inngrepet.\n- Raskere restitusjon og kortere sykemeldingsperiode (som regel 4 uker).\n- Penere kosmetisk resultat sammenlignet med tradisjonell, åpen kirurgi.",
            },
            {
                id: "hvordan-foregar",
                heading: "Hvordan foregår operasjonen?",
                content: "Inngrepet gjøres i full narkose og tar cirka 60–90 minutter. Kirurgen trekker brokksekken forsiktig tilbake på plass og legger et forsterkende nett over svakheten i bukveggen for å forhindre at brokket kommer tilbake. Det settes lokalbedøvelse i de små sårene under operasjonen, noe som bidrar til lite smerter etter at du våkner.",
            },
            {
                id: "spesialister",
                heading: "Trygg behandling hos landets fremste spesialister",
                content: "Dr. Jan Roland Lambrecht: Fagansvarlig gastrokirurg hos oss med over 25 års klinisk erfaring fra Norge og Danmark, og en doktorgrad fra UiO. Internasjonalt anerkjent ekspert innen robotassistert kirurgi, brokk- og bukveggskirurgi. Bakgrunn fra bl.a. Oslo universitetssykehus (Ullevål).\n\nDr. Andreas Edenberg: Spesialist i generell- og gastroenterologisk kirurgi med europeisk spesialistgodkjenning. Bred erfaring som overlege fra bl.a. Oslo Universitetssykehus (Ullevål). Ekspert på avansert endoskopi og fedmebehandling.",
            },
            {
                id: "ta-forste-steget",
                heading: "Ta det første steget",
                content: "Ønsker du å bli kvitt plagene dine og få en vurdering av ditt brokk? Bestill en uforpliktende konsultasjon med våre kirurger.",
            },
        ],
        process: [
            { title: "Før operasjonen", description: "Før operasjonsdagen ber vi deg lese gjennom tilsendt informasjon om anestesi. Siden inngrepet gjøres via små snitt på magen, er en grundig vask av navlen på operasjonsdagen en viktig del av forberedelsene for å unngå infeksjon." },
            { title: "Utskrivelse og hjemreise", description: "Etter operasjonen ligger du til observasjon på vår postoperative avdeling. Før du reiser hjem samme dag, kommer kirurgen innom for en kort samtale om hvordan inngrepet gikk. Siden du har vært i narkose, kan du ikke kjøre bil selv, og du må ha en voksen person sammen med deg det første døgnet." },
            { title: "Tiden etterpå", description: "De første dagene er det helt normalt å kjenne seg litt oppblåst eller ha ubehag i skuldrene på grunn av gassen som brukes under inngrepet – dette lindres enkelt med vanlige smertestillende og rolige gåturer. Du bør unngå tunge løft over 10 kilo de første 6 ukene." },
        ],
        relatedSpecialists: ["jan-roland-lambrecht", "andreas-edenberg"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig." },
            { question: "Ventetid", answer: "Vi har korte ventetider. Ta kontakt så finner vi en tid som passer deg." },
            { question: "Sykemelding", answer: "Som regel er sykemeldingsperioden 4 uker etter brokkoperasjon." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },

    "flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager": {
        title: "Hemorroider og endetarmsplager (rektocele)",
        subtitle: "Spesialistkompetanse på plager i endetarm og bekkenbunn",
        parentCategory: "Gastrokirurgi",
        heroImage: flereFagImg,
        description: "Hemorroider er utposninger av blodårer i endetarmen, og kan best beskrives som en slags åreknute. Marisker kan sitte på de samme stedene, men består av hud og bindevev uten store blodårer. Dette er svært vanlige og ufarlige tilstander, men de kan skape betydelig ubehag og smerte i hverdagen. Når egenbehandling og reseptfrie salver ikke lenger hjelper, kan kirurgisk behandling være den beste løsningen for å bli helt kvitt plagene.",
        sections: [
            {
                id: "behandling",
                heading: "Behandling av hemorroider og marisker",
                content: "Hemorroider er utposninger av blodårer i endetarmen, og kan best beskrives som en slags åreknute. Marisker kan sitte på de samme stedene, men består av hud og bindevev uten store blodårer. Dette er svært vanlige og ufarlige tilstander, men de kan skape betydelig ubehag og smerte i hverdagen. Når egenbehandling og reseptfrie salver ikke lenger hjelper, kan kirurgisk behandling være den beste løsningen for å bli helt kvitt plagene.",
            },
            {
                id: "gode-rad",
                heading: "Gode råd og forholdsregler etter hjemkomst",
                content: "Det er helt vanlig med smerter i tiden rett etter operasjonen, særlig ved avføring de første ukene:\n\n- Smertelindring: Forvent behov for smertestillende i flere dager. Ha Paracetamol og Ibux klart hjemme. Ved behov for sterkere medisiner skriver kirurgen ut resept ved utskrivelse.\n- Skånsom sårpleie: Etter avføring, bruk en lunken hånddusj fremfor tørt papir. Våtservietter eller mykt toalettpapir forsiktig mot sårflaten uten å gni.\n- Bruk av innlegg: Normalt med litt blødning de første dagene – bruk truseinnlegg eller bind.\n- Ingen sting som skal fjernes: Eventuelle små sting løsner og forsvinner av seg selv.\n- Aktivitet og mage: Hold avføringen myk ved å drikke godt og evt. bruke Movicol eller andre bløtgjørende midler. Behov for sykemelding vurderes individuelt ut fra yrket ditt.",
            },
            {
                id: "trygghet",
                heading: "Trygghet og ekspertise i sentrum",
                content: "Kirurgisk fjerning av hemorroider har lav risiko for komplikasjoner. Hos CMedical blir du operert av Dr. Marian Bale, som har bred erfaring med denne typen inngrep.",
            },
            {
                id: "bestill",
                heading: "Bestill en uforpliktende konsultasjon",
                content: "Ønsker du å bli kvitt plagene dine? Ta kontakt med oss for en uforpliktende konsultasjon.",
            },
        ],
        process: [
            { title: "Før operasjonen", description: "Les gjennom tilsendt informasjon om anestesi. Siden inngrepet gjøres i endetarmen, må du tømme tarmen med et Klyx (120 ml, kjøpes reseptfritt på apoteket) to timer før oppmøte hos oss." },
            { title: "Utskrivelse og hjemreise", description: "Inngrepet gjøres i narkose. Etterpå ligger du til observasjon på vår postoperative avdeling. Før hjemreise samme dag kommer kirurgen innom for en samtale. Siden du har vært i narkose, kan du ikke kjøre bil selv, og du må ha en voksen person med deg det første døgnet." },
            { title: "Oppfølging", description: "Du settes automatisk opp til kontroll hos din kirurg 6–8 uker etter inngrepet for å sikre at alt har grodd fint." },
        ],
        relatedSpecialists: ["marian-bale"],
        faqs: [
            { question: "Henvisning", answer: "Ingen henvisning nødvendig." },
            { question: "Ventetid", answer: "Vi har korte ventetider. Ta kontakt så finner vi en tid som passer deg." },
            { question: "Sykemelding", answer: "Behov for sykemelding vurderes individuelt ut fra yrket ditt." },
            { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
        ],
    },

}

