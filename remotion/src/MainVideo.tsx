import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { PrototypeScene } from "./scenes/PrototypeScene";
import { BookingScene } from "./scenes/BookingScene";
import { SplitMobileScene } from "./scenes/SplitMobileScene";
import { SliderScene } from "./scenes/SliderScene";
import { StackDesktopScene } from "./scenes/StackDesktopScene";
import { RibbonScene } from "./scenes/RibbonScene";
import { StickyNavScene } from "./scenes/StickyNavScene";
import { OldBookingScene } from "./scenes/OldBookingScene";
import { BookingFlowScene } from "./scenes/BookingFlowScene";
import { ChapterScene } from "./scenes/ChapterScene";
import { ChallengeScene } from "./scenes/ChallengeScene";
import { DataScene } from "./scenes/DataScene";
import { MarketScene } from "./scenes/MarketScene";
import { StrategyScene } from "./scenes/StrategyScene";
import { ContentScene } from "./scenes/ContentScene";
import { DesignSystemScene } from "./scenes/DesignSystemScene";
import { BuildScene } from "./scenes/BuildScene";
import { OutcomeScene } from "./scenes/OutcomeScene";
import { AgencyScene } from "./scenes/AgencyScene";
import { ProgressBar } from "./components/Fx";
import { PALETTE } from "./theme";

const { fontFamily } = loadFont("normal", { weights: ["200", "300", "400"], subsets: ["latin"] });

const S = (p: string, h: number) => ({ src: `cmp/${p}.png`, h });
const snap = springTiming({ config: { damping: 200 }, durationInFrames: 15 });
const T = 15;

// scene durations — fortellingen: utfordring → innsikt → strategi → design → løsning → effekt
const D = {
  intro: 90,
  ch1: 80,
  challenge: 190,
  ch2: 80,
  data: 210,
  market: 190,
  ch3: 80,
  strategy: 190,
  content: 170,
  ch4: 80,
  proto1: 190,
  proto2: 150,
  designSystem: 190,
  ch5: 80,
  homeSplit: 170,
  homeSlider: 140,
  priserSplit: 180,
  priserSlider: 140,
  priserSticky: 200,
  oldBooking: 160,
  booking: 170,
  bookingFlow: 260,
  spesialister: 140,
  desktop: 170,
  gyn: 120,
  build: 190,
  ribbon: 120,
  ch6: 80,
  outcome: 230,
  agency: 180,
  outro: 120,
};

