// CMedical Specialists Data
// Based on real specialists from cmedical.no/no/spesialister
// Updated with real bio data scraped from individual profile pages

// Specialist images
import alenkaBIndas from '@/assets/specialists/alenka-bindas.jpg';
import anamikaChoudhury from '@/assets/specialists/anamika-choudhury.jpg';
import andreasEdenberg from '@/assets/specialists/andreas-edenberg.jpg';
import aneGerdaZEriksson from '@/assets/specialists/ane-gerda-z-eriksson.webp';
import areHaukaaenStodle from '@/assets/specialists/are-haukaen-stodle.jpg';
import ashiAhmad from '@/assets/specialists/ashi-ahmad.webp';
import audunHoeghTangerud from '@/assets/specialists/audun-hoegh-tangerud.jpg';
import birgirGudbrandsson from '@/assets/specialists/birgir-gudbrandsson.jpg';
import birgitteAspenes from '@/assets/specialists/birgitte-aspenes.jpg';
import birgitteMitlidMork from '@/assets/specialists/birgitte-mitlid-mork.jpg';
import bjornBrennhovd from '@/assets/specialists/bjorn-brennhovd.jpg';
import bjornRobstad from '@/assets/specialists/bjorn-robstad.jpg';
import einarAndreBrevik from '@/assets/specialists/einar-andre-brevik.jpg';
import cennetAkdeniz from '@/assets/specialists/cennet-akdeniz.png';
import endreSoreide from '@/assets/specialists/endre-soreide.jpg';
import erikBerg from '@/assets/specialists/erik-berg.jpg';
// ersanKrckov removed - no longer on cmedical.no
import gilbertMoatshe from '@/assets/specialists/gilbert-moatshe.webp';
import gunnarDalen from '@/assets/specialists/gunnar-dalen.jpg';
import hannahRussell from '@/assets/specialists/hannah-russell.jpg';
import henrikMichelsenWahl from '@/assets/specialists/henrik-michelsen-wahl.jpg';
import idaWaagsboBjorntvedt from '@/assets/specialists/ida-waagsbo-bjorntvedt.jpg';
import ingvildSkarpasAannerud from '@/assets/specialists/ingvild-skarpas-aannerud.jpg';
import istvanZoltanRigo from '@/assets/specialists/istvan-zoltan-rigo.jpg';
import jacksonTok from '@/assets/specialists/jackson-tok.jpg';
import janRolandLambrecht from '@/assets/specialists/jan-roland-lambrecht.jpg';
import janRagnarHaugstvedt from '@/assets/specialists/jan-ragnar-haugstvedt.jpg';
import jeanetteFollestad from '@/assets/specialists/jeanette-follestad.jpg';
import jonasRydinge from '@/assets/specialists/jonas-rydinge.jpg';
import jorgenPerminow from '@/assets/specialists/jorgen-perminow.jpg';
import kjerstiBrenden from '@/assets/specialists/kjersti-brenden.jpg';
import kjerstiMargreteFinsrud from '@/assets/specialists/kjersti-margrete-finsrud.jpg';
import kristianMarstrandWarholm from '@/assets/specialists/kristian-marstrand-warholm.jpg';
import kristianOphaug from '@/assets/specialists/kristian-ophaug.jpg';
import larsEldarMyrseth from '@/assets/specialists/lars-eldar-myrseth.webp';
import larsFredrikQvigstad from '@/assets/specialists/lars-fredrik-qvigstad.jpg';
import lineFusdahlHulleberg from '@/assets/specialists/line-fusdahl-hulleberg.jpg';
import lineJacob from '@/assets/specialists/line-jacob.jpg';
import linnMyrtveitStensrud from '@/assets/specialists/linn-myrtveit-stensrud.jpg';
import linneaTorsnes from '@/assets/specialists/linnea-torsnes.jpg';
import madeleineEngen from '@/assets/specialists/madeleine-engen.jpg';
import marcJacobStrauss from '@/assets/specialists/marc-jacob-strauss.jpg';
import mariBorgeEskerud from '@/assets/specialists/mari-borge-eskerud.jpg';
import mariaThompsonClausen from '@/assets/specialists/maria-thompson-clausen.jpg';
import marianBale from '@/assets/specialists/marian-bale.jpg';
import martheHagen from '@/assets/specialists/marthe-hagen.jpg';
import miaKitter from '@/assets/specialists/mia-kitter.png';
import mortenAndersen from '@/assets/specialists/morten-andersen.jpg';
import nabeelYousafKhan from '@/assets/specialists/nabeel-yousaf-khan.jpg';
import nicolaiWessel from '@/assets/specialists/nicolai-wessel.jpg';
import siriKlokstad from '@/assets/specialists/siri-klokstad.webp';
import sondreHassellund from '@/assets/specialists/sondre-hassellund.webp';
import sonuLukose from '@/assets/specialists/sonu-lukose.jpg';
import stigHegna from '@/assets/specialists/stig-hegna.jpg';
import teaBerge from '@/assets/specialists/tea-berge.jpg';
import thomasFredrikThaulow from '@/assets/specialists/thomas-fredrik-thaulow.jpg';
import tomHenrySundoen from '@/assets/specialists/tom-henry-sundoen.jpg';
import tonjeWestlie from '@/assets/specialists/tonje-westlie.jpg';
import trondJorgensen from '@/assets/specialists/trond-jorgensen.jpg';

export interface Specialist {
  name: string;
  title: string;
  subtitle?: string;
  expertise: string[];
  image: string;
  category: 'gynekologi' | 'fertilitet' | 'urologi' | 'ortopedi' | 'annet';
  slug: string;
  bio?: string;
  education?: string;
  experience?: string;
  languages?: string[];
  clinics?: string[];
}

