import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageProps {
  isChatOpen: boolean;
}

const FastlegeveiledningOvergangsalder = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Fastlegeveiledning overgangsalder | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero */}
      <section className="bg-brand-dark py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8 max-w-3xl">
          <button
            onClick={() => navigate("/behandlinger/gynekologi/overgangsalder")}
            className="text-white/60 hover:text-white text-sm font-light flex items-center gap-1 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Tilbake til overgangsalder
          </button>
          <h1 className="text-3xl md:text-4xl font-normal text-white mb-4">
            Fastlegeveiledning overgangsalder
          </h1>
          <p className="text-white/70 font-light">
            Veileder for fastleger – Forenklet utredning og behandling av peri- og menopause
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 md:px-8 max-w-3xl prose-article">

          <p className="text-foreground/80 font-light leading-relaxed mb-8">
            Denne veilederen er et praktisk verktøy for fastleger ved utredning og behandling av peri- og menopausale kvinner. Den baserer seg på Norsk gynekologisk veileder 2024, NICE NG23 (2024), British Menopause Society (BMS) retningslinjer, European Society of Endocrinology (ESE) kliniske retningslinjer 2025, samt relevant forskning på spesielle pasientgrupper.
          </p>
          <p className="text-foreground/60 font-light text-sm italic mb-12">
            Viktig presisering: Dette er et forslag til klinisk tilnærming. Klinikere må alltid anvende faglig skjønn og huske at retningslinjer endres kontinuerlig. Individuell vurdering og oppfølging er essensielt.
          </p>

          {/* Utredning */}
          <Section title="Utredning">
            <h3 className="text-lg font-normal text-foreground mb-3">Holistisk tilnærming: De fire søylene</h3>
            <p className="mb-4">Ved vurdering av peri- og menopausale symptomer anbefales en helhetlig tilnærming basert på fire søyler:</p>
            <ol className="list-decimal pl-6 space-y-1 mb-6">
              <li>Hormoner – Østrogen-, progesteron- og testosteronstatus</li>
              <li>Psykologisk tilstand – Familiære relasjoner, arbeidskonflikter, angst, depresjon, søvnkvalitet</li>
              <li>Ernæring – Kosthold, vekt, metabolsk helse</li>
              <li>Fysisk aktivitet – Treningsvaner og daglig bevegelse</li>
            </ol>

            <h3 className="text-lg font-normal text-foreground mb-3">Differensialdiagnoser</h3>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Hyperthyreose og hypothyreose (Feokromocytom, Carcinoid syndrom, Leukemi, Arytmier)</li>
              <li>Søvnforstyrrelser av andre årsaker</li>
              <li>Medikamentbivirkninger</li>
              <li>Angstlidelser og depresjon</li>
            </ul>
          </Section>

          {/* Aldersbasert håndtering */}
          <Section title="Aldersbasert håndtering">
            <h3 className="text-lg font-normal text-foreground mb-3">Under 40 år: Prematur ovarialsvikt (POI)</h3>
            <p className="mb-4">Alle kvinner med POI skal henvises til gynekolog for utredning og oppfølging.</p>
            <p className="mb-6">POI diagnostiseres ved oligo-/amenoré i minst 4 måneder kombinert med FSH-nivåer i postmenopausalt område målt to ganger med minimum 4 ukers mellomrom. Disse kvinnene har økt risiko for kardiovaskulær sykdom, osteoporose, kognitiv svikt og for tidlig død, og krever derfor spesialisert oppfølging.</p>

            <h3 className="text-lg font-normal text-foreground mb-3">40–45 år: Tidlig menopause</h3>
            <p className="mb-4">Bør henvises til gynekolog hvis mulig.</p>
            <p className="mb-6">Kvinner med tidlig menopause har økning i langtidshelserisiko, og spesialistvurdering kan sikre optimal hormonsubstitusjon minst frem til forventet menopausealder (ca. 52–53 år).</p>

            <h3 className="text-lg font-normal text-foreground mb-3">45 år og eldre: Naturlig menopause</h3>
            <p className="mb-4">Kan håndteres av fastleger.</p>
            <p className="mb-6">Viktig unntak: Alle blødningsforstyrrelser (menoragi/metroragi) bør henvises til gynekolog for videre utredning. Dette gjelder spesielt uregelmessige eller kraftige blødninger, da underliggende patologi (polypper, myomer, adenomyose, endometriehyperplasi eller malignitet) må utelukkes.</p>
          </Section>

          {/* Behandling */}
          <Section title="Behandling">
            <div className="bg-secondary/30 rounded-xl p-6 mb-6 border-l-4 border-foreground/20">
              <p className="italic text-foreground/70 font-light">
                «Det er kvinnens subjektive overgangsplager, og hennes opplevelse av hvordan symptomene påvirker livskvaliteten som avgjør om hun skal tilbys behandling.»
              </p>
              <p className="text-sm text-muted-foreground mt-2">– Norsk gynekologisk veileder 2024</p>
            </div>

            <h3 className="text-lg font-normal text-foreground mb-3">1. Livsstilsoptimalisering</h3>
            <p className="mb-3">Før oppstart av farmakologisk behandling bør det alltid gis råd om:</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Røykeslutt</li>
              <li>Regelmessig fysisk aktivitet (obs styrketrening)</li>
              <li>Sunt kosthold og vektkontroll</li>
              <li>Søvnhygiene</li>
              <li>Stressmestring/kognitive verktøy</li>
            </ul>

            <h3 className="text-lg font-normal text-foreground mb-3">2. Menopausal hormonbehandling (MHT)</h3>
            <p className="mb-6">MHT er den mest effektive behandlingen for vasomotoriske symptomer, søvnforstyrrelser, humørsvingninger og redusert livskvalitet knyttet til østrogen og progesteron mangel.</p>

            <h4 className="font-medium text-foreground mb-2">Østrogentilførsel</h4>
            <p className="mb-3">Transdermal østrogen anbefales fremfor peroral administrasjon for å redusere risiko for tromboemboliske hendelser.</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Plaster (Estradot) gir jevnere distribusjon og mindre hormonelle svingninger sammenlignet med spray (Lenzetto) og gel (Estrogel).</li>
              <li>Ved naturlig menopause startes med lavest mulig effektive dose.</li>
              <li>Dose justeres etter symptomer og respons – individuell titrering er nøkkelen.</li>
            </ul>

            <h4 className="font-medium text-foreground mb-2">Gestagenbeskyttelse av endometriet</h4>
            <p className="mb-3">Alle kvinner med livmor skal ha gestagen som endometriebeskyttelse.</p>
            <p className="mb-2"><strong>Førstevalg: Mikronisert progesteron (Utrogestan)</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Lavere brystkreftrisiko sammenlignet med syntetiske gestagener.</li>
              <li>Bør tas om kvelden før sengetid på grunn av søvndyssende effekt.</li>
              <li>Mange kvinner opplever bedre søvnkvalitet og redusert angst/uro ved bruk av Utrogestan.</li>
            </ul>
            <p className="mb-2"><strong>Mirena-spiral som alternativ</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Gir lokal endometriebeskyttelse med minimal systemisk progesteronpåvirkning.</li>
              <li>Reduserer blødninger med opptil 90%, særlig godt alternativ ved samtidig prevensjonsbehov og/eller blødningsforstyrrelser.</li>
              <li>Viktig: Mirena dekker ikke alltid opp for typiske progesteron-mangel-symptomer som tidlig oppvåkning, indre uro eller «frynsete nerver».</li>
              <li>Ved slike symptomer bør Utrogestan gis i tillegg til Mirena + transdermal østrogen.</li>
            </ul>

            <h4 className="font-medium text-foreground mb-2">Behandlingsregime</h4>
            <p className="mb-2"><strong>Sekvensiell behandling</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Indikasjon: Perimenopause og inntil 6–12 måneder etter siste menstruasjon.</li>
              <li>Utrogestan gis 12–14 dager per måned, østrogen kontinuerlig.</li>
              <li>Dette regime etterlikner den naturlige menstruasjonssyklus og gir kontrollert bortfallsblødning.</li>
            </ul>
            <p className="text-sm text-muted-foreground mb-4">Unntak: Ved uttalt søvnvansker og betydelig uro kan man forsøke kontinuerlig Utrogestan, men bør gå tilbake til sekvensiell bruk hvis ingen effekt innen 3 måneder.</p>

            <p className="mb-2"><strong>Kontinuerlig kombinert behandling</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Indikasjon: Postmenopause (&gt;12 måneder siden siste menstruasjon).</li>
              <li>Både østrogen og gestagen gis daglig.</li>
              <li>Målsetting er blødningsfrihet etter 3–4 måneder.</li>
            </ul>

            <h4 className="font-medium text-foreground mb-2">Vaginal østrogen</h4>
            <p className="mb-3">Indikasjon: Vaginal atrofi, hyppige urinveisinfeksjoner, urinlekkasje, fremfall.</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Kan gis i tillegg til systemisk MHT.</li>
              <li>Minimal systemisk absorpsjon – trygt også for kvinner med kontraindikasjoner mot systemisk MHT.</li>
              <li>Preparater: Vagifem (vaginaltabletter), Ovesterin (gel/tabletter), Gynoflor (østriol + melkesyrebakterier).</li>
            </ul>

            <h4 className="font-medium text-foreground mb-2">Testosteron for kvinner</h4>
            <p className="mb-2"><strong>Indikasjon:</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Redusert seksuell lyst hos kvinner som ikke responderer tilstrekkelig på østrogen og progesteron alene.</li>
              <li>Noen studier indikerer også forbedret fokus, konsentrasjon og øket energi.</li>
            </ul>
            <p className="mb-2"><strong>Dosering og oppfølging:</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Preparat: Tostran gel</li>
              <li>Dose: Ertestor gelklump bak knehasen annenhver dag til morgen.</li>
              <li>Målnivå: Skal ikke overstige 2,2 nmol/L (testosteronnivå måles etter 3 uker).</li>
              <li>Effekt på seksuell funksjon og bivirkninger (hårvekst, akne) evalueres etter 6 uker.</li>
            </ul>
            <p className="text-sm text-muted-foreground mb-6">NB: Testosteron er ikke godkjent for kvinner i Norge, men kan forskrives off-label etter individuell vurdering.</p>

            <h4 className="font-medium text-foreground mb-2">Kontraindikasjoner for MHT</h4>
            <p className="mb-3">Vi fraråder MHT ved:</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Brystkreft (aktiv eller tidligere)</li>
              <li>Kjente eller mistenkte østrogensensitive maligne tilstander</li>
              <li>Vaginalblødning av ukjent årsak</li>
              <li>Aktuell venøs tromboembolisme (VTE)</li>
              <li>Tidligere eller pågående koronar hjertesykdom</li>
              <li>Aktiv leversykdom</li>
              <li>Porfyria cutanea tarda</li>
            </ul>
          </Section>

          {/* Spesielle pasientgrupper */}
          <Section title="Spesielle pasientgrupper">
            <h3 className="text-lg font-normal text-foreground mb-3">Migrene med aura</h3>
            <p className="mb-3">Transdermale østrogener kan brukes ved migrene med aura, men orale østrogener er kontraindisert på grunn av økt risiko for arterielle hendelser.</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Plaster (Estradot) gir jevnere distribusjon og færre hormonelle svingninger.</li>
              <li>Syklisk progesteron forverrer migrene. Mikronisert progesteron provoserer frem minst migrene.</li>
              <li>Alternativ: Mirena-spiral + transdermal østrogen for jevnest mulig hormonell stabilitet.</li>
            </ul>
            <p className="text-sm text-muted-foreground mb-6">Absolutt kontraindikasjon hvis kvinnen i tillegg røyker eller har to eller flere slagrisikofaktorer.</p>

            <h3 className="text-lg font-normal text-foreground mb-3">Endometriose</h3>
            <p className="mb-3">MHT bør absolutt tilbys til kvinner med endometriose i menopause – forskning viser at fordelene veier tyngre enn risikoene.</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Kontinuerlig kombinert MHT er førstevalget, også etter hysterektomi.</li>
              <li>Østrogen monoterapi kan reaktivere endometrioselesjonene.</li>
              <li>Anbefalt regime: Mirena og/eller Utrogestan + transdermal østrogen.</li>
              <li>Kvinner med gjentatte kirurgiske inngrep for endometriose har større sannsynlighet for tidlig menopause.</li>
            </ul>

            <h3 className="text-lg font-normal text-foreground mb-3">ADHD</h3>
            <p className="mb-3">Østrogen øker dopaminproduksjon i hjernen; når østrogen faller forverres ADHD-symptomer. Progesteron kan hemme dopaminfrigjøring og forsterke symptomer.</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Syklisk regime med Utrogestan om kvelden, men Mirena-spiral er best for minst systemisk påvirkning.</li>
              <li>Transdermal østrogen (plaster, gel eller spray).</li>
            </ul>

            <h3 className="text-lg font-normal text-foreground mb-3">Hypothyroidisme</h3>
            <p className="mb-3">Hypothyroidisme er 10 ganger vanligere hos kvinner enn menn, og 12–20% av kvinner over 60 år har underaktiv skjoldbruskkjertel.</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Oral østrogen øker TBG, noe som reduserer fritt T4 – kan kreve økning av levothyroxin-dosen.</li>
              <li>TSH bør måles på nytt etter oppstart av oral kombinert MHT.</li>
              <li>Transdermal MHT påvirker ikke skjoldbruskkjertel-funksjon like mye.</li>
            </ul>

            <h3 className="text-lg font-normal text-foreground mb-3">Type 2-diabetes</h3>
            <p className="mb-3">Menopause øker risikoen for insulinresistens betydelig fordi synkende østrogen gjør kroppen mindre responsiv til insulin.</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Reduserer HbA1c og fastende glukose.</li>
              <li>35,8% reduksjon i insulinresistens (HOMA-IR) sammenlignet med placebo.</li>
              <li>21–30% lavere risiko for å utvikle diabetes (WHI-studien).</li>
              <li>MHT forbedrer også lipidprofil og reduserer sentral fettakkumulering.</li>
            </ul>
            <p className="text-sm text-muted-foreground mb-6">Viktig: MHT bør ikke forskrives kun for diabetesforebygging – symptomlindring er hovedindikasjonen.</p>

            <h3 className="text-lg font-normal text-foreground mb-3">Metabolsk syndrom og fedme</h3>
            <p className="mb-3">50% av kardiovaskulære hendelser hos kvinner er relatert til metabolske forstyrrelser.</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>MHT reduserer BMI, midje-omkrets og abdominalt fett.</li>
              <li>Senker LDL-kolesterol og triglyserider, øker HDL.</li>
            </ul>
            <p className="mb-2"><strong>Tirzepatid (GLP-1/GIP-agonist) + MHT:</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>MHT-brukere: ~20% total kroppsvekttap etter 18 måneder.</li>
              <li>Ikke-brukere: ~15% total kroppsvekttap etter 18 måneder.</li>
              <li>45% av MHT-brukere oppnådde ≥20% vekttap vs. 18% av ikke-brukere.</li>
            </ul>

            <h3 className="text-lg font-normal text-foreground mb-3">Revmatoid artritt (RA)</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>MHT reduserer inflammatoriske markører (TNF-α, IL-6).</li>
              <li>Bedrer disease activity score (DAS28).</li>
              <li>Forbedrer benmineraltetthet og kan ha beskyttende effekt mot ledddestruksjon.</li>
            </ul>
            <p className="text-sm text-muted-foreground mb-6">Viktig: MHT frarådes for kvinner med lupus og anti-fosfolipid antistoffer på grunn av økt risiko for blodpropp.</p>

            <h3 className="text-lg font-normal text-foreground mb-3">PCOS (Polycystisk ovariesyndrom)</h3>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Transdermal østrogen + mikronisert progesteron eller Mirena-spiral.</li>
              <li>Kvinner med PCOS kan ha nytte av testosteron som del av MHT.</li>
              <li>Livsstilsintervensjon (vektnedgang, kosthold, fysisk aktivitet) fortsatt viktig.</li>
            </ul>
          </Section>

          {/* Blødningsforstyrrelser */}
          <Section title="Betydelige blødningsforstyrrelser">
            <p className="mb-3">Ved betydelige blødningsforstyrrelser perimenopausalt behandles dette best med Mirena-spiral eller kirurgisk inngrep.</p>
            <p className="mb-3">Henvisning til gynekolog ved:</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Kraftige eller uregelmessige blødninger som ikke responderer på konservativ behandling</li>
              <li>Postmenopausal blødning</li>
              <li>Blødning av ukjent årsak</li>
            </ul>
          </Section>

          {/* Oppsummering */}
          <Section title="Oppsummering og praktiske råd">
            <h3 className="text-lg font-normal text-foreground mb-3">Start med det grunnleggende</h3>
            <ol className="list-decimal pl-6 space-y-1 mb-6">
              <li>Livsstilsoptimalisering bestandig.</li>
              <li>Individuell vurdering av symptomer, risikofaktorer og pasientpreferanser.</li>
              <li>Laveste effektive dose i start, ingen tidsbegrensning i behandling.</li>
            </ol>

            <h3 className="text-lg font-normal text-foreground mb-3">Velg riktig MHT</h3>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Østrogen: Transdermal (plaster, gel, spray) fremfor peroral.</li>
              <li>Gestagen: Mikronisert progesteron (Utrogestan) fremfor syntetiske gestagener.</li>
              <li>Regime: Sekvensiell perimenopausalt, kontinuerlig postmenopausalt.</li>
            </ul>

            <h3 className="text-lg font-normal text-foreground mb-3">Ikke glem spesielle behov</h3>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Vaginal atrofi: Lokal østrogen i tillegg.</li>
              <li>Redusert libido: Vurder testosteron.</li>
              <li>Komorbiditet: Tilpass behandling til hypothyreose, diabetes, ADHD, migrene, endometriose, etc.</li>
            </ul>

            <h3 className="text-lg font-normal text-foreground mb-3">Henvisning til gynekolog ved:</h3>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>POI (&lt;40 år) – alltid</li>
              <li>Tidlig menopause (40–45 år) – anbefalt</li>
              <li>Blødningsforstyrrelser – menoragi/metroragi</li>
              <li>Kompliserte tilfeller eller manglende respons på behandling</li>
            </ul>
          </Section>

          {/* Kilder */}
          <Section title="Kilder">
            <ol className="list-decimal pl-6 space-y-2 mb-6 text-sm">
              <li>Norsk gynekologisk veileder kapittel menopause 2024</li>
              <li>NICE NG23 Menopause guideline 2024 – menopause, POI, genitourinære symptomer</li>
              <li>British Menopause Society retningslinjer 2022–2025 – endometriose, migrene, ADHD, autoimmune sykdommer, diabetes, metabolsk syndrom, PCOS</li>
              <li>European Society of Endocrinology guidelines 2025</li>
              <li>Osianlis E, et al. ADHD and Sex Hormones in Females: A Systematic Review. <em>Journal of Attention Disorders</em> 2025; 29(9):706-723</li>
            </ol>
          </Section>

          <p className="text-sm text-muted-foreground italic mb-12">
            Avsluttende merknad: Denne veilederen er et forslag til klinisk praksis og skal ikke erstatte individuell klinisk vurdering eller oppdaterte nasjonale retningslinjer. Faglig skjønn og pasientsentrert tilnærming står alltid sentralt.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/behandlinger/gynekologi/overgangsalder")}
              variant="outline"
              className="rounded-md font-light"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Tilbake til overgangsalder
            </Button>
            <Button
              onClick={() => navigate("/booking?kategori=gynekologi")}
              className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-md font-light"
            >
              Bestill time
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </article>
    </PageLayout>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-normal text-foreground mb-6 pb-3 border-b border-border">{title}</h2>
    <div className="text-foreground/80 font-light leading-relaxed">
      {children}
    </div>
  </section>
);

export default FastlegeveiledningOvergangsalder;
