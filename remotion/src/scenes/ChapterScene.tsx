import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { KineticLine, Grain, Marquee } from "../components/Fx";

/** Kapittelkort som deler filmen inn i prosessens faser. */
export const ChapterScene: React.FC<{
  num: string;
  title: string;
  sub: string;
  marquee: string;
  duration: number;
}> = ({ num, title, sub, marquee, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numIn = spring({ frame, fps, config: { damping: 14, stiffness: 110 }, durationInFrames: 40 });
  const bar = interpolate(frame, [8, 38], [0, 1], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 4) });
  const subIn = spring({ frame: frame - 26, fps, config: { damping: 200 }, durationInFrames: 34 });
  const drift = interpolate(frame, [0, duration], [0, -40]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(80% 50% at 40% 46%, ${PALETTE.dark} 0%, ${PALETTE.deep} 74%)` }} />
      <Marquee text={marquee} top={300} size={132} color={PALETTE.dark} opacity={0.5} speed={2.4} />
      <Marquee text={marquee} top={1500} size={110} color={PALETTE.dark} opacity={0.35} speed={1.5} dir={1} />

      <div style={{ position: "absolute", left: 84, top: 700, width: 930, transform: `translateY(${drift}px)` }}>
        <div
          style={{
            fontSize: 210,
            lineHeight: 0.9,
            fontWeight: 200,
            color: PALETTE.yellow,
            opacity: numIn,
            transform: `translateY(${interpolate(numIn, [0, 1], [70, 0])}px)`,
          }}
        >
          {num}
        </div>
        <div style={{ height: 4, width: bar * 900, background: PALETTE.mid, opacity: 0.55, margin: "34px 0 40px" }} />
        <KineticLine text={title} size={96} frame={frame} delay={14} />
        <div
          style={{
            fontSize: 29,
            fontWeight: 300,
            color: PALETTE.mid,
            marginTop: 26,
            maxWidth: 820,
            lineHeight: 1.4,
            opacity: subIn,
            transform: `translateY(${interpolate(subIn, [0, 1], [20, 0])}px)`,
          }}
        >
          {sub}
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
