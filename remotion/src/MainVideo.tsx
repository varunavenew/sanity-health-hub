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
import { ProgressBar } from "./components/Fx";
import { PALETTE } from "./theme";

const { fontFamily } = loadFont("normal", { weights: ["200", "300", "400"], subsets: ["latin"] });

const S = (p: string, h: number) => ({ src: `cmp/${p}.png`, h });
const snap = springTiming({ config: { damping: 200 }, durationInFrames: 15 });
const T = 15;

// scene durations
const D = {
  intro: 90,
  proto1: 190,
  proto2: 150,
  homeSplit: 170,
  homeSlider: 140,
  priserSplit: 180,
  priserSlider: 140,
  booking: 190,
  spesialister: 140,
  desktop: 170,
  gyn: 120,
  ribbon: 120,
  outro: 120,
};

const SUM = Object.values(D).reduce((a, b) => a + b, 0);
export const TOTAL = SUM - 12 * T; // 12 transitions

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, backgroundColor: PALETTE.deep }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.intro}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      {/* ---------- prototype phase ---------- */}
      <TransitionSeries.Sequence durationInFrames={D.proto1}>
        <PrototypeScene
          kicker="00 — Prototype"
          title={"Fra skisse\ntil flate."}
          note="Vi startet med wireframes: hierarki, rytme og hva som skal møte pasienten først — før én eneste farge var på plass."
          shot={S("new-mobile-home", 5592)}
          duration={D.proto1}
          reveal={0.62}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={D.proto2}>
        <PrototypeScene
          kicker="00 — Prototype"
          title={"Samme system,\nhver flate."}
          note="Prislister, fagområder og booking bygget på samme rutenett — derfor føles alt som én side, ikke ti."
          shot={S("new-mobile-priser", 8000)}
          duration={D.proto2}
          reveal={0.4}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      {/* ---------- home ---------- */}
      <TransitionSeries.Sequence durationInFrames={D.homeSplit}>
        <SplitMobileScene
          kicker="01 — Forsiden, mobil"
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
          kicker="02 — Dra i skillelinjen"
          title="Før. Etter."
          before={S("old-mobile-home", 5592)}
          after={S("new-mobile-home", 5592)}
          duration={D.homeSlider}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={snap} />

      {/* ---------- priser ---------- */}
      <TransitionSeries.Sequence durationInFrames={D.priserSplit}>
        <SplitMobileScene
          kicker="03 — Priser"
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
          kicker="04 — Prissiden, side ved side"
          title="Før. Etter."
          before={S("old-mobile-priser", 5154)}
          after={S("new-mobile-priser", 8000)}
          duration={D.priserSlider}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      {/* ---------- booking ---------- */}
      <TransitionSeries.Sequence durationInFrames={D.booking}>
        <BookingScene
          kicker="05 — Booking"
          title={"Timebestilling\nsom er en flate."}
          note="I dag sendes pasienten ut av nettsiden. Nå er bestillingen en del av opplevelsen — samme språk, samme design, fem tydelige steg."
          steps={["Tjeneste", "Sted", "Behandler", "Tid", "Bekreft"]}
          mobile={S("new-mobile-booking", 1508)}
          desktop={{ src: "cmp/new-desktop-booking.png", h: 1679 }}
          duration={D.booking}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      {/* ---------- spesialister ---------- */}
      <TransitionSeries.Sequence durationInFrames={D.spesialister}>
        <SplitMobileScene
          kicker="06 — Spesialistene"
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

      {/* ---------- desktop ---------- */}
      <TransitionSeries.Sequence durationInFrames={D.desktop}>
        <StackDesktopScene
          kicker="07 — Desktop"
          title={"Bredere skjerm,\nsamme ro."}
          note="Forsiden på desktop: fra tett komponentmiks til en sammenhengende fortelling som holder tempoet hele veien ned."
          before={S("old-desktop-home", 4844)}
          after={S("new-desktop-home", 5400)}
          duration={D.desktop}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={snap} />

      {/* ---------- fagområde ---------- */}
      <TransitionSeries.Sequence durationInFrames={D.gyn}>
        <SplitMobileScene
          kicker="08 — Fagområde"
          title={"Fag som\nfortelling."}
          note="Gynekologi og kvinnehelse: hero, temaer, priser og behandlere i én sammenhengende reise."
          before={S("old-mobile-gyn", 5592)}
          after={S("new-mobile-gyn", 7000)}
          duration={D.gyn}
          to={0.5}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

      {/* ---------- ribbon ---------- */}
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

      <TransitionSeries.Sequence durationInFrames={D.outro}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <ProgressBar total={TOTAL} />
  </AbsoluteFill>
);
