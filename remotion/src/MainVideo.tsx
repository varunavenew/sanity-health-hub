import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { ShotScene } from "./scenes/ShotScene";
import { PALETTE } from "./theme";

const { fontFamily } = loadFont("normal", { weights: ["200", "300", "400"], subsets: ["latin"] });

const T = 20;

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: PALETTE.deep }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={80}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={150}>
          <ShotScene
            src="shots/home.png"
            kicker="01 — Forsiden"
            title={"Et rolig\nførsteinntrykk."}
            note="Hero, tjenester, anmeldelser og spesialister — bygget som én sammenhengende fortelling."
            imageHeight={5250}
            from={0}
            to={0.62}
            duration={150}
            align="right"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={140}>
          <ShotScene
            src="shots/gyn.png"
            kicker="02 — Fagområde"
            title={"Dybde uten\nstøy."}
            note="Livsfaser, ekspertområder og behandlinger strukturert slik at pasienten finner fram selv."
            imageHeight={6300}
            from={0}
            to={0.72}
            duration={140}
            align="left"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={120}>
          <ShotScene
            src="shots/priser.png"
            kicker="03 — Priser"
            title={"Åpenhet,\nlinje for linje."}
            note="Hele prislisten samlet, filtrert per fagområde — med direkte booking i hver rad."
            imageHeight={5400}
            from={0.04}
            to={0.7}
            duration={120}
            align="right"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={120}>
          <ShotScene
            src="shots/spesialister.png"
            kicker="04 — Spesialister"
            title={"Menneskene\nbak tilbudet."}
            note="Over 50 spesialister med egne profiler, fagfelt og direkte timebestilling."
            imageHeight={5400}
            from={0.02}
            to={0.78}
            duration={120}
            align="left"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={90}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
