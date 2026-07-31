import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { SplitMobileScene } from "./scenes/SplitMobileScene";
import { SliderScene } from "./scenes/SliderScene";
import { StackDesktopScene } from "./scenes/StackDesktopScene";
import { RibbonScene } from "./scenes/RibbonScene";
import { ProgressBar } from "./components/Fx";
import { PALETTE } from "./theme";

const { fontFamily } = loadFont("normal", { weights: ["200", "300", "400"], subsets: ["latin"] });

export const TOTAL = 960;
const S = (p: string, h: number) => ({ src: `cmp/${p}.png`, h });
const snap = springTiming({ config: { damping: 200 }, durationInFrames: 15 });

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, backgroundColor: PALETTE.deep }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={180}>
        <SplitMobileScene
          kicker="01 — Forsiden, mobil"
          title={"Samme innhold.\nHelt ny rytme."}
          note="Til venstre dagens cmedical.no. Til høyre den nye flaten — roligere hierarki, tydelig hero og innhold som puster."
          before={S("old-mobile-home", 5592)}
          after={S("new-mobile-home", 5592)}
          duration={180}
          to={0.82}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={150}>
        <SliderScene
          kicker="02 — Dra i skillelinjen"
          title="Før. Etter."
          before={S("old-mobile-home", 5592)}
          after={S("new-mobile-home", 5592)}
          duration={150}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={170}>
        <SplitMobileScene
          kicker="03 — Spesialistene"
          title={"Menneskene\nfram i lyset."}
          note="Over 50 spesialister med egne profiler, fagfelt og direkte timebestilling — istedenfor en flat liste."
          before={S("old-mobile-spesialister", 5592)}
          after={S("new-mobile-spesialister", 5592)}
          duration={170}
          from={0.05}
          to={0.85}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={190}>
        <StackDesktopScene
          kicker="04 — Desktop"
          title={"Bredere skjerm,\nsamme ro."}
          note="Forsiden på desktop: fra tett komponentmiks til en sammenhengende fortelling som holder tempoet hele veien ned."
          before={S("old-desktop-home", 4844)}
          after={S("new-desktop-home", 5400)}
          duration={190}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />

      <TransitionSeries.Sequence durationInFrames={150}>
        <RibbonScene
          title={"Hele siden,\npå én gang."}
          note="Priser, fagområder og spesialister — bygget som ett system, ikke som løse sider."
          duration={150}
          cols={[
            { src: "cmp/new-mobile-spesialister.png", h: 5592, speed: 1, dir: -1 },
            { src: "cmp/new-mobile-home.png", h: 5592, speed: 1, dir: 1 },
            { src: "cmp/new-desktop-priser.png", h: 5400 * (430 / 1440), speed: 1, dir: -1 },
            { src: "cmp/new-desktop-home.png", h: 5400 * (430 / 1440), speed: 1, dir: 1 },
            { src: "cmp/new-mobile-home.png", h: 5592, speed: 1, dir: -1 },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={snap} />

      <TransitionSeries.Sequence durationInFrames={120}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <ProgressBar total={TOTAL} />
  </AbsoluteFill>
);
