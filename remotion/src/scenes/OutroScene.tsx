import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";

const STATS = [
  { v: "60 000", k: "Årlige pasientbesøk" },
  { v: "3 500", k: "Operasjoner per år" },
  { v: "4,8/5", k: "Snittvurdering" },
  { v: "50+", k: "Spesialister" },
];


export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = spring({ frame: frame - 4, fps, config: { damping: 200 }, durationInFrames: 44 });
  const line = interpolate(
    spring({ frame: frame - 18, fps, config: { damping: 200 }, durationInFrames: 50 }),
    [0, 1],
    [0, 1656],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(100% 80% at 50% 40%, ${PALETTE.dark} 0%, ${PALETTE.deep} 72%)`,
        }}
      />
      <div style={{ position: "absolute", left: 132, top: 288, width: 1300 }}>
        <div
          style={{
            fontSize: 92,
            lineHeight: 1.02,
            fontWeight: 200,
            color: PALETTE.light,
            opacity: t,
            transform: `translateY(${interpolate(t, [0, 1], [34, 0])}px)`,
          }}
        >
          Ett helhetlig helsetilbud,
          <br />
          <span style={{ color: PALETTE.mid, fontStyle: "italic" }}>samlet på ett sted.</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 132, top: 660, height: 1, width: line, background: PALETTE.mid, opacity: 0.4 }} />

      <div style={{ position: "absolute", left: 132, top: 716, display: "flex", gap: 110 }}>
        {STATS.map((s, i) => {
          const a = spring({ frame: frame - 30 - i * 7, fps, config: { damping: 200 }, durationInFrames: 40 });
          return (
            <div key={s.k} style={{ opacity: a, transform: `translateY(${interpolate(a, [0, 1], [22, 0])}px)` }}>
              <div style={{ fontSize: 56, fontWeight: 200, color: PALETTE.light }}>{s.v}</div>
              <div style={{ fontSize: 20, fontWeight: 300, color: PALETTE.mid, marginTop: 10 }}>{s.k}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          right: 132,
          bottom: 116,
          fontSize: 34,
          fontWeight: 300,
          letterSpacing: 0,
          color: PALETTE.yellow,
          opacity: interpolate(frame, [46, 74], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        CMedical
      </div>
    </AbsoluteFill>
  );
};
