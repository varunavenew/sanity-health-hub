import { PageLayout } from "@/components/layout/PageLayout";

interface PersonvernProps {
  isChatOpen?: boolean;
}

const Personvern = ({ isChatOpen = false }: PersonvernProps) => {
  return (
    <PageLayout isChatOpen={isChatOpen}>
      <div className="container mx-auto px-6 md:px-16 py-20 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-foreground">Privacy policy</h1>

        <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Introduksjon</h2>
            <p>Du skal kunne stole på at vi ivaretar ditt personvern, er åpne om hvordan vi behandler dine personopplysninger, og at vi til enhver tid håndterer dine data i samsvar med gjeldende regelverk.</p>
            <p>Personvernerklæringen inneholder informasjon du har krav på når opplysninger om deg samles inn, samt generell informasjon om hvordan vi behandler personopplysninger. Når vi bruker «du» i denne erklæringen, viser vi til deg som kunde, potensiell kunde eller andre kontakter og samarbeidspartnere vi har registrert personopplysninger om.</p>
            <p>En «personopplysning» er enhver opplysning eller vurdering som kan knyttes til deg som enkeltperson. Det kan være navn, kontaktinformasjon eller fødselsdato.</p>
            <p>«Behandling» betyr enhver bruk av personopplysninger, som innsamling, registrering, lagring, endring, deling, anonymisering, sletting osv.</p>
            <p>Personopplysningsloven (som implementerer personvernforordningen, GDPR) bestemmer hvordan vi skal behandle dine personopplysninger. Det er særskilte krav i loven til behandling av sensitive personopplysninger, som helseopplysninger og medisinske vurderinger. I lovverket omtales slike opplysninger som «særlige kategorier av personopplysninger».</p>
            <p>Som privat helsevirksomhet må CMedical også følge helsepersonell-lovgivningen i behandlingen av personopplysninger, i tillegg til andre særlovgivninger. Relevante lover inkluderer pasientjournalloven (med forskrifter), helsepersonelloven, spesialisthelsetjenesteloven, pasient- og brukerrettighetsloven, helseregisterloven m.fl. Markedsføringsloven og regnskapsloven er også eksempler på lover som regulerer CMedicals behandling av personopplysninger.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Behandlingsansvarlig</h2>
            <p>Behandlingsansvarlig er den enheten som bestemmer formålet med behandlingen av personopplysninger, og som har ansvar for at opplysningene behandles i samsvar med gjeldende regelverk.</p>
            <p>Innenfor CMedical-gruppen i Norge vil behandlingsansvarlig for dine helseopplysninger være det selskapet i gruppen som behandler personopplysninger om deg.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Hvor vi henter dine opplysninger fra</h2>
            <p>Opplysningene vi samler inn, mottar vi blant annet fra deg selv, gjennom samtaler med helsepersonell eller via undersøkelser og behandlinger du gjennomfører hos oss.</p>
            <p>Opplysninger kan også komme fra andre helsetjenester du har vært i kontakt med, som fastlege, andre sykehus eller leverandører av røntgen-/MR-/CT- og laboratorietjenester. I tillegg mottar vi opplysninger fra forsikringsselskaper når du benytter helseforsikring, og vi verifiserer adresseinformasjon mot Folkeregisteret dersom du er privatkunde.</p>
            <p>Noen opplysninger samles inn via informasjonskapsler (cookies) når du besøker våre nettsider. Du kan lese mer om bruk av cookies nedenfor.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Kategorier av behandlede personopplysninger</h2>
            <p>Vi behandler kun de personopplysninger som er nødvendige for å oppfylle formålet med behandlingen. Typiske kategorier er:</p>
            <p><strong>Administrative opplysninger</strong> som navn, adresse, telefonnummer, e-postadresse og fødselsnummer. Avtaleinformasjon. Betalingsinformasjon.</p>
            <p><strong>Journalopplysninger</strong> som sykehistorie, tidligere behandlinger, medisiner du bruker, allergier, diagnoser, vurderinger, prøvesvar, bilder fra røntgen/MR/CT, resepter, sykemeldinger og informasjon om pårørende.</p>
            <p><em>Merk:</em> Når du får en diagnose, helsehjelp eller medisinsk behandling hos oss, er vi lovpålagt å registrere all nødvendig informasjon i pasientjournalen. Innholdet i en pasientjournal er regulert i lov.</p>
            <p><strong>Kommunikasjon,</strong> for eksempel når du kontakter oss i forbindelse med behandling.</p>
            <p><strong>Tekniske opplysninger</strong> som PC-/mobiltjeneste, internettforbindelse, operativsystem, nettleser og IP-adresse. Disse samles inn gjennom bruk av cookies.</p>
            <p>Det er frivillig å oppgi personopplysninger, men dersom du unnlater å gjøre det, kan vi i enkelte tilfeller ikke levere de tjenestene du ønsker.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Formålet med behandlingen av dine personopplysninger</h2>
            <p>Vi behandler dine personopplysninger for følgende formål:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Å identifisere deg som kunde.</li>
              <li>Å tilby forsvarlig helsehjelp og medisinske tjenester.</li>
              <li>Oppfølging av potensielle og eksisterende kunderelasjoner.</li>
              <li>Markedsføring av våre tjenester via nyhetsbrev.</li>
              <li>Sikring av informasjonssikkerhet ved testing, forbedring og utvikling av systemer.</li>
              <li>Kontinuerlig å levere helsetjenester av høy kvalitet ved bruk av data.</li>
              <li>Forebygge og avdekke ulovlige handlinger rettet mot kunder eller CMedical.</li>
              <li>For regnskapsformål.</li>
              <li>For dokumentasjonsformål.</li>
            </ul>
            <p>Det rettslige grunnlaget for behandling av personopplysninger til formål 1 og 3 er at behandlingen er nødvendig for å administrere avtalen med deg om helsehjelp.</p>
            <p>Det rettslige grunnlaget for behandling av personopplysninger til formål 2, 5 og 8 er at behandlingen er pålagt ved lov.</p>
            <p>Det rettslige grunnlaget for behandling av personopplysninger til formål 4 og 6 er ditt samtykke.</p>
            <p>Det rettslige grunnlaget for behandling av personopplysninger til formål 7 og 9 er at behandlingen er pålagt ved lov eller bygger på en berettiget interesse.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Hvem vi deler dine personopplysninger med</h2>

            <h3 className="text-lg font-medium text-foreground mt-4">Helsetjenester eller annet helsepersonell</h3>
            <p>Vi deler helseopplysninger med helseinstitusjoner, henvisende leger eller annet helsepersonell som også gir deg behandling, dersom vi mottar forespørsel om utlevering av pasientopplysninger. Dette skjer kun når det er nødvendig for å gi deg forsvarlig helsehjelp. Informasjonen deles med samarbeidende helsepersonell som er underlagt samme taushetsplikt som ansatte i CMedical. Som pasient har du rett til å motsette deg slik deling, jf. helsepersonelloven.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Offentlige myndigheter</h3>
            <p>Vi utleverer personopplysninger til offentlige myndigheter dersom det kreves ved lov eller dersom det er mistanke om lovbrudd i forbindelse med våre tjenester.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Offentlige helseregistre</h3>
            <p>Vi deler opplysninger vi er pålagt å rapportere til helseregistre, som kreftregisteret.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Databehandlere</h3>
            <p>Vi deler også personopplysninger med underleverandører som utfører oppgaver på våre vegne. I slike tilfeller inngås en egen databehandleravtale for å sikre at opplysningene kun brukes til å levere den avtalte tjenesten. Dette kan gjelde drift og vedlikehold av IT-systemer og løsninger.</p>
            <p>Våre underleverandører er primært lokalisert innen EU/EØS og er dermed underlagt samme regelverk. I enkelte tilfeller kan databehandlere utenfor EU/EØS benyttes. Da sørger vi for at behandlingen skjer med tilstrekkelig beskyttelse.</p>
            <p>Deling av personopplysninger kan også skje ved virksomhetsoverdragelser, som fusjon eller restrukturering av CMedical.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Hvordan vi sikrer dine personopplysninger</h2>
            <p>For å beskytte dine personopplysninger iverksetter vi nødvendige fysiske, tekniske og administrative tiltak, som sikring av lokaler og infrastruktur.</p>
            <p>I henhold til helsepersonell-lovgivningen er våre ansatte underlagt taushetsplikt om opplysninger knyttet til din helse og samtalene du har med oss som pasient. Når det gjelder pasientjournal, hindres uvedkommende fra å få tilgang til dine opplysninger gjennom ulike sikkerhetstiltak, inkludert tilgangskontroller.</p>
            <p>Våre underleverandører som behandler personopplysninger på våre vegne, må også ha tilstrekkelige sikkerhetstiltak og er bundet av taushetsplikt.</p>
            <p>For å sikre konfidensialitet er det viktig at kommunikasjon med deg skjer på en trygg måte. Du bør derfor ikke sende helseopplysninger eller annen sensitiv informasjon via e-post eller sosiale medier. Ta i stedet kontakt med oss på telefon, per post eller ved personlig oppmøte.</p>
            <p>Utveksling av personopplysninger med forsikringsselskaper skjer via dedikerte og krypterte linjer i tråd med gjeldende krav og standarder.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Hvor lenge vi lagrer opplysninger om deg</h2>
            <p>Vi behandler opplysninger om deg så lenge det er nødvendig for å oppfylle formålet de ble samlet inn for. Deretter anonymiseres eller slettes de, med mindre vi er pålagt å lagre opplysningene lenger etter gjeldende lovverk eller har et annet grunnlag for videre behandling.</p>
            <p>Vi sletter ikke opplysninger dersom det finnes uavklarte forhold mellom deg som kunde og CMedical.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Administrative opplysninger</h3>
            <p>Opplysninger knyttet til administrasjon av avtaleforhold lagres så lenge vi har et gyldig behandlingsgrunnlag og det anses nødvendig. Deretter slettes eller anonymiseres de. Eksempelvis lagres betalingsinformasjon i fem år etter utløpet av siste regnskapsår, i samsvar med regnskapsloven.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Pasientjournal</h3>
            <p>Hovedregelen er at pasientjournalen skal oppbevares så lenge det antas å være behov for den på grunn av helsehjelpens karakter. Vi lagrer vanligvis journaler i 10 år. Så lenge journalen eksisterer, oppbevares også kontaktinformasjon knyttet til pasienten.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Dokumentasjon</h3>
            <p>Visse personopplysninger oppbevares for dokumentasjonsformål, for eksempel samtykker som har vært gitt, eller opplysninger som er nødvendige for å fastsette, gjøre gjeldende eller forsvare rettskrav.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Digital kommunikasjon</h2>
            <p>Hvordan du kan kommunisere digitalt med oss, kan variere fra klinikk til klinikk.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Timebestilling</h3>
            <p>Vi har et skjema for timebestilling hvor du kan fylle inn opplysninger og sende forespørsel. Tekstinformasjon slettes automatisk etter 21 dager, mens kontaktinformasjon slettes automatisk etter fem måneder.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">SMS og e-post</h3>
            <p>Korrespondanse via e-post og SMS slettes ved utgangen av hver måned. Helseopplysninger som må oppbevares, overføres til journalsystemet.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Dine rettigheter</h2>
            <p>Du har lovfestede rettigheter etter personopplysningsloven. Ønsker du å utøve dine rettigheter, må du kontakte klinikken du har hatt kontakt med.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Innsyn</h3>
            <p>Du har rett til å få informasjon om hvilke personopplysninger vi behandler om deg og hvordan de brukes.</p>
            <p>Du har også rett til innsyn i din pasientjournal, samt informasjon om hvem som har hatt tilgang til den og hvem som har mottatt opplysninger fra den.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Retting</h3>
            <p>Du har rett til å få rettet personopplysninger som er uriktige eller mangelfulle. Det er viktig at vi har korrekt informasjon, slik at vi f.eks. ikke sender fakturaer til feil adresse. Oppdager du feil, må du kontakte oss slik at vi kan korrigere dem.</p>
            <p>For pasientjournaler er retten til retting begrenset av helsepersonelloven. Dersom vi ikke blir enige om endringer, kan du kreve at det føres en merknad i journalen hvor det fremgår at du som pasient mener det finnes feil eller misvisende opplysninger.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Sletting</h3>
            <p>Du har rett til å få slettet personopplysninger når de ikke lenger er nødvendige for formålet de ble samlet inn for, eller når du trekker tilbake samtykke. Dette gjelder med mindre det finnes annet lovlig grunnlag for behandlingen.</p>
            <p>Opplysninger som behandles på grunnlag av lovpålagte plikter, kan ikke slettes. Det samme gjelder opplysninger som er nødvendige for å fastsette, gjøre gjeldende eller forsvare rettskrav.</p>
            <p>For pasientjournaler er retten til sletting svært begrenset av helsepersonelloven.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Dataportabilitet</h3>
            <p>Du skal i prinsippet kunne ta med deg dine opplysninger til en annen tilsvarende virksomhet. Retten gjelder kun opplysninger du selv har gitt oss, og som brukes til å oppfylle en avtale eller behandles på bakgrunn av samtykke. Du kan be om at opplysningene utleveres eller sendes direkte til ny behandler.</p>
            <p>Det meste av behandlingen CMedical utfører med personopplysninger er begrunnet i en lovpålagt plikt til å yte helsehjelp, og omfattes derfor ikke av retten til dataportabilitet. Din mulighet til å be om utlevering eller overføring påvirker derfor ikke vår plikt til å oppbevare din pasientjournal.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Protest</h3>
            <p>I visse tilfeller har du rett til å protestere mot behandlingen av dine personopplysninger. Dette gjelder ikke for behandlinger som er nødvendige for å levere tjenestene som omfattes av ditt kontraktsforhold, eller for formål som er nødvendige for å drifte og administrere avtalen din.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Rett til begrensning av behandling</h3>
            <p>Du har rett til å kreve at vår behandling av personopplysninger om deg blir begrenset. Du kan be om dette dersom:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>du mener at personopplysningene vi har lagret om deg er uriktige,</li>
              <li>du mener at vår behandling av personopplysninger om deg er ulovlig, eller</li>
              <li>vi ikke lenger trenger personopplysningene, men du har behov for dem for å fastsette eller gjøre gjeldende rettskrav.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Samtykke</h2>

            <h3 className="text-lg font-medium text-foreground mt-4">Helseforsikring</h3>
            <p>For å kunne følge opp forsikringssaker, trenger vi ditt samtykke til å utveksle helseopplysninger med forsikringsselskapet ditt.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Innhenting av relevante opplysninger fra andre behandlere</h3>
            <p>Du kan gi samtykke til at CMedical henter inn nødvendige pasientopplysninger fra andre offentlige eller private behandlere når dette er nødvendig for din behandling.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Kvalitetsregister og forskning</h3>
            <p>Du kan samtykke til at dine helseopplysninger brukes til kvalitetssikring, slik at vi kan følge opp utviklingen din og forbedre våre tjenester. Opplysningene anonymiseres når de hentes ut fra journal og lagres i kvalitetsregisteret.</p>

            <h3 className="text-lg font-medium text-foreground mt-4">Nyhetsbrev</h3>
            <p>Du kan samtykke til å motta nyhetsbrev om våre tjenester via e-post. Pasienter kan samtykke direkte til klinikken. Alle kan abonnere på nyhetsbrev via vår nettside. Vi registrerer navn og e-postadresse, og måler åpningsrate og klikk. Nyhetsbrevet inneholder informasjon om helsetjenester og sendes 4–12 ganger per år. Du kan melde deg av når som helst via lenken i nyhetsbrevet.</p>
            <p>Du kan trekke tilbake samtykke når som helst. Tilbakekall påvirker ikke lovligheten av behandling basert på tidligere samtykke.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Kontakt oss om personvern</h2>
            <p>Har du spørsmål om vår behandling av personopplysninger, kan du kontakte klinikkleder ved den klinikken du har hatt kontakt med. Du har rett på svar uten ugrunnet opphold og senest innen én måned dersom henvendelsen gjelder dine rettigheter etter personopplysningsloven.</p>
            <p>CMedicals personvernombud, Gisle Kjøsen, kan nås på: <a href="mailto:personvernombud@cmedical.no" className="text-primary hover:underline">personvernombud@cmedical.no</a></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Klage</h2>
            <p>Dersom du har fått endelig avslag på en klage knyttet til vår behandling av personopplysninger, og mener at vi ikke respekterer dine rettigheter etter personopplysningsloven, kan du klage til Datatilsynet.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Endringer i denne erklæringen</h2>
            <p>Vi vil oppdatere personvernerklæringen jevnlig for å holde deg informert om hvordan vi behandler personopplysninger.</p>
            <p className="text-sm text-muted-foreground italic mt-4">Desember 2023</p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Personvern;
