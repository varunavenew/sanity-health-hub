import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { SplitMobileScene } from "./scenes/SplitMobileScene";
import { StackDesktopScene } from "./scenes/StackDesktopScene";
import { RibbonScene } from "./scenes/RibbonScene";
import { PALETTE } from "./theme";

const { fontFamily } = loadFont("normal", { weights: ["200", "300", "400"], subsets: ["latin"] });

const T = 18;
const S = (p: string, h: number) => ({ src: `cmp/${p}.png`, h });

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, backgroundColor: PALETTE.deep }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={100}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence durationInFrames={210}>
        <SplitMobileScene
          kicker="01 — Forsiden, mobil"
          title={"Samme innhold.\nHelt ny rytme."}
          note="Til venstre dagens cmedical.no. Til høyre den nye flaten — roligere hierarki, tydelig hero og innhold som puster."
          before={S("old-mobile-home", 5592)}
          after={S("new-mobile-home", 5592)}
          duration={210}
          to={0.82}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence durationInFrames={190}>
        <SplitMobileScene
          kicker="02 — Spesialistene"
          title={"Menneskene\nfram i lyset."}
          note="Over 50 spesialister med egne profiler, fagfelt og direkte timebestilling — istedenfor en flat liste."
          before={S("old-mobile-spesialister", 5592)}
          after={S("new-mobile-spesialister", 5592)}
          duration={190}
          from={0.05}
          to={0.85}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence durationInFrames={220}>
        <StackDesktopScene
          kicker="03 — Desktop"
          title={"Bredere skjerm,\nsamme ro."}
          note="Forsiden på desktop: fra tett komponentmiks til en sammenhengende fortelling som holder tempoet hele veien ned."
          before={S("old-desktop-home", 4844)}
          after={S("new-desktop-home", 5400)}
          duration={220}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence durationInFrames={160}>
        <RibbonScene
          title={"Hele siden,\npå én gang."}
          note="Priser, fagområder og spesialister — bygget som ett system, ikke som løse sider."
          duration={160}
          cols={[
            { src: "cmp/new-mobile-home.png", h: 5592, speed: 1, dir: 1 },
            { src: "cmp/new-desktop-priser.png", h: 5400 * (430 / 1440), speed: 1, dir: -1 },
            { src: "cmp/new-mobile-spesialister.png", h: 5592, speed: 1, dir: 1 },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence durationInFrames={110}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
