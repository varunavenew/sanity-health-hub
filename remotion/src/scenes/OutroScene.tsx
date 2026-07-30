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
    [0, 904],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(80% 55% at 50% 42%, ${PALETTE.dark} 0%, ${PALETTE.deep} 74%)` }}
      />
      <div style={{ position: "absolute", left: 88, top: 560, width: 920 }}>
        <div
          style={{
            fontSize: 96,
            lineHeight: 1.04,
            fontWeight: 200,
            color: PALETTE.light,
            opacity: t,
            transform: `translateY(${interpolate(t, [0, 1], [34, 0])}px)`,
          }}
        >
          Ett helhetlig
          <br />
          helsetilbud,
          <br />
          <span style={{ color: PALETTE.mid, fontStyle: "italic" }}>samlet på ett sted.</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 88, top: 1000, height: 1, width: line, background: PALETTE.mid, opacity: 0.4 }} />

      <div style={{ position: "absolute", left: 88, top: 1070, display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 72, columnGap: 80, width: 900 }}>
        {STATS.map((s, i) => {
          const a = spring({ frame: frame - 30 - i * 8, fps, config: { damping: 200 }, durationInFrames: 40 });
          return (
            <div key={s.k} style={{ opacity: a, transform: `translateY(${interpolate(a, [0, 1], [24, 0])}px)` }}>
              <div style={{ fontSize: 76, fontWeight: 200, color: PALETTE.light }}>{s.v}</div>
              <div style={{ fontSize: 24, fontWeight: 300, color: PALETTE.mid, marginTop: 10 }}>{s.k}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 88,
          bottom: 150,
          fontSize: 44,
          fontWeight: 300,
          color: PALETTE.yellow,
          opacity: interpolate(frame, [56, 86], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        CMedical
      </div>
    </AbsoluteFill>
  );
};
