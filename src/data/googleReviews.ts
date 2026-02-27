export interface GoogleReview {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const googleReviews: GoogleReview[] = [
  {
    id: 1,
    name: "Trude Pedersen",
    rating: 5,
    text: "Fantastisk opplevelse- hyggelig og dyktig lege. Fikk meg til å føle meg veldig trygg og fikk nyttig informasjon. Legen heter Siri Kløkstad",
    date: "5 måneder siden",
  },
  {
    id: 2,
    name: "Kaja Kollsgård",
    rating: 5,
    text: "Har hatt en veldig behagelig og fin opplevelse med eggfrys på CMedical. Min lege Jackson var svært dyktig og betryggende. Ved selve egguttaket var Birgitte og Jeanett så gode til å få meg til å slappe av og føle med trygg, at opplevelsen var tilnærmet smertefri. Sykepleier Line fulgte meg opp og hele veien og ga meg all informasjon jeg trengte. Anbefaler CMedical på det sterkeste.",
    date: "7 måneder siden",
  },
  {
    id: 3,
    name: "Børge Thue",
    rating: 5,
    text: "God servise, gjennomføringsevne. Fantastisk personale og flotte lokaler og god meny.",
    date: "1 måned siden",
  },
  {
    id: 4,
    name: "Basse Grefsrud",
    rating: 5,
    text: "Fra start til etter operasjonen har alt gått på skinner veldig fornøyd",
    date: "2 uker siden",
  },
  {
    id: 5,
    name: "Thor Gustavsen",
    rating: 5,
    text: "Etter robotassistert kirurgi for prostatakreft av kirurg Nicolai Wessel, er jeg utrolig fornøyd. Både før og etter operasjonen. Fikk helt super informasjon om alt jeg lurte på og Nicolai Wessel var utrolig sympatisk og brukte god tid med meg etter operasjonen. Hele teamet rundt meg med anestesilege og sykepleier var profesjonelle og jeg følte meg så godt ivaretatt. Tusen takk til alle sammen",
    date: "2 måneder siden",
  },
  {
    id: 6,
    name: "Kjell Olav Rebne",
    rating: 5,
    text: "Full score på alle punkter fra mottakelse, forberedelse til operasjon, operasjon, oppvåkning, etterbehandling, mat, service og kompetanse hele veien. Ansvalig lege var Trond Jørgensen",
    date: "1 måned siden",
  },
  {
    id: 7,
    name: "Anders Engh",
    rating: 5,
    text: "Jeg fikk påvist artrose i håndleddet mitt og ble henvist til Jan Ragnar Haugstvedt! Ekstremt dyktig håndkirurg og en usedvanlig hyggelig kar! Hele opplevelsen fra ankomst operasjonsdag av Anne Emilie, til teamet med Margrethe i spissen gjorde en litt skummel dag til det motsatte! De første 14 dagene etter inngrepet har vært tilnærmet smertefritt. Kan anbefale klinikken på det sterkeste og takker for opplevelsen. Keep up the good work!",
    date: "4 måneder siden",
  },
  {
    id: 8,
    name: "Tiril Charlotte Ulrichsen",
    rating: 5,
    text: "Jeg hadde en veldig fin opplevelse hos CMedical. Ble tatt godt imot, og følte meg både hørt og forstått gjennom hele timen. Gynekologen Ida var nøye i arbeidet og fikk meg til å føle meg trygg og godt ivaretatt. Jeg kommer absolutt til å anbefale CMedical og kommer tilbake!",
    date: "1 måned siden",
  },
  {
    id: 9,
    name: "Cato Ingebretsen",
    rating: 5,
    text: "Jeg hadde en særskilt god opplevelse ved bruk av CMedical i fm. en kompleks, større skulderoperasjon i november 2024. CMedical var svært imøtekommende og profesjonelle. Spesielt må jeg fremheve overlege Kristian Marstrand Warholm som så min motivasjon og ga meg muligheten til operasjonen på tross av min høye alder (60). Allerede etter to måneder var jeg i gang med styrketrening og ett år senere er jeg sterkere i skulderen enn noen gang. En stor og hjertelig takk til Kristian og Team CMedical.",
    date: "2 måneder siden",
  },
  {
    id: 10,
    name: "Martine Widing",
    rating: 5,
    text: "Hyggelig og god opplevelse. Følte meg godt ivaretatt :)",
    date: "3 måneder siden",
  },
  {
    id: 11,
    name: "Line Toft Sæther",
    rating: 5,
    text: "Nydelig sted med fantastiske mennesker. Fikk veldig god hjelp av legene og sykepleierne. Super opplevelse med nedfrysning av egg.",
    date: "6 måneder siden",
  },
  {
    id: 12,
    name: "Mari Nilsen",
    rating: 5,
    text: "Utførte IVF her i 2023 og endte opp med en nydelig gutt etter 3 forsøk. Kan ikke garantere andre å være så heldig, men kan garantere at CMedical vil ta godt vare på deg i gjennom hele prosessen. Har ingen ting å klage på.",
    date: "11 måneder siden",
  },
  {
    id: 13,
    name: "Terje Schults",
    rating: 5,
    text: "Veldig prof behandling, veldig hyggelig og seriøse medarbeidere. Rommet var fantastisk",
    date: "3 måneder siden",
  },
  {
    id: 14,
    name: "Sunniva Hage",
    rating: 5,
    text: "Ingvild Aanerud er en dyktig osteopat med stor kunnskap. Hun er varm, lyttende, trygg og har et stort engasjement for pasientene sine. Ingvild er spesielt god på kvinnehelse, men i tillegg til dette er hun en svært dyktig osteopat som kan behandle de fleste former for plager. Jeg kan virkelig anbefale Ingvild.",
    date: "7 måneder siden",
  },
];

export const googleRatingData = {
  averageRating: 4.6,
  // No longer showing total count as per user request
};