export const specialists: Specialist[] = [
  {
    name: "Alenka Bindas",
    title: "Gynekolog",
    subtitle: "Spesialist",
    expertise: ["Gynekologi"],
    image: alenkaBIndas,
    category: "gynekologi",
    slug: "alenka-bindas",
    bio: "Alenka Bindas er spesialist i gynekologi. Hun har lang og bred erfaring i utredning, behandling og oppfølging av alle typer kvinnesykdommer.\n\nPå grunn av hennes gode renommé og faglige dyktighet har Alenka pasienter fra hele Innlandet og andre deler av landet. Hun bruker god tid ved alle undersøkelser, og det er satt av 30 minutters konsultasjon til alle pasienter.",
    clinics: ["Moelv"]
  },
  {
    name: "Anamika Choudhury",
    title: "Embryolog",
    subtitle: "Fertilitet",
    expertise: ["Fertilitet", "Embryologi"],
    image: anamikaChoudhury,
    category: "fertilitet",
    slug: "anamika-choudhury",
    bio: "Anamika jobber på fertilitetsteamet og har over 12 års internasjonal erfaring innen reproduksjonsmedisin, og er en ledende spesialist innen sitt felt. Etter å ha fullført sin utdannelse ved University College London, Storbritannia, startet Anamika sin karriere med UZ Brussel-teamet i Kuwait, før hun flyttet til Kobe, Japan, hvor hun jobbet med avanserte teknologier for å fryse ned egg og embryoer. Hun flyttet til Oslo, Norge i 2017 og arbeidet ved Rikshospitalet i flere år. I løpet av sin tid der bidro hun til å forbedre pasientopplevelsen og graviditetsratene betydelig.\n\nHos CMedical Fertilitet har hun brukt sin ekspertise til å bygge et toppmoderne laboratorium for å kunne tilby personlige fertilitetsløsninger av høyeste kvalitet. Hun brenner mest for pasientrettigheter og håper at hennes pasienter føler seg sett og tatt vare på. Anamika deltar også i flere nasjonale og internasjonale kongresser, inkludert NOFAB og ESHRE, og har en sterk interesse for forskning som kan omsettes til klinisk praksis.",
    education: "University College London",
    clinics: ["Majorstuen"]
  },
  {
    name: "Andreas Edenberg",
    title: "Gastrokirurg",
    subtitle: "Spesialist",
    expertise: ["Gastrokirurgi", "Overvektskirurgi", "Endoskopi"],
    image: andreasEdenberg,
    category: "annet",
    slug: "andreas-edenberg",
    bio: "Dr. Andreas Edenberg er spesialist i generell kirurgi og gastroenterologisk kirurgi, med europeisk spesialistgodkjenning i traumekirurgi. Han har tidligere jobbet som overlege ved Ringerike sykehus, Gjøvik sykehus og Ullevål universitetssykehus.\n\nEdenberg har spesialisert seg på avansert endoskopi og fedmebehandling og utfører årlig over 2000 endoskopiske undersøkelser. Han har en særlig interesse for fedmekirurgi og utvikling av nye teknikker innen endoskopi. Andreas er en del av CMedical sitt tverrfaglige team som tilbyr robotassistert overvektskirurgi.\n\nHans omfattende erfaring og faglige engasjement gjør ham til en ledende aktør innen sitt felt. Han har også publisert artikler om bruk av kunstig intelligens i endoskopi.\n\nTa det første steget mot en enklere hverdag og økt livskvalitet – bestill en uforpliktende konsultasjon med Dr. Andreas Edenberg.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Ane Gerda Z Eriksson",
    title: "Gynekolog",
    subtitle: "Robotkirurg",
    expertise: ["Gynekologi", "Robotkirurgi", "Gynekologisk kreftbehandling"],
    image: aneGerdaZEriksson,
    category: "gynekologi",
    slug: "ane-gerda-z-eriksson",
    bio: "Dr. Eriksson er en erfaren gynekolog med subspesialisering innen gynekologisk kreftbehandling fra Memorial Sloan Kettering Cancer Center i USA.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Are Haukåen Stødle",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Fot- og ankelkirurgi"],
    image: areHaukaaenStodle,
    category: "ortopedi",
    slug: "are-haukaen-stodle",
    bio: "Dr. Haukåen Stødle er ortoped og spesialist i fot- og ankelkirurgi.\n\nHan var ferdig utdannet spesialist i 2014 og har lang erfaring fra ortopedisk avdeling ved Oslo Universitetssykehus (OUS).\n\nTil daglig behandler han alle typer kirurgiske problemstillinger som kommer til seksjon for fot- og ankelkirurgi ved OUS.\n\nHan kan også vurdere barn fra 12-årsalder samt alle voksne.\n\nAre har doktorgrad på lisfranc-skader i foten, og har publisert en rekke forskningsartikler på tematikken. I tillegg underviser han på nasjonale kurs i ortopedi, fot- og ankelkirurgi.\n\nAre har poliklinikk på ettermiddager og opererer på dagtid hos oss i CMedical.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Ashi Ahmad",
    title: "Gynekolog",
    subtitle: "Fødselshjelp",
    expertise: ["Gynekologi", "Fødselshjelp", "Fostermedisin", "Ultralyd", "NIPT"],
    image: ashiAhmad,
    category: "gynekologi",
    slug: "ashi-ahmad",
    bio: "Dr. Ashi Ahmad er spesialist i fødselshjelp og gynekologi og i tillegg fostermedisiner. Hun har en spesiell interesse for oppfølging av gravide kvinner og tilbyr både tidlig ultralyd, grundig organrettet ultralyd og NIPT, i tillegg til oppfølging av fostre med tanke på vekst og trivsel.\n\nDr. Ashi Ahmad jobber som overlege ved fødeavdelingen og fostermedisinsk avdeling ved OUS Rikshospitalet og har over 15 års erfaring i faget. Hun har en doktorgrad i fødselshjelp og gynekologi og er involvert i forskning og fagutvikling, hvor hun blant annet har vært med å skrive flere kapitler i \"Veileder i Fødselshjelp\" for de norske retningslinjer for faget.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Audun Høegh Tangerud",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Hånd- og fotkirurgi"],
    image: audunHoeghTangerud,
    category: "ortopedi",
    slug: "audun-hoegh-tangerud",
    bio: "Dr. Audun Høegh Tangerud er en erfaren ortopedisk kirurg med spesialisering innen hånd- og fotkirurgi. Han har omfattende erfaring med både planlagte og akutte operasjoner, og jobber også som overlege ved hånd- og albueseksjonen på Ullevål universitetssykehus.\n\nGjennom sin karriere har han også opparbeidet bred erfaring fra flere anerkjente sykehus, som Ringerike sykehus og Rikshospitalet.",
    clinics: ["Moelv"]
  },
  {
    name: "Birgir Gudbrandsson",
    title: "Revmatolog",
    subtitle: "Vaskulitt",
    expertise: ["Revmatologi", "Vaskulitt"],
    image: birgirGudbrandsson,
    category: "annet",
    slug: "birgir-gudbrandsson",
    bio: "Fra 2017 har Birgir vært en viktig del av Revmatologisk avdeling ved Oslo Universitetssykehus Rikshospitalet, og gjennom sitt engasjement har han formet en positiv innvirkning på pasientenes liv. Siden 2015 har han også vært den dedikerte revmatologen ved Oslo Ortopedsenter, nå CMedical, der han bringer sin ekspertise og omsorg til hver eneste konsultasjon.\n\nI løpet av årene 2012-2017 var Birgir ikke bare en foreleser i revmatologi ved Universitetet i Oslo; han var også en inspirator som delte sin lidenskap for faget med kommende helsearbeidere. Han fullførte sitt doktorgradsarbeid ved UiO i 2017, hvor han spesialiserte seg på vaskulitt.\n\nFør han ble en anerkjent revmatolog, brakte Birgir med seg sin medisinske lidenskap og kunnskap fra 2003 til 2007 som en lærling innen indremedisin ved Universitetssykehuset i Reykjavik/Landspitalinn. Hans omfattende kunnskap innen endokrinologi, kardiologi, hematologi/onkologi, nyre, lunge, gastroenterologi, geriatri og revmatologi har gjort ham i stand til å tilby helhetlig omsorg til pasienter.\n\nBirgir bærer stolt sitt medisinske diplom fra 2003 fra Island, og hans dedikasjon til å hjelpe mennesker og gjøre en positiv forskjell i helsevesenet har vært drivkraften gjennom hele hans imponerende karriere.",
    education: "Medisinsk diplom, Island (2003). Doktorgrad i revmatologi, Universitetet i Oslo (2017)",
    languages: ["Norsk", "Islandsk", "Engelsk"],
    clinics: ["Majorstuen"]
  },
  {
    name: "Birgitte Aspenes",
    title: "Gynekolog",
    subtitle: "Kirurg",
    expertise: ["Gynekologi", "Kirurgi", "Overgangsalder", "Urogynekologi"],
    image: birgitteAspenes,
    category: "gynekologi",
    slug: "birgitte-aspenes",
    bio: "Dr. Birgitte Aspenes er utdannet lege ved Universitetet i Oslo. Etter noen år som allmennlege, spesialiserte hun seg i fødselshjelp og kvinnesykdommer ved Bærum Sykehus, hvor hun har jobbet som overlege. Hun har også erfaring fra kirurgisk avdeling på Bærum Sykehus og kvinneklinikken på Ullevål Sykehus.\n\nDe siste årene har Dr. Aspenes jobbet som privatpraktiserende spesialist. Hun har lang erfaring og kan hjelpe deg med alle gynekologiske problemstillinger, som prevensjonsveiledning, celleforandringer, blødningsforstyrrelser, overgangsalder, PMS/PMDD, PCOS og urinlekkasje. Hun er medlem av og jobber i Bayers nordiske menopause råd, og har særlig kompetanse innen behandling og oppfølging i overgangsalderen. Som gynekologisk kirurg opererer hun også vaginale fremfall og urinlekkasje her hos oss.\n\nHun er spesielt opptatt av å forklare og informere godt, slik at pasienten forstår sin egen diagnose og får en følelse av klarhet og kontroll.\n\nDr. Birgitte Aspenes jobber på avdeling Bekkestua.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Birgitte Mitlid-Mork",
    title: "Fertilitetslege",
    subtitle: "Gynekolog",
    expertise: ["Fertilitet", "IVF", "Gynekologi", "Hormonforstyrrelser"],
    image: birgitteMitlidMork,
    category: "fertilitet",
    slug: "birgitte-mitlid-mork",
    bio: "Birgitte er spesialist i fødselshjelp og kvinnesykdommer og har jobbet ved OUS i over 10 år med reproduksjonsmedisin(IVF) gynekologi, fødselshjelp og fostermedisin.\n\nHar vært del av en større forskningsgruppe ved OUS og har Doktorgrad innen morkakefunksjon.\n\nJobbet frem til nylig til som overlege ved Reproduksjonsmedisinsk avdeling ved Rikshospitalet, og har alltid vært lidenskapelig opptatt av kvinnehelse.\n\nBirgitte har utstrakt innsikt og særlig kunnskap om infertilitet, hormonforstyrrelser som tidlig ovarialsvikt og overgangsalder og oppfølging av svangerskap.\n\nMitt ønske er at alle pasienter skal føles seg både sett og hørt uansett hvilken fase i livet de er i.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Bjørn Brennhovd",
    title: "Urolog",
    subtitle: "Kirurg",
    expertise: ["Urologi", "Robotkirurgi", "Prostatakreft"],
    image: bjornBrennhovd,
    category: "urologi",
    slug: "bjorn-brennhovd",
    bio: "Bjørn Brennhovd introduserte robotassistert kirurgi i Norge i 2004, etter å ha ledet teamet for alle urologiske kreftoperasjoner ved Radiumhospitalet i mange år. Årlig har han utført 100–150 inngrep og har aktivt deltatt i opplæringen av helsepersonell i Norge. Bjørn har vært medisinsk ansvarlig ved urologisk avdeling på Radiumhospitalet siden 2005 og har hatt ledelsen for all urologisk robotkirurgi ved Oslo universitetssykehus siden 2014.\n\nBjørn er nasjonal hovedutprøver i en stor skandinavisk multisenterstudie om behandling av høyrisiko prostatakreft. Alle resultater fra hans praksis er nøye registrert i en database, og forskningsresultatene er publisert med ulike perspektiver i internasjonale tidsskrifter. Bjørn er også en deltaker i den nasjonale gruppen som utarbeider Nasjonale retningslinjer for behandling av prostatakreft i regi av Helsedirektoratet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Bjørn Robstad",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Protesekirurgi", "Traumatologi", "Fotkirurgi"],
    image: bjornRobstad,
    category: "ortopedi",
    slug: "bjorn-robstad",
    bio: "Bjørn Robstad har omfattende erfaring innen ortopedisk kirurgi, og har jobbet med ortopedi siden 2005. Han har tidligere jobbet ved OUS, Ullevål, og de siste 14 årene som overlege ved Gjøvik sykehus, hvor han de siste åtte årene har vært seksjonsoverlege. Hans ekspertise omfatter avansert protesekirurgi, traumatologi og fotkirurgi, med en særlig interesse for idrettsmedisin og idrettsskader.\n\nDr. Robstad har jobbet for CMedical i tre år, hvor han utfører operasjoner lokalt ved CMedical i Moelv under lokalbedøvelse, inkludert inngrep som Hallux Valgus, hammertåoperasjoner, inngrodde tånegler, karpaltunnelsyndrom og andre mindre prosedyrer på hender og føtter.\n\nFor pasienter med tilstander som krever generell anestesi, kan operasjoner tilbys ved CMedical i Oslo etter første konsultasjon i Moelv.",
    clinics: ["Moelv"]
  },
  {
    name: "Cennet Akdeniz",
    title: "Endokrinolog",
    subtitle: "Indremedisin",
    expertise: ["Endokrinologi", "Indremedisin", "Stoffskifte", "Diabetes"],
    image: cennetAkdeniz,
    category: "annet",
    slug: "cennet-akdeni",
    bio: "Cennet Akdeniz er spesialist i endokrinologi og indremedisin, utdannet cand.med. fra Universitetet i Oslo. Hun har bred klinisk erfaring fra både Drammen sykehus og Oslo universitetssykehus, og har arbeidet som overlege ved Oslo universitetssykehus siden 2020. Gjennom sitt arbeid har hun opparbeidet solid kompetanse innen diagnostikk og behandling av hormonelle og metabolske sykdommer.\n\nDr. Akdeniz har særlig erfaring med utredning og behandling av stoffskiftesykdommer, inkludert sykdommer i skjoldbruskkjertelen. Hun arbeider også mye med lipidforstyrrelser og høyt kolesterol, hvor målet er å redusere risikoen for hjerte- og karsykdom gjennom grundig utredning og individuelt tilpasset behandling.\n\nHun utreder og behandler også høyt blodtrykk, både essensiell hypertensjon og sekundær hypertensjon forårsaket av hormonelle tilstander. I tillegg har hun erfaring med sykdommer i binyrer og hypofyse, inkludert hormonmangel, hormonforstyrrelser og hypofyseadenomer.\n\nDr. Akdeniz arbeider også med diabetes og metabolsk helse, med særlig fokus på oppfølging av type 2-diabetes og optimalisering av metabolsk behandling. Videre utreder og behandler hun osteoporose og forstyrrelser i kroppens kalsiumbalanse, samt hormonelle tilstander som gonadesvikt, blant annet etter kreftbehandling.",
    education: "Cand.med., Universitetet i Oslo",
    clinics: ["Majorstuen"]
  },
  {
    name: "Einar Andre Brevik",
    title: "Karkirurg",
    subtitle: "Spesialist",
    expertise: ["Karkirurgi", "Åreknuter"],
    image: einarAndreBrevik,
    category: "annet",
    slug: "einar-andre-brevik",
    bio: "Dr. Brevik er en av Norges mest erfarne kar- og åreknutekirurger, og er en av de svært få som tilbyr private og forsikringspasienter en fullverdig karkirurgisk vurdering og utredning for åreknuter, venøs insuffisiens ved lymfødem og lipødem, claudicatio (røykebein, gangsmerter), Raynauds syndrom (likfingre), aortaaneurismer (utvidelse av hovedpulsåren i magen), carotis (halspulsåren og risikovurdering), iliaca syndrom (endofibrose og kompresjon av bekkenpulsåren hos syklister) og som en second opinion innen karkirurgi (fornyet vurdering og informasjon).\n\nDr. Brevik har vært en meget aktiv i det karkirurgiske miljøet gjennom Norsk karkirurgisk forening som leder, nestleder og styremedlem i fra 2014 til 2019. Siden 2020 har han vært rekrutert til å jobbe ved karkirurgisk avdeling på Haukeland universitetssykehus.\n\nTotalt har Dr. Brevik vært engasjert innen privat helsetjenester siden 2014 (Volvat, Hamarklinikken, CMedical), og har operert over 2000 pasienter med åreknuter med de mest moderne og skånsomme metoder.\n\nI dag jobber Dr. Brevik ved CMedical i Moelv (alle undersøkelser) og Majorstuen (åreknuter og claudicatio).",
    clinics: ["Moelv", "Majorstuen"]
  },
  {
    name: "Endre Søreide",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Hånd- og albuekirurgi", "Artroskopisk kirurgi"],
    image: endreSoreide,
    category: "ortopedi",
    slug: "endre-soreide",
    bio: "Dr. Endre Søreide er hånd- og albuekirurg. Han har jobbet mange år ved seksjon for hånd- og albuekirurgi på Oslo Universitetssykehus.\n\nHan utfører avansert hånd- og albuekirurgi, inkludert artoskopisk (kikkhulls-) kirurgi.\n\nEndre har en ph.d, betydelig forskningserfaring og har lagt bak seg et forskningsopphold ved Mayo Clinic i USA.\n\nHan har skrevet flere publikasjoner i internasjonale tidsskrift, og er også kursleder i kirurgisk teknikk, som er et obligatorisk utdanningskurs for leger i spesialisering i ortopedisk kirurgi.\n\nEndre jobber ukentlig på CMedical, bor i Oslo-området, og har stor grad av tilgjengelighet for våre pasienter.",
    education: "Ph.d., forskningsopphold ved Mayo Clinic, USA",
    clinics: ["Majorstuen"]
  },
  {
    name: "Erik Berg",
    title: "Plastikkirurg",
    subtitle: "Spesialist",
    expertise: ["Plastikkirurgi", "Rekonstruksjonskirurgi", "Kosmetisk kirurgi"],
    image: erikBerg,
    category: "annet",
    slug: "erik-berg",
    bio: "Overlege PhD Erik Berg er spesialist i plastikkirurgi og er utdannet lege ved Universitet i Oslo i 1999. Erik er spesialist i plastikkirurgi fra Haukeland Universitetssykehus og har over 20 års erfaring i bransjen før han kommer inn som en del av vårt team hos CMedical. Han har jobbet ved en lang rekke offentlige og private institusjoner, og innehar bred erfaring fra plastikk-, hånd-, og rekonstruksjonskirurgi samt fra Nasjonalt brannskadesenter.\n\nHan utfører både bryst, kropps- og ansiktskirurgi.\n\nKombinasjonen av solid kompetanse, en åpen tilnærming, et godt estetisk blikk og ønsket om naturlige resultater, har gjort han til en ettertraktet kirurg innen kosmetisk kirurgi.\n\nErik har lang erfaring med rekonstruksjon etter hudkreft, brystkreft, medfødte misdannelser og traumatologi inklusiv avanserte håndskader. Han utfører alle typer kosmetiske inngrep, og har inngående kunnskap innen kosmetiske brystoperasjoner, fettransplantasjon, fettsuging og kroppsformende inngrep, inkludert bukplastikker og bodylift.\n\nHan har doktorgrad innen leppe-, kjeve-, ganespalte og hans doktorgradsarbeid innen medfødte ansiktsmisdannelser fikk stor publisitet, og ble valgt som lederartikkel i det internasjonalt anerkjente tidsskriftet JAMA Pediatrics.\n\nErik startet sitt arbeid som plastikkirurg ved Privathospitalet Fana i Bergen, og har senere vært ansvarlig for utviklingen av kosmetisk kirurgi som medisinskansvarlig lege ved prisbelønte Klinikk Arendal, Agders største kosmetiske klinikk.\n\nErik er medlem av Den norske legeforening og Norsk Plastikkirurgisk Forening.",
    education: "PhD, Universitetet i Oslo (1999). Spesialist i plastikkirurgi, Haukeland Universitetssykehus",
    clinics: ["Moss"]
  },
  {
    name: "Ersan Krckov",
    title: "Endokrinolog",
    subtitle: "Spesialist",
    expertise: ["Endokrinologi", "Stoffskifte", "Diabetes", "Hormonsykdommer"],
    image: ersanKrckov,
    category: "annet",
    slug: "ersan-krckov",
    bio: "Dr. Ersan Krckov er spesialist i indremedisin og endokrinologi, med bred erfaring innen utredning og behandling av hormonsykdommer. Han vurderer pasienter med diabetes type 1 og 2, stoffskiftesykdommer, sykdommer i binyrer, hypofyse og biskjoldkjertler, samt testikkelsvikt og hormonbehandling ved overgangsalder. Han har jobbet ved Sykehuset i Drammen, Oslo universitetssykehus og Akershus universitetssykehus.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Gilbert Moatshe",
    title: "Ortoped",
    subtitle: "Knekirurg",
    expertise: ["Ortopedi", "Knekirurgi", "Skulderkirurgi", "Idrettsskader"],
    image: gilbertMoatshe,
    category: "ortopedi",
    slug: "gilbert-moatshe",
    bio: "Dr. Gilbert Moatshe er spesialist i ortopedisk kirurgi og arbeider ved Ortopedisk avdeling ved Oslo universitetssykehus (Ullevål). Han har spesialisert seg innen artroskopisk kirurgi og idrettsskader, med særlig ekspertise på knekirurgi (inkludert korsbånd og andre kneliggamentskader) samt skulderkirurgi (inkludert instabilitet og seneskader). Han har også internasjonal erfaring fra USA og Canada, hvor han gjennomførte videreutdanning etter spesialisering (fellowship). Dr. Gilbert Moatshe har en doktorgrad fra Universitetet i Oslo innenfor knekirurgi.\n\nHan er aktivt engasjert innenfor toppidretten og idrettskader, og han utfører forskning på dette området. Dr. Moatshe har publisert over 100 vitenskapelige forskningsartikler og bokkapitler. Hans forskningsgruppe har mottatt flere internasjonale priser fra American Orthopaedic Society for Sports Medicine (AOSSM), American Academy of Orthopaedic Surgeons (AAOS) og International Society of Arthroscopy, Knee Surgery and Orthopaedic Sports Medicine (ISAKOS). Han holder kurs og foredrag både nasjonalt og internasjonalt.",
    education: "Doktorgrad, Universitetet i Oslo. Fellowship i USA og Canada",
    clinics: ["Majorstuen"]
  },
  {
    name: "Gunnar Dalén",
    title: "Karkirurg",
    subtitle: "Spesialist",
    expertise: ["Karkirurgi", "Åreknuter", "Venebehandling"],
    image: gunnarDalen,
    category: "annet",
    slug: "gunnar-dalen",
    bio: "Gunnar Dalén er spesialist i karkirurgi med lang erfaring i behandling av venøse sykdommer som åreknuter og sirkulasjonsplager i bena. Han bruker moderne og skånsomme metoder som gir varige resultater og kort restitusjonstid, tilpasset den enkelte pasient.\n\nHan utfører behandlingsmetoder som radiofrekvensablasjon (varmebehandling av syke årer), flebektomi (lokal fjerning av åreknuter) og sklerosering; en injeksjonsbasert teknikk som egner seg godt for overfladiske årer. Ved behov kombineres metodene for optimal effekt.\n\nGunnar er en sentral del av vårt team ved den ortopediske avdelingen på CMedical. Han møter hver enkelt med trygghet og høy faglig presisjon, og legger vekt på at du skal oppleve god oppfølging gjennom hele behandlingsforløpet.\n\nVed siden av sin praksis hos oss, arbeider han også som karkirurg ved Ullevål sykehus, som bidrar til hans brede erfaring innen avansert karkirurgi og venebehandling.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Hannah Russell",
    title: "Fertilitetslege",
    subtitle: "Gynekolog",
    expertise: ["Fertilitet", "Gynekologi", "POI"],
    image: hannahRussell,
    category: "fertilitet",
    slug: "hannah-russell",
    bio: "Hannah Russell er spesialist i gynekologi og obstetrikk, og har vært en del av CMedical siden Livio Oslo ble en del av vår klinikkfamilie i 2025. Hun har med seg over 20 års erfaring som gynekolog, både fra Livio - Norges eldste fertilitetsklinikk - og OUS Ullevål, blant annet som overlege og tilknyttet IVF-avdelingen.\n\nHun er opprinnelig fra Irland, hvor hun både studerte medisin og jobbet som lege, før hun flyttet til Oslo i 2005. Hun har et særlig engasjement for prematur ovarial insuffisiens (POI), og har bidratt både i nasjonal veileder for Norsk Gynekologisk Forening og i fagartikler om blant annet POI.\n\nHannah er også medlem og den medisinske rådgiveren i komiteen for ESHRE-sertifisering for sykepleiere, og deltar regelmessig i internasjonale møter for kompetanseutvikling. Hun har også sittet i NOFABs valgkomité i mange år.\n\nHannah møter pasienter med både flytende norsk og engelsk, noe våre engelsktalende pasienter setter stor pris på. Hannah er opptatt av at alle hennes pasienter skal møtes med varme og forståelse, og oppleve omsorg og trygghet hele veien.",
    languages: ["Norsk", "Engelsk"],
    clinics: ["Majorstuen"]
  },
  {
    name: "Henrik Michelsen-Wahl",
    title: "Gynekolog",
    subtitle: "Kirurg",
    expertise: ["Gynekologi", "Endometriose", "Gynekologisk kirurgi"],
    image: henrikMichelsenWahl,
    category: "gynekologi",
    slug: "henrik-michelsen-wahl",
    bio: "Henrik Michelsen-Wahl er gynekolog med bred erfaring og et sterkt engasjement for kvinnehelse. Han fullførte sin spesialisering i gynekologi etter turnustjeneste ved sykehuset Elverum/Hamar i 2010, og har siden jobbet ved Elverum sykehus, Bærum sykehus og Ullevål sykehus.\n\nHenrik har særlig kompetanse innen gynekologisk kirurgi og behandling av endometriose. Ved siden av sitt arbeid hos CMedical er han overlege ved Ullevål sykehus, og han er aktiv i flere faglige fora: som medlem av Nasjonal kompetansetjeneste for endometriose og adenomyose (NKTEA), leder for Oslo gynekologiske forening (OGF) og styremedlem i den nordiske foreningen for endoskopisk gynekologisk kirurgi (NSGE).\n\nHos oss møter du en lege som tar imot alle generelle gynekologiske problemstillinger, inkludert menstruasjonssmerter og blødningsforstyrrelser. Henrik er opptatt av å lytte, skape åpen dialog og finne de løsningene som både føles riktige for pasienten og som er medisinsk trygge.\n\nHan snakker flytende norsk, engelsk og tysk – noe mange pasienter opplever som en ekstra trygghet.",
    languages: ["Norsk", "Engelsk", "Tysk"],
    clinics: ["Ski"]
  },
  {
    name: "Ida Waagsbø Bjørntvedt",
    title: "Gynekolog",
    subtitle: "Vulvaspesialist",
    expertise: ["Fertilitet", "IVF", "Vulvaklinikk", "POI"],
    image: idaWaagsboBjorntvedt,
    category: "fertilitet",
    slug: "ida-waagsbo-bjorntvedt",
    bio: "Dr. Bjørntvedt er gynekolog med subspesialisering innen infertilitet. Ida har lang erfaring og har tidligere jobbet som overlege sammen med resten av teamet ved CMedical Fertilitet på fertilitetsavdelingen på Rikshospitalet. Hun er i tillegg leder for vulvaforum og har ansvar for vulvaklinikken til CMedical.\n\nIda jobber i dag både i det offentlige og ved CMedical med kvinner med eggstokksvikt før 40 år (POI), tidlig overgangsalder og andre hormonforstyrrelser.\n\nVulvaklinikken hos oss består av et unikt multidisiplinært team med gynekolog, hudlege, sexolog, psykolog og fysioterapeut med bekkenbunnskompetanse.\n\nSammen jobber spesialistene med en tverrfaglig tilnærming til ulike problemstillinger.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Ingvild Skarpås Aannerud",
    title: "Senior Osteopat",
    subtitle: "Manuell behandling",
    expertise: ["Osteopati", "Bekkenbunnshelse", "Kvinnehelse", "Rehabilitering etter robotkirurgi"],
    image: ingvildSkarpasAannerud,
    category: "annet",
    slug: "ingvild-skarpas-aannerud",
    bio: "Ingvild Skarpås Aannerud er autorisert osteopat, utdannet ved Norges Helsehøyskole i Oslo. I over ti år har hun fordypet seg i plager som kan oppstå gjennom ulike faser av en kvinnes syklus og livsløp. Hun er også ammeveileder, og tilbyr forberedende timer innen amming, barseltid og fødsel, alltid med et varmt og støttende blikk på den nye hverdagen som venter.\n\nIngvild har et sterkt engasjement for gravide og barselkvinner, og for kvinner og menn som opplever underlivsplager som lekkasje, smerter eller erektil dysfunksjon. Som en del av kompetansesenteret for kvinnehelse samarbeider hun tett med gynekolog, urolog, sexolog og psykolog for å hjelpe pasienter med smerteproblematikk og bekkenbunnsdysfunksjon, som kan gi utfordringer som vannlatingsproblemer, fremfall og blæresmerter.\n\nHun har også spesialisert kompetanse innen oppfølging etter robotkirurgi, med veiledet fysikalsk rehabilitering og rådgivning om seksualtekniske hjelpemidler. Dette arbeidet krever både presisjon og forståelse, og Ingvild legger stor vekt på å møte pasienter med trygghet, tydelighet og god informasjon gjennom hele prosessen.\n\nSom en del av CMedical sitt tverrfaglige team følger hun både kvinner og menn før og etter operasjon, og bidrar til et helhetlig forløp der pasienter blir sett, forstått og godt ivaretatt.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Istvan Zoltan Rigo",
    title: "Ortoped",
    subtitle: "Håndkirurg",
    expertise: ["Ortopedi", "Håndkirurgi", "Artroskopi"],
    image: istvanZoltanRigo,
    category: "ortopedi",
    slug: "istvan-zoltan-rigo",
    bio: "Istvan Zoltan Rigo er spesialist i ortopedisk kirurgi og har Europeisk Diplom i Håndkirurgi (FESSH Diplom). Han har tidligere jobbet på Rikshospitalet, som har landsdekkende ansvar for avansert håndkirurgi. Istvan jobber som overlege på Ortopedisk avdeling, Sykehuset Østfold og er engasjert i klinisk forskning.\n\nHan har bred erfaring med håndkirurgi, inkludert behandling av leddbåndskader, artroskopi (kikkhullskirurgi) og protesekirurgi av håndledd og andre ledd i hånd. Dr. Rigo har doktorgrad og skrev sin ph.d.-avhandling om bøyeseneskader i hånd. Han har også skrevet flere vitenskapelige publikasjoner og bokkapitler innen håndkirurgi, og underviser på forskjellige skandinaviske og internasjonale kurs innen håndkirurgi og artroskopisk kirurgi.\n\nI tillegg til vanlige håndkirurgiske inngrep (operasjon for carpal tunnel syndrom, triggerfinger, de Quervain syndrom og Dupuytrens kontraktur) utfører han andre avanserte håndkirurgiske inngrep, inkludert diverse artroskopiske prosedyrer, leddbåndrekonstruksjoner, avstivninger og proteseoperasjoner i håndledd og hånd.\n\nBestill time hos Istvan i Moss på telefon 69254000.",
    clinics: ["Moss"]
  },
  {
    name: "Jackson Tok",
    title: "Fertilitetslege",
    subtitle: "Gynekolog",
    expertise: ["Fertilitet", "IVF", "Mannlig infertilitet", "Mikro-TESE"],
    image: jacksonTok,
    category: "fertilitet",
    slug: "jackson-tok",
    bio: "Jackson Tok er spesialist i gynekologi med subspesialisering innen ufrivillig kvinnelig og mannlig infertilitet. Før CMedical jobbet Jackson som overlege ved reproduksjonsmedisinsk avdeling ved Oslo universitetssykehus, der han var ansvarlig for utredning og behandling av mannlig infertilitet.\n\nJackson ledet etableringen av fertilitetsklinikken og er nå leder for CMedical Fertilitet Majorstuen. Han har omfattende erfaring innen utredning og behandling av infertilitet på alle nivåer og har godkjent sertifisering i mikrodisseksjon-TESE (mikro-TESE) ved Centre for Male Reproductive Medicine & Microsurgery ved Weill Cornell Medicine i New York. I tillegg til infertilitet har Jackson god erfaring innen PCOS, for tidlig overgangsalder og menopause.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jan Roland Lambrecht",
    title: "Gastrokirurg",
    subtitle: "Spesialist",
    expertise: ["Gastrokirurgi", "Overvektskirurgi", "Robotkirurgi", "Brokkkirurgi"],
    image: janRolandLambrecht,
    category: "annet",
    slug: "jan-roland-lambrecht",
    bio: "Dr. Jan Lambrecht er spesialist i mage- og tarmkirurgi (gastrokirurgi), robotassistert kirurgi og generell kirurgi, med en doktorgrad fra Universitetet i Oslo og over 25 års klinisk erfaring fra både Norge og Danmark. Han er en anerkjent ekspert innen overvektskirurgi (bariatrisk og metabolsk kirurgi), brokk- og bukveggskirurgi, tarmkirurgi (kolorektal kirurgi) og robotkirurgi, og er sterkt engasjert i kirurgisk innovasjon og utdanning av neste generasjons kirurger.\n\nHan er i dag fagansvarlig gastrokirurg hos oss i CMedical, med hovedansvar for robotassistert behandling av pasienter med alvorlig overvekt. Her leder han utviklingen av trygge og effektive behandlingsforløp, der kirurgisk presisjon og pasientsikkerhet står i sentrum.\n\nJan har opparbeidet seg bred erfaring gjennom stillinger ved blant annet Oslo universitetssykehus, Sykehuset Innlandet og Universitetssykehuset Nord-Norge. Han har vært en drivkraft i utviklingen av avanserte, minimalt invasive teknikker – det vil si skånsom kirurgi gjennom små snitt. Han underviser jevnlig kirurger både nasjonalt og internasjonalt.\n\nMed Jan får du kirurgisk trygghet og faglig presisjon, kombinert med ærlig veiledning og personlig oppfølging. Han møter pasientene med respekt og et helhetlig blikk, enten det gjelder overvektskirurgi eller andre kirurgiske inngrep.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jan-Ragnar Haugstvedt",
    title: "Ortoped",
    subtitle: "Håndkirurg",
    expertise: ["Ortopedi", "Håndkirurgi", "Artroskopisk håndkirurgi"],
    image: janRagnarHaugstvedt,
    category: "ortopedi",
    slug: "jan-ragnar-haugstvedt",
    bio: "Jan Ragnar Haugstvedt er en erfaren håndkirurg med flere års tjeneste ved Rikshospitalet, som har landsdekkende ansvar for håndkirurgi. Han spesialiserer seg særlig innen artroskopisk håndkirurgi og har bidratt til vitenskapelig litteratur med flere titalls publikasjoner i internasjonale tidsskrifter.\n\nI løpet av sin karriere har Jan Ragnar utført komplekse inngrep som proteseinsetting, rekonstruksjon av leddbånd, rekonstruksjon av blodårer og nerver, samt andre avanserte prosedyrer. Hans kompetanse dekker i prinsippet hele spekteret av håndkirurgi innenfor både det private og det offentlige helsevesenet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jeanette Follestad",
    title: "Sykepleier",
    subtitle: "Fertilitet",
    expertise: ["Sykepleie", "Fertilitet"],
    image: jeanetteFollestad,
    category: "annet",
    slug: "jeanette-follestad",
    bio: "Jeanette jobber som Fertilitetssykepleier ved CMedical og jobber til daglig med å bistå pasienter gjennom fertilitetsbehandling. Hun har tidligere erfaring både fra hjertemedisinske avdelinger og spesialiserte klinikker som Olafia og Vulvapoliklinikken. Jeanette har over ti års erfaring som sykepleier og har i løpet av sin karriere utviklet en god evne til å støtte pasienter gjennom utfordrende prosesser, spesielt innen fertilitet.\n\nJeanette brenner for kvinnehelse og har en særlig forståelse for den emosjonelle og fysiske belastningen fertilitetsbehandling kan medføre. Hun møter pasienter med omsorg og en strukturert tilnærming, for å sikre at man føler seg ivaretatt i behandlingsprosessen, basert på hver pasients historie og situasjon. Gjennom sitt arbeid i tverrfaglige team er hun med på å gi pasientene oppfølging med fokus på å skape en trygg og støttende atmosfære.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jonas Rydinge",
    title: "Ortoped",
    subtitle: "Spesialist",
    expertise: ["Ortopedi", "Fot- og ankelkirurgi"],
    image: jonasRydinge,
    category: "ortopedi",
    slug: "jonas-rydinge",
    bio: "Spesialist i ortopedisk kirurgi og overlege ved fot- og ankelseksjonen på Ullevål sykehus i tillegg til å jobbe ved C-medical. Dr. Jonas spesialiserer seg på behandling av pasienter som opplever smerter, feilstillinger eller instabilitet i foten og ankelen. Har omfattende erfaring med pasienter som lider av ettervirkninger etter leddbåndsskader, bruskproblemer og bruddskader.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jørgen Perminow",
    title: "Gynekolog",
    subtitle: "Spesialist",
    expertise: ["Gynekologi", "Obstetrikk"],
    image: jorgenPerminow,
    category: "gynekologi",
    slug: "jorgen-perminow",
    bio: "Dr. Jørgen Perminow har omfattende erfaring både fra Ahus og Ullevål Sykehus. Han er spesialist i gynekologi og obstetrikk, og er også overlege ved Kvinneklinikken på Ahus. Dr. Perminow snakker flytende norsk og engelsk, og snakker også noe polsk. Han er dypt engasjert i kvinnehelse, og jobber kontinuerlig for å forbedre kvaliteten på omsorg og støtte til sine pasienter.",
    languages: ["Norsk", "Engelsk", "Polsk"],
    clinics: ["Majorstuen"]
  },
  {
    name: "Kjersti Brenden",
    title: "Fertilitetslege",
    subtitle: "Gynekolog",
    expertise: ["Fertilitet", "IVF", "Gynekologi", "Eggdonasjon"],
    image: kjerstiBrenden,
    category: "fertilitet",
    slug: "kjersti-brenden",
    bio: "Kjersti Brenden er utdannet ved det medisinske fakultet i Oslo og fullførte i 1999.\n\nHun er spesialist i gynekologi og obstetrikk og har over 20 års erfaring som gynekolog. Hun har tidligere jobbet ved kvinneklinikken i Vestre Viken, Drammen, men har helt siden 2012 vært en del av fertilitetsteamet ved Livio - Norges eldste fertilitetsklinikk. Livio ble i 2025 en del av CMedical.\n\nI tillegg til bred erfaring i generell gynekologi har hun en spisskompetanse innen fertilitetsbehandling. Siden lovverksendringene i 2021 har hun også vært mye engasjert i spesielt eggdonasjonsbehandling som da ble tillatt i Norge.\n\nHun har sittet i styret i NOFAB (Norsk Forening for Assistert Befruktning) i perioden 2017-2019. Kjersti er opptatt av å sette pasientene i fokus, og gi medisinsk faglig oppdatert informasjon i tillegg til varme, omsorg og trygghet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Kjersti Margrete Finsrud",
    title: "Sexolog",
    subtitle: "Spesialist",
    expertise: ["Sexologi", "Seksuell helse", "Vulvasmerter", "Prevensjon"],
    image: kjerstiMargreteFinsrud,
    category: "annet",
    slug: "kjersti-margrete-finsrud",
    bio: "Kjersti er sykepleier med videreutdanning som helsesykepleier, og spesialist i sexologisk rådgivning gjennom NACS. Hun tar imot enkeltpersoner og par i alle aldre. Hun har kompetanse innen vulvasmerter, vaginisme, seksuell identitet, erektil dysfunksjon og hormonelle endringer. Hun tilbyr også prevensjonsveiledning og er godkjent vaksinatør.",
    clinics: ["Majorstuen", "Ski"]
  },
  {
    name: "Kristian Marstrand Warholm",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Hoftekirurgi", "Knekirurgi", "Skulderkirurgi", "Idrettsmedisin"],
    image: kristianMarstrandWarholm,
    category: "ortopedi",
    slug: "kristian-marstrand-warholm",
    bio: "Kristian Marstrand Warholm er en høyt kvalifisert ortoped og en sentral del av vårt ortopediteam ved CMedical. Til daglig jobber han som overlege ved OUS Ullevål, skopi-seksjonen, og som konsulent for Idrettens Helsesenter, der han kombinerer ekspertise med engasjement for idrettsmedisin.\n\nKristian fullførte sin spesialisering som ortoped i 2020 og har siden opparbeidet seg omfattende erfaring innen kikkhullsoperasjoner, med fokus på hoften. Han har bidratt til utviklingen av moderne behandlingsmetoder for denne pasientgruppen og driver aktiv forskning for å videreutvikle feltet.\n\nI 2023 ble Kristian en verdifull tilvekst til CMedicals ortopediteam. Hans kombinasjon av kirurgisk dyktighet, forskningskompetanse og pasientfokus gjør ham til en uvurderlig ressurs for både pasienter og teamet vårt.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Kristian Ophaug",
    title: "Fertilitetscoach",
    subtitle: "Familieterapeut",
    expertise: ["Fertilitet", "Familieterapi", "Fertilitetsrådgivning"],
    image: kristianOphaug,
    category: "fertilitet",
    slug: "kristian-ophaug",
    bio: "Kristian Ophaug har over 20 års erfaring som terapeut i spesialisthelsetjenesten, og har siden 2022 jobbet ved Kvinneklinikken på Rikshospitalet. Han er utdannet klinisk sosionom og familieterapeut, og spesialiserer seg innen psykisk helse i svangerskap og barsel.\n\nSiden 2018 har han jobbet med par som opplever ufrivillig barnløshet og har vært fertilitetsrådgiver ved IVF-avdelingen på Oslo Universitetssykehus. Gjennom sin egen IVF-erfaring og faglige bakgrunn har Kristian utviklet et unikt tilbud innen fertilitetsrådgivning.\n\nSom Norges eneste mannlige fertilitetsrådgiver gir han støtte til ufrivillig barnløse menn, og fokuserer på begge parter for å lette utfordringene i behandlingsprosessen.\n\nKristian hjelper kvinner og menn med å uttrykke og bearbeide følelser rundt ufrivillig barnløshet, og tilbyr verktøy for å håndtere de følelsesmessige utfordringene. Han gir også råd om hvordan par kan støtte hverandre gjennom prosessen, eller til enkeltpersoner som går gjennom det alene.\n\nSamtalene tilpasses individuelle behov, og Kristian gir veiledning for å normalisere tanker og følelser, samt verktøy for å håndtere sorg ved mislykkede forsøk eller spontanaborter.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Lars Eldar Myrseth",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Håndkirurgi", "Nerveskader"],
    image: larsEldarMyrseth,
    category: "ortopedi",
    slug: "lars-eldar-myrseth",
    bio: "Lars Eldar Myrseth har flere års erfaring fra Rikshospitalet, som har landsdekkende ansvar for håndkirurgi og håndterer plexus nerveskader. Lars har omfattende erfaring innen behandling av nerveskader og håndkirurgi.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Lars Fredrik Qvigstad",
    title: "Urolog",
    subtitle: "Kirurg",
    expertise: ["Urologi", "Prostatakreft"],
    image: larsFredrikQvigstad,
    category: "urologi",
    slug: "lars-fredrik-qvigstad",
    bio: "Lars er urolog og generell kirurg og jobber til daglig på Radiumhospitalet som overlege. Han er knyttet til forskningsgruppen for prostatakreft, og er doktorgradskandidat ved Universitetet i Oslo.\n\nTil daglig har Lars urologisk poliklinikk og opererer det meste innenfor urologi på Radiumhospitalet. Lars vil styrke vårt urologteam ved å ha poliklinikk på ettermiddager.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Line Fusdahl Hulleberg",
    title: "Sykepleier",
    subtitle: "Fertilitet",
    expertise: ["Sykepleie", "Fertilitet", "Inseminasjon"],
    image: lineFusdahlHulleberg,
    category: "annet",
    slug: "line-fusdahl-hulleberg",
    bio: "Line Fusdahl Hulleberg har vært sykepleier siden 2008 og har bred erfaring fra Oslo Universitetssykehus. Siden 2017 har hun jobbet med assistert befruktning, først ved Oslo Universitetssykehus og senere hos oss på CMedical. Hun har vært en sentral del av fertilitetsteamet fra oppstarten hos CMedical og er i dag teamleder for fertilitetsteamet. Line var en av de første sykepleierne i Norge som startet med inseminasjonsbehandling, noe som understreker hennes viktige bidrag innen fertilitetsbehandling her i landet.\n\nMed et sterkt engasjement for fertilitetsbehandling har Line fokus på å støtte pasientene gjennom hele prosessen med å oppnå drømmen om barn. Hennes omsorgsfulle og empatiske tilnærming sikrer at pasientene føler seg trygge og godt ivaretatt i en tid som ofte kan være både emosjonelt og fysisk krevende. I tillegg til sin spesialisering innen fertilitet, har hun verdifull erfaring fra andre helsefaglige områder som styrker hennes evne til å tilby helhetlig og pasientsentrert omsorg.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Line Jacob",
    title: "Gynekolog",
    subtitle: "Spesialist",
    expertise: ["Gynekologi", "Reproduksjonsmedisin", "Overgangsalder"],
    image: lineJacob,
    category: "gynekologi",
    slug: "line-jacob",
    bio: "Dr. Line Jacob er utdannet lege fra Universitetet i Oslo, og har flere års erfaring fra gynekologisk avdeling ved Bærum sykehus, hvor hun spesialiserte seg på fødselshjelp og kvinnesykdommer. Hun har også jobbet ved Rikshospitalet som gynekolog innen reproduksjonsmedisin og infertilitet, og forsker nå på sammenhengen mellom overgangsplager og risiko for demens.\n\nLine er opptatt av at det skal føles trygt og godt å komme til gynekolog. Hun møter hver pasient med ro, omtanke og individuell tilnærming, og legger vekt på å skape en trygg dialog.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Linn Myrtveit-Stensrud",
    title: "Psykolog, PhD",
    subtitle: "Spesialist",
    expertise: ["Psykologi", "Kvinnehelse", "Vulvodyni", "Vaginisme"],
    image: linnMyrtveitStensrud,
    category: "annet",
    slug: "linn-myrtveit-stensrud",
    bio: "Linn er utdannet psykolog fra UiO med doktorgrad fra OsloMet, der hun har forsket på hvordan vulvodyni påvirker både den enkelte og parforholdet. Hun har spesialisert seg på kvinnehelse og har flere års erfaring med å møte kvinner som lever med langvarige underlivssmerter – som vulvodyni, vaginisme og endometriose.\n\nHun har også bred kompetanse innen hormonelle utfordringer som PMDD, samt psykiske belastninger knyttet til fertilitet, graviditet, abort og fødsel. Linn møter deg med en kombinasjon av faglig trygghet og ekte forståelse for hvordan kropp og psyke henger sammen.\n\nHos CMedical tilbyr Linn psykologsamtaler tilpasset din livssituasjon – uansett hvor du er i løpet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Linnea Torsnes",
    title: "Hudhelse",
    subtitle: "Hudlege",
    expertise: ["Hudhelse", "Dermatologi", "Hudkreft", "Laserbehandling"],
    image: linneaTorsnes,
    category: "annet",
    slug: "linnea-torsnes",
    bio: "Dr. Linnea Torsnes er spesialist i hud- og veneriske sykdommer, med utdannelse fra Danmark og Rikshospitalet i Oslo. Hun har omfattende erfaring innen dermatologi og har tidligere jobbet som overlege ved hudavdelingen på Rikshospitalet, Oslo universitetssykehus.\n\nHun behandler et bredt spekter av hudtilstander, inkludert hudkreft, psoriasis, eksem, vorter, rosacea, perioral dermatitt og akne. Hun har lang erfaring med føflekksjekker og utfører fjerning av føflekker ved behov. I tillegg tilbyr hun behandling for overdreven svette, ulike injeksjonsbehandlinger, fotodynamisk terapi (PDT) ved indikasjon samt laserbehandling.\n\nSom en anerkjent spesialist innen sitt felt er Dr. Torsnes medlem av Den Norske Legeforening og European Academy of Dermatology and Venereology (EADV).\n\nLinnea jobber ved vår klinikk på Bekkestua.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Madeleine Engen",
    title: "Gynekolog",
    subtitle: "Kirurg",
    expertise: ["Gynekologi", "Urogynekologi", "Bekkenbunnshelse"],
    image: madeleineEngen,
    category: "gynekologi",
    slug: "madeleine-engen",
    bio: "Dr. Engen er spesialist innen gynekologi med spesiell interesse og ekspertise innen urogynekologi, som omhandler tilstander som urinlekkasje og vaginale fremfall, samt utvidete «6 ukers kontroller» etter fødsel med fokus på bekkenbunn og fødselsskader. Hun har forskningserfaring innen urinlekkasje og har presentert sitt arbeid på internasjonale kongresser. Dr. Engen har tidligere hatt faglig ansvar for urogynekologi ved Bærum Sykehus. Dr. Engen har også god erfaring med utredning og behandling av overgangsalder.\n\nDr. Engen er en tydelig stemme for kvinnehelse, og deler sin kunnskap både i klinikken, i media og på internasjonale arenaer. Hun er fagansvarlig for gynekologi og grunnlegger av CMedical Kvinnehelse, og hun er medlem av European Urogynaecological Association (EUGA).",
    clinics: ["Majorstuen"]
  },
  {
    name: "Marc Jacob Strauss",
    title: "Ortoped",
    subtitle: "Spesialist",
    expertise: ["Ortopedi", "Knekirurgi", "Idrettsmedisin", "Korsbåndkirurgi"],
    image: marcJacobStrauss,
    category: "ortopedi",
    slug: "marc-jacob-strauss",
    bio: "Dr. Marc Jacob Strauss er spesialist i ortopedisk kirurgi og sertifisert idrettslege gjennom IOC. Han har bred erfaring innen avansert knekirurgi, med særlig kompetanse på idrettsrelaterte kneskader, korsbåndsskader og komplekse leddbånds rekonstruksjoner.\n\nMarc har jobbet i en rekke ledende nasjonale og internasjonale miljøer. Han har hatt fellowship hos Professor Lars Engebretsen, vært forskningsstipendiat hos Dr. Robert LaPrade ved Steadman-klinikken i Vail, Colorado (2018–2019), og har erfaring fra Olympiatoppen, Oslo universitetssykehus og Idrettsklinikken ved Aarhus Universitetssykehus.\n\nHan har i mange år vært tett på toppidretten, blant annet som landslagslege for det norske alpinlandslaget siden 2014, og tidligere som landslagslege for Dansk Boldspil Union (DBU) for U16- og U19-landslagene.\n\nMarc er i siste fase av sin doktorgrad innen korsbåndskirurgi og har publisert en rekke vitenskapelige artikler og bokkapitler. Han er aktiv i internasjonale fagmiljøer gjennom ESSKA, ISAKOS og ACL-studiegruppen, og bidrar jevnlig som foreleser på nasjonale og internasjonale kurs og konferanser.\n\nHos CMedical møter du en engasjert og kunnskapsrik kirurg som brenner for å hjelpe pasienter tilbake til en trygg hverdag og aktivitet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Mari Borge Eskerud",
    title: "Ernæring",
    subtitle: "Ernæringsfysiolog",
    expertise: ["Ernæring", "IBS", "LavFODMAP", "PCOS", "Fertilitet", "Overgangsalder"],
    image: mariBorgeEskerud,
    category: "annet",
    slug: "mari-borge-eskerud",
    bio: "Mari Borge Eskerud er klinisk ernæringsfysiolog med spesialisering innen IBS og lavFODMAP-dietten. Hun har tidligere jobbet ved Lovisenberg Diakonale Sykehus, hvor hun har hjulpet pasienter med irritabel tarm-syndrom (IBS) gjennom evidensbasert kostholdsveiledning. Mari er sertifisert i lavFODMAP-dietten av Monash University og har et stort engasjement for å gi pasientene sine kunnskapsbasert og individuelt tilpasset behandling.\n\nI tillegg til sin spesialisering innen mage- og tarmhelse, har hun særlig kompetanse innen ernæring relatert til fertilitet, overgangsalder, Polycystisk ovariesyndrom (PCOS) og graviditet. Hun jobber også med generell ernæringsveiledning for god helse og velvære.\n\nMari er medforfatter av boken «Sunn og frisk med sensitiv mage – en fullstendig guide til kosthold og mestring» (2018), sammen med Cecilie Hauge Ågotnes.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Maria Thompson Clausen",
    title: "Ernæring",
    subtitle: "Ernæringsfysiolog",
    expertise: ["Ernæring", "IBS", "PCOS", "Spiseforstyrrelser", "Overvekt", "Overgangsalder", "Diabetes type 2", "RED-s"],
    image: mariaThompsonClausen,
    category: "annet",
    slug: "maria-thompson-clausen",
    bio: "Maria Thompson Clausen er utdannet klinisk ernæringsfysiolog fra Universitetet i Oslo, med videre spesialisering i bulimi og overspisingslidelse ved Norges idrettshøyskole. Hun har i tillegg fordypet seg i irritabel tarm (IBS), og har bred erfaring med sammensatte problemstillinger innen ernæring og helse.\n\nDe siste seks årene har Maria jobbet som kostholds- og treningsveileder og hjulpet mennesker med livsstilsendringer, overvekt, fedme, spiseforstyrrelser som bulimi og overspisingslidelse (BED), samt undervekt og mangelfull ernæring. Hun har et helhetlig syn på helse, der kroppen sees i sammenheng – fysisk og mentalt.\n\nMaria tilbyr evidensbasert veiledning for blant annet: IBS (irritabel tarm), PCOS, Diabetes type 2 og insulinresistens, Overspisingslidelse og bulimi, RED-s (Relative Energy Deficiency in Sport), Kosthold tilpasset overgangsalder, IBD, Cøliaki og Spisevansker.\n\nHun brenner for å gi mennesker kunnskap og verktøy som gjør det mulig å ta bærekraftige, sunne valg – tilpasset hver enkelt kropp og livssituasjon.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Marian Bale",
    title: "Gastrokirurgi",
    subtitle: "Gastrokirurg",
    expertise: ["Gastrokirurgi", "Brokkbehandling", "Laparoskopi", "Endetarmsplager", "Generell kirurgi"],
    image: marianBale,
    category: "annet",
    slug: "marian-bale",
    bio: "Dr. Marian Bale er overlege og spesialist i generell kirurgi og gastrokirurgi. Hun har lang og bred kirurgisk erfaring fra blant annet Ullevål sykehus, Ahus og Diakonhjemmet sykehus og er nå overlege ved Bærum sykehus. Hun har jobbet som lege siden 2001. Dr. Bale er en kapasitet på alle typer brokkbehandling, med et stort antall laparoskopiske (kikkehull) og åpne inngrep bak seg.\n\nVed CMedical tilbyr dr. Bale blant annet utredning og behandling av endetarmsplager (hemorroider, marisker, fissurer mv.), vurdering og behandling av brokk (operasjoner med kikkehull og åpen teknikk) og diverse mindre kirurgiske prosedyrer (fjerning av fettkuler, talgcyster, føflekker med mer).\n\nI tillegg til medisinske og kirurgisk-tekniske ferdigheter, legger Dr. Bale alltid vekt på god dialog med pasienter og pårørende, både i utredningsfasen og i forbindelse med inngrep og oppfølging. Hun er veldig grundig og setter seg godt inn i hver pasients situasjon. Det er viktig for det endelige resultatet, og for at pasienten skal få en god opplevelse gjennom hele behandlingsløpet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Marthe Hagen",
    title: "Psykologi",
    subtitle: "Psykolog",
    expertise: ["Psykologi", "Kvinnehelse", "EMDR", "Traumer", "Angst", "Depresjon", "Kronisk sykdom"],
    image: martheHagen,
    category: "annet",
    slug: "marthe-hagen",
    bio: "Marthe Hagen er psykolog med et spesielt fokus og engasjement for kvinnehelse. Hun har bred erfaring fra spesialisthelsetjenesten (DPS og TSB) og fra privat praksis.\n\nMarthe tilbyr samtaleterapi for voksne innenfor et bredt spekter av problemstillinger, inkludert traumer og livsbelastninger, angst og depresjon. Hun kan også veilede og støtte i prosessen med å leve med kronisk sykdom, utmattelse, smertetilstander og andre medisinske utfordringer.\n\nSom terapeut er Marthe rolig, varm og tålmodig, og hun arbeider ut fra en helhetlig og integrativ forståelse av mental helse og psykiske vansker. Hun benytter elementer fra kognitiv og metakognitiv terapi, sammen med eksistensielle og humanistiske terapiformer. Marthe tilbyr også behandling av traumer og angsttilstander med Eye Movement Desensitization and Reprocessing (EMDR).\n\nMarthe tilbyr også digitale konsultasjoner, slik at du kan få veiledning og oppfølging uansett hvor du befinner deg. Enten du foretrekker fleksibilitet eller har behov for en digital løsning, er hun tilgjengelig for å hjelpe deg.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Mia Kitter",
    title: "Osteopati",
    subtitle: "Osteopat",
    expertise: ["Osteopati", "Manuell behandling", "Kvinnehelse", "Endometriose", "Muskel- og skjelettplager", "Rehabilitering"],
    image: miaKitter,
    category: "annet",
    slug: "mia-kitter",
    bio: "Mia Kitter er autorisert osteopat med bachelor i osteopati fra Høyskolen Kristiania, samt videreutdanning innen osteopati fra samme institusjon. Hun har også spesialisert seg innen kvinnehelse, med kurs i både generell kvinnehelse og endometriose, og har en særlig interesse for hvordan muskel- og skjelettplager kan påvirke livskvalitet i ulike faser av livet.\n\nHun har erfaring innen manuell behandling og rehabilitering av muskel- og skjelettplager. Hun er opptatt av å se hele mennesket, og tilpasser behandlingen til den enkeltes behov, mål og hverdag. Med bakgrunn fra både helse, trening og undervisning har hun bred erfaring med bevegelse, forebygging og funksjonell opptrening.\n\nGjennom sitt arbeid møter hun pasienter med ulike typer smerteproblematikk og funksjonsutfordringer, og legger stor vekt på trygg oppfølging, god kommunikasjon og forståelig veiledning gjennom hele behandlingsforløpet. Hennes mål er å bidra til økt funksjon, mindre smerte og bedre mestring i hverdagen.\n\nSom en del av CMedical sitt tverrfaglige team samarbeider hun tett med andre behandlere for å sikre en helhetlig og koordinert oppfølging av pasientene. Dette gir et godt grunnlag for å møte komplekse problemstillinger med både faglig bredde og individuell tilpasning.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Morten Andersen",
    title: "Urologi",
    subtitle: "Urolog",
    expertise: ["Urologi", "Sterilisering", "Forhudsoperasjoner", "Refertilisering"],
    image: mortenAndersen,
    category: "urologi",
    slug: "morten-andersen",
    bio: "Morten Andersen er spesialist i kirurgi og spesialist i urologi fra 1993.\n\nTidligere arbeidet som spesialist og overlege ved Sykehuset Innlandet. Tidligere A-hus og Rikshospitalet. Siden 2006 avtalespesialist i urologi, og nå privatpraktiserende urolog ved CMedical i Moelv. Forskningserfaring og publikasjoner. Deltatt i utdanningen av urologer.\n\nMorten har en lang og bred erfaring innen de aller fleste urologiske problemstillinger. Utfører en rekke steriliseringer og forhudsoperasjoner. Operasjoner på penis og refertiliseringer. Utreder og behandler kvinner og menn med ulike urologiske sykdommer og plager. Har pasientfokus.",
    clinics: ["Moelv"]
  },
  {
    name: "Nabeel Yousaf Khan",
    title: "Urologi",
    subtitle: "Urolog",
    expertise: ["Urologi", "Prostata", "Sterilisering", "Forhudsoperasjoner", "Pungkirurgi"],
    image: nabeelYousafKhan,
    category: "urologi",
    slug: "nabeel-yousaf-khan",
    bio: "Nabeel Yousaf Khan er urolog og jobber til daglig ved Sykehuset Innlandet Hamar. Han har bred erfaring med utredning og behandling av urologiske lidelser både hos kvinner og menn. Han har erfaring med blant annet kirurgi ved lidelser i pungen, penis, forhud og gjør mannlig sterilisering. Han er for øyeblikket doktorgradsstipendiat ved Universitet i Oslo og forsker på kirurgisk behandling av godartet forstørrelse av prostata.",
    clinics: ["Moelv"]
  },
  {
    name: "Nicolai Wessel",
    title: "Urologi",
    subtitle: "Urolog",
    expertise: ["Urologi", "Robotkirurgi", "Prostatakreft", "Laparoskopi", "Nyre- og prostatakirurgi"],
    image: nicolaiWessel,
    category: "urologi",
    slug: "nicolai-wessel",
    bio: "Nicolai Wessel er en erfaren spesialist innen kirurgi og urologi med spesialkompetanse innen laparoskopiske urologiske prosedyrer og behandling av prostatakreft. Tidligere overlege ved Aker Sykehus, regnes han blant Europas mest erfarne kirurger og urologer innen robotassistert kirurgi. Nicolai begynte sitt arbeid med robotkirurgi i 2007, etter fem års erfaring med laparoskopisk nyre- og prostatakirurgi, og han har utført over 1.400 robotassisterte prostatakreftoperasjoner.\n\nHan har også deltatt i forskning som er publisert i anerkjente tidsskrifter som Scandinavian Journal of Urology, European Urology (utgitt av European Association of Urology), Urology, Nutrition and Cancer, Neurourology and Urodynamics, samt The Journal of Urology (utgitt av American Urological Association).",
    clinics: ["Majorstuen"]
  },
  {
    name: "Siri Kløkstad",
    title: "Gynekologi",
    subtitle: "Gynekolog",
    expertise: ["Gynekologi", "Underlivsplager", "Vulvasmerter", "Hormoner", "Prevensjon"],
    image: siriKlokstad,
    category: "gynekologi",
    slug: "siri-klokstad",
    bio: "Siri Kløkstad er utdannet gynekolog og har jobbet ved både sykehuset i Elverum og Oslo Universitetsykehus.\n\nNå jobber hun en dag i uken ved CMedical og resten av tiden ved Sex og samfunn i Oslo. Siri er spesielt interessert i underlivsplager, vulvasmerter, hormoner og prevensjon.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Sondre Hassellund",
    title: "Ortopedi",
    subtitle: "Ortoped",
    expertise: ["Ortopedi", "Håndkirurgi", "Albuekirurgi", "Kikkhullskirurgi"],
    image: sondreHassellund,
    category: "ortopedi",
    slug: "sondre-hassellund",
    bio: "Dr. Sondre Hassellund er hånd- og albuekirurg med mange års erfaring fra hånd- og albueseksjonen på Ullevål universitetssykehus.\n\nHan har stor erfaring med akutt og planlagt kirurgi, både åpen kirurgi og med kikkhullsteknikk i hånd og albue.\n\nSondre underviser også på nasjonale kurs for ortopeder i hånd- og albuekirurgi.\n\nHan jobber hos oss i CMedical flere ganger i måneden.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Sonu Lukose",
    title: "Fertilitet",
    subtitle: "Embryolog",
    expertise: ["Fertilitet", "Embryologi", "IVF", "ICSI", "PGT", "Vitrifisering"],
    image: sonuLukose,
    category: "fertilitet",
    slug: "sonu-lukose",
    bio: "Sonu er en ESHRE-sertifisert Senior Klinisk Embryolog ved CMedical Majorstuen. Han har mer enn et tiår med klinisk erfaring fra klinikker i Sør-Amerika og India, etter sin mastergrad i klinisk embryologi.\n\nHan har etablert og jobbet med Guyanas første IVF-laboratorium og er ansvarlig for de første IVF-fødslene fra IVF, ICSI, testikulær sperm-ICSI og frosne embryooverføringer i landet.\n\nHan flyttet tilbake til India og var laboratorieleder ved flere klinikker før han flyttet til Norge, der han ble med i CMedical Oslo som en del av fertilitetsklinikken fra starten av.\n\nHans ekspertområder inkluderer oppsett av IVF-laboratorium, testikulær sperm-ICSI, embryo biopsier for PGT, embryo- og eggvitrifisering.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Stig Hegna",
    title: "Ortopedi",
    subtitle: "Ortoped",
    expertise: ["Ortopedi", "Fotkirurgi", "Ortopedisk kirurgi"],
    image: stigHegna,
    category: "ortopedi",
    slug: "stig-hegna",
    bio: "Dr. Hegna er spesialist i ortopedisk kirurgi og spesialist i fotkirurgi.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Tea Berge",
    title: "Ortopedi",
    subtitle: "Ortoped",
    expertise: ["Ortopedi", "Knekirurgi", "Skulderkirurgi", "Artroskopi", "Skulderinstabilitet"],
    image: teaBerge,
    category: "ortopedi",
    slug: "tea-berge",
    bio: "Tea er spesialist i ortopedisk kirurgi og har jobbet med ortopedi siden 2015.\n\nHun jobber til daglig som overlege på Artroskopiseksjonen ved Oslo Universitetssykehus med kne- og skulderkirurgi som spesialfelt. Hun forsker på skulderinstabilitet og har presentert sitt arbeid på internasjonale kongresser.\n\nTea er en engasjert og kvalitetsbevisst ortoped og det er viktig for henne at pasienten føler seg sett, hørt og ivaretatt.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Thomas Fredrik Thaulow",
    title: "Gynekologi",
    subtitle: "Gynekolog",
    expertise: ["Gynekologi", "Endometriose", "Laparoskopi", "Hysteroskopi", "Endoskopisk kirurgi"],
    image: thomasFredrikThaulow,
    category: "gynekologi",
    slug: "thomas-fredrik-thaulow",
    bio: "Thomas er en av landets fremste spesialister innen endoskopiske operasjoner og utmerker seg som en av de mest kompetente i fagmiljøet når det gjelder å utføre svært komplekse inngrep med laparoskopi og hysteroskopi. Han er en nøkkelperson i det dedikerte endometriose-teamet ved Ullevål sykehus, hvor han diagnostiserer og behandler de mest utfordrende tilfellene fra hele landet. I tillegg er Thomas en verdifull ressurs ved CMedical Majorstuen, hvor han viderefører sin ekspertise og bidrar til å styrke teamet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Tom Henry Sundøen",
    title: "Ortopedi",
    subtitle: "Ortoped",
    expertise: ["Ortopedi", "Skopisk kirurgi", "Hoftekirurgi", "Skulderkirurgi", "Knekirurgi", "Traumatologi", "Idrettsmedisin", "PRP"],
    image: tomHenrySundoen,
    category: "ortopedi",
    slug: "tom-henry-sundoen",
    bio: "Tom Henry Sundøen er ortopedkirurg og traumatolog med særlig kompetanse innen avansert skopisk kirurgi i skulder, albue, håndledd, hofte, knær og ankel. Han utfører skopi i hofteledd som en av få ortopeder i Norge. Han får derfor pasienter fra hele landet.\n\nPå Colosseum Faust i Moss utfører han avansert ortopedisk dagkirurgi. Hovedtyngden er skulder-, hofte- og knekirurgi. Han kan henvise både til offentlige og private sykehus. Bruker regelmessig injeksjonsterapi via ultralyd for å sikre riktig diagnose. Lang erfaring med MR tolkning av muskel og skjelett. Over 10 års erfaring med bruk av platerikt plasma, PRP.\n\nTom Henry har medisinsk grunnutdannelse fra Tyskland og er norsk spesialist i ortopedi/kirurgisk ortopedi. Han har dessuten solid erfaring innen traumatologi, idrettsmedisin og protesekirurgi.\n\nHan har jobbet som overlege på diverse sykehus og vært sentral i oppbygging av en velfungerende dagkirurgisk enhet ved Volvat Fredrikstad.\n\nTom Henry har bred kompetanse innen ortopedi og stor kontaktflate i kirurgisk miljø og er i tillegg sakkyndig for forsikringsselskap og rettsvesen. Han gjør vurdering av medisinsk invaliditetsgrad og second opinion vurderinger.",
    clinics: ["Moss"]
  },
  {
    name: "Tonje Westlie",
    title: "Fysioterapi",
    subtitle: "Håndterapeut",
    expertise: ["Fysioterapi", "Håndterapi", "Albuekirurgi-rehabilitering", "CRPS", "Nerveskader", "Psykomotorisk fysioterapi"],
    image: tonjeWestlie,
    category: "annet",
    slug: "tonje-westlie",
    bio: "Tonje er utdannet fysioterapeut ved OsloMet i 2011. Hun har jobbet i mange år med kompliserte albue- og håndskader ved Oslo universitetssykehus og skadelegevakten. Tonje har videreutdannet seg i psykomotorisk fysioterapi og studert rehabilitering av håndskader ved universitetet i Lund. Hun er styremedlem i Norsk forening for Håndterapi og i tillegg til OUS jobber hun i Nasjonal Kompetansetjeneste for Albuekirurgi.\n\nTonje har bred erfaring med rehabilitering etter brudd, leddbåndsskader og bløtdelsskader i albue og hånd. Hun jobber også med leddstivhet og ulike smertetilstander ved blant annet nerveskader og CRPS.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Trond Jørgensen",
    title: "Urologi",
    subtitle: "Urolog",
    expertise: ["Urologi", "Prostatakreft", "Sterilisering", "Fimoseoperasjoner", "Urologisk kirurgi"],
    image: trondJorgensen,
    category: "urologi",
    slug: "trond-jorgensen",
    bio: "Trond Jørgensen er kirurg og urolog med omfattende forskningserfaring, inkludert flere publiserte internasjonale artikler og en doktorgrad innen prostatakreft. Tidligere tjenestegjorde han som overlege ved Oslo Universitetssykehus, urologisk avdeling. De siste 16 årene har han praktisert som privat urolog, med spesiell ekspertise innen urologisk kirurgi og utredning av prostatakreft. Hvert år utfører han flere hundre steriliseringer og fimoseoperasjoner.\n\nTrond Jørgensen har forfattet eller deltatt i flere internasjonale forskningsartikler publisert i anerkjente tidsskrifter, blant annet American Association for Cancer Research, European Urology og British Journal of Cancer. Hans doktoravhandling, «Prognostic Factors in Metastatic Prostate Cancer», bygde på omfattende studier gjennomført i regi av The Scandinavian Prostatic Cancer Group (SPCG-2).",
    clinics: ["Majorstuen"]
  },
];

// Get specialists sorted alphabetically by first name (A-Å)
export const getSpecialistsSortedByLastName = (): Specialist[] => {
  return [...specialists].sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'nb');
  });
};

// Get specialists by category
export const getSpecialistsByCategory = (category: Specialist['category']): Specialist[] => {
  return specialists.filter(s => s.category === category)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'nb'));
};

// Get all unique clinic names
export const getAllClinics = (): string[] => {
  const clinicSet = new Set<string>();
  specialists.forEach(s => s.clinics?.forEach(c => clinicSet.add(c)));
  return Array.from(clinicSet).sort((a, b) => a.localeCompare(b, 'nb'));
};

// Get specialists by clinic
export const getSpecialistsByClinic = (clinic: string): Specialist[] => {
  return specialists.filter(s => s.clinics?.includes(clinic))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'nb'));
};