const SUM = Object.values(D).reduce((a, b) => a + b, 0);
const SCENES = Object.keys(D).length;
export const TOTAL = SUM - (SCENES - 1) * T;

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, backgroundColor: PALETTE.deep }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.intro}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      {/* ============ 01 UTFORDRINGEN ============ */}
      <TransitionSeries.Sequence durationInFrames={D.ch1}>
        <ChapterScene
          num="01"
          title="Utfordringen"
          sub="En etablert helseaktør med sterkt fagmiljø — og en nettside som ikke fortalte det."
          marquee="UTFORDRING"
          duration={D.ch1}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.challenge}>
        <ChallengeScene duration={D.challenge} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      {/* ============ 02 ANALYSE OG INNSIKT ============ */}
      <TransitionSeries.Sequence durationInFrames={D.ch2}>
        <ChapterScene
          num="02"
          title="Analyse og innsikt"
          sub="Vi så på tall og adferd før vi så på farger: klikk, konverteringer, frafall — og markedet rundt."
          marquee="INNSIKT"
          duration={D.ch2}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.data}>
        <DataScene duration={D.data} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.market}>
        <MarketScene duration={D.market} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      {/* ============ 03 STRATEGI ============ */}
      <TransitionSeries.Sequence durationInFrames={D.ch3}>
        <ChapterScene
          num="03"
          title="Strategi"
          sub="Forretningsmålene satt i rekkefølge — og innholdet strukturert etter pasientens spørsmål."
          marquee="STRATEGI"
          duration={D.ch3}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.strategy}>
        <StrategyScene duration={D.strategy} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.content}>
        <ContentScene duration={D.content} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      {/* ============ 04 DESIGNPROSESS ============ */}
      <TransitionSeries.Sequence durationInFrames={D.ch4}>
        <ChapterScene
          num="04"
          title="Designprosessen"
          sub="Fra wireframes og tidlige skisser til et visuelt system som tåler over hundre sider."
          marquee="DESIGN"
          duration={D.ch4}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.proto1}>
        <PrototypeScene
          kicker="Wireframes"
          title={"Fra skisse\ntil flate."}
          note="Vi tegnet hierarki, rytme og hva som skal møte pasienten først — før én eneste farge var på plass."
          shot={S("new-mobile-home", 5592)}
          duration={D.proto1}
          reveal={0.62}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.proto2}>
        <PrototypeScene
          kicker="Wireframes"
          title={"Samme system,\nhver flate."}
          note="Prislister, fagområder og booking bygget på samme rutenett — derfor føles alt som én side, ikke ti."
          shot={S("new-mobile-priser", 8000)}
          duration={D.proto2}
          reveal={0.4}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.designSystem}>
        <DesignSystemScene duration={D.designSystem} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      {/* ============ 05 LØSNINGEN ============ */}
      <TransitionSeries.Sequence durationInFrames={D.ch5}>
        <ChapterScene
          num="05"
          title="Løsningen"
          sub="Slik ser innsikten ut når den er bygget: side for side, flate for flate."
          marquee="LØSNINGEN"
          duration={D.ch5}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.homeSplit}>
        <SplitMobileScene
          kicker="Forsiden, mobil"
          title={"Samme innhold.\nHelt ny rytme."}
          note="Til venstre dagens cmedical.no. Til høyre den nye flaten — roligere hierarki, tydelig hero og innhold som puster."
          before={S("old-mobile-home", 5592)}
          after={S("new-mobile-home", 5592)}
          duration={D.homeSplit}
          to={0.82}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.homeSlider}>
        <SliderScene
          kicker="Dra i skillelinjen"
          title="Før. Etter."
          before={S("old-mobile-home", 5592)}
          after={S("new-mobile-home", 5592)}
          duration={D.homeSlider}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.priserSplit}>
        <SplitMobileScene
          kicker="Priser"
          title={"Priser du\nfaktisk finner."}
          note="Fra en lang engelsk tabell til en norsk prisliste med kategorier, varighet og «Bestill time» på hver eneste linje."
          before={S("old-mobile-priser", 5154)}
          after={S("new-mobile-priser", 8000)}
          duration={D.priserSplit}
          to={0.35}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.priserSlider}>
        <SliderScene
          kicker="Prissiden, side ved side"
          title="Før. Etter."
          before={S("old-mobile-priser", 5154)}
          after={S("new-mobile-priser", 8000)}
          duration={D.priserSlider}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.priserSticky}>
        <StickyNavScene
          kicker="Mobiloptimalisering"
          title={"Menyen som\nblir med deg."}
          note="Når du scroller i prislisten på mobil, låser kategorimenyen seg til toppen — og markerer automatisk hvilket fagområde du står i. Ett trykk, og du hopper videre."
          duration={D.priserSticky}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.oldBooking}>
        <OldBookingScene
          kicker="Friksjonen i dag"
          title={"Slik bestiller\nman i dag."}
          note="Dagens «Book»-knapp åpner et eget vindu på engelsk: velg land, velg behandlingstype, velg klinikk — før du i det hele tatt ser en tid eller en pris."
          duration={D.oldBooking}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.booking}>
        <BookingScene
          kicker="Ny bookingflyt"
          title={"Timebestilling\nsom er en flate."}
          note="Nå er bestillingen en del av opplevelsen — samme språk, samme design, fem tydelige steg."
          steps={["Tjeneste", "Sted", "Behandler", "Tid", "Bekreft"]}
          mobile={S("new-mobile-booking", 1508)}
          desktop={{ src: "cmp/new-desktop-booking.png", h: 1679 }}
          duration={D.booking}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.bookingFlow}>
        <BookingFlowScene
          kicker="Hele flyten"
          title={"Fire skjermer,\nferdig bestilt."}
          note="Tjeneste med pris og varighet, behandler med bilde og fagfelt, ledige tider på ekte kalender — og en bekreftelse på norsk. Alt uten å forlate siden."
          duration={D.bookingFlow}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.spesialister}>
        <SplitMobileScene
          kicker="Spesialistene"
          title={"Menneskene\nfram i lyset."}
          note="Over 50 spesialister med egne profiler, fagfelt og direkte timebestilling — istedenfor en flat liste."
          before={S("old-mobile-spesialister", 5592)}
          after={S("new-mobile-spesialister", 5592)}
          duration={D.spesialister}
          from={0.05}
          to={0.85}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.desktop}>
        <StackDesktopScene
          kicker="Desktop"
          title={"Bredere skjerm,\nsamme ro."}
          note="Forsiden på desktop: fra tett komponentmiks til en sammenhengende fortelling som holder tempoet hele veien ned."
          before={S("old-desktop-home", 4844)}
          after={S("new-desktop-home", 5400)}
          duration={D.desktop}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.gyn}>
        <SplitMobileScene
          kicker="Fagområde"
          title={"Fag som\nfortelling."}
          note="Gynekologi og kvinnehelse: hero, temaer, priser og behandlere i én sammenhengende reise."
          before={S("old-mobile-gyn", 5592)}
          after={S("new-mobile-gyn", 7000)}
          duration={D.gyn}
          to={0.5}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence durationInFrames={D.build}>
        <BuildScene duration={D.build} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.ribbon}>
        <RibbonScene
          title={"Hele siden,\npå én gang."}
          note="Priser, fagområder, booking og spesialister — bygget som ett system, ikke som løse sider."
          duration={D.ribbon}
          cols={[
            { src: "cmp/new-mobile-spesialister.png", h: 5592, speed: 1, dir: -1 },
            { src: "cmp/new-mobile-priser.png", h: 8000 * 0.6, speed: 1, dir: 1 },
            { src: "cmp/new-desktop-priser.png", h: 5400 * (430 / 1440), speed: 1, dir: -1 },
            { src: "cmp/new-mobile-gyn.png", h: 7000 * 0.7, speed: 1, dir: 1 },
            { src: "cmp/new-mobile-home.png", h: 5592, speed: 1, dir: -1 },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      {/* ============ 06 EFFEKTEN ============ */}
      <TransitionSeries.Sequence durationInFrames={D.ch6}>
        <ChapterScene
          num="06"
          title="Forretningsverdien"
          sub="Design måles ikke i hvordan det ser ut, men i hva det gjør mulig."
          marquee="EFFEKT"
          duration={D.ch6}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.outcome}>
        <OutcomeScene duration={D.outcome} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.agency}>
        <AgencyScene duration={D.agency} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence durationInFrames={D.outro}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <ProgressBar total={TOTAL} />
  </AbsoluteFill>
);
