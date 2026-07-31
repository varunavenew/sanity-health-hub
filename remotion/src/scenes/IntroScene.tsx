import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { KineticLine, Grain, Marquee } from "../components/Fx";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kick = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 26 });
  const bar = interpolate(frame, [4, 34], [0, 1], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 4) });
  const push = interpolate(frame, [30, 90], [0, -60]);
  const scale = interpolate(frame, [0, 90], [1.12, 1]);
  const flash = interpolate(frame, [0, 8], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(85% 55% at 26% 40%, ${PALETTE.dark} 0%, ${PALETTE.deep} 74%)`, transform: `scale(${scale})` }} />

      <Marquee text="CMEDICAL" top={210} size={150} color={PALETTE.dark} opacity={0.55} speed={2.6} />
      <Marquee text="2026" top={1560} size={130} color={PALETTE.dark} opacity={0.4} speed={1.6} dir={1} />

      {/* gul sveipende strek */}
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 600,
          height: 6,
          width: bar * 780,
          background: PALETTE.yellow,
        }}
      />

      <div style={{ position: "absolute", left: 88, top: 680, width: 940, transform: `translateY(${push}px)` }}>
        <div style={{ fontSize: 28, color: PALETTE.yellow, opacity: kick, marginBottom: 44 }}>
          Digital plattform — før / etter
        </div>
        <KineticLine text="cmedical.no" size={128} frame={frame} delay={8} color={PALETTE.mid} />
        <KineticLine text="møter" size={128} frame={frame} delay={22} color={PALETTE.mid} italic />
        <KineticLine text="en ny flate." size={128} frame={frame} delay={32} color={PALETTE.light} />
      </div>

      <AbsoluteFill style={{ background: PALETTE.light, opacity: flash * 0.9 }} />
      <Grain />
    </AbsoluteFill>
  );
};
