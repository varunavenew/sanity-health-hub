import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { KineticLine, Grain, Marquee } from "../components/Fx";

const STATS = [
  { to: 60000, suffix: "", k: "Årlige pasientbesøk", dec: 0 },
  { to: 3500, suffix: "", k: "Operasjoner per år", dec: 0 },
  { to: 4.8, suffix: "/5", k: "Snittvurdering", dec: 1 },
  { to: 50, suffix: "+", k: "Spesialister", dec: 0 },
];

const fmt = (n: number, dec: number) =>
  dec > 0
    ? n.toFixed(1).replace(".", ",")
    : Math.round(n).toLocaleString("nb-NO").replace(/\u00A0/g, " ");

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line = interpolate(frame, [16, 50], [0, 904], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 4) });
  const logo = spring({ frame: frame - 66, fps, config: { damping: 12, stiffness: 120 }, durationInFrames: 40 });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(80% 55% at 50% 40%, ${PALETTE.dark} 0%, ${PALETTE.deep} 74%)` }} />
      <Marquee text="CMEDICAL" top={1660} size={140} color={PALETTE.dark} opacity={0.5} speed={2.4} />

      <div style={{ position: "absolute", left: 88, top: 520, width: 940 }}>
        <KineticLine text="Ett helhetlig" size={98} frame={frame} delay={2} />
        <KineticLine text="helsetilbud," size={98} frame={frame} delay={10} />
        <KineticLine text="samlet på ett sted." size={98} frame={frame} delay={18} color={PALETTE.mid} italic />
      </div>

      <div style={{ position: "absolute", left: 88, top: 1010, height: 3, width: line, background: PALETTE.yellow }} />

      <div style={{ position: "absolute", left: 88, top: 1080, display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 68, columnGap: 80, width: 900 }}>
        {STATS.map((s, i) => {
          const a = spring({ frame: frame - 28 - i * 7, fps, config: { damping: 200 }, durationInFrames: 38 });
          const count = interpolate(a, [0, 1], [0, s.to]);
          return (
            <div key={s.k} style={{ opacity: a, transform: `translateY(${interpolate(a, [0, 1], [30, 0])}px)` }}>
              <div style={{ fontSize: 78, fontWeight: 200, color: PALETTE.light }}>
                {fmt(count, s.dec)}
                {s.suffix}
              </div>
              <div style={{ fontSize: 24, fontWeight: 300, color: PALETTE.mid, marginTop: 10 }}>{s.k}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 88,
          bottom: 200,
          fontSize: 56,
          fontWeight: 300,
          color: PALETTE.yellow,
          opacity: logo,
          transform: `scale(${interpolate(logo, [0, 1], [0.85, 1])})`,
          transformOrigin: "left center",
        }}
      >
        CMedical
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
